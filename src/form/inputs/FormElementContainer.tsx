import React from "react";
import "./FormElementContainer.less";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";
import { InputBaseProps } from "./InputBasePropsInterface";


interface FormElementContainerProps extends InputBaseProps {
    inputFocused: boolean,
    required?: boolean,
    hasValue: boolean,
    errorMessages?: string,
    touched: boolean
}
@observer
export class FormElementContainer extends React.Component<FormElementContainerProps> {
    
    render() {

        const inputType = this.props.inputType || 'text';

        let classFormElemContainer = toClass({
            "form-element-container": true,
            "focused": this.props.inputFocused,
            "required": !!this.props.required && !this.props.hasValue && this.props.touched ,
            "warning-status": this.props.inputStatus === "warning",
            "error-status": this.props.inputStatus === "error",
            ["type-" + inputType]: true
        });

        let classNameLabel = toClass({
            "label": true,
            "zoom-out": this.props.hasValue || this.props.inputFocused,
        });

        let classNameMessage = toClass({
            "message": true,
        })

        return (
            <div className={classFormElemContainer} >
                <div className={"input-container"}>
                    <span className={classNameLabel} >{this.props.label}</span>

                    {this.props.children}
                </div>

                {this.props.required && this.props.errorMessages && this.props.touched && !this.props.hasValue ?
                    <span className={classNameMessage}><sup>*</sup>{ this.props.errorMessages }</span> : 
                    <span className={classNameMessage} >
                           {this.props.required?<sup>*</sup>:null} {this.props.message}</span>
                }

                {(this.props.inputStatus === "warning" || this.props.inputStatus === "error") &&
                    <span className="tooltip">
                        <div className="right">
                            <p>{this.props.statusMessage}</p>
                            <i></i>
                        </div>
                    </span>
                }
            </div>
        )
    }
}