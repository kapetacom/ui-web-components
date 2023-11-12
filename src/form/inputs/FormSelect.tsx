/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { withFormFieldController } from '../formFieldController';
import { MenuItem, TextField } from '@mui/material';

interface FormSelectProps {
    options: string[] | { [key: string]: string };
    multi?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormSelect = withFormFieldController<string | string[]>((props: FormSelectProps, controller) => {
    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = evt.target.value;
        if (props.onChange) {
            props.onChange(controller.name, val);
        }
    };

    const options = Array.isArray(props.options)
        ? props.options.map((option) => {
              return { value: option, label: option };
          })
        : Object.entries(props.options).map(([value, label]) => {
              return { value, label };
          });

    let value = controller.value;
    if (!value) {
        if (props.multi) {
            value = [];
        }
    }

    return (
        <TextField
            sx={{
                my: 1,
            }}
            fullWidth={true}
            onChange={onChange}
            variant={controller.variant}
            className={controller.className}
            multiline={true}
            label={controller.label}
            autoFocus={controller.autoFocus}
            required={controller.required}
            helperText={controller.help}
            disabled={controller.disabled}
            name={controller.name}
            value={value}
            defaultValue={options.length > 0 ? options[0].value : undefined}
            select={true}
            type={'text'}
            error={controller.showError}
            inputProps={{
                readOnly: controller.readOnly,
            }}
            SelectProps={{
                multiple: props.multi,
                displayEmpty: true,
            }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
});
