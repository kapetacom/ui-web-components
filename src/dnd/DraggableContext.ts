import { Dimensions } from '@blockware/ui-web-types';
import { DOMElement } from '@blockware/ui-web-utils';

export interface DraggableContext<T> {
    containerElement: () => DOMElement | null;
    onDragStart: (drag: T) => void;
    onDragMove: (position: Dimensions, dragRect: ClientRect, drag: T) => void;
    onDragEnd: (position: Dimensions, dragRect: ClientRect, drag: T) => void;
}
