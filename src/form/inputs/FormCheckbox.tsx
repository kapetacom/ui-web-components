/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { useFormFieldController, withFormFieldController } from '../formFieldController';
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

interface Props {
    name: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    disabled?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormCheckbox = withFormFieldController((props: Props, controller) => {
    const onChange = (value: boolean) => {
        if (props.onChange) {
            props.onChange(props.name, value);
        }
    };

    let checked = props.value === true;

    return (
        <FormControl
            disabled={props.disabled}
            required={controller.required}
            autoFocus={controller.autoFocus}
            variant={controller.variant}
            error={controller.showError}
            sx={{
                display: 'block',
                my: 1,
                '.MuiFormHelperText-root': {
                    ml: 0,
                },
            }}
        >
            <FormControlLabel
                onChange={(evt, checked) => onChange(checked)}
                checked={checked}
                control={<Checkbox className={controller.className} />}
                label={props.label}
            />
            {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
        </FormControl>
    );
});
