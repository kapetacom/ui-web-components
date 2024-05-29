/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DSLEditor } from './DSLEditor';
import { DSLFormEditorProps } from "./types";
import { useFormContextField } from "../form/FormContext";
import { DSLResult, MODEL_CONFIGURATION } from '@kapeta/kaplang-core';


export interface ModelEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
    onCodeChange?: (code: string) => any;
    onError?: (err: any) => any;
    readOnly?: boolean;
    validTypes?: string[];
}


export const ModelEditor = (props: ModelEditorProps) => {
    return (
        <DSLEditor
            {...MODEL_CONFIGURATION}
            validTypes={[...(MODEL_CONFIGURATION.validTypes ?? []), ...(props.validTypes ?? [])]}
            onChange={props.onChange}
            onError={props.onError}
            onCodeChange={props.onCodeChange}
            readOnly={props.readOnly}
            value={props.value}
        />
    );
};

export const ModelEditorField = (props: DSLFormEditorProps<ModelEditorProps>) => {
    const formField = useFormContextField<DSLResult>(props.name);
    return (
        <ModelEditor
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
