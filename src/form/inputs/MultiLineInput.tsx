import React, { RefObject } from "react";
import "./MultiLineInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";
import { FormElementContainer } from "../inputs/FormElementContainer";

export interface MultiLineInputProps {
    inputId: string,
    label: string,
    required: boolean,
    message: string,
    statusMessage?: string,
    inputStatus?: string,
    inputCallback: (userSelection: string[]) => void
}

@observer
export class MultiLineInput extends React.Component<MultiLineInputProps> {


    @observable
    inputFocused: boolean = false;

    @observable
    minHeight: number = 40;

    wrapperBorder:number =2; 

    maxHeight: number = 200;

    textareaWrapperRef: RefObject<HTMLDivElement>= React.createRef();

    textareaRef: RefObject<HTMLTextAreaElement> = React.createRef();

    textareaScrollHeight:number | null =null; 

    iconClass: string = '';

    required: string = this.props.required ? 'required' : '';

    @observable
    userInput: string = "";

    @action
    inputOnBlur = () => {
        this.inputFocused = false;
    }

    @action
    inputOnFocus = () => {
        this.inputFocused = true;
    }

    componentDidMount() {
        //this.setTextAreaHeight();
    }

    setTextAreaHeight = () => {
        if(this.textareaRef && this.textareaRef.current && this.textareaWrapperRef && this.textareaWrapperRef.current ) {
            this.textareaWrapperRef.current.style.height = this.minHeight.toString()+'px';
            this.textareaScrollHeight = this.textareaRef.current.scrollHeight;
            if(this.minHeight<=this.textareaScrollHeight && this.textareaScrollHeight<this.maxHeight ) {
                this.textareaWrapperRef.current.style.height = this.textareaScrollHeight.toString()+'px';
                console.log(this.textareaRef.current.style.height,this.textareaWrapperRef.current.style.height )

            } else if(this.textareaScrollHeight>this.maxHeight) {
                this.textareaWrapperRef.current.style.height =this.maxHeight.toString()+'px';
            }
        }
    }


    @action
    private setUserInput = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = evt.target.value;
        this.userInput = val;
        console.log(this.textareaRef);
    }

    render() {

        let classNameTextarea = toClass({
            "textarea": true
        });

        let classNameWrapper = toClass({
            "textarea-wrapper": true,
            "required": !!this.required && !this.userInput.length && !this.inputFocused,
            "warning-status": this.props.inputStatus === "warning",
            "error-status": this.props.inputStatus === "error",
            "focused": this.inputFocused
        })


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
                ref ={ this.textareaWrapperRef}
                >
                    <textarea id={this.props.inputId}
                        onChange={(event) => { this.setUserInput(event); this.setTextAreaHeight() }}
                        onFocus={this.inputOnFocus}
                        onBlur={this.inputOnBlur}
                        className={classNameTextarea}
                        value={this.userInput}
                        ref={this.textareaRef}
                        autoComplete="off">
                    </textarea>
                </div>


            </FormElementContainer>
        )
    }
}

