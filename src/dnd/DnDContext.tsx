import React, {Context} from "react";
import {DnDContainer} from "./DnDContainer";
import {DnDDrop} from "./DnDDrop";
import {DnDDrag} from "./DnDDrag";
import {DraggableContext} from "./DraggableContext";

interface DnDContextData extends DraggableContext<DnDDrag> {
    scrollTop: number;
    scrollLeft: number;
    onDropZoneRemoved:(dropZone: DnDDrop) => void
    onDropZoneCreated:(dropZone: DnDDrop) => void
    container?:DnDContainer
}

export interface DnDContextType extends Context<DnDContextData> {

}

const defaultValue:DnDContextData = {
    scrollLeft:0,
    scrollTop:0,
    containerElement: () => { return null },
    onDropZoneCreated: () => {},
    onDropZoneRemoved: () => {},
    onDragStart: () => {},
    onDragMove: () => {},
    onDragEnd: () => {}
};

export default React.createContext(defaultValue);


