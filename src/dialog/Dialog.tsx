
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { toClass, createHexagonPath, Orientation } from '@blockware/ui-web-utils';

import {DialogControl} from './DialogControl';
import { Button, ButtonType } from '../button/Button';
import {OverlayComponent, OverlayContextType} from "../overlay/OverlayContext";
import {OverlayContext} from "../overlay/OverlayContext";
import {RenderInBody} from "../overlay/RenderInBody";
import {Draggable} from "../dnd/Draggable";

import './Dialog.less';


const DEFAULT_HEIGHT = 350;
const DEFAULT_WIDTH = 400;

interface DialogProps {
    height?: number
    width?: number
}

interface DialogSize {
    height: number
    width: number
    top: number
    left: number
}

@observer
export class Dialog extends Component<DialogProps> implements OverlayComponent {

    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    private container: HTMLDivElement | null = null;

    private initialSize:DialogSize;

    constructor(props: any) {
        super(props);
        const height = this.props.height ? this.props.height : DEFAULT_HEIGHT;
        const width = this.props.width ? this.props.width : DEFAULT_WIDTH;
        const top = (window.innerHeight / 2) - (height / 2);
        const left = (window.innerWidth / 2) - (width / 2);

        this.initialSize = {
            height,
            width,
            top,
            left
        };
    }

    public isOpen():boolean {
        return DialogControl.open;
    }

    public isModal():boolean {
        return true;
    }

    public close() {
        DialogControl.close();
        this.context.onClosing(this);
    }

    public open() {
        DialogControl.show();
        this.context.onChanged(this);
    }

    componentDidMount() {
        if (!this.container) {
            return;
        }

        this.context.onAdded(this);

        const draggable = new Draggable<any>(this, {
            elm: this.container,
            handle: '.background'
        });

        draggable.start();
    }

    componentWillUnmount() {
        this.context.onRemoved(this);
    }

    componentWillUpdate() {
        this.context.onChanged(this);
    }

    private onTransitionEnd = () => {
        this.context.onChanged(this);
    };

    render() {
        let classNames = toClass({
            "dialog-container": true,
            'open': DialogControl.open
        });

        const zIndex = this.context.getIndex(this);

        const style = Object.assign({
            zIndex
        }, this.initialSize);

        return (
            <RenderInBody>
                <div ref={(ref) => this.container = ref}
                     className={classNames}
                     style={style}
                     onTransitionEnd={this.onTransitionEnd} >
                    <svg className={"dialog-shape"} width={this.initialSize.width} height={this.initialSize.height} viewBox={"0 0 " + this.initialSize.height + " " + this.initialSize.height} >
                        {/* TODO: add all info in dialog in a foreign object and use div and p elements  */}

                        <defs >
                            <filter id="dialog-shadow" x="-50%" y="-50%" width="200%" height="200%" >
                                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#000" floodOpacity="0.25" />
                            </filter>
                        </defs>

                        <path className={'background'} style={{ overflow: "visible" }} d={createHexagonPath(this.initialSize.width, this.initialSize.height, 10, Orientation.VERTICAL, 60)} />

                        <text className={'dialog-title'} x={this.initialSize.width / 2} textAnchor="middle" y={this.initialSize.height / 4} fill={"#000"} >
                            {DialogControl.title}
                        </text>

                        <text className={'dialog-text'} x={this.initialSize.width / 2} textAnchor="middle" y={this.initialSize.height / 2} fill={"#000"} >
                            {DialogControl.text}
                        </text>

                        <foreignObject x={this.initialSize.width / 2 - 140} y={this.initialSize.height - 100} overflow="visible" >
                            <Button onClick={DialogControl.ok} width={88} buttonType={ButtonType.PROCEED} text={"Yes"} style={{}} />
                        </foreignObject>

                        <foreignObject x={this.initialSize.width / 2 + 30} y={this.initialSize.height - 100} overflow="visible" >
                            <Button onClick={() => { DialogControl.hide() }} width={88} buttonType={ButtonType.CANCEL} text={"No"} style={{}} />
                        </foreignObject>

                    </svg>
                </div>
            </RenderInBody>
        )
    }
}
