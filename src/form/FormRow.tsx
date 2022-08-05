import React from "react";
import {Validators} from './FormValidators';
import {FormContext, FormContextType} from './FormContext';

import "./FormRow.less";
import {FormStateChangeEvent} from "./FormContainer";
import { FormElementContainer } from "./inputs/FormElementContainer";

interface FormRowProps {
    label: string
    help?: string
    validation?: any | any[],
    children:any,
    type?: string,
    focused: boolean,
    disableZoom?: boolean
    $onReadyStateChanged?: (fieldName:string, ready:boolean) => void //Internal callback
}

enum StatusType {
    WARNING = "warning",
    ERROR = "error",
    OK = "ok"
}
interface FormRowState {
    touched:boolean
    forceError?:string
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

        let value = this.getChildProperties()['data-value'];

        if (value === undefined) {          
            return this.getDefaultValue();
        }

        return value;
    }

    hasValue() {
        const value = this.getChildValue();
        if (value === undefined || value === null) {
            return false;
        }
        if (typeof value === 'string') {
             return value.length > 0;
        }        
        return true;
    }

    getDefaultValue() {
        return this.getChildProperties().defaultValue || '';
    }

    getChildName() {
        return this.getChildProperties()['data-name'];
    }

    getChildProperties() {
        if (!this.props.children) {
            throw new Error('Form row requires a input table element as a child to work');
        }

        if (!this.props.children.props.hasOwnProperty('data-value')) {
            throw new Error('Form row requires a single child with a "data-value" property to work properly');            
        }

        if (!this.props.children.props.hasOwnProperty('data-name')) {
            throw new Error('Form row requires a single child with a "data-name" property to work properly');
            }

        return this.props.children.props;
    }

    isRequired() {
        return this.getValidators().indexOf('required') > -1;
    }

    applyValidation() {
        const childProps = this.getChildProperties();

        if (this.state.forceError) {
            return [this.state.forceError]
        }

        return this.getValidators().map((validator: any) => {
            if (typeof validator === 'string') {
                if (!Validators[validator]) {
                    throw new Error(`Unknown validator: ${validator}`);
                }

                validator = Validators[validator];
            }

            try {
                validator.call(Validators, this.props.label, childProps['data-value']);
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

    public setError(errorMessage?:string) {
        this.setState({forceError: errorMessage, touched: this.state.touched});
    }

    componentWillUnmount() {
        if (this.disposer) {
            this.disposer();
            this.disposer = undefined;
        }

        this.setReadyState(true); //Tell the form to not worry about this
    }

    componentDidUpdate() {

    }

    private updateReadyState() {

        const errors = this.applyValidation();

        if (this.isTouched()) {

            if (errors.length > 0) {
                this.setReadyState(false);
            } else {
                this.setReadyState(true);
            }
        } else {
            this.setReadyState(errors.length === 0);
        }
    }

    render() {

        let errorMessage = null;

        if (this.isTouched()) {
            const errors = this.applyValidation();
            if (errors.length > 0) {
                errorMessage = errors[0];
            }
        }

        const required = this.isRequired();

        return (
            <FormElementContainer
                required={required}
                hasValue={this.hasValue()}
                touched={this.isTouched()}
                help={this.props.help}
                errorMessage={errorMessage}
                label={this.props.label}
                type={this.props.type}
                focused={this.props.focused}
                disableZoom={this.props.disableZoom}
                status={ errorMessage && errorMessage.length > 0 ? StatusType.ERROR: StatusType.OK}
                infoBox={''}                
            >
                {this.props.children}
            </FormElementContainer>
        )

    }
}