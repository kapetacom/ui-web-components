/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DSLEditor } from './DSLEditor';
import { DSLFormEditorProps } from './types';
import { useFormContextField } from '../form/FormContext';
import { DSLResult, METHOD_CONFIGURATION, restPathVariableValidator } from '@kapeta/kaplang-core';
import { noFileTypeFilter } from './validators';

export interface MethodEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
    onCodeChange?: (code: string) => any;
    onError?: (err: any) => any;
    readOnly?: boolean;
    restMethods?: boolean;
    validTypes?: string[];
}

export const MethodEditor = (props: MethodEditorProps) => {
    return (
        <DSLEditor
            {...METHOD_CONFIGURATION}
            rest={props.restMethods}
            validTypes={props.validTypes}
            onChange={props.onChange}
            onCodeChange={props.onCodeChange}
            onError={props.onError}
            readOnly={props.readOnly}
            typeFilter={noFileTypeFilter}
            validator={props.restMethods ? restPathVariableValidator : undefined}
            value={props.value}
        />
    );
};

export const MethodEditorField = (props: DSLFormEditorProps<MethodEditorProps>) => {
    const formField = useFormContextField<DSLResult>(props.name);
    return (
        <MethodEditor
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
