import React, { CSSProperties } from 'react';
import { asHTMLElement, DOMElement } from '@kapeta/ui-web-utils';
import { Dimensions } from '@kapeta/schemas';

import SortableContext, { SwapMode } from './SortableContext';
import { SortableItem } from './SortableItem';
import _ from 'lodash';
import { DRAGGING_SOURCE_CSS } from './Draggable';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

interface SelectorContainerProps<T extends any> {
    list: T[];
    children: any;
    onUpdate: (changedList: T[]) => void;
    onChanged?: (changedList: T[]) => void;
}

@observer
export class SortableContainer<T extends any> extends React.Component<SelectorContainerProps<T>> {
    private elm: DOMElement | null = null;

    private items: SortableItem[] = [];

    @observable
    private dragging?: SortableItem;

    @observable
    private changed: boolean = false;

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

    @observable
    public isDragging(item: SortableItem) {
        if (!this.dragging) {
            return false;
        }

        return this.dragging.getItem() === item.getItem();
    }

    @action
    private onDragStart(drag: SortableItem) {
        this.dragging = drag;
    }

    @action
    private onUpdate() {
        this.changed = true;
        this.props.onUpdate([...this.props.list]);
    }

    @action
    private onDragMove(dimensions: Dimensions, dragRect: ClientRect, drag: SortableItem) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.getItem() === drag.getItem()) {
                continue;
            }

            const mode = item.shouldSwap(dragRect);

            const currentIx = this.props.list.indexOf(drag.getItem());
            const newIx = this.props.list.indexOf(item.getItem());

            switch (mode) {
                case SwapMode.BEFORE:
                    this.props.list.splice(currentIx, 1);
                    if (newIx === 0) {
                        this.props.list.unshift(drag.getItem());
                    } else {
                        this.props.list.splice(Math.max(0, newIx), 0, drag.getItem());
                    }
                    this.onUpdate();
                    return;
                case SwapMode.AFTER:
                    this.props.list.splice(currentIx, 1);
                    this.props.list.splice(newIx, 0, drag.getItem());
                    this.onUpdate();
                    return;
            }
        }
    }

    @action
    private onDragEnd(dimensions: Dimensions, dragRect: ClientRect, drag: SortableItem) {
        this.dragging = undefined;
        if (this.changed && this.props.onChanged) {
            this.props.onChanged([...this.props.list]);
        }
        this.changed = false;
        if (!this.elm) {
            return;
        }

        this.elm
            .querySelectorAll('.' + DRAGGING_SOURCE_CSS)
            .forEach((elm) => elm.classList.remove(DRAGGING_SOURCE_CSS));
    }

    private calculateStyle(existingStyle?: CSSProperties) {
        const style: CSSProperties = existingStyle ? _.cloneDeep(existingStyle) : {};

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
            ref: (ref: HTMLElement) => {
                this.elm = asHTMLElement(ref);
            },
            style: this.calculateStyle(child.style),
        });

        return (
            <SortableContext.Provider
                value={{
                    container: this,
                    containerElement: this.getElement.bind(this),
                    onDragStart: this.onDragStart.bind(this),
                    onDragMove: this.onDragMove.bind(this),
                    onDragEnd: this.onDragEnd.bind(this),
                    onSortableItemCreated: this.onSortableItemCreated.bind(this),
                    onSortableItemRemoved: this.onSortableItemRemoved.bind(this),
                }}
            >
                {clone}
            </SortableContext.Provider>
        );
    }
}
