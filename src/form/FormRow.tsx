import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    applyValidation,
    normaliseValidators,
    useValidation,
    ValidatorListUnresolved,
    Validators
} from '../validation/Validators';
import { FormContext, FormContextType } from './FormContext';

import './FormRow.less';
import { FormStateChangeEvent } from './FormContainer';
import { FormElementContainer } from './inputs/FormElementContainer';
import { useAsync } from 'react-use';

interface FormRowProps {
    name: string;
    value: any
    defaultValue?: any;
    label: string;
    help?: string;
    validation?: ValidatorListUnresolved;
    children: any;
    type?: string;
    focused: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    disableZoom?: boolean;
}

enum StatusType {
    WARNING = 'warning',
    ERROR = 'error',
    OK = 'ok',
}

export const FormRow = (props: FormRowProps) => {
    function getChildValue() {
        let value = props.value

        if (value === undefined) {
            return props.defaultValue;
        }

        return value;
    }

    function hasValue() {
        const value = getChildValue();
        if (value === undefined || value === null) {
            return false;
        }
        if (typeof value === 'string') {
            return value.length > 0;
        }
        return true;
    }

    function getDefaultValue() {
        return props.defaultValue ?? '';
    }

    function getChildName() {
        return props.name
    }

    const context = useContext(FormContext);

    const initialValue = useMemo(() => {
        return getChildValue();
    }, []);

    const [touchedState, setTouchedState] = useState(false);

    const validators = useMemo(() => normaliseValidators(props.validation), [props.validation]);

    const touched = useMemo(() => {
        if (touchedState) {
            return true;
        }
        if (getDefaultValue() !== getChildValue() && initialValue !== getChildValue()) {
            return true;
        }

        return touchedState;
    }, [touchedState, getDefaultValue(), getChildValue()]);

    const required = useMemo(() => {
        return validators.indexOf('required') > -1;
    }, [validators]);

    function setReadyState(ready: boolean) {
        context.onReadyStateChanged(getChildName(), ready);
    }

    function setTouched(touched: boolean) {
        setTouchedState(touched);
    }

    useEffect(() => {
        if (!context.container) {
            return;
        }

        const disposer = context.container.onFormStateChanged((evt: FormStateChangeEvent) => {
            switch (evt.type) {
                case 'submit':
                    if (evt.value) {
                        setTouched(false);
                    } else {
                        setTouched(true);
                    }
                    break;
                case 'reset':
                    setTouched(false);
                    break;
            }
        });

        return () => {
            disposer();
            setReadyState(true); //Tell the form to not worry about this
        };
    }, [context.container]);

    const errorList = useValidation(true, validators, getChildName(), getChildValue());

    useEffect(() => {
        if (errorList.loading) {
            setReadyState(false);
        } else {
            setReadyState(errorList.value?.length === 0);
        }
    }, [errorList.loading, errorList.value]);

    let errorMessage = null;
    if (!errorList.loading && touched && errorList.value?.length > 0) {
        errorMessage = errorList.value[0];
    }

    return (
        <FormElementContainer
            required={required}
            processing={errorList.loading}
            hasValue={hasValue()}
            touched={touched}
            help={props.help}
            errorMessage={errorMessage}
            label={props.label}
            type={props.type}
            focused={props.focused}
            disabled={props.disabled}
            readOnly={props.readOnly}
            disableZoom={props.disableZoom}
            status={errorMessage && errorMessage.length > 0 ? StatusType.ERROR : StatusType.OK}
            infoBox={''}
        >
            {props.children}
        </FormElementContainer>
    );
};
