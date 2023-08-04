import React, { SyntheticEvent } from 'react';
import { useFormContextField } from '../FormContext';
import Autocomplete, { AutocompleteProps } from './Autocomplete';

type FormAutocompleteProps<Option> = Omit<AutocompleteProps<Option>, 'onChange' | 'value'> & {
    onChange?: (inputName: string, userInput: Option | null) => void;
};

export function FormAutocomplete<Option>({ name, onChange, ...otherAutocompleteProps }: FormAutocompleteProps<Option>) {
    const formField = useFormContextField<Option | Option[] | null>(name, (value) => {
        formField.set(value);
    });

    let value = formField.get(null) || null;
    // Autocomplete is a controlled component, so we change the value to null if it is a string. This is because the
    // Autocomplete component expects a value of type Option | null
    if ((typeof value === 'string' && value === '') || value === undefined) {
        value = null;
    }

    if (otherAutocompleteProps.multiple) {
        value = value ? value : [];
    }

    const onChangeHandler = (_event: SyntheticEvent, value: Option) => {
        if (onChange) {
            onChange(name, value);
        }
        formField.set(value);
    };

    return <Autocomplete<Option> {...otherAutocompleteProps} name={name} onChange={onChangeHandler} value={value} />;
}
