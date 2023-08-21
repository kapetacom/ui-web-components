import React from 'react';
import { useFormFieldController } from '../formFieldController';
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

export const FormCheckbox = (props: Props) => {
    const controller = useFormFieldController({
        name: props.name,
        value: props.value,
        help: props.help,
        validation: props.validation,
    });

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
            error={controller.showError}
            sx={{
                display: 'block',
                mb: 1,
                mt: 1,
                '.MuiFormHelperText-root': {
                    ml: 0,
                },
            }}
        >
            <FormControlLabel
                onChange={(evt, checked) => onChange(checked)}
                checked={checked}
                control={<Checkbox />}
                label={props.label}
            />
            {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
        </FormControl>
    );
};
