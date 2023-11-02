/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useRef } from 'react';
import { withFormFieldController } from '../formFieldController';
import TextField from '@mui/material/TextField';
import { FormFieldProcessingContainer } from './FormFieldProcessingContainer';

interface Props {
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormTextarea = withFormFieldController((props: Props, controller) => {
    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = evt.target.value;
        if (props.onChange) {
            props.onChange(controller.name, val);
        }
    };

    const inputRef = useRef<HTMLTextAreaElement>();

    return (
        <FormFieldProcessingContainer controller={controller} inputElement={inputRef.current}>
            <TextField
                inputRef={inputRef}
                sx={{
                    display: 'block',
                    my: 1,
                    '.MuiInputBase-root': {
                        width: '100%',
                    },
                }}
                onChange={onChange}
                variant={controller.variant}
                multiline={true}
                label={controller.label}
                autoFocus={controller.autoFocus}
                required={controller.required}
                helperText={controller.help}
                disabled={controller.disabled}
                name={controller.name}
                value={controller.value}
                type={'text'}
                error={controller.showError}
                inputProps={{
                    readOnly: controller.readOnly,
                }}
            />
        </FormFieldProcessingContainer>
    );
});
