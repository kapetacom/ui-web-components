import React from 'react';
import DnDContext, { DnDContextType } from './DnDContext';
import { DnDDrag } from './DnDDrag';
import { asHTMLElement, DOMElement } from '@kapeta/ui-web-utils';
import { Dimensions } from '@kapeta/ui-web-types';

interface DnDDropProps {
    children: any;
    droppable?: (value: any) => boolean;
    onDrop: (type: string, value: any, dragDimensions: Dimensions) => void;
    onDrag?: (type: string, value: any, dragDimensions: Dimensions) => void;
    type: string | string[];
}

interface DnDDropState {
    dragging: boolean;
    hovering: boolean;
}

function normaliseType(type: string | string[]) {
    if (!Array.isArray(type)) {
        return [type];
    }

    return type;
}

function isDragOverDrop(dropSize: ClientRect, dragSize: ClientRect) {
    return !(
        dragSize.left > dropSize.right ||
        dragSize.right < dropSize.left ||
        dragSize.top > dropSize.bottom ||
        dragSize.bottom < dropSize.top
    );
}

const CSS_DRAGGING = 'dnd-zone-dragging';
const CSS_HOVERING = 'dnd-zone-hovering';

export class DnDDrop extends React.Component<DnDDropProps, DnDDropState> {
    static contextType = DnDContext;
    context!: React.ContextType<DnDContextType>;

    private elm: DOMElement | null = null;

    constructor(props: DnDDropProps) {
        super(props);

        this.state = {
            dragging: false,
            hovering: false,
        };
    }

    matchesType(drag: DnDDrag) {
        if (normaliseType(this.props.type).indexOf(drag.props.type) === -1) {
            return false;
        }

        if (this.props.droppable) {
            return this.props.droppable(drag.props.value);
        }

        return true;
    }

    componentDidMount() {
        this.context.onDropZoneCreated(this);
    }

    componentWillUnmount() {
        this.context.onDropZoneRemoved(this);
    }

    private getDimensionsForElement(dimensions: Dimensions) {
        if (!this.elm) {
            return dimensions;
        }

        return {
            ...dimensions,
            left: dimensions.left + this.elm.scrollLeft,
            top: dimensions.top + this.elm.scrollTop,
        };
    }

    onDragStart(drag: DnDDrag) {
        if (!this.elm) {
            return;
        }

        this.elm.classList.add(CSS_DRAGGING);
    }

    onDragEnd(dimensions: Dimensions, dragRect: ClientRect, drag: DnDDrag) {
        if (!this.elm) {
            return;
        }

        this.clearState();

        const zoneRect = this.elm.getBoundingClientRect();

        const hitTest = isDragOverDrop(zoneRect, dragRect);

        if (hitTest) {
            this.props.onDrop(
                drag.props.type,
                drag.props.value,
                this.getDimensionsForElement(dimensions)
            );
        }

        return hitTest;
    }

    onDragMove(dimensions: Dimensions, dragRect: ClientRect, drag: DnDDrag) {
        if (!this.elm) {
            return;
        }

        const zoneRect = this.elm.getBoundingClientRect();

        const hitTest = isDragOverDrop(zoneRect, dragRect);

        if (hitTest) {
            if (this.props.onDrag) {
                this.props.onDrag(
                    drag.props.type,
                    drag.props.value,
                    this.getDimensionsForElement(dimensions)
                );
            }
            this.elm.classList.add(CSS_HOVERING);
        } else {
            this.clearMoveState();
        }

        return hitTest;
    }

    clearMoveState() {
        if (!this.elm) {
            return;
        }
        this.elm.classList.remove(CSS_HOVERING);
    }

    clearState() {
        if (!this.elm) {
            return;
        }

        this.elm.classList.remove(CSS_DRAGGING);
        this.elm.classList.remove(CSS_HOVERING);
    }

    render() {
        const child = React.Children.only(this.props.children);

        const clone = React.cloneElement(child, {
            ref: (ref: HTMLElement) => {
                this.elm = asHTMLElement(ref);
            },
        });

        return <>{clone}</>;
    }
}
