/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DSLEditor } from './DSLEditor';
import { DSLFormEditorProps } from './types';
import { useFormContextField } from '../form/FormContext';
import { DATATYPE_CONFIGURATION, DSLResult } from '@kapeta/kaplang-core';

export interface DataTypeEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
    onCodeChange?: (code: string) => any;
    onError?: (err: any) => any;
    readOnly?: boolean;
    validTypes?: string[];
}

export const DataTypeEditor = (props: DataTypeEditorProps) => {
    return (
        <DSLEditor
            {...DATATYPE_CONFIGURATION}
            validTypes={props.validTypes}
            onError={props.onError}
            onCodeChange={props.onCodeChange}
            readOnly={props.readOnly}
            onChange={props.onChange}
            value={props.value}
        />
    );
};

export const DataTypeEditorField = (props: DSLFormEditorProps<DataTypeEditorProps>) => {
    const formField = useFormContextField<DSLResult>(props.name);
    return (
        <DSLEditor
            validTypes={props.validTypes}
            onChange={(value) => {
                formField.set(value);
                formField.valid();
            }}
            onCodeChange={props.onCodeChange}
            onError={(err) => {
                props.onError?.(err);
                formField.invalid();
            }}
            readOnly={props.readOnly}
            value={formField.get(props.defaultValue)}
        />
    );
};
