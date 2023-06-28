import React, { useContext } from 'react';
import Autocomplete, { AutocompleteProps } from '../Autocomplete';
import { FormContext, useFormContextField } from '../FormContext';

type FormAutocompleteProps<AutocompleteOption> = Omit<AutocompleteProps<AutocompleteOption>, 'onChange' | 'value'> & {
    onChange?: (inputName: string, userInput: any) => void;
};

export default function FormAutocomplete<AutocompleteOption>({
    name,
    onChange,
    ...otherAutocompleteProps
}: FormAutocompleteProps<AutocompleteOption>) {
    const formContext = useContext(FormContext);
    const formField = useFormContextField<AutocompleteOption | null>(name, (value) => {
        formField.set(value);
    });

    let value = formField.get(null) || null;
    // Autocomplete is a controlled component, so we change the value to null if it is a string. This is because the
    // Autocomplete component expects a value of type AutocompleteOption | null
    if ((typeof value === 'string' && value === '') || value === undefined) {
        value = null;
    }

    const onChangeHandler = (value: any) => {
        if (onChange) {
            onChange(name, value);
        }
        formField.set(value);
    };

    return (
        <Autocomplete<AutocompleteOption>
            {...otherAutocompleteProps}
            name={name}
            onChange={onChangeHandler}
            value={value}
        />
    );
}
