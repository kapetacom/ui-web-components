import React, {CSSProperties} from "react";
import {asHTMLElement, DOMElement} from "@blockware/ui-web-utils";
import {Dimensions} from "@blockware/ui-web-types";

import SortableContext, {SwapMode} from './SortableContext';
import {SortableItem} from "./SortableItem";
import _ from "lodash";
import {DRAGGING_SOURCE_CSS} from "./Draggable";
import {action, makeObservable} from "mobx";
import {observer} from "mobx-react";

interface SelectorContainerProps {
    list: any[]
    children: any
    onChange:() => void
}

@observer
export class SortableContainer extends React.Component<SelectorContainerProps> {

    private elm: DOMElement | null = null;

    private items:SortableItem[] = [];

    private dragging?:SortableItem;

    constructor(props) {
        super(props);
        makeObservable(this);
    }

    private onSortableItemCreated(drag: SortableItem) {
        this.items.push(drag);
    }

    private onSortableItemRemoved(drag: SortableItem) {
        _.pull(this.items, drag);
    }


    public isDragging(item: SortableItem) {
        if (!this.dragging) {
            return false;
        }

        return this.dragging.getItem() === item.getItem();
    }

    private onDragStart(drag: SortableItem) {
        this.dragging = drag;
    }

    @action
    private onDragMove(dimensions: Dimensions, dragRect:ClientRect, drag: SortableItem) {
        for(let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.getItem() === drag.getItem()) {
                continue;
            }

            const mode = item.shouldSwap(dragRect);

            const currentIx = this.props.list.indexOf(drag.getItem());
            const newIx = this.props.list.indexOf(item.getItem());

            switch(mode) {
                case SwapMode.BEFORE:
                    this.props.list.splice(currentIx, 1);
                    if (newIx === 0) {
                        this.props.list.unshift(drag.getItem());
                    } else {
                        this.props.list.splice(Math.max(0,newIx), 0, drag.getItem());
                    }
                    this.props.onChange();
                    return;
                case SwapMode.AFTER:
                    this.props.list.splice(currentIx, 1);
                    this.props.list.splice(newIx, 0, drag.getItem());
                    this.props.onChange();
                    return;
            }
        }
    }

    private onDragEnd(dimensions: Dimensions, dragRect:ClientRect, drag: SortableItem) {
        this.dragging = undefined;
        if (!this.elm) {
            return;
        }

        this.elm.querySelectorAll('.' + DRAGGING_SOURCE_CSS).forEach((elm) => elm.classList.remove(DRAGGING_SOURCE_CSS));
    }

    private calculateStyle(existingStyle?:CSSProperties) {

        const style:CSSProperties = existingStyle ? _.cloneDeep(existingStyle) : {};

        if (!style.position) {
            style.position = 'relative';
        }

        return style;
    }

    private getElement() {
        return this.elm;
    }


    render() {

        const child = React.Children.only(this.props.children);

        const clone = React.cloneElement(child, {
            ref: (ref:HTMLElement) => {this.elm = asHTMLElement(ref)},
            style: this.calculateStyle(child.style)
        });

        return (
            <SortableContext.Provider value={{
                container: this,
                containerElement: this.getElement.bind(this),
                onDragStart: this.onDragStart.bind(this),
                onDragMove: this.onDragMove.bind(this),
                onDragEnd: this.onDragEnd.bind(this),
                onSortableItemCreated: this.onSortableItemCreated.bind(this),
                onSortableItemRemoved: this.onSortableItemRemoved.bind(this)
            }}>
                {clone}
            </SortableContext.Provider>
        )
    }


}