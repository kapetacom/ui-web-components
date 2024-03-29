/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DSLEditor } from './DSLEditor';
import {
    DSLDataTypeProperty,
    DSLResult,
    PEGValidationEntity,
    CONFIG_CONFIGURATION,
    DSLTypeHelper,
} from '@kapeta/kaplang-core';

import { useFormContextField } from '../form/FormContext';
import { DataTypeEditorProps } from './DataTypeEditor';
import { DSLFormEditorProps } from './types';

export interface ConfigurationEditorProps {
    value?: DSLResult | string;
    readOnly?: boolean;
    onChange?: (structure: DSLResult) => any;
    onCodeChange?: (code: string) => any;
    onError?: (err: any) => any;
    validTypes?: string[];
}

function fieldValidator(entity: PEGValidationEntity<DSLDataTypeProperty>) {
    if (entity.type !== 'field') {
        return;
    }

    const property = entity.data;

    if (property.defaultValue) {
        if (property.defaultValue.type === 'literal') {
            if (typeof property.type !== 'string' || property.type === 'object') {
                throw new Error(`Default value not supported for complex types`);
            }

            if (property.type === 'string' && typeof property.defaultValue.value !== 'string') {
                throw new Error(`Default value for field ${property.name} must be a string`);
            } else if (DSLTypeHelper.isNumericType(property.type) && typeof property.defaultValue.value !== 'number') {
                throw new Error(`Default value for field ${property.name} must be a ${property.type}`);
            } else if (property.type === 'boolean' && typeof property.defaultValue.value !== 'boolean') {
                throw new Error(`Default value for field ${property.name} must be a boolean`);
            } else if (!DSLTypeHelper.isBuiltInType(property.type)) {
                if (
                    typeof property.defaultValue.value !== 'string' ||
                    !property.defaultValue.value.startsWith(property.type)
                ) {
                    throw new Error(`Default value for field ${property.name} must be a ${property.type} reference`);
                }
            }
        } else if (
            property.defaultValue.type === 'reference' &&
            typeof property.defaultValue.value === 'string' &&
            typeof property.type === 'string'
        ) {
            if (!property.defaultValue.value.startsWith(property.type + '.')) {
                throw new Error(`Default value for field ${property.name} must be a ${property.type} reference`);
            }
        }
    }
}

export const ConfigurationEditor = (props: ConfigurationEditorProps) => {
    return (
        <DSLEditor
            {...CONFIG_CONFIGURATION}
            validTypes={[...(CONFIG_CONFIGURATION.validTypes ?? []), ...(props.validTypes ?? [])]}
            validator={fieldValidator}
            onChange={props.onChange}
            onError={props.onError}
            onCodeChange={props.onCodeChange}
            readOnly={props.readOnly}
            value={props.value}
        />
    );
};

export const ConfigurationEditorField = (props: DSLFormEditorProps<DataTypeEditorProps>) => {
    const formField = useFormContextField<DSLResult>(props.name);
    return (
        <ConfigurationEditor
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
