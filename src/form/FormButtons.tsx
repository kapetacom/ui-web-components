import React from "react";
import {FormContext, FormContextType} from './FormContext';

import "./FormButtons.less";

interface FormButtonsProps {
    children: any
}

export class FormButtons extends React.Component<FormButtonsProps, any> {
    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    isSubmitButton(child:any) {
        if (child.type === 'button' &&
            (child.props.type === 'submit' ||
                child.props.type === undefined)) {
            return true;
        }

        if (child.type === 'input' &&
            child.props.type === 'submit') {
            return true;
        }

        if (child.type === 'input' &&
            child.props.type === 'image') {
            return true;
        }

        return false;
    }

    render() {
        let children = this.props.children;
        if (!Array.isArray(children)) {
            children = [children];
        }

        const newChildren = children.map((child:any, ix:number) => {
            if (!this.isSubmitButton(child) ||
                this.context.valid) {
                return child;
            }

            //Disable submit buttons when form is invalid
            return React.cloneElement(child, {
                disabled: true,
                key: ix
            });
        });

        return (
            <div className="form-buttons">
                {newChildren}
            </div>
        )
    }
}