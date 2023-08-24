import React from 'react';
import { withFormFieldController } from '../formFieldController';
import TextField from '@mui/material/TextField';
import { FormFieldProcessingContainer } from './FormFieldProcessingContainer';

export enum Type {
    DATE = 'date',
    EMAIL = 'email',
    NUMBER = 'number',
    PASSWORD = 'password',
    TEXT = 'text',
}

const NON_TEXT_TYPES = [Type.DATE];

interface FormInputProps {
    onChange?: (inputName: string, userInput: any) => void;
    type?: Type;
}

export const FormInput = withFormFieldController<string | number | boolean>((props: FormInputProps, controller) => {
    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        emitChange(evt.target.value);
    };

    function toValueType(value: any) {
        if (!value) {
            return value;
        }

        if (typeof value !== 'string') {
            return value;
        }

        if (props.type === Type.NUMBER) {
            return parseFloat(value);
        }

        return value;
    }

    function emitChange(value: any) {
        const typedValue = toValueType(value);
        if (props.onChange) {
            props.onChange(controller.name, typedValue);
        }
    }

    let value = controller.value;

    return (
        <FormFieldProcessingContainer controller={controller}>
            <TextField
                sx={{
                    display: 'block',
                    my: 1,
                    '.MuiInputBase-root': {
                        width: '100%',
                    },
                }}
                autoFocus={controller.autoFocus}
                onChange={onChange}
                variant={controller.variant}
                label={controller.label}
                helperText={controller.help}
                disabled={controller.disabled}
                name={controller.name}
                required={controller.required}
                error={controller.showError}
                value={value}
                type={props.type}
                InputLabelProps={{
                    shrink: NON_TEXT_TYPES.includes(props.type) ? true : undefined,
                }}
                inputProps={{
                    readOnly: controller.readOnly,
                }}
            />
        </FormFieldProcessingContainer>
    );
});
