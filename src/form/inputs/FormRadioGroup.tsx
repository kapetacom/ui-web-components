import React, { useEffect, useRef, useState } from 'react';
import './FormRadioGroup.less';
import { toClass } from '@kapeta/ui-web-utils';
import { FormRow } from '../FormRow';
import _ from 'lodash';

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
    const [inputFocused, setInputFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>();

    const inputOnBlur = () => {
        setInputFocused(false);
    };

    const inputOnFocus = () => {
        setInputFocused(true);
    };

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

    let className = toClass({
        'form-radiogroup': true,
    });

    const options = getOptions();
    const currentValue = getCurrentValue();

    return (
        <FormRow
            label={props.label}
            help={props.help}
            validation={props.validation}
            type={'radiogroup'}
            disableZoom={true}
            focused={inputFocused}
            disabled={props.disabled}
        >
            <div className={className} data-name={props.name} data-value={props.value}>
                {Object.entries(options).map(([value, label], ix) => {
                    return (
                        <label key={`radio_${ix}`}>
                            <input
                                type={'radio'}
                                name={props.name}
                                onChange={onChange}
                                onFocus={inputOnFocus}
                                onBlur={inputOnBlur}
                                value={value}
                                checked={value === currentValue}
                                disabled={props.disabled}
                                ref={inputRef}
                            />
                            <span className={'name'}>{label}</span>
                        </label>
                    );
                })}
            </div>
        </FormRow>
    );
};
