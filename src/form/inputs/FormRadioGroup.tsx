import React, { useEffect, useRef, useState } from 'react';
import { useFormFieldController } from '../formFieldController';
import _ from 'lodash';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, Radio, RadioGroup } from '@mui/material';

interface Props {
    name: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    options: string[] | { [key: string]: string };
    disabled?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

export const FormRadioGroup = (props: Props) => {
    const controller = useFormFieldController({
        name: props.name,
        value: props.value,
        help: props.help,
        validation: props.validation,
    });

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        emitChange(evt.target.value);
    };

    function emitChange(value: any) {
        if (props.onChange) {
            props.onChange(props.name, value);
        }
    }

    useEffect(() => {
        const value = getCurrentValue();
        if (props.value !== value) {
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

        return props.value || Object.keys(options)[0];
    }

    const options = getOptions();
    const currentValue = getCurrentValue();

    const defaultValue = Object.keys(options)[0];

    return (
        <FormControl
            disabled={props.disabled}
            onChange={onChange}
            required={controller.required}
            error={controller.showError}
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
                {props.label}
            </InputLabel>
            <RadioGroup
                row={true}
                sx={{
                    pt: 2,
                }}
                defaultValue={defaultValue}
                value={currentValue}
                name={props.name}
            >
                {Object.entries(options).map(([value, label], ix) => {
                    return (
                        <FormControlLabel disabled={props.disabled} value={value} control={<Radio />} label={label} />
                    );
                })}
            </RadioGroup>
            {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
        </FormControl>
    );
};
