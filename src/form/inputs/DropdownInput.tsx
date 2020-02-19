import React, { ChangeEvent } from "react";
import "./DropdownInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";
import { FormElementContainer } from "../inputs/FormElementContainer";

export interface DropdownInputProps {
    inputId: string,
    label: string,
    required: boolean,
    message: string,
    statusMessage?: string,
    inputStatus?: string,
    optionList: string[],
    multiSelection: boolean,
    inputCallback: (userSelection: string[]) => void
}

@observer
export class DropdownInput extends React.Component<DropdownInputProps> {


    @observable
    inputFocus: boolean = false;

    @observable
    inputSuggestion: string = '';

    @observable
    labelZoomOut: boolean = false;

    iconClass: string = 'arrow-icon';
    required: string = this.props.required ? 'required' : '';

    @observable
    userInput: string = "";

    @observable
    userSelection: string[] = [];

    @observable
    inputElement = React.createRef<HTMLInputElement>();

    optionList: string[] = this.props.optionList;

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
        }
    };

    @action
    private onInputToggle = () => {
        this.inputFocus = !this.inputFocus;
    }

    @action
    private setUserSelection(tempList: string[]) {
        this.userSelection = _.cloneDeep(tempList)
    }

    @action
    private setInputSuggestion() {
        if (this.userInput && this.userInput.length > 0) {
            let temp: string[] = this.optionListFiltered();
            this.inputSuggestion = temp[0];
        } else {
            this.inputSuggestion = "";
        }
    }

    @action
    private selectHandler(selection: string) {
        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }

        let tempUserSelection: string[] = this.userSelection;
        const isSelected: number = tempUserSelection.indexOf(selection);

        if (tempUserSelection.length > 0) {

            if (isSelected > -1) {
                tempUserSelection.splice(isSelected, 1);
                this.setUserSelection(tempUserSelection);
                this.props.inputCallback(this.userSelection);
                return;
            }
        }

        if (!this.props.multiSelection && tempUserSelection.length > 0) {
            tempUserSelection = [];
        }

        tempUserSelection.push(selection);
        this.userInput = "";
        this.setInputSuggestion();
        this.setUserSelection(tempUserSelection);
        this.props.inputCallback(this.userSelection);
    };

    private optionListFiltered = () => {
        return this.optionList.filter((item) => {
            return item.toUpperCase().startsWith(this.userInput.toUpperCase())
        })
    }

    options = () => {
        let filteredList = this.optionListFiltered();
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
                                <svg width="14" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 9.61957L0 4.99477L1.4 3.69983L5 7.02968L12.6 0L14 1.29494L5 9.61957Z" fill="#686868" />
                                </svg>
                            </span>
                    }
                </li>
            );
            return row;
        });
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

        let classNameInput = toClass({
            "input": true,
            "focused": !!this.inputFocus,
            "required": !!this.required && !this.userSelection.length && !this.inputFocus,
            "warning-status": this.props.inputStatus === "warning",
            "error-status": this.props.inputStatus === "error"
        })

        let classNameArrowIcon = toClass({
            "arrow-icon": true,
            "focus-icon": !!this.inputFocus
        });

        return (
            <FormElementContainer
                inputId={this.props.inputId}
                label={this.props.label}
                required={this.props.required}
                inputFocused={this.inputFocus}
                message={this.props.message}
                statusMessage={this.props.statusMessage}
                inputStatus={this.props.inputStatus}
                hasValue={this.userInput.length > 0}
                inputMode= {"dropdown"}
            >
                { this.inputFocus && this.userInput.length > 0 && <span className={"user-suggestion"}>{this.inputSuggestion}</span>}

                <input id={this.props.inputId}
                    type={"text"}
                    onChange={(event) => { this.setUserInput(event) }}
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                    ref={this.inputElement}
                    className={classNameInput} list="datalist-input"
                    value={this.userInput}
                    autoComplete="off"></input>
                <div className={classNameArrowIcon}>
                    <svg width="13" height="5" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={this.onInputToggle}>
                        <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
                    </svg>
                </div>
                {this.userSelection.length > 0 && !this.props.inputStatus && <span className="selected-number">({this.userSelection.length})</span> }
                <ul id="datalist-input" className={classNameList}>
                    {this.options()}
                </ul>
            </FormElementContainer>
        )
    }

}