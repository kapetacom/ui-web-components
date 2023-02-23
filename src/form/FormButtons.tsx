import React from 'react';
import { FormContext, FormContextType } from './FormContext';

import './FormButtons.less';
import { Button } from '../button/buttons';

interface FormButtonsProps {
    children: any;
}

export class FormButtons extends React.Component<FormButtonsProps, any> {
    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    isSubmitButton(child: any) {
        if (
            child.type === 'button' &&
            (child.props.type === 'submit' || child.props.type === undefined)
        ) {
            return true;
        }

        if (child.type === 'input' && child.props.type === 'submit') {
            return true;
        }

        if (child.type === Button && child.props.type === 'submit') {
            return true;
        }

        if (child.type === 'input' && child.props.type === 'image') {
            return true;
        }

        return false;
    }

    render() {
        let children = this.props.children;
        if (!Array.isArray(children)) {
            children = [children];
        }

        const newChildren = children.map((child: any, ix: number) => {
            if (!this.isSubmitButton(child)) {
                if (this.context.processing) {
                    //Disable all buttons when form is processing
                    return React.cloneElement(child, {
                        disabled: true,
                        key: ix,
                    });
                }

                return child;
            }

            if (this.context.valid && !this.context.processing) {
                return child;
            }

            //Disable submit buttons when form is invalid or processing
            return React.cloneElement(child, {
                disabled: true,
                text: this.context.processing
                    ? 'Submitting...'
                    : child.props.text,
                width: this.context.processing ? 120 : child.props.width,
                key: ix,
            });
        });

        return <div className="form-buttons">{newChildren}</div>;
    }
}
