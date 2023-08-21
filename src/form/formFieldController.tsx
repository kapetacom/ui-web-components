import React, { useContext, useEffect, useMemo, useState } from 'react';
import { normaliseValidators, useValidation, ValidatorListUnresolved } from '../validation/Validators';
import { FormContext } from './FormContext';

import { FormStateChangeEvent } from './FormContainer';
import { AsyncState } from 'react-use/lib/useAsync';

export enum StatusType {
    ERROR = 'error',
    OK = 'ok',
}
export interface FormFieldControllerProps<V = any> {
    name: string;
    value: V;
    defaultValue?: V;
    help?: string;
    validation?: ValidatorListUnresolved;
    label?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

export interface FormFieldController<V = any> {
    name: string;
    value: V;
    filled: boolean;
    touched: boolean;
    required: boolean;
    errors: AsyncState<string[]>;
    showError: boolean;
    status: StatusType;
    help?: string;
    label?: string;
    disabled: boolean;
    readOnly: boolean;
}

export const useFormFieldController = <T = any,>(props: FormFieldControllerProps<T>): FormFieldController<T> => {
    const context = useContext(FormContext);
    const [touchedState, setTouchedState] = useState(false);
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
    }, [childValue]);

    const validators = useMemo(
        () => normaliseValidators(props.validation).concat(context.validators),
        [props.validation, context.validators]
    );

    const touched = useMemo(() => {
        if (touchedState) {
            return true;
        }
        if (defaultValue !== childValue && initialValue !== childValue) {
            return true;
        }

        return touchedState;
    }, [touchedState, defaultValue, childValue]);

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
                        setTouchedState(false);
                    } else {
                        setTouchedState(true);
                    }
                    break;
                case 'reset':
                    setTouchedState(false);
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
    if (!help && required) {
        help = 'This value is required';
    }

    return {
        filled,
        touched,
        required,
        errors,
        showError: touched && errors.value?.length > 0,
        help,
        status: errorMessage && errorMessage.length > 0 ? StatusType.ERROR : StatusType.OK,
        label: props.label,
        disabled: !!props.disabled,
        readOnly: !!props.readOnly,
        name: props.name,
        value: childValue,
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
