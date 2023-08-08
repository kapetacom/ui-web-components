import React from 'react';
import { useFormContextField } from '../FormContext';
import { Autocomplete, AutocompleteProps } from './Autocomplete';

type FormAutocompleteProps<Option> = Omit<AutocompleteProps<Option>, 'value'>;
export function FormAutocomplete<Option>({ name, onChange, ...otherAutocompleteProps }: FormAutocompleteProps<Option>) {
    const formField = useFormContextField<Option | NonNullable<string | Option> | (string | Option)[] | null>(
        name,
        (value) => {
            formField.set(value);
        }
    );

    let value = formField.get(null) || null;

    // Autocomplete is a controlled component, so we change the value to null if it is an empty string. This is because
    // the Autocomplete component expects a value of type Option | null
    if ((typeof value === 'string' && value === '') || value === undefined) {
        value = null;
    }

    if (otherAutocompleteProps.multiple) {
        value = value ? value : [];
    }

    return (
        <Autocomplete<Option>
            {...otherAutocompleteProps}
            name={name}
            onChange={(event, value, reason, details) => {
                if (onChange) {
                    onChange(event, value, reason, details);
                }
                formField.set(value);
            }}
            value={value}
        />
    );
}
