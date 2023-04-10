import React from 'react';
import DnDContext, { DnDContextType } from './DnDContext';
import { asHTMLElement, DOMElement } from '@kapeta/ui-web-utils';
import { Draggable } from './Draggable';
import { Dimensions } from '@kapeta/schemas';

interface DnDDragProps {
    children: any;
    type: string;
    value: any;
    horizontal?: boolean;
    vertical?: boolean;
    disabled?: boolean;
    zoom?: number;
    copyElm?: () => JSX.Element;
    onDragStart?: () => void;
    onDragMove?: (dimensions: Dimensions) => boolean;
    onDragEnd?: (dimensions: Dimensions) => boolean;
    dragCopy?: boolean;
    container?: DOMElement | string;
}

export class DnDDrag extends React.Component<DnDDragProps> {
    static contextType = DnDContext;
    context!: React.ContextType<DnDContextType>;

    private elm: DOMElement | null = null;

    private target: DOMElement | null = null;

    private draggable?: Draggable<DnDDrag>;

    componentDidMount() {
        if (!this.elm || !this.target) {
            return;
        }
        let container: Element | undefined;
        if (this.props.container) {
            if (typeof this.props.container === 'string') {
                let selector: string = this.props.container;
                let closestParent = this.elm.closest(selector);
                if (closestParent) {
                    container = closestParent;
                }
            } else {
                container = this.props.container;
            }
        }

        this.draggable = new Draggable<DnDDrag>(this, {
            ...this.props,
            elm: this.elm,
            target: this.target,
            container: container,
            dragCopy:
                this.props.dragCopy !== undefined ? this.props.dragCopy : true,
            context: this.context,
            zoom: this.props.zoom ? this.props.zoom : this.context.zoom,
            overflowX: this.context ? this.context.overflowX : false,
            overflowY: this.context ? this.context.overflowY : false,
        });

        this.draggable.start();
    }

    componentDidUpdate() {
        if (!this.elm || !this.target) {
            return;
        }
        let container: Element | undefined;
        if (this.props.container) {
            if (typeof this.props.container === 'string') {
                let selector: string = this.props.container;
                let closestParent = this.elm.closest(selector);
                if (closestParent) {
                    container = closestParent;
                }
            } else {
                container = this.props.container;
            }
        }

        this.draggable?.stop();

        if (this.props.disabled) {
            return;
        }

        this.draggable = new Draggable<DnDDrag>(this, {
            ...this.props,
            elm: this.elm,
            target: this.target,
            container: container,
            dragCopy:
                this.props.dragCopy !== undefined ? this.props.dragCopy : true,
            context: this.context,
            zoom: this.props.zoom ? this.props.zoom : this.context.zoom,
            overflowX: this.context ? this.context.overflowX : false,
            overflowY: this.context ? this.context.overflowY : false,
        });

        this.draggable.start();
    }

    render() {
        //TODO: FIGURE OUT HOW TO ADD PLACEHOLDER ELEMENT TO THE DOM TO BE ABLE TO PROVIDE IT TO THE Draggable.ts class
        const child = React.Children.only(this.props.children);

        const clone = React.cloneElement(child, {
            ref: (ref: HTMLElement) => {
                this.elm = this.target = asHTMLElement(ref);
            },
        });

        if (this.props.copyElm) {
            const copyElm = React.cloneElement(this.props.copyElm(), {
                ref: (ref: HTMLElement) => {
                    this.target = asHTMLElement(ref);
                },
            });

            return (
                <>
                    {clone}
                    <div style={{ position: 'absolute', left: '-99999px' }}>
                        {copyElm}
                    </div>
                </>
            );
        }

        return <>{clone}</>;
    }
}
