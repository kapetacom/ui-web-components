import React, { useContext, useEffect, useMemo, useState } from 'react';
import { normaliseValidators, useValidation, ValidatorListUnresolved } from '../validation/Validators';
import { FormContext } from './FormContext';

import { FormStateChangeEvent } from './FormContainer';
import { AsyncState } from 'react-use/lib/useAsync';
import { FormInputProps } from './inputs/FormInput';

export enum StatusType {
    ERROR = 'error',
    OK = 'ok',
}
export interface FormFieldControllerProps<V = any> {
    name: string;
    value?: V;
    defaultValue?: V;
    help?: string;
    validation?: ValidatorListUnresolved;
    label?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: FormInputProps['autoFocus'];
    variant?: FormInputProps['variant'];
    onFocus?: FormInputProps['onFocus'];
    onBlur?: FormInputProps['onBlur'];
}

export interface FormFieldController<V = any> {
    name: string;
    value?: V;
    filled: boolean;
    touched: boolean;
    required: boolean;
    errors: AsyncState<string[]>;
    processing: boolean;
    showError: boolean;
    status: StatusType;
    help?: string;
    label?: string;
    disabled: boolean;
    readOnly: boolean;
    autoFocus?: FormInputProps['autoFocus'];
    variant?: FormInputProps['variant'];
    onFocus?: FormInputProps['onFocus'];
    onBlur?: FormInputProps['onBlur'];
}

export const useFormFieldController = <T = any,>(props: FormFieldControllerProps<T>): FormFieldController<T> => {
    const context = useContext(FormContext);
    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const childValue = useMemo(() => {
        let value = props.value;

        if (value === undefined) {
            return props.defaultValue;
        }

        return value;
    }, [props.value, props.defaultValue]);

    const filled = useMemo(() => {
        const value = childValue;
        if (value === undefined || value === null) {
            return false;
        }
        if (typeof value === 'string') {
            return value.length > 0;
        }
        return true;
    }, [childValue]);

    const defaultValue = useMemo(() => {
        return props.defaultValue ?? '';
    }, [props.defaultValue]);

    const initialValue = useMemo(() => {
        return childValue;
    }, []);

    const validators = useMemo(() => {
        const validators = [];
        if (props.validation) {
            validators.push(...normaliseValidators(props.validation));
        }

        if (context.validators) {
            validators.push(...context.validators);
        }
        return validators;
    }, [props.validation, context.validators]);

    const touched = useMemo(() => {
        if (formSubmitAttempted) {
            return true;
        }
        if (defaultValue !== childValue && initialValue !== childValue) {
            return true;
        }

        return formSubmitAttempted;
    }, [formSubmitAttempted, defaultValue, childValue]);

    const required = useMemo(() => {
        return validators.indexOf('required') > -1;
    }, [validators]);

    function setReadyState(ready: boolean) {
        context.onReadyStateChanged(props.name, ready);
    }

    useEffect(() => {
        if (!context.container) {
            return;
        }

        const disposer = context.container.onFormStateChanged((evt: FormStateChangeEvent) => {
            switch (evt.type) {
                case 'submit':
                    if (evt.value) {
                        setFormSubmitAttempted(false);
                    } else {
                        setFormSubmitAttempted(true);
                    }
                    break;
                case 'reset':
                    setFormSubmitAttempted(false);
                    break;
            }
        });

        return () => {
            disposer();
            setReadyState(true); //Tell the form to not worry about this
        };
    }, [context.container]);

    const { errors, hasAsync } = useValidation(true, validators, props.name, childValue);

    useEffect(() => {
        if (!hasAsync) {
            //If nothing's async then we can just set the ready state when loading is done.
            if (!errors.loading && errors.value) {
                setReadyState(errors.value?.length === 0);
                if (touched && errors.value?.length > 0) {
                    setErrorMessage(errors.value[0]);
                } else {
                    setErrorMessage('');
                }
            }
            return;
        }

        if (errors.loading) {
            setReadyState(false);
        } else {
            setReadyState(errors.value?.length === 0);
            if (touched && errors.value?.length > 0) {
                setErrorMessage(errors.value[0]);
            } else {
                setErrorMessage('');
            }
        }
    }, [errors.loading, errors.value, touched, hasAsync]);

    let help = errorMessage && touched ? errorMessage : props.help;

    return {
        filled,
        touched,
        required,
        errors,
        processing: errors.loading,
        showError: formSubmitAttempted && errors.value?.length > 0,
        help,
        status: errorMessage && errorMessage.length > 0 ? StatusType.ERROR : StatusType.OK,
        label: props.label,
        disabled: !!props.disabled,
        readOnly: !!props.readOnly,
        name: props.name,
        value: childValue,
        autoFocus: props.autoFocus,
        variant: props.variant,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
    };
};

export const withFormFieldController = <V = any, P = any>(
    component: (props: P, controller: FormFieldController<V>) => React.JSX.Element
) => {
    return (props: P & FormFieldControllerProps<V>) => {
        const controller = useFormFieldController(props);
        return component(props, controller);
    };
};
