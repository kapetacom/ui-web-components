import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Autocomplete, { AutocompleteProps } from './Autocomplete';

type FormAutocompleteProps<FormValues extends FieldValues, AutocompleteOption> = Omit<
    AutocompleteProps<AutocompleteOption>,
    'name' | 'onChange' | 'value'
> & {
    control: Control<FormValues>;
    name: Path<FormValues>;
};

export default function FormAutocomplete<FormValues extends FieldValues, AutocompleteOption>({
    control,
    name,
    ...otherAutocompleteProps
}: FormAutocompleteProps<FormValues, AutocompleteOption>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, ...fieldProps } }) => (
                <Autocomplete<AutocompleteOption>
                    {...fieldProps}
                    {...otherAutocompleteProps}
                    onChange={(value) => {
                        onChange(value);
                    }}
                />
            )}
        />
    );
}
