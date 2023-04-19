import { describe, expect, test } from '@jest/globals';
import { DSLConverters } from '../../src/dsl/DSLConverters';
import { DSLDataType, DSLEntityType, DSLEnum, DSLMethod } from '../../src/dsl/types';
import { HTTPMethod, RESTMethod } from '@kapeta/ui-web-types';
import { EntityDTO, EntityEnum, EntityType } from '@kapeta/schemas';

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
            expect(DSLConverters.fromDSLType({ name: 'string', list: true })).toEqual('string[]');
        });

        test('can convert from SchemaType', () => {
            expect(DSLConverters.fromSchemaType({ type: '' })).toBe('void');
            expect(DSLConverters.fromSchemaType({ type: 'string' })).toBe('string');
            expect(DSLConverters.fromSchemaType({ ref: 'MyClass' })).toEqual('MyClass');
        });

        test('can convert to SchemaType', () => {
            expect(DSLConverters.toSchemaType('')).toStrictEqual({
                type: 'void',
            });
            expect(DSLConverters.toSchemaType('string')).toStrictEqual({
                type: 'string',
            });
            expect(DSLConverters.toSchemaType({ name: 'MyClass', list: true })).toEqual({ ref: 'MyClass[]' });
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
                type: EntityType.Enum,
                name: entity.name,
                description: entity.description,
                values: entity.values,
            });
        });

        test('can convert from schema Enum', () => {
            const entity: EntityEnum = {
                type: EntityType.Enum,
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
                        type: 'string',
                        name: 'name',
                        defaultValue: {
                            type: 'literal',
                            value: 'test',
                        },
                    },
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
                type: EntityType.Dto,
                name: entity.name,
                description: entity.description,
                properties: {
                    name: {
                        type: 'string',
                        defaultValue: 'test',
                        description: undefined,
                        properties: null,
                        required: false,
                        secret: false,
                    },
                    tags: {
                        description: 'Tags',
                        type: 'array',
                        items: {
                            type: 'string',
                            properties: null,
                            required: false,
                            secret: false,
                        },
                    },
                    children: {
                        description: 'Children',
                        type: 'array',
                        items: {
                            type: 'object',
                            required: false,
                            secret: false,
                            properties: {
                                id: {
                                    type: 'string',
                                    defaultValue: undefined,
                                    description: undefined,
                                    properties: null,
                                    required: false,
                                    secret: false,
                                },
                            },
                        },
                    },
                    parent: {
                        defaultValue: undefined,
                        description: 'Parent',
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                defaultValue: undefined,
                                description: undefined,
                                properties: null,
                                required: false,
                                secret: false,
                            },
                        },
                    },
                },
            });
        });

        test('can convert from schema dto', () => {
            const entity: EntityDTO = {
                type: EntityType.Dto,
                name: 'MyDTO',
                description: 'Some description',
                properties: {
                    name: {
                        type: 'string',
                        defaultValue: '"test"',
                        required: true,
                    },
                    tags: {
                        description: 'Tags',
                        type: 'string[]',
                        required: true,
                        secret: true,
                    },
                    children: {
                        description: 'Children',
                        type: 'Node[]',
                    },
                    parent: {
                        description: 'Parent',
                        type: 'Node',
                        defaultValue: 'Node.ONE',
                    },
                },
            };

            expect(DSLConverters.fromSchemaEntity(entity)).toEqual({
                type: DSLEntityType.DATATYPE,
                description: entity.description,
                name: entity.name,
                properties: [
                    {
                        type: 'string',
                        name: 'name',
                        properties: undefined,
                        description: undefined,
                        annotations: [
                            {
                                type: '@required',
                            },
                        ],
                        defaultValue: {
                            type: 'literal',
                            value: '"test"',
                        },
                    },
                    {
                        type: { name: 'string', list: true },
                        name: 'tags',
                        annotations: [
                            {
                                type: '@required',
                            },
                            {
                                type: '@secret',
                            },
                        ],
                        description: 'Tags',
                    },
                    {
                        type: { name: 'Node', list: true },
                        annotations: [],
                        name: 'children',
                        description: 'Children',
                    },
                    {
                        type: 'Node',
                        annotations: [],
                        name: 'parent',
                        properties: undefined,
                        description: 'Parent',
                        defaultValue: {
                            type: 'reference',
                            value: 'Node.ONE',
                        },
                    },
                ],
            });
        });
    });

    describe('methods', () => {
        test('can convert methods without arguments or annotations to schema', () => {
            const methods: DSLMethod[] = [
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
                    responseType: { type: 'string[]' },
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
                    responseType: { type: 'string[]' },
                },
                complex: {
                    description: 'Complex',
                    method: 'POST',
                    path: '/path',
                    arguments: {
                        body: {
                            ref: 'Test[]',
                            transport: 'BODY',
                        },
                    },
                    responseType: { ref: 'Test[]' },
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
                    responseType: { type: 'string[]' },
                },
                complex: {
                    description: 'Complex',
                    method: HTTPMethod.POST,
                    path: '/path',
                    arguments: {
                        body: {
                            ref: 'Test[]',
                            transport: 'BODY',
                        },
                    },
                    responseType: { ref: 'Test[]' },
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
