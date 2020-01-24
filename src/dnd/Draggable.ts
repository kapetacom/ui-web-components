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
    context?: DraggableContext<T>
}

export enum Direction{
    left="LEFT",
    right="RIGHT"
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

    private enabledAxis:{
        horizontal:boolean,
        vertical:boolean
    };

    private item: T;


    constructor(item:T, options:DraggableOptions<T>) {
        this.item = item;
        this.options = options;

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

    private calculateDimensions(evt: MouseEvent) {
        const scrolling = {
            left:0,
            top:0
        };
        const container = this.getContainerElement();
        if (container) {
            scrolling.left = container.scrollLeft;
            scrolling.top = container.scrollTop;
        }

        return {
            left: evt.pageX - this.mouseElementOffset.x + scrolling.left - this.containerDimensions.left,
            top: evt.pageY - this.mouseElementOffset.y + scrolling.top - this.containerDimensions.top,
            width: this.initialSize.width,
            height: this.initialSize.height
        };
    }

    private handleMouseDown = (evt: any) => {
        if (evt.button !== 0) {
            return; //Not left click
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

        this.startPosition = {
            x: evt.pageX,
            y: evt.pageY,
        };

        let containerRect = container.getBoundingClientRect();

        this.containerDimensions = {
            left: containerRect.left,
            top: containerRect.top,
            width: containerRect.width,
            height: containerRect.height
        };

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        let clientRect = this.elm.getBoundingClientRect();

        this.mouseElementOffset = {
            x: evt.pageX - clientRect.left,
            y: evt.pageY - clientRect.top
        };

        this.initialSize = {
            width: clientRect.width,
            height: clientRect.height
        };
    };

    private handleMouseMove = (evt: any) => {
        const container = this.getContainerElement();
        if (!this.startPosition ||
            !this.elm ||
            !container) {
            return;
        }

        if (Math.abs(this.startPosition.x - evt.pageX) < MIN_MOVE_BEFORE_DRAG &&
            Math.abs(this.startPosition.y - evt.pageY) < MIN_MOVE_BEFORE_DRAG) {
            return;
        }

        if (!this.dragging) {
            this.dragging = true;
            if (this.options.context) {
                this.options.context.onDragStart(this.item);
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

        const dimensions = this.calculateDimensions(evt);

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

        const dimensions = this.calculateDimensions(evt);

        const clientRect = this.draggingTarget.getBoundingClientRect();

        if (this.options.context) {
            this.options.context.onDragEnd(dimensions, clientRect, this.item);
        }

        this.dragging = false;

        this.updateDraggingTarget(dimensions,evt.movementX>0?Direction.right:Direction.left);

        if (this.options.dragCopy) {
            this.draggingTarget.remove();
        }
        this.draggingTarget = null;
    };


    private updateDraggingTarget(dimensions:Dimensions,direction?:Direction) {
        if (!this.draggingTarget ||
            !this.elm) {
            return;
        }

        if (this.dragging) {
            this.elm.classList.add(DRAGGING_SOURCE_CSS);
            this.draggingTarget.classList.add(DRAGGING_HANDLE_CSS);

            let top = Math.max(0, dimensions.top);
            let left = Math.max(0, dimensions.left);

            const containerRight = this.containerDimensions.width;
            const containerBottom = this.containerDimensions.height || 0;

            const right = left + dimensions.width;
            const bottom = top + (dimensions.height || 0);

            if (right > containerRight) {
                left -= (right - containerRight);
            }

            if (bottom > containerBottom) {
                top -= (bottom - containerBottom);
            }

            if (this.enabledAxis.vertical) {
                this.draggingTarget.style.top = top + 'px';
            }

            if (this.enabledAxis.horizontal) {
                this.draggingTarget.style.left = left + 'px';
            }

            this.draggingTarget.style.width = dimensions.width + 'px';
            this.draggingTarget.style.height = dimensions.height + 'px';
        } else {
            this.draggingTarget.classList.remove(DRAGGING_HANDLE_CSS);
            this.elm.classList.remove(DRAGGING_SOURCE_CSS);
        }
    }
}