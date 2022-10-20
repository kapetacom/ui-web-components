import React, {useContext, useEffect, useState} from "react";
import {FormSelect} from "./FormSelect";
import {FormInput, Type} from "./FormInput";
import {FormTextarea} from "./FormTextarea";
import {FormContext} from "../FormContext";
import {FormRadioGroup} from "./FormRadioGroup";
import {FormCheckbox} from "./FormCheckbox";

export enum FormFieldType {
    DATE = "date",
    EMAIL = "email",
    NUMBER = "number",
    PASSWORD = "password",
    STRING = "string",
    TEXT = "text",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    ENUM = "enum",
    ENUM_MULTI = "enum_multi"
}

interface SharedProps {
    name: string
    label: string
    validation?: any[]
    help?: string
    options?: string[] | { [key: string]: string }
    disabled?: boolean
}

interface InputProps extends SharedProps {
    value?:any
    onChange: (inputName: string, userInput: any) => void
}

interface Props extends SharedProps {
    type?: FormFieldType
}

export const FormField = (props: Props) => {

    const formContext = useContext(FormContext);
    const [fieldValue, setFieldValue] = useState(formContext.container.getValue(props.name));

    const propClone = {...props};
    delete propClone.type;
    const sharedProps:InputProps = {
        ...propClone,
        value: fieldValue,
        disabled: propClone.disabled || formContext.processing,
        onChange:(name, value) => {
            formContext.onValueChanged(name, value);
            setFieldValue(value);
        }
    };

    useEffect(() => {
        return formContext.onReset(props.name,(value) => {
            setFieldValue(value);
        })
    }, [])


    const type = props.type ? props.type : FormFieldType.STRING;

    switch (type) {
        case FormFieldType.ENUM:
        case FormFieldType.ENUM_MULTI:
            if (!props.options) {
                throw new Error('Missing attribute: options');
            }
            return <FormSelect multi={type === FormFieldType.ENUM_MULTI}
                               options={props.options}
                               {...sharedProps} />

        case FormFieldType.STRING:
            return <FormInput type={Type.TEXT} {...sharedProps} />
        case FormFieldType.TEXT:
            return <FormTextarea {...sharedProps} />
        case FormFieldType.DATE:
            return <FormInput type={Type.DATE} {...sharedProps} />
        case FormFieldType.NUMBER:
            return <FormInput type={Type.NUMBER} {...sharedProps} />
        case FormFieldType.EMAIL:
            return <FormInput type={Type.EMAIL} {...sharedProps} />
        case FormFieldType.PASSWORD:
            return <FormInput type={Type.PASSWORD} {...sharedProps} />
        case FormFieldType.CHECKBOX:
            return <FormCheckbox {...sharedProps} />
        case FormFieldType.RADIO:
            if (!props.options) {
                throw new Error('Missing attribute: options');
            }
            return <FormRadioGroup options={props.options} {...sharedProps} />
    }

    throw new Error('Invalid form field type: ' + type);
}