import React from "react";
import {Validators} from './FormValidators';
import {FormContext, FormContextType} from './FormContext';

import "./FormRow.less";
import {FormStateChangeEvent} from "./FormContainer";

interface FormRowProps {
    label: string
    help?: string
    validation?: any | any[]
    className?:string
    children:any,
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
        let value = this.getChildProperties().value;
        if (value === undefined) {
            return this.getDefaultValue();
        }

        return this.getChildProperties().value;
    }

    getDefaultValue() {
        return this.getChildProperties().defaultValue || '';
    }

    getChildName() {
        return this.getChildProperties().name;
    }

    getChildProperties() {
        if (!this.props.children) {
            throw new Error('Form row requires a input table element as a child to work');
        }

        if (!this.props.children.props.hasOwnProperty('value')) {
            throw new Error('Form row requires a single child with a value property to work properly');
        }

        if (!this.props.children.props.hasOwnProperty('name')) {
            throw new Error('Form row requires a single child with a name property to work properly');
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

        let labelTitle = '';
        let errorMessage = null;
        const classNames = ['form-row'];

        if (this.props.className) {
            classNames.push(this.props.className);
        }

        const errors = this.applyValidation();

        if (this.isTouched()) {

            classNames.push('touched');

            if (errors.length > 0) {
                classNames.push('error');
                errorMessage = errors[0];
                this.setReadyState(false);
            } else {
                this.setReadyState(true);
            }
        } else {
            this.setReadyState(errors.length === 0);
        }

        const required = this.isRequired();

        if (required) {
            classNames.push('required');
            labelTitle = 'Field is required';
        } else if (!this.readyState) {
            labelTitle = 'Field requires changes';
        }

        classNames.push(this.readyState ? 'ready' : 'unready');

        return (
            <div className={classNames.join(' ')} >
                <label>
                    <span className="row-label" title={labelTitle}>
                        {this.props.label + (required ? ' *' : '')}
                    </span>
                    {this.props.children}
                </label>

                {
                    this.props.help &&
                    !errorMessage &&
                    <div className="row-help">{this.props.help}</div>
                }

                {
                    errorMessage &&
                    <div className="row-error">{errorMessage}</div>
                }
            </div>
        )

    }
}