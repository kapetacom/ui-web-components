import React from "react";
import DnDContext, {DnDContextType} from './DnDContext';
import { asHTMLElement, DOMElement } from "@blockware/ui-web-utils";
import {Draggable} from "./Draggable";

interface DnDDragProps {
    children: any
    type: string
    value: any
    horizontal?: boolean
    vertical?: boolean
    copyElm?: () => JSX.Element
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

        this.draggable = new Draggable<DnDDrag>(this, {
            ...this.props,
            elm: this.elm,
            target: this.target,
            dragCopy: true,
            context: this.context
        });

        this.draggable.start();
    }

    render() {

        //TODO: FIGURE OUT HOW TO ADD PLACEHOLDER ELEMENT TO THE DOM TO BE ABLE TO PROVIDE IT TO THE Draggable.ts class
        const child = React.Children.only(this.props.children);

        const clone = React.cloneElement(child, {
            ref: (ref: HTMLElement) => { this.elm = this.target = asHTMLElement(ref) }
        });

        if (this.props.copyElm) {
            const copyElm = React.cloneElement(this.props.copyElm(), {
                ref: (ref: HTMLElement) => { this.target = asHTMLElement(ref) }
            });

            return <>
                {clone}
                <div style={{ position: 'absolute', left:'-99999px' }}>
                    {copyElm}
                </div>
            </>;
        }

        
        return <>
            {clone}
        </>;

    }
}