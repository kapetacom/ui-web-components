import React, {ChangeEvent} from "react";
import "./DropdownInput.less";
import {action, makeObservable, observable} from "mobx";
import {toClass} from "@blockware/ui-web-utils";
import * as _ from "lodash";
import {observer} from "mobx-react";
import {FormRow} from "../FormRow";

interface DropdownInputProps {
    name: string,
    options: string[] | { [key: string]: string },
    label: string,
    value?: any,
    validation?: any[],
    help?: string,
    disabled?: boolean,
    multi?: boolean,
    onChange?: (inputName: string, userInput: any) => void
}

@observer
export class DropdownInput extends React.Component<DropdownInputProps> {


    @observable
    private inputFocus: boolean = false;

    @observable
    private userInputDisplay: string = '';

    @observable
    private inputSuggestion: string = '';

    @observable
    private inputElement = React.createRef<HTMLInputElement>();

    constructor(props:DropdownInputProps) {
        super(props);
        makeObservable(this);
    }

    private userSelection = (): string[] => {
        let keys = this.props.value;
        if (!Array.isArray(keys)) {
            keys = keys ? [keys] : [];
        }
        return [].concat(keys);
    };

    @action
    private onInputFocus = () => {
        this.inputFocus = true;
        this.userInputDisplay = '';
    };

    @action
    private onInputBlur = () => {
        // Select value if it is equal to suggestion
        if (this.userInputDisplay && this.inputSuggestion && this.inputSuggestion.toUpperCase() === this.userInputDisplay.toUpperCase()) {
            this.props.onChange(this.props.name, _.invert(this.optionListFiltered())[this.inputSuggestion]);
        }
        this.inputFocus = false;
        if (this.inputElement.current) {
            this.userInputDisplay = "";
            this.inputElement.current.blur();
        }
    };

    private renderKeysAsValues = (keys: string | string[]) => {
        const options = this.getOptions();
        if (!Array.isArray(keys)) {
            keys = keys ? [keys] : [];
        }
        return keys.map((key) => options[key]).join(', ');
    };

    @action
    private onInputToggle = () => {
        if (!this.props.disabled) {
            if (this.inputFocus) {
                this.onInputBlur();
            } else {
                this.onInputFocus();
            }
        }
    };

    @action
    private setInputSuggestion() {
        if (this.userInputDisplay && this.userInputDisplay.length > 0) {
            const filteredOptions = this.optionListFiltered();
            if (_.isObject(filteredOptions)) {
                this.inputSuggestion = Object.values(filteredOptions)[0];
            } else if (_.isString(filteredOptions)) {
                this.inputSuggestion = filteredOptions;
            }
        } else {
            this.inputSuggestion = "";
        }
    }

    @action
    private selectHandler(selection: string) {
        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }

        let tempUserSelection: string[] = this.userSelection();
        const isSelected: number = tempUserSelection.indexOf(selection);

        if (tempUserSelection.length > 0) {

            if (isSelected > -1) {
                tempUserSelection.splice(isSelected, 1);
                if (this.props.onChange) {
                    this.props.onChange(this.props.name, this.props.multi ? tempUserSelection : tempUserSelection[0]);
                }

                return;
            }
        }

        if (!this.props.multi && tempUserSelection.length > 0) {
            tempUserSelection = [];
        }

        tempUserSelection.push(selection);
        this.userInputDisplay = "";
        this.setInputSuggestion();

        if (this.props.onChange) {
            this.props.onChange(this.props.name, this.props.multi ? tempUserSelection : tempUserSelection[0]);
        }

        if (!this.props.multi) {
            this.onInputBlur();
        }
    };

    private optionListFiltered = () => {
        return _.pickBy(this.getOptions(), (value) => {
            return value.toUpperCase().startsWith(this.userInputDisplay.toUpperCase());
        });
    };

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
    };

    private renderOptions = () => {
        let filteredList = this.optionListFiltered();

        return _.map(filteredList, (value, key) => {

            return (
                <li key={key} className={`option ${(this.userSelection().indexOf(key) > -1 ? " selected" : "")}`}
                    onMouseDown={(evt: React.MouseEvent) => {
                        evt.nativeEvent.stopImmediatePropagation();
                        evt.preventDefault();

                        this.selectHandler(key)
                    }}>
                    {this.boldQuery(value, this.userInputDisplay)}

                    {
                        this.userSelection().indexOf(key) < 0 ? null :
                            <span className={"selected-icon"}>
                                    <svg width="14" height="10" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M5 9.61957L0 4.99477L1.4 3.69983L5 7.02968L12.6 0L14 1.29494L5 9.61957Z"
                                              fill="#686868"/>
                                    </svg>
                                </span>
                    }
                </li>
            );
        });
    };


    @action
    private setUserInputDisplay = (evt: ChangeEvent<HTMLInputElement>) => {
        this.userInputDisplay = evt.target.value;
        this.setInputSuggestion();
    };

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

        let inputValue = (this.userInputDisplay || this.inputFocus) ? this.userInputDisplay : this.renderKeysAsValues(this.props.value);

        return (
            <FormRow
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                focused={this.inputFocus}
            >
                <div className={"dropdown-input"} data-name={this.props.name} data-value={inputValue}>
                    {this.inputFocus && this.userInputDisplay.length > 0 &&
                    <span className={"user-suggestion"}>{this.inputSuggestion}</span>}

                    <input name={this.props.name}
                           type={"text"}
                           onChange={(event) => {
                               this.setUserInputDisplay(event)
                           }}
                           onFocus={this.onInputFocus}
                           onBlur={this.onInputBlur}
                           ref={this.inputElement}
                           value={inputValue}
                           autoComplete="off"
                           disabled={this.props.disabled}/>
                    <div className={classNameArrowIcon}>
                        <svg width="13" height="5" fill="none" onClick={this.onInputToggle}>
                            <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988"/>
                        </svg>
                    </div>
                    {this.props.value ? this.props.value.length > 0 && this.props.multi &&
                        <span className="selected-number">({this.props.value.length})</span> : null}
                    <ul id="datalist-input" className={classNameList}>
                        {this.renderOptions()}
                    </ul>
                </div>
            </FormRow>
        )
    }
}
