import React, { ChangeEvent, MouseEventHandler } from "react";
import "./dropdownInput.less";
import { observable, action } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";

interface DropdownInputProps {
    label: string,
    optionList: string[],
    required: boolean,
    multiSelection: boolean
}

@observer
export class DropdownInput extends React.Component<DropdownInputProps> {


    @observable
    inputFocus: boolean = false;

    @observable
    labelZoomOut: boolean = false;

    iconClass: string = 'arrow-icon';

    @observable
    userInput: string = '';

    @observable
    userSelection: string[] = [];
    inputElement = React.createRef<HTMLInputElement>();

    @observable
    filter: string = this.userInput.toUpperCase();
    optionList: string[] = this.props.optionList;

    @action
    private toggleInputFocus = () => {
        console.log("toggling");

        this.inputFocus = !this.inputFocus;
        this.iconClass = this.inputFocus ? 'arrow-icon focus-icon' : 'arrow-icon';
        console.log("toggleInputFocus", this.inputFocus);
    };


    @action
    private setUserSelection(tempList: string[]) {
        this.userSelection = _.cloneDeep(tempList)
    }

    @action
    private selectHandler(selection: string) {

        if (this.inputElement.current) {
            this.inputElement.current.focus();
        }

        let tempUserSelection: string[] = [];
        tempUserSelection = this.userSelection;
        const isSelected: number = tempUserSelection.indexOf(selection);

        if (tempUserSelection.length > 0) {
            console.log("bigger than 0");

            if (isSelected > -1) {
                console.log("preselected");
                tempUserSelection.splice(isSelected, 1);
                this.setUserSelection(tempUserSelection);
                console.log(this.userSelection);
                console.log("removed something");
                return;
            }
        }
        tempUserSelection.push(selection);
        this.userInput="";
        this.setUserSelection(tempUserSelection);
        console.log("added something", tempUserSelection);
        console.log(this.userSelection);
    };

    @action
    private placeholder = () => {
        if (this.userSelection.length > 0) {
            this.labelZoomOut = true;
            return this.userSelection.join(', ');
        } else {
            this.labelZoomOut= false;
            return '';
        }
    }

    
    options = () => this.optionList.filter((item)=>{
        return item.toUpperCase().indexOf(this.userInput.toUpperCase())>-1
    })
    .map((option: string) => {
        let row = (
            <div key={option}>
                <li className={`option ${(this.userSelection.indexOf(option) > -1 ? " selected" : "")}`}
                    onMouseDown={(evt: React.MouseEvent) => {
                        evt.nativeEvent.stopImmediatePropagation();
                        evt.preventDefault();
                        this.selectHandler(option)
                    }}>
                    {option}

                    {this.userSelection.indexOf(option) < 0 ? null :
                        <span className={"selected-icon"} >
                            <svg width="14" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5 9.61957L0 4.99477L1.4 3.69983L5 7.02968L12.6 0L14 1.29494L5 9.61957Z" fill="#686868" />
                            </svg>
                        </span>
                    }
                </li>

            </div>);
            return row;
    });

    @action
    private setUserInput = (evt: ChangeEvent<HTMLInputElement>) => {
        
        if(!this.labelZoomOut) {
            this.labelZoomOut=true;
        }

        let val = evt.target.value;
        
        this.userInput = val;
    }
    render() {

        let classNames = toClass({
            "list": true,
            "show-list": this.inputFocus
        })

        let classNameInput = toClass({
            "input": true,
            "focused": this.inputFocus
        })

        let classNameLabel = toClass({
            "label":true,
            "zoom-out": this.labelZoomOut || this.userInput.length>0 ,
            "focus zoom-out": this.inputFocus
        })

        return (
            <div className="dropdown" >
                <label className={ classNameLabel } htmlFor="dropdown">{this.props.label}</label>
                <input id="dropdown"
                    onChange={(event) => { this.setUserInput(event) }} onClick={this.toggleInputFocus} onBlur={()=>{
                        this.toggleInputFocus();
                    }}
                    ref={this.inputElement} className={classNameInput} list="datalist-input" 
                    placeholder={this.placeholder()}
                    value={this.userInput}
                    required={this.props.required} autoComplete="off"></input>
                <div className={this.iconClass}>
                    <svg width="13" height="5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
                    </svg>
                </div>
                <ul id="datalist-input" className={classNames}>
                    {this.options()}
                </ul>
            </div>
        )
    }

}
