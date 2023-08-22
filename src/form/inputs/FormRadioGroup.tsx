import React, { useEffect, useRef, useState } from 'react';
import { useFormFieldController, withFormFieldController } from '../formFieldController';
import _ from 'lodash';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, Radio, RadioGroup } from '@mui/material';

interface Props {
    options: string[] | { [key: string]: string };
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormRadioGroup = withFormFieldController((props: Props, controller) => {
    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        emitChange(evt.target.value);
    };

    function emitChange(value: any) {
        if (props.onChange) {
            props.onChange(controller.name, value);
        }
    }

    useEffect(() => {
        const value = getCurrentValue();
        if (controller.value !== value) {
            emitChange(value);
        }
    }, []);

    function getOptions() {
        let options: { [key: string]: string } = {};

        if (Array.isArray(props.options)) {
            props.options.forEach((val) => {
                options[val] = val;
            });
        } else {
            options = props.options;
        }

        if (_.isEmpty(options)) {
            throw new Error('Received empty options for radio group');
        }

        return options;
    }

    function getCurrentValue() {
        let options = getOptions();

        return controller.value || Object.keys(options)[0];
    }

    const options = getOptions();
    const currentValue = getCurrentValue();

    const defaultValue = Object.keys(options)[0];

    return (
        <FormControl
            disabled={controller.disabled}
            onChange={onChange}
            required={controller.required}
            error={controller.showError}
            autoFocus={controller.autoFocus}
            defaultValue={defaultValue}
            variant={'standard'}
            sx={{
                display: 'block',
                mt: 1,
                mb: 1,
                '.MuiFormHelperText-root': {
                    ml: 0,
                },
            }}
        >
            <InputLabel shrink={true} required={controller.required}>
                {controller.label}
            </InputLabel>
            <RadioGroup
                row={true}
                sx={{
                    pt: 2,
                }}
                defaultValue={defaultValue}
                value={currentValue}
                name={controller.name}
            >
                {Object.entries(options).map(([value, label], ix) => {
                    return (
                        <FormControlLabel
                            key={ix}
                            disabled={controller.disabled}
                            value={value}
                            control={<Radio readOnly={controller.readOnly} />}
                            label={label}
                        />
                    );
                })}
            </RadioGroup>
            {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
        </FormControl>
    );
});
