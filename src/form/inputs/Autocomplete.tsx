import { default as MuiAutocomplete, AutocompleteProps as MuiAutocompleteProps } from '@mui/material/Autocomplete';
import { default as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

import React from 'react';

export type AutocompleteProps<Option> = Omit<MuiAutocompleteProps<Option, boolean, boolean, boolean>, 'renderInput'> &
    Pick<MuiTextFieldProps, 'name' | 'label' | 'placeholder'> & {
        hidePopupIndicator?: boolean;
    };

export function Autocomplete<Option>(props: AutocompleteProps<Option>) {
    const { name, label, placeholder, hidePopupIndicator, autoFocus, ...autocompleteProps } = props;
    return (
        <MuiAutocomplete
            {...autocompleteProps}
            renderInput={(renderInputParams) => (
                <MuiTextField
                    {...renderInputParams}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    variant="standard"
                    InputProps={{
                        ...renderInputParams.InputProps,
                        ...(hidePopupIndicator ? { endAdornment: null } : {}),
                    }}
                />
            )}
        />
    );
}
