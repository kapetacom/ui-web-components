import React, { useRef } from 'react';
import { toClass } from '@kapeta/ui-web-utils';
import { FormFieldControllerProps, useFormFieldController, withFormFieldController } from '../formFieldController';
import TextField from '@mui/material/TextField';
import { FormFieldProcessingContainer } from './FormFieldProcessingContainer';

export enum Type {
    DATE = 'date',
    EMAIL = 'email',
    NUMBER = 'number',
    PASSWORD = 'password',
    TEXT = 'text',
    CHECKBOX = 'checkbox',
}

const NON_TEXT_TYPES = [Type.DATE, Type.CHECKBOX];

interface Props {
    onChange?: (inputName: string, userInput: any) => void;
    type?: Type;
}
export const FormInput = withFormFieldController<string | number | boolean>((props: Props, controller) => {
    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (props.type === Type.CHECKBOX) {
            emitChange(evt.target.checked);
            return;
        }
        emitChange(evt.target.value);
    };

    function toValueType(value: any) {
        if (!value) {
            return value;
        }

        if (typeof value !== 'string') {
            return value;
        }

        switch (props.type) {
            case Type.NUMBER:
                return parseFloat(value);
            case Type.CHECKBOX:
                return value.toLowerCase() === 'true';
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
    let checked;

    if (props.type === Type.CHECKBOX) {
        checked = value === true;
    }

    return (
        <FormFieldProcessingContainer controller={controller}>
            <TextField
                sx={{
                    display: 'block',
                    mt: 1,
                    mb: 1,
                    '.MuiInputBase-root': {
                        width: '100%',
                    },
                }}
                autoFocus={controller.autoFocus}
                onChange={onChange}
                variant={'standard'}
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
                    defaultChecked: checked,
                }}
            />
        </FormFieldProcessingContainer>
    );
});
