import React from "react";
import {observer} from "mobx-react";
import {action, makeObservable, observable} from "mobx";
import _ from 'lodash';
import {toClass} from "@blockware/ui-web-utils";

import {OverlayContext, OverlayComponent} from "./OverlayContext";

import './OverlayContainer.less';

interface OverlayContainerProps {
    children:any
}
interface OverlayContainerState {
    container:HTMLElement|null
}

@observer
export class OverlayContainer extends React.Component<OverlayContainerProps,OverlayContainerState> {

    private modalContainer :HTMLElement|null = null;

    @observable
    private components:OverlayComponent[] = [];


    private toZIndex(level:number) {
        return level + 10;
    }

    constructor(props:OverlayContainerProps){
        super(props);
        makeObservable(this);
        this.state={container:null}
    }

    @action
    private closeAllAbove(component:OverlayComponent) {
        const ix = this.components.indexOf(component);
        if (ix < 0) {
            return;
        }

        //Close all modals above this
        for(let i = (ix+1); i < this.components.length; i++) {
            if (!this.components[i].isClosable()) {
                return;
            }
            this.components[i].close();
        }
    }

    @action
    private onRemoved = (component:OverlayComponent) => {

        _.pull(this.components, component);
    };

    @action
    private onAdded = (component:OverlayComponent) => {
        const ix = this.components.indexOf(component);

        if (ix > -1 ||
            !component.isOpen()) {
            return;
        }

        this.components.push(component);
    };

    @action
    private onChanged = (component:OverlayComponent) => {

        const ix = this.components.indexOf(component);
        if (ix === -1 && component.isOpen()) {
            this.components.push(component);
        }

        if (ix > -1 && !component.isOpen()) {
            this.components.splice(ix, 1);
        }
    };

    @action
    private onClosing = (component:OverlayComponent) => {
        this.closeAllAbove(component);
    };

    @action
    private popLast = () => {
        if (this.components.length === 0) {
            return;
        }

        const component = this.components[this.components.length - 1];
        if (component && component.isClosable()) {
            component.close();
        }
    };

    @action
    private popLastModal = () => {
        const modals = this.components.filter((c) => c.isModal());
        if (modals.length === 0) {
            return;
        }

        const modal = modals[modals.length - 1];
        if (modal && modal.isClosable()) {
            modal.close();
        }
    };

    @action
    private onKeyPress = (evt:KeyboardEvent) => {
        if (evt.code !== 'Escape') {
            return;
        }

        this.popLast();
    };

    private isVisible() {
        return this.components.filter((c) => c.isModal()).length > 0;
    }

    private getIndex = (component:OverlayComponent):number => {

        const ix = this.components.indexOf(component);
        return this.toZIndex(ix);
    };

    private isCurrent = (component:OverlayComponent):boolean => {

        const ix = this.components.indexOf(component);
        if (ix < 0) {
            return false;
        }

        return this.components.length === ix + 1; //Last one
    };

    private getLevel() {
        let lastIx = -1;
        for(let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.isModal()) {
                lastIx = i;
            }
        }

        return lastIx;
    }

    componentDidMount() {
        document.addEventListener('keyup', this.onKeyPress);
        this.setState({container:this.modalContainer})
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyPress);
    }

    render() {
        const className = toClass({
            'overlay-container':true,
            'visible': this.isVisible()
        });

        const zIndex = this.toZIndex(this.getLevel());

        return (
            <div ref={(ref)=>{this.modalContainer=ref} }>
                <OverlayContext.Provider value={{
                    onAdded: this.onAdded,
                    onRemoved: this.onRemoved,
                    onChanged: this.onChanged,
                    onClosing: this.onClosing,
                    getIndex: this.getIndex,
                    isCurrent: this.isCurrent,
                    container: this.state.container
                }}>
                    <div className={className} style={{zIndex}} onClick={this.popLastModal} />


                    {this.props.children}

                </OverlayContext.Provider>
            </div>
        )
    }
}