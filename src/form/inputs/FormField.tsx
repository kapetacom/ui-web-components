import React from 'react';
import { FormSelect } from './FormSelect';
import { FormInput, FormInputProps, Type } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormRadioGroup } from './FormRadioGroup';
import { FormCheckbox } from './FormCheckbox';
import { FieldProps, FormFieldHandler } from './FormFieldHandler';

export enum FormFieldType {
    DATE = 'date',
    EMAIL = 'email',
    NUMBER = 'number',
    PASSWORD = 'password',
    STRING = 'string',
    TEXT = 'text',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    ENUM = 'enum',
    ENUM_MULTI = 'enum_multi',
}

interface SharedFormFieldProps {
    label?: string;
    validation?: any[];
    help?: string;
    options?: string[] | { [key: string]: string };
    disabled?: boolean;
    readOnly?: boolean;
    variant?: FormInputProps['variant'];
    onFocus?: FormInputProps['onFocus'];
    onBlur?: FormInputProps['onBlur'];
}

export interface FormFieldProps extends SharedFormFieldProps {
    name: string;
    type?: FormFieldType;
}

interface InnerElementProps extends SharedFormFieldProps, FieldProps {
    type?: FormFieldType;
}

const InnerElement = ({
    type: formFieldType = FormFieldType.STRING,
    variant = 'standard',
    ...props
}: InnerElementProps) => {
    switch (formFieldType) {
        case FormFieldType.ENUM:
        case FormFieldType.ENUM_MULTI:
            if (!props.options) {
                throw new Error('Missing attribute: options');
            }
            return (
                <FormSelect
                    multi={formFieldType === FormFieldType.ENUM_MULTI}
                    options={props.options}
                    {...props}
                    variant={variant}
                />
            );

        case FormFieldType.STRING:
            return <FormInput type={Type.TEXT} {...props} variant={variant} />;
        case FormFieldType.TEXT:
            return <FormTextarea {...props} variant={variant} />;
        case FormFieldType.DATE:
            return <FormInput type={Type.DATE} {...props} variant={variant} />;
        case FormFieldType.NUMBER:
            return <FormInput type={Type.NUMBER} {...props} variant={variant} />;
        case FormFieldType.EMAIL:
            return <FormInput type={Type.EMAIL} {...props} variant={variant} />;
        case FormFieldType.PASSWORD:
            return <FormInput type={Type.PASSWORD} {...props} variant={variant} />;
        case FormFieldType.CHECKBOX:
            return <FormCheckbox {...props} />;
        case FormFieldType.RADIO: {
            if (!props.options) {
                throw new Error('Missing attribute: options');
            }
            return <FormRadioGroup options={props.options} {...props} />;
        }
        default: {
            formFieldType satisfies never;
            throw new Error('Invalid form field type: ' + formFieldType);
        }
    }
};

export const FormField = (props: FormFieldProps) => {
    const parentProps = props;

    return (
        <FormFieldHandler
            name={props.name}
            key={`$FormField${props.name}Handler`}
            component={(props) => <InnerElement {...props} {...parentProps} key={`$FormField${props.name}Inner`} />}
        />
    );
};
