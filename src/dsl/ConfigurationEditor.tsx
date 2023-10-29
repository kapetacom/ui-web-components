/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DSLEditor } from './DSLEditor';
import { DSLDataTypeProperty, DSLResult, CONFIG_FIELD_ANNOTATIONS, PEGValidationEntity } from './types';
import { isBuiltInType, isStringableType, TypeLike } from '@kapeta/schemas';

export const TYPE_INSTANCE = 'Instance';
export const TYPE_INSTANCE_PROVIDER = 'InstanceProvider';

export interface ConfigurationEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
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
            } else if (
                ['integer', 'float', 'double', 'number', 'bigint'].includes(property.type) &&
                typeof property.defaultValue.value !== 'number'
            ) {
                throw new Error(`Default value for field ${property.name} must be a ${property.type}`);
            } else if (property.type === 'boolean' && typeof property.defaultValue.value !== 'boolean') {
                throw new Error(`Default value for field ${property.name} must be a boolean`);
            }

            if (!isBuiltInType(property as TypeLike)) {
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
            types={true}
            fieldAnnotations={CONFIG_FIELD_ANNOTATIONS.map((a) => a.name)}
            validTypes={[TYPE_INSTANCE, ...(props.validTypes ?? [])]}
            validator={fieldValidator}
            onChange={props.onChange}
            methods={false}
            rest={false}
            value={props.value}
        />
    );
};
