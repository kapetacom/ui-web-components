import React from "react";
import {  toClass } from "@blockware/ui-web-utils";
import {PanelStructure} from "../helpers/PanelStructure";
import {OverlayComponent, OverlayContextType} from "../overlay/OverlayContext";
import {OverlayContext} from "../overlay/OverlayContext";
import {RenderInBody} from "..";

import "./SidePanel.less";

interface SidePanelProps {
    size?: PanelSize
    side?: PanelAlignment
    closable?:boolean
    onClose?: () => void
    onOpen?: () => void
    children: any
    title?: string
    open?: boolean
    index?: number
    modal?: boolean
    className?:string
}

interface SidePanelState {
    open: boolean
}

export enum PanelAlignment {
    left = "left",
    right = "right"
}

export enum PanelSize {
    small = "small",
    medium = "medium",
    large = "big",
    full = "all"
}

export class SidePanel extends React.Component<SidePanelProps, SidePanelState> implements OverlayComponent {

    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    constructor(props:SidePanelProps) {
        super(props);

        this.state = {
            open: !!props.open
        };
    }

    public isClosable() {
        return this.props.closable !== undefined ? this.props.closable : true;
    }

    public isOpen():boolean {
        return this.state.open;
    }

    public isModal():boolean {
        return !!this.props.modal;
    }

    public close() {

        this.setState({
            open:false
        });

        if (this.isClosable()) {
            this.context.onClosing(this);
        }
    }

    public open() {
        this.setState({
            open:true
        }, () => {
            if (this.isClosable()) {
                this.context.onChanged(this);
            }
        });
    }

    componentDidMount() {
        if (this.isClosable()) {
            this.context.onAdded(this);
        }
    }

    componentWillUnmount() {
        if (this.isClosable()) {
            this.context.onRemoved(this);
        }
    }

    private onTransitionEnd = (evt:React.TransitionEvent) => {
        if (evt.propertyName !== "transform") {
            return;
        }


        if (this.isOpen()) {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        } else {
            if (this.props.onClose) {
                this.props.onClose();
            }
        }

        if (this.isClosable()) {
            this.context.onChanged(this);
        }
    };

    public render() {

        const size = this.props.size ? this.props.size : PanelSize.small;
        const side = this.props.side ? this.props.side : PanelAlignment.right;

        let classNames = {
            'side-panel-container': true,
            [size]:true,
            [side]:true,
            'open': this.state.open,
            'current': this.isClosable() ? this.context.isCurrent(this) : true
        };

        const zIndex = this.isClosable() ? this.context.getIndex(this) : 5;

        return (
            <RenderInBody className={this.props.className}>
                <div onTransitionEndCapture={this.onTransitionEnd}
                     style={{ zIndex }}
                     className={toClass(classNames)}>

                    <PanelStructure
                        title={this.props.title || ""}
                        closable={this.props.closable}
                        onClose={() => {
                            this.close();
                        }}>

                        {this.props.children}

                    </PanelStructure>

                </div>
            </RenderInBody>
        )
    }

}