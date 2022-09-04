import React, {CSSProperties} from "react";
import DnDContext from './DnDContext';
import {DnDDrop} from "./DnDDrop";
import {DnDDrag} from "./DnDDrag";
import _ from "lodash";

import {Dimensions} from "@blockware/ui-web-types";
import {asHTMLElement, DOMElement} from "@blockware/ui-web-utils";

interface DnDContainerProps {
    children: any
    overflowX?:boolean
    overflowY?:boolean
    zoom?:number
}

interface DnDContainerState {
    scrollLeft: number
    scrollTop: number
    zoom?:number
}

export class DnDContainer extends React.Component<DnDContainerProps, DnDContainerState> {

    private elm: DOMElement|null = null;

    private dropZones: DnDDrop[] = [];

    private currentDropZones: DnDDrop[] = [];

    constructor(props:DnDContainerProps) {
        super(props);

        this.state = {
            scrollLeft:0,
            scrollTop:0,
            zoom: this.props.zoom
        };
    }

    private getDropZonesFor(drag: DnDDrag) {
        return this.dropZones.filter((dropZone) => {
            return dropZone.matchesType(drag);
        });
    }

    onDropZoneCreated(dropZone: DnDDrop) {
        this.dropZones.push(dropZone);
    }

    onDropZoneRemoved(dropZone: DnDDrop) {
        const ix = this.dropZones.indexOf(dropZone);
        if (ix > -1) {
            this.dropZones.splice(ix, 1);
        }
    }

    onDragStart(drag: DnDDrag) {

        this.currentDropZones = this.getDropZonesFor(drag);

        this.currentDropZones.forEach((dropZone) => {
            dropZone.onDragStart(drag);
        });
    }

    onDragMove(dimensions: Dimensions, dragRect:ClientRect, drag: DnDDrag) {
        let foundDropZone = false;
        this.currentDropZones.forEach((dropZone) => {
            dropZone.clearMoveState();

            if (!foundDropZone &&
                dropZone.onDragMove(dimensions, dragRect, drag)) {
                foundDropZone = true;
            }
        });
    }

    onDragEnd(dimensions: Dimensions, dragRect:ClientRect, drag: DnDDrag) {
        let foundDropZone = false;
        this.currentDropZones.forEach((dropZone) => {
            dropZone.clearState();

            if (!foundDropZone &&
                dropZone.onDragEnd(dimensions, dragRect, drag)) {
                foundDropZone = true;
            }
        });

        this.currentDropZones = [];
    }

    componentDidMount() {
        if (!this.elm) {
            return;
        }

        this.updateScroll();

        this.elm.addEventListener('scroll', (evt) => {
            this.updateScroll();
        });
    }

    private updateScroll() {
        if (!this.elm) {
            return;
        }

        this.setState({
            scrollLeft: this.elm.scrollLeft,
            scrollTop: this.elm.scrollTop
        });
    }

    calculateStyle(existingStyle?:CSSProperties) {

        const style:CSSProperties = existingStyle ? _.cloneDeep(existingStyle) : {};

        if (!style.position) {
            style.position = 'relative';
        }

        return style;
    }

    getElement() {
        return this.elm;
    }

    render() {

        const child = React.Children.only(this.props.children);

        const clone = React.cloneElement(child, {
            ref: (ref:HTMLElement) => {this.elm = asHTMLElement(ref)},
            style: this.calculateStyle(child.style)
        });

        return (
            <DnDContext.Provider value={{
                container: this,
                containerElement: this.getElement.bind(this),
                onDropZoneCreated: this.onDropZoneCreated.bind(this),
                onDropZoneRemoved: this.onDropZoneRemoved.bind(this),
                onDragStart: this.onDragStart.bind(this),
                onDragMove: this.onDragMove.bind(this),
                onDragEnd: this.onDragEnd.bind(this),
                scrollLeft: this.state.scrollLeft,
                scrollTop: this.state.scrollTop,
                overflowX: this.props.overflowX,
                overflowY: this.props.overflowY,
                zoom: this.props.zoom
            }}>
                {clone}
            </DnDContext.Provider>
        )
    }


}