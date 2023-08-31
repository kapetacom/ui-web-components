import React, { useRef, useState } from 'react';
import { withFormFieldController } from '../formFieldController';
import { FormFieldProcessingContainer } from './FormFieldProcessingContainer';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export enum Type {
    DATE = 'date',
    EMAIL = 'email',
    NUMBER = 'number',
    PASSWORD = 'password',
    TEXT = 'text',
}

const NON_TEXT_TYPES = [Type.DATE];

type PickedMuiTextFieldProps = Pick<TextFieldProps, 'variant' | 'onFocus' | 'onBlur' | 'autoFocus'>;

export interface FormInputProps extends PickedMuiTextFieldProps {
    onChange?: (inputName: string, userInput: any) => void;
    type?: Type;
}

export const FormInput = withFormFieldController<string | number | boolean>((props: FormInputProps, controller) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

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

    const inputRef = useRef<HTMLInputElement>(null);

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
                autoFocus={controller.autoFocus}
                onChange={onChange}
                onFocus={controller.onFocus || undefined}
                onBlur={controller.onBlur || undefined}
                variant={controller.variant || 'standard'}
                label={controller.label}
                helperText={controller.help}
                disabled={controller.disabled}
                name={controller.name}
                required={controller.required}
                error={controller.showError}
                value={value}
                type={props.type === Type.PASSWORD && showPassword ? 'text' : props.type}
                InputLabelProps={{
                    shrink: NON_TEXT_TYPES.includes(props.type) ? true : undefined,
                }}
                inputProps={{
                    readOnly: controller.readOnly,
                }}
                InputProps={
                    props.type === Type.PASSWORD
                        ? {
                              endAdornment: (
                                  <InputAdornment position="start">
                                      <IconButton
                                          edge="end"
                                          onClick={togglePasswordVisibility}
                                          aria-label="toggle password visibility"
                                          sx={{
                                              '&:focus': {
                                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                              },
                                          }}
                                      >
                                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                  </InputAdornment>
                              ),
                          }
                        : undefined
                }
            />
        </FormFieldProcessingContainer>
    );
});
