import React, {Component} from 'react';
import {observer} from 'mobx-react';

import {createHexagonPath, Orientation, toClass} from '@blockware/ui-web-utils';

import {DialogControl} from './DialogControl';
import {OverlayComponent, OverlayContext, OverlayContextType} from "../overlay/OverlayContext";
import {PanelStructure} from '../helpers/PanelStructure';

import {
    Button,
    ButtonSize,
    ButtonStyle,
    ButtonType,
    Draggable,
    FormButtons,
    FormContainer,
    RenderInBody,
    SingleLineInput
} from "..";

import './Dialog.less';

export enum DialogTypes {
    CONFIRMATION = "confirmation",
    PROMPT = "prompt",
    DELETE = "delete"
  }

const DEFAULT_HEXAGONAL = {
    height: 350,
    width: 400
};

const DEFAULT_RECTANGLE_PROMPT = {
    height: 290,
    width: 500
}

const DEFAULT_RECTANGLE_CONFIRMATION = {
    height: 240,
    width: 500
}

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

const CheckedIcon: React.FC = () => {
    return (
        <svg className="checked-icon" viewBox="0 0 50 50" fill="none">
            <circle cx="18.5" cy="18.5" r="18.5" fill="#88B39A" />
            <path fillRule="evenodd" clipRule="evenodd" d="M27.4674 11.4655C28.1443 12.1177 28.1809 13.2129 27.5491 13.9117L17.1178 25.4502C16.8007 25.8009 16.3568 26 15.8922 26C15.4275 26 14.9836 25.8009 14.6666 25.4502L9.45088 19.6809C8.81913 18.9821 8.85571 17.8869 9.53259 17.2347C10.2095 16.5825 11.2703 16.6203 11.9021 17.3191L15.8922 21.7326L25.0979 11.5498C25.7297 10.851 26.7905 10.8133 27.4674 11.4655Z" fill="white" />
        </svg>

    )
}

@observer
export class Dialog extends Component<DialogProps ,any> implements OverlayComponent {

    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    private container: HTMLDivElement | null = null;

    public isOpen():boolean {
        return DialogControl.open;
    }

    public isModal():boolean {
        return true;
    }

    public close() {
        DialogControl.close();
        this.context.onClosing(this);
    }

    public open() {
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

    private calculateInitialSize = () : DialogSize => {

        let defaultValue: DialogProps;

        switch (DialogControl.type) {
            case DialogTypes.DELETE:
                defaultValue = DEFAULT_HEXAGONAL;
                break
            case DialogTypes.CONFIRMATION:
                defaultValue = DEFAULT_RECTANGLE_CONFIRMATION;
                break
            default:
                defaultValue = DEFAULT_RECTANGLE_PROMPT;
                break
        }

        const height = this.props.height ? this.props.height : defaultValue.height!;
        const width = this.props.width ? this.props.width : defaultValue.width!;
        const top = (window.innerHeight / 2) - (height / 2);
        const left = (window.innerWidth / 2) - (width / 2);

        return {
            height,
            width,
            top,
            left
        };
    } 

    private renderDeleteDialog = (initialSize: DialogSize) => {

        return (

            <svg className={"dialog-shape"} width={initialSize.width} height={initialSize.height} viewBox={"0 0 " + initialSize.height + " " + initialSize.height} >
                {/* TODO: add all info in dialog in a foreign object and use div and p elements  */}

                <defs >
                    <filter id="dialog-shadow" x="-50%" y="-50%" width="200%" height="200%" >
                        <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#000" floodOpacity="0.25" />
                    </filter>
                </defs>

                <path className={'background'} style={{ overflow: "visible" }} d={createHexagonPath(initialSize.width, initialSize.height, 10, Orientation.VERTICAL, 60)} />

                <text className={'dialog-title'} x={initialSize.width / 2} textAnchor="middle" y={initialSize.height / 4} fill={"#000"} >
                    {DialogControl.title}
                </text>

                <text className={'dialog-text'} x={initialSize.width / 2} textAnchor="middle" y={initialSize.height / 2} fill={"#000"} >
                    {DialogControl.text}
                </text>

                <foreignObject x={initialSize.width / 2 - 100} y={initialSize.height - 100} overflow="visible" >
                    <Button onClick={DialogControl.ok} width={ButtonSize.SMALL} style={ButtonStyle.PRIMARY} text={"Yes"} />
                </foreignObject>

                <foreignObject x={initialSize.width / 2 + 10} y={initialSize.height - 100} overflow="visible" >
                    <Button onClick={() => { DialogControl.hide() }} width={ButtonSize.SMALL} style={ButtonStyle.DANGER} text={"No"} />
                </foreignObject>

            </svg>
        );
    }

    private renderPromptOrConfirmationDialog = () => {
        return (

            <PanelStructure title={DialogControl.title} onClose={() => this.close()}>
                <div className="close">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" onClick={() => this.close()}  >
                        <path d="M11.1421 11L1.1424 1" stroke="#C4C4C4" strokeLinecap="round" />
                        <path d="M1.14209 11L11.1418 1" stroke="#C4C4C4" strokeLinecap="round" />
                    </svg>
                </div>

                {DialogControl.type === DialogTypes.CONFIRMATION && <CheckedIcon></CheckedIcon>}

                <div className="content-wrapper">
                    <div className="dialog-title">{DialogControl.title}</div>
                    <div className="dialog-message">{DialogControl.text}</div>
                    <FormContainer onSubmit={() => {
                        console.log("prompt dialog Ok");
                        DialogControl.ok();
                    }}>
                        {DialogControl.type === DialogTypes.PROMPT && <SingleLineInput
                            name={"dialog-prompt"}
                            value={DialogControl.promptInputValue}
                            label={""}
                            validation={['required']}
                            help={""}
                            onChange={(name, input) => DialogControl.setPromptInputValue(input)}
                            type={DialogControl.promptInputType}
                        />}

                        <FormButtons>
                            <Button width={ButtonSize.SMALL} style={ButtonStyle.DANGER} onClick={() => this.close()} text="Cancel" />
                            <Button width={ButtonSize.SMALL} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY} text={"Ok"} />
                        </FormButtons>
                    </FormContainer>
                </div>
            </PanelStructure>
        );
    };
    

    render() {
        let classNames = toClass({
            "dialog-container": true,
            'open': DialogControl.open,
            'delete': DialogControl.type === DialogTypes.DELETE,
            'prompt': DialogControl.type === DialogTypes.PROMPT,
            'confirmation': DialogControl.type === DialogTypes.CONFIRMATION
        });

        const zIndex = this.context.getIndex(this);

        let initialSize = this.calculateInitialSize();

        const style = Object.assign({
            zIndex
        }, initialSize);

        return (
            
            <RenderInBody>
                <div ref={(ref) => this.container = ref}
                    className={classNames}
                    style={style}
                    onTransitionEnd={this.onTransitionEnd} >

                    {DialogControl.type === DialogTypes.DELETE ?
                        this.renderDeleteDialog(initialSize) : (DialogControl.type === DialogTypes.CONFIRMATION || DialogControl.type === DialogTypes.PROMPT) ?
                            this.renderPromptOrConfirmationDialog() : null}
                </div>
            </RenderInBody>

        )
    }
}
