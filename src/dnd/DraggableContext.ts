import { Dimensions } from '@kapeta/ui-web-types';
import { DOMElement } from '@kapeta/ui-web-utils';

export interface DraggableContext<T> {
    containerElement: () => DOMElement | null;
    onDragStart: (drag: T) => void;
    onDragMove: (position: Dimensions, dragRect: ClientRect, drag: T) => void;
    onDragEnd: (position: Dimensions, dragRect: ClientRect, drag: T) => void;
}
