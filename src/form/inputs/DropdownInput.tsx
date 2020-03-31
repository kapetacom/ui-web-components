import React, { ChangeEvent } from "react";
import "./DropdownInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";
import { FormRow } from "../FormRow";

interface DropdownInputProps {
    name: string,
    value: any,
    label: string,
    validation: any[],
    help?: string,
    disabled?: boolean,
    multi?: boolean,
    options: string[] | {[key:string]:string},
    onChange: (inputName: string, userInput: any) => void
}

@observer
export class DropdownInput extends React.Component<DropdownInputProps> {


    @observable
    private inputFocus: boolean = false;

    @observable
    private inputSuggestion: string = '';

    @observable
    private userInput: string = this.props.value ? this.props.value :"";

    @observable
    private userSelection: string[] = [];

    @observable
    private inputElement = React.createRef<HTMLInputElement>();

    @action
    private onInputFocus = () => {
        this.inputFocus = true;
        this.userInput='';
    };

    @action
    private onInputBlur = () => {
        this.inputFocus = false;
        if (this.inputElement.current) {
            this.userInput = this.userSelection.join(', ');
            this.inputElement.current.blur();
        }
    };

    @action
    private onInputToggle = () => {
        if(!this.props.disabled){
            if(this.inputFocus) {
                this.onInputBlur();
            }
            else {
                this.onInputFocus();
            }  
        }
    }

    @action
    private setUserSelection(tempList: string[]) {
        this.userSelection = _.cloneDeep(tempList)
    }

    @action
    private setInputSuggestion() {
        if (this.userInput && this.userInput.length > 0 ) {
                this.inputSuggestion = this.optionListFiltered()![0];
        } else {
            this.inputSuggestion = "";
        }
    }

    @action
    private selectHandler(selection: string) {
        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }
        const getMappedValues = (): string[] | string=>{
            let selection = this.userSelection.map(key=>{                
                return this.getOptions()[key];
            });
            if(!this.props.multi) {
                return selection[0];
            }
            return selection;
        }

        let tempUserSelection: string[] = this.userSelection;
        const isSelected: number = tempUserSelection.indexOf(selection);

        if (tempUserSelection.length > 0) {

            if (isSelected > -1) {
                tempUserSelection.splice(isSelected, 1);
                this.setUserSelection(tempUserSelection);
                this.props.onChange(this.props.name,getMappedValues() );
                return;
            }
        }

        if (!this.props.multi && tempUserSelection.length > 0) {
            tempUserSelection = [];
        }

        tempUserSelection.push(selection);
        this.userInput = "";
        this.setInputSuggestion();
        this.setUserSelection(tempUserSelection);
        this.props.onChange(this.props.name, getMappedValues());
        if(!this.props.multi){
            this.onInputBlur();
        }
    };

    private optionListFiltered = () => {
            return Object.keys(this.getOptions()).sort().filter((item:string) => {
                return item.toUpperCase().startsWith(this.userInput.toUpperCase())
            });
    }

    private getOptions = (): { [key: string]: string } => {

        if (this.props.options === null || this.props.options === undefined) {
            throw new Error("Provide an array of strings or an object of options.");
        }

        let options: { [key: string]: string } = {};
        if (_.isArray(this.props.options)) {
            this.props.options.forEach(item => options[item] = item);
            return options;
        }

        if (_.isObject(this.props.options)) {
            return this.props.options;
        }
        return options;
    }

    private renderOptions = () => {
        let filteredList = this.optionListFiltered();        
        if(filteredList) {
            return filteredList.map((option: string) => {
                let row = (
                    <li key={option} className={`option ${(this.userSelection.indexOf(option) > -1 ? " selected" : "")}`}
                        onMouseDown={(evt: React.MouseEvent) => {
                            evt.nativeEvent.stopImmediatePropagation();
                            evt.preventDefault();

                            this.selectHandler(option)
                        }}>
                        {this.boldQuery(option, this.userInput)}

                        {
                            this.userSelection.indexOf(option) < 0 ? null :
                                <span className={"selected-icon"} >
                                    <svg width="14" height="10" fill="none" >
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 9.61957L0 4.99477L1.4 3.69983L5 7.02968L12.6 0L14 1.29494L5 9.61957Z" fill="#686868" />
                                    </svg>
                                </span>
                        }
                    </li>
                );
                return row;
            });
        }
    }

    @action
    private setUserInput = (evt: ChangeEvent<HTMLInputElement>) => {
        let val = evt.target.value;
        this.userInput = val;
        this.setInputSuggestion();
    }

    private boldQuery = (str: string, query: string) => {
        let optionString = str.toUpperCase();
        let userInput = query.toUpperCase();
        const queryIndex = optionString.indexOf(userInput);
        if (!userInput || queryIndex === -1) {
            return str;
        }
        const queryLength = query.length;
        return <span>
            {str.substr(0, queryIndex)}
            <b>{str.substr(queryIndex, queryLength)}</b>
            {str.substr(queryIndex + queryLength)}
        </span>
    }

    render() {

        let classNameList = toClass({
            "list": true,
            "show-list": this.inputFocus
        })

        let classNameArrowIcon = toClass({
            "arrow-icon": true,
            "focus-icon": !!this.inputFocus
        });

        let inputValue= this.userInput || this.inputFocus ? this.userInput : this.props.value;

        return (
            <FormRow
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                focused={this.inputFocus}
            >
                <div className={"dropdown-input"} data-name={this.props.name} data-value={inputValue}>
                    {this.inputFocus && this.userInput.length > 0 && <span className={"user-suggestion"}>{this.inputSuggestion}</span>}

                    <input name={this.props.name}
                        type={"text"}
                        onChange={(event) => { this.setUserInput(event) }}
                        onFocus={this.onInputFocus}
                        onBlur={this.onInputBlur}
                        ref={this.inputElement}
                        value={inputValue}
                        autoComplete="off"
                        disabled={this.props.disabled} />
                    <div className={classNameArrowIcon}>
                        <svg width="13" height="5" fill="none" onClick={this.onInputToggle}>
                            <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
                        </svg>
                    </div>
                    {this.userSelection.length > 0 && this.props.multi && <span className="selected-number">({this.userSelection.length})</span>}
                    <ul id="datalist-input" className={classNameList}>
                        {this.renderOptions()}
                    </ul>
                </div>
            </FormRow>
        )
    }
}
