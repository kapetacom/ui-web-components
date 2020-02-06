import {Dimensions, Point, Size} from "@blockware/ui-web-types";
import { DOMElement, toDOMElement} from "@blockware/ui-web-utils";
import {DraggableContext} from "./DraggableContext";

import './Draggable.less';

const MIN_MOVE_BEFORE_DRAG = 5;

export const DRAGGING_HANDLE_CSS = 'dragging-handle';
export const DRAGGING_SOURCE_CSS = 'dragging-source';

interface DraggableOptions<T> {
    elm:DOMElement
    dragCopy?:boolean
    horizontal?:boolean
    vertical?:boolean
    handle?:string
    target?:DOMElement
    container?:Element
    context?: DraggableContext<T>
    zoom?:number
    overflowX?:boolean
    overflowY?:boolean
    onDragStart?: () => void
    onDragMove?: (dimensions: Dimensions) => boolean
    onDragEnd?: (dimensions: Dimensions) => boolean
}

export class Draggable<T> {

    private options: DraggableOptions<T>;

    private elm:DOMElement;

    private handle:DOMElement;
    
    private target:DOMElement;

    private draggingTarget:DOMElement|null = null;

    private dragging:boolean = false;

    private startPosition:Point = {x:0,y:0};

    private initialSize:Size = {width:-1, height:-1};

    private mouseElementOffset:Point = {x:0,y:0};

    private containerDimensions:Dimensions = {top:0,left:0,width:0,height:0};

    private svgContainer?:boolean;

    private enabledAxis:{
        horizontal:boolean,
        vertical:boolean
    };

    private item: T;


    constructor(item:T, options:DraggableOptions<T>) {
        this.item = item;
        this.options = options;

        if (!this.options.overflowX) {
            this.options.overflowX = false;
        }

        if (!this.options.overflowY) {
            this.options.overflowY = false;
        }

        this.elm = options.elm;
        this.handle = this.elm;
        this.target = options.target || options.elm;

        if (options.handle) {
            const handle = this.elm.querySelector(options.handle);
                if (handle) {
                    this.handle = toDOMElement(handle);
                }
        }

        this.enabledAxis = {
            horizontal: options.horizontal === undefined ? true : options.horizontal,
            vertical: options.vertical === undefined ? true : options.vertical
        };
    }

    public start() {
        this.handle.addEventListener('mousedown', this.handleMouseDown)
    }
    
    public stop() {
        this.handle.removeEventListener('mousedown', this.handleMouseDown)
    }

    private getContainerElement() {
        if (this.options.container) {
            return this.options.container;
        }

        if (!this.options.context) {
            return document.documentElement;
        }

        return this.options.context.containerElement();
    }

    private getDocumentBody() {
        if (!this.elm ||
            !this.elm.ownerDocument) {
            return null;
        }

        return this.elm.ownerDocument.body;
    }

    private getWindow() {
        if (!this.elm ||
            !this.elm.ownerDocument ||
            !this.elm.ownerDocument.defaultView) {
            return null;
        }

        return this.elm.ownerDocument.defaultView;
    }


    private isSVG() {
        if (this.svgContainer !== undefined) {
            return this.svgContainer;
        }

        const container = this.getContainerElement();
        if (!container) {
            return this.svgContainer = false;
        }

        return this.svgContainer = container.matches('svg');
    }

    private calculateDimensions(mousePosition: Point) {

        return {
            left: mousePosition.x - this.mouseElementOffset.x,
            top: mousePosition.y - this.mouseElementOffset.y,
            width: this.initialSize.width,
            height: this.initialSize.height
        };
    }

    private getZoomLevel(){
        if(this.options.zoom){
            return this.options.zoom;
        }
        return 1;
    }
    /**
     * Gets the mouse position translated down to the local coordinate system of the element
     * @param evt
     */
    private getTranslatedMousePosition(evt:MouseEvent):Point {   
        this.updateContainerDimensions();     
        const container = this.getContainerElement();
        let scrolling = {left:0,top:0};

        if (container) {
            scrolling.top = container.scrollTop;
            scrolling.left = container.scrollLeft;
        }

        return {
            x: (evt.pageX*this.getZoomLevel() + scrolling.left - this.containerDimensions.left),
            y : (evt.pageY*this.getZoomLevel()+ scrolling.top+ this.containerDimensions.top)//) 
        };
    }

    private updateContainerDimensions() {
        const container = this.getContainerElement();
        if (!container) {
            return;
        }
        
        const containerRect = container.getBoundingClientRect();
        
        this.containerDimensions = {
            left: containerRect.left,
            top: containerRect.top,
            width: +(containerRect.width).toFixed(),//trim decimal points and parse to number
            height: +(containerRect.height).toFixed()
        };
        
    }

