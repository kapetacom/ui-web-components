import React from 'react';
import { asHTMLElement, DOMElement } from '@kapeta/ui-web-utils';

import SortableContext, { SortableContextType, SwapMode } from './SortableContext';
import { Draggable, DRAGGING_SOURCE_CSS } from './Draggable';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

interface SelectorItemProps {
    item: any;
    children: any;
    handle?: string;
}

const MARGIN = 10;

@observer
export class SortableItem extends React.Component<SelectorItemProps> {
    static contextType = SortableContext;
    context!: React.ContextType<SortableContextType>;

    private elm: DOMElement | null = null;

    private draggable?: Draggable<SortableItem>;

    constructor(props: SelectorItemProps) {
        super(props);
        makeObservable(this);
    }

    public shouldSwap(dragRect: ClientRect): SwapMode {
        if (!this.elm) {
            return SwapMode.NONE;
        }

        const elmRect = this.elm.getBoundingClientRect();

        if (!(dragRect.top > elmRect.bottom || dragRect.bottom < elmRect.top)) {
            const elmTop = elmRect.top + MARGIN;

            const inTopMargin = dragRect.top >= elmRect.top && dragRect.top <= elmTop;

            if (inTopMargin) {
                return SwapMode.BEFORE;
            }

            const elmBottom = elmRect.bottom - MARGIN;
            const inBottomMargin = dragRect.bottom >= elmBottom && dragRect.bottom <= elmRect.bottom;

            if (inBottomMargin) {
                return SwapMode.AFTER;
            }
        }

        return SwapMode.NONE;
    }

    public getItem() {
        return this.props.item;
    }

    @observable
    private getClassName(child: any) {
        let className = '';

        if (child.props.className) {
            className = child.props.className;
        }

        if (this.context.container && this.context.container.isDragging(this)) {
            className += ' ' + DRAGGING_SOURCE_CSS;
        }

        return className;
    }

    componentDidMount() {
        if (!this.elm) {
            return;
        }

        this.draggable = new Draggable<SortableItem>(this, {
            ...this.props,
            elm: this.elm,
            handle: this.props.handle,
            dragCopy: true,
            horizontal: false,
            vertical: true,
            context: this.context,
        });

        this.draggable.start();

        this.context.onSortableItemCreated(this);
    }

    componentWillUnmount() {
        this.context.onSortableItemRemoved(this);
    }

    render() {
        const child = React.Children.only(this.props.children);
        const clone = React.cloneElement(child, {
            ref: (ref: HTMLElement) => {
                this.elm = asHTMLElement(ref);
            },
            className: this.getClassName(child),
        });

        return clone;
    }
}
