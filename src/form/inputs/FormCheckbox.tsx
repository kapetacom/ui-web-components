import React from 'react';
import { toClass } from '@kapeta/ui-web-utils';
import { FormRow } from '../FormRow';
import { Checkbox } from '../Checkbox';

import './FormCheckbox.less';

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
    const onChange = (value: boolean) => {
        if (props.onChange) {
            props.onChange(props.name, value);
        }
    };

    let className = toClass({
        'form-checkbox': true,
    });

    let checked = props.value === true;

    return (
        <FormRow
            help={props.help}
            label={''}
            validation={props.validation}
            type={'checkbox'}
            disableZoom={true}
            focused={false}
            disabled={props.disabled}
        >
            <div className={className} data-name={props.name} data-value={props.value}>
                <label>
                    <Checkbox value={checked} onChange={onChange} disabled={props.disabled} />

                    <span className={'name'}>{props.label}</span>
                </label>
            </div>
        </FormRow>
    );
};
