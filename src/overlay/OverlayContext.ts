import React, {Context} from "react";
import exp from "constants";

export interface OverlayComponent {
    isOpen: () => boolean
    isModal: () => boolean
    isClosable: () => boolean
    open:() => void
    close:() => void
}

interface OverlayContextData  {
    onRemoved:(component:OverlayComponent) => void
    onChanged:(component:OverlayComponent) => void
    onClosing:(component:OverlayComponent) => void
    onAdded:(component:OverlayComponent) => void
    getIndex:(component:OverlayComponent) => number
    isCurrent:(component:OverlayComponent) => boolean
    container?:HTMLElement|null
}

export interface OverlayContextType extends Context<OverlayContextData> {

}

const defaultValue:OverlayContextData = {
    onRemoved:() => {},
    onAdded:() => {},
    onChanged:() => {},
    onClosing:() => {},
    getIndex:() => { return 0 },
    isCurrent:() => { return false },
};

export const OverlayContext:OverlayContextType = React.createContext(defaultValue);
