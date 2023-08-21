import React from 'react';
import { withFormFieldController } from '../formFieldController';
import { MenuItem, TextField } from '@mui/material';

interface Props {
    options: string[] | { [key: string]: string };
    multi?: boolean;
    enableDeselect?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormSelect = withFormFieldController<string | string[]>((props: Props, controller) => {
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
        } else if (options.length > 0) {
            value = options[0].value;
        }
    }

    return (
        <TextField
            sx={{
                display: 'block',
                mt: 1,
                mb: 1,
                '.MuiInputBase-root': {
                    minWidth: '100%',
                },
            }}
            onChange={onChange}
            variant={'standard'}
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
                displayEmpty: props.enableDeselect,
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
