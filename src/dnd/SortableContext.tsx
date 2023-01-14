import React, {Context} from "react";
import {SortableContainer} from './SortableContainer';
import {DraggableContext} from "./DraggableContext";
import {SortableItem} from "./SortableItem";

export enum SwapMode {
    BEFORE,
    AFTER,
    NONE
}

export interface SortableContext extends DraggableContext<SortableItem> {
    container?:SortableContainer<any>
    onSortableItemRemoved:(item: SortableItem) => void
    onSortableItemCreated:(item: SortableItem) => void
}

export interface SortableContextType extends Context<SortableContext> {

}

const defaultValue:SortableContext = {
    onDragStart: () => {},
    onDragMove: () => {},
    onDragEnd: () => {},
    containerElement: () => null,
    onSortableItemCreated: () => {},
    onSortableItemRemoved: () => {}
};

export default React.createContext(defaultValue);