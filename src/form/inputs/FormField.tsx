import React from "react";
import {FormSelect} from "./FormSelect";
import {FormInput, Type} from "./FormInput";
import {FormTextarea} from "./FormTextarea";
import {FormRadioGroup} from "./FormRadioGroup";
import {FormCheckbox} from "./FormCheckbox";
import {FieldProps, FormFieldHandler} from "./FormFieldHandler";

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

interface SharedProps extends FieldProps {
    label?: string
    validation?: any[]
    help?: string
    options?: string[] | { [key: string]: string }
}


interface Props extends SharedProps {
    type?: FormFieldType
}

export const FormField = (props: Props) => {

    const propClone = {...props};
    delete propClone.type;
    const sharedProps:SharedProps = {
        ...propClone,
        disabled: propClone.disabled
    };


    const InnerElement = (fieldProps:FieldProps) => {

        const type = props.type ? props.type : FormFieldType.STRING;

        const innerProps:SharedProps = {
            ...sharedProps,
            ...fieldProps
        }

        switch (type) {
            case FormFieldType.ENUM:
            case FormFieldType.ENUM_MULTI:
                if (!props.options) {
                    throw new Error('Missing attribute: options');
                }
                return <FormSelect multi={type === FormFieldType.ENUM_MULTI}
                                   options={props.options}
                                   {...innerProps} />

            case FormFieldType.STRING:
                return <FormInput type={Type.TEXT} {...innerProps} />
            case FormFieldType.TEXT:
                return <FormTextarea {...innerProps} />
            case FormFieldType.DATE:
                return <FormInput type={Type.DATE} {...innerProps} />
            case FormFieldType.NUMBER:
                return <FormInput type={Type.NUMBER} {...innerProps} />
            case FormFieldType.EMAIL:
                return <FormInput type={Type.EMAIL} {...innerProps} />
            case FormFieldType.PASSWORD:
                return <FormInput type={Type.PASSWORD} {...innerProps} />
            case FormFieldType.CHECKBOX:
                return <FormCheckbox {...innerProps} />
            case FormFieldType.RADIO:
                if (!props.options) {
                    throw new Error('Missing attribute: options');
                }
                return <FormRadioGroup options={props.options} {...innerProps} />
        }

        throw new Error('Invalid form field type: ' + type);
    }

    return (
        <FormFieldHandler
            name={props.name}
            component={(props) => <InnerElement {...props} />}
        />
    )
}