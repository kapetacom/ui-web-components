import React from "react";
import {Validators} from './FormValidators';
import {FormContext, FormContextType} from './FormContext';

import "./FormRow.less";
import {FormStateChangeEvent} from "./FormContainer";
import { FormElementContainer } from "./inputs/FormElementContainer";
import { InputStatusTypes, InputTypes } from "./inputs/InputBasePropsInterface";

interface FormRowProps {
    label: string
    help: string
    validation?: any | any[]
    className?:string
    children:any,
    inputFocused: boolean,
    hasValue: boolean,
    value?: string | string[],
    statusMessage?: string | undefined,
    inputStatus?: InputStatusTypes | undefined,
    inputType?: InputTypes | undefined,
    $onReadyStateChanged?: (fieldName:string, ready:boolean) => void //Internal callback
}

interface FormRowState {
    touched:boolean
}

export class FormRow extends React.Component<FormRowProps, FormRowState> {


    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    private readyState?:boolean;

    private disposer?:Function;
    private touched: boolean = false;

    constructor(props:FormRowProps) {
        super(props);

        this.state = {
            touched:false
        };
    }

    getValidators() {
        let validators = [];
        if (this.props.validation) {
            if (Array.isArray(this.props.validation)) {
                validators = this.props.validation;
            } else {
                validators = [this.props.validation];
            }
        }
        return validators;
    }
    setReadyState(ready:boolean) {
        if (this.readyState !== ready) {
            this.readyState = ready;
            this.context.onReadyStateChanged(this.getChildName(), ready);
        }
    }

    isTouched() {
        if (this.touched ||
            this.state.touched) {
            return true;
        }
        if (this.getDefaultValue() !== this.getChildValue()) {
            this.touched = true;
        }

        return this.touched;
    }

    getChildValue() {
        // At this moment I need to check for both this.props.children.props[data-value] and this.props.children.props.value.
        // In the old FormRow component the value was under input as <input value="">  . Now the value is under <div data-value="">

        let value = this.props.children.props.hasOwnProperty('data-value') ? this.getChildProperties()['data-value'] : this.getChildProperties().value;

        if (value === undefined) {          
            return this.getDefaultValue();
        }

        return this.props.children.props.hasOwnProperty('data-value') ? this.getChildProperties()['data-value'] : this.getChildProperties().value;
    }

    getDefaultValue() {
        return this.getChildProperties().defaultValue || '';
    }

    getChildName() {
        return this.props.children.props.hasOwnProperty('name') ? this.getChildProperties().name : this.getChildProperties()['data-name'];
    }

    getChildProperties() {
        if (!this.props.children) {
            throw new Error('Form row requires a input table element as a child to work');
        }

        if (!this.props.children.props.hasOwnProperty('data-value')) {
            if(!this.props.children.props.hasOwnProperty('value')){
                throw new Error('Form row requires a single child with a "data-value" or "value" property to work properly');
            }
        }

        if (!this.props.children.props.hasOwnProperty('data-name')) {
            if(!this.props.children.props.hasOwnProperty('name')){
                throw new Error('Form row requires a single child with a "name" or "data-name" property to work properly');
            }
        }

        return this.props.children.props;
    }

    isRequired() {
        return this.getValidators().indexOf('required') > -1;
    }

    applyValidation() {
        const childProps = this.getChildProperties();

        return this.getValidators().map((validator: any) => {
            if (typeof validator === 'string') {
                if (!Validators[validator]) {
                    throw new Error(`Unknown validator: ${validator}`);
                }

                validator = Validators[validator];
            }

            try {
                validator.call(Validators, this.props.label, childProps.value);
                return null;
            } catch (err) {
                if (typeof err === 'string') {
                    return err;
                }

                return err.message;
            }

        }).filter((error: string) => !!error);
    }

    private setTouched(touched:boolean) {
        this.setState({touched});
        this.touched = touched;
    }

    componentDidMount() {
        if (!this.context.container) {
            return;
        }

        this.disposer = this.context.container.onFormStateChanged(((evt:FormStateChangeEvent) => {
            switch (evt.type) {
                case 'submit':
                    if (evt.value) {
                        this.setTouched(false);
                    } else {
                        this.setTouched(true);
                    }
                    break;
                case 'reset':
                    this.setTouched(false);
                    break;
            }
        }));
    }

    componentWillUnmount() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }

        this.setReadyState(true); //Tell the form to not worry about this
    }

    render() {

        let errorMessage = null;


        const errors = this.applyValidation();

        if (this.isTouched()) {


            if (errors.length > 0) {
                errorMessage = errors[0];
                this.setReadyState(false);
            } else {
                this.setReadyState(true);
            }
        } else {
            this.setReadyState(errors.length === 0);
        }

        const required = this.isRequired();



        return (
            <FormElementContainer
                hasValue={this.props.hasValue}
                required={required}
                touched={this.isTouched()}
                inputFocused={this.props.inputFocused}
                label={this.props.label}
                message={this.props.help}
                errorMessages={errorMessage}
            >
                {this.props.children}
            </FormElementContainer>
        )

    }
}