import React from "react";
import "./FormElementContainer.less";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";


interface FormElementContainerProps {
    required?: boolean,
    hasValue: boolean,
    touched: boolean,
    help?: string,
    errorMessage: string,
    label?: string,
    type?: string,
    focused: boolean,
    status?: string,
    infoBox?: string
}

@observer
export class FormElementContainer extends React.Component<FormElementContainerProps> {
    
    render() {

        const inputType = this.props.type || 'text';

        let classFormElemContainer = toClass({
            "form-element-container": true,
            "focused": this.props.focused,
            "required": !!this.props.required && !this.props.hasValue && this.props.touched ,
            "warning-status": this.props.status === "warning",
            "error-status": this.props.status === "error",
            ["type-" + inputType]: true
        });

        let classNameLabel = toClass({
            "label": true,
            "zoom-out": this.props.hasValue || this.props.focused,
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

                {this.props.required && this.props.errorMessage && this.props.touched && !this.props.hasValue ?
                    <span className={classNameMessage}><sup>*</sup>{ this.props.errorMessage }</span> : 
                    <span className={classNameMessage} >
                           {this.props.required?<sup>*</sup>:null} {this.props.help}</span>
                }

                {(this.props.status === "warning" || this.props.status === "error") &&
                    <span className="tooltip">
                        <div className="right">
                            <p>{this.props.infoBox}</p>
                            <i></i>
                        </div>
                    </span>
                }
            </div>
        )
    }
}