    private handleMouseDown = (evt: any) => {
        if (evt.button !== 0) {
            return; //Only drag on left click
        }
        const container = this.getContainerElement();
        const body = this.getDocumentBody();
        const window = this.getWindow();
        if (!container ||
            !this.elm ||
            !body ||
            !window ||
            this.dragging) {
            return;
        }

        const mousePosition = this.getTranslatedMousePosition(evt);

        this.startPosition = {... mousePosition};

        this.updateContainerDimensions();

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        let elmRect = this.elm.getBoundingClientRect();

        this.mouseElementOffset = {
            x: evt.pageX - elmRect.left,
            y: evt.pageY - elmRect.top
        };

        this.initialSize = {
            width: elmRect.width,
            height: elmRect.height
        };
    };

    private handleMouseMove = (evt: any) => {
        const container = this.getContainerElement();
        if (!this.startPosition ||
            !this.elm ||
            !container) {
            return;
        }

        this.updateContainerDimensions();

        const mousePosition = this.getTranslatedMousePosition(evt);

        if (Math.abs(this.startPosition.x - mousePosition.x) < MIN_MOVE_BEFORE_DRAG &&
            Math.abs(this.startPosition.y - mousePosition.y) < MIN_MOVE_BEFORE_DRAG) {
            return;
        }

        if (!this.dragging) {
            this.dragging = true;
            if (this.options.context) {
                this.options.context.onDragStart(this.item);
            }

            if (this.options.onDragStart) {
                this.options.onDragStart();
            }
        }

        if (!this.draggingTarget) {
            if (this.options.dragCopy) {
                const clonedNode = this.target.cloneNode(true);
                if (!(clonedNode instanceof HTMLElement) && 
                    !(clonedNode instanceof SVGElement)) {
                    return;
                }

                if (!this.elm.parentElement) {
                    return;
                }

                this.draggingTarget = clonedNode;
                container.appendChild(this.draggingTarget);
            } else {
                this.draggingTarget = this.target;
            }
        }

        const dimensions = this.calculateDimensions(mousePosition);

        if (this.options.onDragMove) {
            if (!this.options.onDragMove(dimensions)) {
                return;
            }
        }

        this.updateDraggingTarget(dimensions);

        const clientRect = this.draggingTarget.getBoundingClientRect();

        if (this.options.context) {
            this.options.context.onDragMove(dimensions, clientRect, this.item);
        }


    };

    private handleMouseUp = (evt: MouseEvent) => {
        const body = this.getDocumentBody();
        const window = this.getWindow();
        if (!body || !window) {
            return;
        }

        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);

        if (!this.dragging ||
            !this.draggingTarget) {
            return;
        }

        this.updateContainerDimensions();

        const mousePosition = this.getTranslatedMousePosition(evt);

        const dimensions = this.calculateDimensions(mousePosition);

        const clientRect = this.draggingTarget.getBoundingClientRect();

        if (this.options.context) {
            this.options.context.onDragEnd(dimensions, clientRect, this.item);
        }

        this.dragging = false;

        if (!(this.options.onDragEnd &&
                this.options.onDragEnd(dimensions))) {
            this.updateDraggingTarget(dimensions);
        }

        if (this.options.dragCopy) {
            this.draggingTarget.remove();
        }

        this.draggingTarget = null;

    };


    private updateDraggingTarget(dimensions:Dimensions) {
        if (!this.draggingTarget ||
            !this.elm) {
            return;
        }

        if (this.dragging) {
            this.elm.classList.add(DRAGGING_SOURCE_CSS);
            this.draggingTarget.classList.add(DRAGGING_HANDLE_CSS);

            let top = Math.max(0, dimensions.top);
            let left = Math.max(0, dimensions.left);

            const right = left + dimensions.width;
            const bottom = top + (dimensions.height || 0);

            if (!this.options.overflowX) {
                const containerRight = this.containerDimensions.left + this.containerDimensions.width;
                if (right > containerRight) {
                    left -= (right - containerRight);
                }
            }

            if (!this.options.overflowY) {
                const containerBottom = this.containerDimensions.top + this.containerDimensions.height || 0;
                if (bottom > containerBottom) {
                    top -= (bottom - containerBottom);
                }
            }

            if (this.isSVG()) {
                if (this.enabledAxis.vertical) {
                    this.draggingTarget.setAttribute('y', top + 'px');
                }

                if (this.enabledAxis.horizontal) {
                    this.draggingTarget.setAttribute('x', left + 'px');
                }

                this.draggingTarget.setAttribute('width', dimensions.width + 'px');
                this.draggingTarget.setAttribute('height', dimensions.height + 'px');
            } else {
                if (this.enabledAxis.vertical) {
                    this.draggingTarget.style.top = top + 'px';
                }

                if (this.enabledAxis.horizontal) {
                    this.draggingTarget.style.left = left + 'px';
                }

                this.draggingTarget.style.width = dimensions.width + 'px';
                this.draggingTarget.style.height = dimensions.height + 'px';
            }

        } else {
            this.draggingTarget.classList.remove(DRAGGING_HANDLE_CSS);
            this.elm.classList.remove(DRAGGING_SOURCE_CSS);
        }
    }
}