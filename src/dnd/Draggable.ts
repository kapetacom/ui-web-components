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
    disabled?:boolean
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

    private lastMouseMoveEvent:MouseEvent = null;

    private lastScrollPoint:Point = null;

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

        if (!this.options.context) {
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

    private getZoomLevel() {
        if(this.options.zoom) {
            return this.options.zoom;
        }
        return 1;
    }


    private updateContainerDimensions() {
        const container = this.getContainerElement();
        if (!container) {
            return;
        }
        
        const containerRect = container.getBoundingClientRect();

        const dimensions = {
            left: containerRect.left,
            top: containerRect.top,
            width: containerRect.width,//trim decimal points and parse to number
            height: containerRect.height
        };

        this.containerDimensions = dimensions;

    }

    private getGlobalScroll() {
        return {
            y: document.documentElement.scrollTop,
            x: document.documentElement.scrollLeft
        };
    }

    private getGlobalScrollDelta() {
        const globalScroll = this.getGlobalScroll();
        return {
            y: (globalScroll.y - this.lastScrollPoint.y),
            x: (globalScroll.x - this.lastScrollPoint.x)
        };
    }
    
    /**
     * Gets the mouse position translated down to the local coordinate system of the element
     * @param evt
     */
    private getTranslatedMousePosition(evt:MouseEvent):Point {   
        this.updateContainerDimensions();     
        const container = this.getContainerElement();
        const globalScroll = this.getGlobalScroll();
        let scrolling = {left:0,top:0};

        if (container) {
            scrolling.top = container.scrollTop;
            scrolling.left = container.scrollLeft;
        }

        //Normal relative offsets - subtract global scroll if container is not document
        let y = evt.pageY;
        let x = evt.pageX;

        if (container !== document.documentElement) {
            x -= globalScroll.x;
            y -= globalScroll.y;
        }

        //Get offset relative to container
        x -= this.containerDimensions.left;
        y -= this.containerDimensions.top;

        //Handle in-container scroll
        x += scrolling.left;
        y += scrolling.top;

        //Translate page level coordinates to container zoom levels
        x /= this.getZoomLevel();
        y /= this.getZoomLevel();

        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }

    private handleMouseDown = (evt: any) => {
        if (this.options.disabled) {
            return;
        }

        if (evt.button !== 0) {
            return; //Only drag on left click
        }
        const container = this.getContainerElement();
        const body = this.getDocumentBody();
        const window = this.getWindow();
        if (!container ||
            !this.elm ||
            !body ||
            !window ||
            this.dragging) {
            return;
        }

        const mousePosition = this.getTranslatedMousePosition(evt);

        this.lastScrollPoint = this.getGlobalScroll();

        this.startPosition = {... mousePosition};


        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('scroll', this.handleScroll);

        let elmRect = this.elm.getBoundingClientRect();

        const globalScroll = this.getGlobalScroll();

        this.mouseElementOffset = {
            x: ((evt.pageX - globalScroll.x - elmRect.left)/this.getZoomLevel()),
            y: ((evt.pageY - globalScroll.y - elmRect.top)/this.getZoomLevel())
        };

        this.initialSize = {
            width: elmRect.width,
            height: elmRect.height
        };
    };

    private handleScroll = () => {

        const container = this.getContainerElement();
        if (!this.startPosition ||
            !this.elm ||
            !this.lastMouseMoveEvent ||
            !this.draggingTarget ||
            !container) {
            return;
        }
        const scrollDelta = this.getGlobalScrollDelta();
        const mousePosition = this.getTranslatedMousePosition(this.lastMouseMoveEvent);

        mousePosition.y += Math.round(scrollDelta.y/this.getZoomLevel());
        mousePosition.x += Math.round(scrollDelta.x/this.getZoomLevel());

        this.updateFromMousePosition(mousePosition);
    }

    private handleMouseMove = (evt: any) => {
        const container = this.getContainerElement();
        if (!this.startPosition ||
            !this.elm ||
            !container) {
            return;
        }

        this.lastMouseMoveEvent = evt;
        this.lastScrollPoint = this.getGlobalScroll();

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

        this.updateFromMousePosition(mousePosition);
    };

    private updateFromMousePosition(mousePosition:Point) {
        if (!this.draggingTarget) {
            return;
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
    }

    private handleMouseUp = (evt: MouseEvent) => {
        const body = this.getDocumentBody();
        const window = this.getWindow();
        if (!body || !window) {
            return;
        }

        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('scroll', this.handleScroll);

        if (!this.dragging ||
            !this.draggingTarget) {
            return;
        }

        const mousePosition = this.getTranslatedMousePosition(evt);

        const dimensions = this.calculateDimensions(mousePosition);

        const clientRect = this.draggingTarget.getBoundingClientRect();

        if (this.options.context) {
            this.options.context.onDragEnd(dimensions, clientRect, this.item);
        }

        this.dragging = false;
        this.lastScrollPoint = null;
        this.lastMouseMoveEvent = null;
        this.containerDimensions = null;

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

                if (!this.elm.matches('svg')) {
                    if (this.enabledAxis.vertical &&
                        this.enabledAxis.horizontal) {
                        this.draggingTarget.setAttribute('transform', `translate(${left},${top})`);
                    } else if (this.enabledAxis.vertical) {
                        this.draggingTarget.setAttribute('transform', `translate(0,${top})`);
                    } else if (this.enabledAxis.horizontal) {
                        this.draggingTarget.setAttribute('transform', `translate(${left},0)`);
                    }
                } else {
                    if (this.enabledAxis.vertical) {
                        this.draggingTarget.setAttribute('y', top + 'px');
                    }

                    if (this.enabledAxis.horizontal) {
                        this.draggingTarget.setAttribute('x', left + 'px');
                    }
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