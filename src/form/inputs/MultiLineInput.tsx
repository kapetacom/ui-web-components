import React, { RefObject } from "react";
import "./MultiLineInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import { observer } from "mobx-react";
import { FormElementContainer } from "../inputs/FormElementContainer";

export interface MultiLineInputProps {
    inputId: string,
    label: string,
    required: boolean,
    message: string,
    statusMessage?: string,
    inputStatus?: string,
    inputCallback: (inputId:string, userSelection: string) => void
}

@observer
export class MultiLineInput extends React.Component<MultiLineInputProps> {


    @observable
    inputFocused: boolean = false;

    @observable
    minHeight: number = 22;

    wrapperBorder: number = 3;

    @observable
    currentHeight: number = 40;

    maxHeight: number = 200;

    textareaWrapperRef: RefObject<HTMLDivElement> = React.createRef();

    divRef: RefObject<HTMLDivElement> = React.createRef();

    textareaScrollHeight: number | null = null;

    iconClass: string = '';

    @observable
    userInput: string = "";

    constructor(props: MultiLineInputProps) {
        super(props);
        this.currentHeight = this.minHeight;
    }

    @action
    inputOnBlur = () => {
        this.inputFocused = false;
    }

    @action
    inputOnFocus = () => {
        this.inputFocused = true;
    }

    calculateHeight() {
        let currentHeight = this.minHeight;
        if (this.divRef.current) {
            this.divRef.current.innerHTML = this.userInput + 'X';
            currentHeight = this.divRef.current.offsetHeight;
            if (this.minHeight > currentHeight) {
                currentHeight = this.minHeight;
            }

            if (this.maxHeight < currentHeight) {
                currentHeight = this.maxHeight;
            }
        }

        return currentHeight;
    }

    @action
    private setUserInput = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = evt.target.value;
        this.userInput = val;
        this.props.inputCallback(this.props.inputId, this.userInput);
    }

    render() {

        let currentHeight = this.calculateHeight();

        let required: string = this.props.required ? 'required' : '';

        let classNameWrapper = toClass({
            "textarea-wrapper": true,
            "required": !!required && !this.userInput.length && !this.inputFocused,
            "warning-status": this.props.inputStatus === "warning",
            "error-status": this.props.inputStatus === "error",
            "focused": this.inputFocused
        });

        let classNameTextarea = toClass({
            "textarea": true
        });

        return (
            <FormElementContainer
                inputId={this.props.inputId}
                label={this.props.label}
                required={this.props.required}
                inputFocused={this.inputFocused}
                message={this.props.message}
                statusMessage={this.props.statusMessage}
                inputStatus={this.props.inputStatus}
                hasValue={this.userInput.length > 0}
                inputMode={"multiline"}
            >
                <div
                    className={classNameWrapper}
                    ref={this.textareaWrapperRef}
                >
                    <textarea id={this.props.inputId}
                        onChange={(event) => { this.setUserInput(event) }}
                        style={{ height: currentHeight + "px" }}
                        onFocus={this.inputOnFocus}
                        onBlur={this.inputOnBlur}
                        className={classNameTextarea}
                        value={this.userInput}
                        autoComplete="off">
                    </textarea>
                    <div ref={this.divRef} className={'text-height'}></div>
                </div>
            </FormElementContainer>
        )
    }
}