import React, { RefObject } from "react";
import "./FormTextarea.less";
import {observable, action, makeObservable} from "mobx";
import { observer } from "mobx-react";
import { FormRow } from "../FormRow";


interface Props {
    name: string,
    label?: string,
    value?: any,
    validation?: any[],
    help?: string,
    disabled?: boolean,
    onChange?: (inputName: string, userInput: any) => void
}

const MIN_HEIGHT: number = 22;
const MAX_HEIGHT: number = 200;
@observer
export class FormTextarea extends React.Component<Props> {

    @observable
    private inputFocused: boolean = false;

    private textHeightElementRef: RefObject<HTMLDivElement> = React.createRef();

    private formRowRef: React.RefObject<FormRow> = React.createRef();

    @observable
    private userInput: string =  this.props.value ? this.props.value :"";

    constructor(props:Props) {
        super(props);
        makeObservable(this);
    }

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
        if (this.props.onChange) {
            this.props.onChange(this.props.name, this.userInput);
        }
        this.formRowRef.current?.updateReadyState(this.userInput);
    }

    render() {

        let currentHeight = this.calculateHeight();

        return (

            <FormRow
                ref={this.formRowRef}
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                focused={this.inputFocused}
                disabled={this.props.disabled}
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