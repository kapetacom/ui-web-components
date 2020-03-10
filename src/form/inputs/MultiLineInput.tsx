import React, { RefObject } from "react";
import "./MultiLineInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import { observer } from "mobx-react";
import { FormElementContainer } from "../inputs/FormElementContainer";
import { InputAdvanceProps, InputTypes } from "./InputBasePropsInterface";


const MIN_HEIGHT: number = 22;
const MAX_HEIGHT: number = 200;
@observer
export class MultiLineInput extends React.Component<InputAdvanceProps> {

    @observable
    private inputFocused: boolean = false;

    private textHeightElementRef: RefObject<HTMLDivElement> = React.createRef();

    @observable
    private userInput: string = "";

    @action
    private inputOnBlur = () => {
        this.inputFocused = false;
    }

    @action
    private inputOnFocus = () => {
        this.inputFocused = true;
    }

    private calculateHeight() {
        let currentHeight = MIN_HEIGHT;
        if (this.textHeightElementRef.current) {
            this.textHeightElementRef.current.innerHTML = this.userInput + 'X';
            currentHeight = this.textHeightElementRef.current.offsetHeight;
            if (MIN_HEIGHT > currentHeight) {
                currentHeight = MIN_HEIGHT;
            }

            if (MAX_HEIGHT < currentHeight) {
                currentHeight = MAX_HEIGHT;
            }
        }

        return currentHeight;
    }

    @action
    private setUserInput = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = evt.target.value;
        this.userInput = val;
        this.props.inputCallback(this.props.inputName, this.userInput);
    }

    render() {

        let currentHeight = this.calculateHeight();

        return (
            <FormElementContainer
                label={this.props.label}
                required={this.props.required}
                inputFocused={this.inputFocused}
                message={this.props.message}
                statusMessage={this.props.statusMessage}
                inputStatus={this.props.inputStatus}
                hasValue={this.userInput.length > 0}
                inputType= { InputTypes.TEXT}
            >
                <div
                    className={"textarea-wrapper"}
                >
                    <textarea name={this.props.inputName}
                        onChange={(event) => { this.setUserInput(event) }}
                        style={{ height: currentHeight + "px" }}
                        onFocus={this.inputOnFocus}
                        onBlur={this.inputOnBlur}
                        className={"textarea"}
                        value={this.userInput}
                        autoComplete="off">
                    </textarea>
                    <div ref={this.textHeightElementRef} className={'text-height'}></div>
                </div>
            </FormElementContainer>
        )
    }
}