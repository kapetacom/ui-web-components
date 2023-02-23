import { describe, expect, test } from '@jest/globals';
import { DSLConverters } from '../../src/dsl/DSLConverters';
import {
    DSLDataType,
    DSLEntityType,
    DSLEnum,
    DSLMethod,
} from '../../src/dsl/types';
import {
    HTTPMethod,
    RESTMethod,
    SchemaDTO,
    SchemaEntityType,
    SchemaEnum,
} from '@blockware/ui-web-types';

describe('DSLConverters', () => {
    describe('types', () => {
        test('can convert to DSLTypes', () => {
            expect(DSLConverters.asDSLType('')).toBe('void');
            expect(DSLConverters.asDSLType('string')).toBe('string');
            expect(DSLConverters.asDSLType('string[]')).toEqual({
                name: 'string',
                list: true,
            });
        });

        test('can convert from DSLTypes', () => {
            expect(DSLConverters.fromDSLType('')).toBe('void');
            expect(DSLConverters.fromDSLType('string')).toBe('string');
            expect(
                DSLConverters.fromDSLType({ name: 'string', list: true })
            ).toEqual('string[]');
        });

        test('can convert from SchemaType', () => {
            expect(DSLConverters.fromSchemaType('')).toBe('void');
            expect(DSLConverters.fromSchemaType('string')).toBe('string');
            expect(DSLConverters.fromSchemaType({ $ref: 'MyClass' })).toEqual(
                'MyClass'
            );
        });

        test('can convert to SchemaType', () => {
            expect(DSLConverters.toSchemaType('')).toBe('void');
            expect(DSLConverters.toSchemaType('string')).toBe('string');
            expect(
                DSLConverters.toSchemaType({ name: 'MyClass', list: true })
            ).toEqual({ $ref: 'MyClass[]' });
        });
    });

    describe('enums', () => {
        test('can convert to schema Enum', () => {
            const entity: DSLEnum = {
                type: DSLEntityType.ENUM,
                description: 'Some description',
                annotations: [],
                name: 'MyEnum',
                values: ['ONE', 'TWO'],
            };
            expect(DSLConverters.toSchemaEntity(entity)).toEqual({
                type: SchemaEntityType.ENUM,
                name: entity.name,
                description: entity.description,
                values: entity.values,
            });
        });

        test('can convert from schema Enum', () => {
            const entity: SchemaEnum = {
                type: SchemaEntityType.ENUM,
                description: 'Some description',
                name: 'MyEnum',
                values: ['ONE', 'TWO'],
            };
            expect(DSLConverters.fromSchemaEntity(entity)).toEqual({
                type: DSLEntityType.ENUM,
                name: entity.name,
                description: entity.description,
                values: entity.values,
            });
        });
    });

    describe('dtos', () => {
        test('can convert to schema dto', () => {
            const entity: DSLDataType = {
                type: DSLEntityType.DATATYPE,
                description: 'Some description',
                annotations: [],
                name: 'MyDTO',
                properties: [
                    {
                        type: { name: 'string', list: true },
                        name: 'tags',
                        description: 'Tags',
                    },
                    {
                        type: { name: 'object', list: true },
                        name: 'children',
                        description: 'Children',
                        properties: [
                            {
                                type: 'string',
                                name: 'id',
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'parent',
                        description: 'Parent',
                        properties: [
                            {
                                type: 'string',
                                name: 'id',
                            },
                        ],
                    },
                ],
            };
            expect(DSLConverters.toSchemaEntity(entity)).toEqual({
                type: SchemaEntityType.DTO,
                name: entity.name,
                description: entity.description,
                properties: {
                    tags: {
                        description: 'Tags',
                        type: 'array',
                        items: {
                            type: 'string',
                            properties: null,
                        },
                    },
                    children: {
                        description: 'Children',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: undefined,
                                    properties: null,
                                },
                            },
                        },
                    },
                    parent: {
                        description: 'Parent',
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: undefined,
                                properties: null,
                            },
                        },
                    },
                },
            });
        });

        test('can convert from schema dto', () => {
            const entity: SchemaDTO = {
                type: SchemaEntityType.DTO,
                name: 'MyDTO',
                description: 'Some description',
                properties: {
                    tags: {
                        description: 'Tags',
                        type: 'array',
                        items: {
                            type: 'string',
                            properties: null,
                        },
                    },
                    children: {
                        description: 'Children',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: undefined,
                                    properties: null,
                                },
                            },
                        },
                    },
                    parent: {
                        description: 'Parent',
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: undefined,
                                properties: null,
                            },
                        },
                    },
                },
            };

            expect(DSLConverters.fromSchemaEntity(entity)).toEqual({
                type: DSLEntityType.DATATYPE,
                description: entity.description,
                name: entity.name,
                properties: [
                    {
                        type: { name: 'string', list: true },
                        name: 'tags',
                        description: 'Tags',
                    },
                    {
                        type: { name: 'object', list: true },
                        name: 'children',
                        description: 'Children',
                        properties: [
                            {
                                type: 'string',
                                name: 'id',
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'parent',
                        description: 'Parent',
                        properties: [
                            {
                                type: 'string',
                                name: 'id',
                            },
                        ],
                    },
                ],
            });
        });
    });

    describe('methods', () => {
        test('can convert methods without arguments or annotations to schema', () => {
            const methods: DSLMethod[] = [
                // @ts-ignore
                {
                    type: DSLEntityType.METHOD,
                    name: 'test',
                    description: 'Test',
                    returnType: { name: 'string', list: true },
                },
            ];
            expect(DSLConverters.toSchemaMethods(methods)).toEqual({
                test: {
                    description: 'Test',
                    method: 'GET',
                    path: '/',
                    arguments: {},
                    responseType: 'string[]',
                },
            });
        });

        test('can convert methods to schema', () => {
            const methods: DSLMethod[] = [
                {
                    type: DSLEntityType.METHOD,
                    name: 'test',
                    annotations: [
                        {
                            type: '@GET',
                            arguments: ['/path'],
                        },
                    ],
                    description: 'Test',
                    parameters: [
                        {
                            type: { name: 'string', list: true },
                            annotations: [{ type: '@Query' }],
                            name: 'tags',
                        },
                    ],
                    returnType: { name: 'string', list: true },
                },
                {
                    type: DSLEntityType.METHOD,
                    name: 'complex',
                    annotations: [
                        {
                            type: '@POST',
                            arguments: ['/path'],
                        },
                    ],
                    description: 'Complex',
                    parameters: [
                        {
                            type: { name: 'Test', list: true },
                            annotations: [{ type: '@Body' }],
                            name: 'body',
                        },
                    ],
                    returnType: { name: 'Test', list: true },
                },
            ];
            expect(DSLConverters.toSchemaMethods(methods)).toEqual({
                test: {
                    description: 'Test',
                    method: 'GET',
                    path: '/path',
                    arguments: {
                        tags: {
                            type: 'string[]',
                            transport: 'QUERY',
                        },
                    },
                    responseType: 'string[]',
                },
                complex: {
                    description: 'Complex',
                    method: 'POST',
                    path: '/path',
                    arguments: {
                        body: {
                            type: { $ref: 'Test[]' },
                            transport: 'BODY',
                        },
                    },
                    responseType: { $ref: 'Test[]' },
                },
            });
        });

        test('can convert methods from schema', () => {
            const methods: { [key: string]: RESTMethod } = {
                test: {
                    description: 'Test',
                    method: HTTPMethod.GET,
                    path: '/path',
                    arguments: {
                        tags: {
                            type: 'string[]',
                            transport: 'QUERY',
                        },
                    },
                    responseType: 'string[]',
                },
                complex: {
                    description: 'Complex',
                    method: HTTPMethod.POST,
                    path: '/path',
                    arguments: {
                        body: {
                            type: { $ref: 'Test[]' },
                            transport: 'BODY',
                        },
                    },
                    responseType: { $ref: 'Test[]' },
                },
            };
            expect(DSLConverters.fromSchemaMethods(methods)).toEqual([
                {
                    type: DSLEntityType.METHOD,
                    name: 'test',
                    annotations: [
                        {
                            type: '@GET',
                            arguments: ['/path'],
                        },
                    ],
                    description: 'Test',
                    parameters: [
                        {
                            type: { name: 'string', list: true },
                            annotations: [{ type: '@Query' }],
                            name: 'tags',
                        },
                    ],
                    returnType: { name: 'string', list: true },
                },
                {
                    type: DSLEntityType.METHOD,
                    name: 'complex',
                    annotations: [
                        {
                            type: '@POST',
                            arguments: ['/path'],
                        },
                    ],
                    description: 'Complex',
                    parameters: [
                        {
                            type: { name: 'Test', list: true },
                            annotations: [{ type: '@Body' }],
                            name: 'body',
                        },
                    ],
                    returnType: { name: 'Test', list: true },
                },
            ]);
        });
    });
});
