import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from '../FormContext';

export interface FieldProps {
    name: string;
    value?: any;
    onChange: (name: string, value: any) => void;
    disabled?: boolean;
}

interface Props {
    name: string;
    component: (props: FieldProps) => JSX.Element;
}

export const FormFieldHandler = (props: Props) => {
    const formContext = useContext(FormContext);
    const [fieldValue, setFieldValue] = useState(
        formContext.container.getValue(props.name)
    );

    const fieldProps: FieldProps = {
        name: props.name,
        value: fieldValue,
        onChange: (name, value) => {
            formContext.onValueChanged(name, value);
            setFieldValue(value);
        },
    };

    if (formContext.processing) {
        fieldProps.disabled = true;
    }

    useEffect(() => {
        return formContext.onReset(props.name, (value) => {
            setFieldValue(value);
        });
    }, []);

    return props.component(fieldProps);
};
