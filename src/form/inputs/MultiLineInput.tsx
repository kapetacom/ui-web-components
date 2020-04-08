import React, { RefObject } from "react";
import "./MultiLineInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import { observer } from "mobx-react";
import { FormRow } from "../FormRow";


interface MultiLineInputProps {
    name: string,
    value: any,
    label: string,
    validation: any[],
    help?: string,
    disabled?: boolean,
    onChange: (inputName: string, userInput: any) => void
}

const MIN_HEIGHT: number = 22;
const MAX_HEIGHT: number = 200;
@observer
export class MultiLineInput extends React.Component<MultiLineInputProps> {

    @observable
    private inputFocused: boolean = false;

    private textHeightElementRef: RefObject<HTMLDivElement> = React.createRef();

    @observable
    private userInput: string =  this.props.value ? this.props.value :"";

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
        this.props.onChange(this.props.name, this.userInput);
    }

    render() {

        let currentHeight = this.calculateHeight();

        return (

            <FormRow
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                focused={this.inputFocused}
            >
                <div
                    className={"textarea-wrapper"} data-name={this.props.name} data-value={this.userInput}
                >
                    <textarea name={this.props.name}
                        onChange={(event) => { this.setUserInput(event) }}
                        style={{ height: currentHeight + "px" }}
                        onFocus={this.inputOnFocus}
                        onBlur={this.inputOnBlur}
                        className={"textarea"}
                        value={this.userInput}
                        disabled={this.props.disabled}
                        autoComplete="off">
                    </textarea>
                    <div ref={this.textHeightElementRef} className={'text-height'}></div>
                </div>
            </FormRow>
        )
    }
}