import React from 'react';
import { useFormFieldController } from '../formFieldController';
import TextField from '@mui/material/TextField';

interface Props {
    name: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormTextarea = (props: Props) => {
    const controller = useFormFieldController({
        name: props.name,
        value: props.value,
        help: props.help,
        validation: props.validation,
    });

    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = evt.target.value;
        if (props.onChange) {
            props.onChange(props.name, val);
        }
    };

    return (
        <TextField
            sx={{
                display: 'block',
                mt: 1,
                mb: 1,
            }}
            onChange={onChange}
            variant={'standard'}
            multiline={true}
            label={props.label}
            autoFocus={false}
            required={controller.required}
            helperText={controller.help}
            disabled={props.disabled}
            name={props.name}
            value={props.value}
            type={'text'}
            error={controller.showError}
            inputProps={{
                readOnly: props.readOnly,
            }}
        />
    );
};
