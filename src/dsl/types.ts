/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { DSLResult } from './interfaces';

export * from './interfaces';

interface TypeDefinition {
    name: string;
    description: string;
}

export type DSLFormEditorProps<T> = Omit<T, 'value' | 'onChange'> & { name: string; defaultValue?: DSLResult };

/**
 * Types that can easily be converted to or from strings (E.g. in paths and similar)
 */
export const STRINGABLE_TYPES: TypeDefinition[] = [
    {
        name: 'integer',
        description:
            'A whole number without decimals. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'double',
        description:
            'A large number with decimals. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'float',
        description:
            'A small number with decimals. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'long',
        description:
            'A very large number without decimals. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'short',
        description:
            'A small number without decimals. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'boolean',
        description: 'A true or false value',
    },
    {
        name: 'string',
        description: 'A string of characters',
    },
    {
        name: 'char',
        description: 'A single character',
    },
];

export const BUILT_IN_TYPES: TypeDefinition[] = [
    ...STRINGABLE_TYPES,
    {
        name: 'byte',
        description: 'A single byte',
    },
    {
        name: 'date',
        description: 'A date and time. Will be converted to the closest possible representation in the target language',
    },
    {
        name: 'void',
        description: 'A type representing no value. Usually only valid as a return type',
    },
];

export const REST_METHOD_ANNOTATIONS: TypeDefinition[] = [
    {
        name: '@GET',
        description: 'Defines a HTTP GET method. Usually used to retrieve a resource',
    },
    {
        name: '@POST',
        description: 'Defines a HTTP POST method. Usually used to perform an operation or create a resource',
    },
    {
        name: '@PUT',
        description: 'Defines a HTTP PUT method. Usually used to update a resource',
    },
    {
        name: '@PATCH',
        description: 'Defines a HTTP PATCH method. Usually used to update a resource',
    },
    {
        name: '@DELETE',
        description: 'Defines a HTTP DELETE method. Usually used to delete a resource',
    },
    {
        name: '@HEAD',
        description: 'Defines a HTTP HEAD method. Usually used to retrieve metadata about a resource',
    },
];

export const METHOD_ANNOTATIONS: TypeDefinition[] = [...REST_METHOD_ANNOTATIONS];

export const PARAMETER_ANNOTATIONS: TypeDefinition[] = [
    {
        name: '@Path',
        description:
            'Defines a path variable. Used to define a path variable from a path. Note that you need to define the variable in the path as well',
    },
    {
        name: '@Header',
        description: 'Defines a header variable. Variable value is a HTTP header',
    },
    {
        name: '@Query',
        description: 'Defines a query variable. Variable value is a HTTP query parameters',
    },
    {
        name: '@Body',
        description: 'Defines a body variable. Variable value is the HTTP body',
    },
];

export const CONFIG_FIELD_ANNOTATIONS: TypeDefinition[] = [
    {
        name: '@secret',
        description: 'Defines a secret field. The value will be stored encrypted',
    },
    {
        name: '@required',
        description: 'Defines a required field. The field must be set',
    },
    {
        name: '@global',
        description: 'Defines a global field. The fields value will be set in the plan - instead of each environment',
    },
];
