/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { describe, test, expect } from '@jest/globals';
import { DSLParser, SoftError } from '../../src/dsl/DSLParser';
import { DSLEntityType } from '../../src/dsl/types';

describe('DSLParser', () => {
    test('can parse comments', () => {
        expect(
            DSLParser.parse(
                `
        #Some comment
        
        //Other comment
        //comment
        `,
                {}
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.COMMENT,
                text: 'Some comment',
            },
            {
                type: DSLEntityType.COMMENT,
                text: 'Other comment',
            },
            {
                type: DSLEntityType.COMMENT,
                text: 'comment',
            },
        ]);
    });

    test('can parse normal method', () => {
        expect(
            DSLParser.parse(
                [
                    '//Some',
                    '//description',
                    'myMethod(id:string, tags:string[], entity:MyClass, headers:Map<string,string>):void',
                ].join('\n'),
                {
                    methods: true,
                    validTypes: ['MyClass'],
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.METHOD,
                description: 'Some\ndescription',
                returnType: 'void',
                name: 'myMethod',
                annotations: [],
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                        annotations: [],
                    },
                    {
                        name: 'tags',
                        type: { name: 'string', list: true },
                        annotations: [],
                    },
                    {
                        name: 'entity',
                        type: 'MyClass',
                        annotations: [],
                    },
                    {
                        name: 'headers',
                        type: {
                            name: 'Map',
                            generics: ['string', 'string'],
                        },
                        annotations: [],
                    },
                ],
            },
        ]);
    });

    test('can parse REST method', () => {
        expect(
            DSLParser.parse(
                [
                    '//Some',
                    '//description',
                    '@POST("/some/path")',
                    'myMethod(@Path id:string, @Query tags:string[], @Header headers:Map<string,string>, @Body entity:MyClass):void',
                ].join('\n'),
                {
                    methods: true,
                    rest: true,
                    validTypes: ['MyClass'],
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.METHOD,
                description: 'Some\ndescription',
                returnType: 'void',
                name: 'myMethod',
                annotations: [{ type: '@POST', arguments: ['/some/path'] }],
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                        annotations: [{ type: '@Path', arguments: [] }],
                    },
                    {
                        name: 'tags',
                        type: { name: 'string', list: true },
                        annotations: [{ type: '@Query', arguments: [] }],
                    },
                    {
                        name: 'headers',
                        type: { name: 'Map', generics: ['string', 'string'] },
                        annotations: [{ type: '@Header', arguments: [] }],
                    },
                    {
                        name: 'entity',
                        type: 'MyClass',
                        annotations: [{ type: '@Body', arguments: [] }],
                    },
                ],
            },
        ]);
    });

    test('can parse REST method with Header', () => {
        expect(
            DSLParser.parse(
                [
                    '//Some',
                    '//description',
                    '@POST("/some/path")',
                    'myMethod(@Header("My-Header") header: string, @Path id:string, @Query tags:string[], @Body entity:MyClass):void',
                ].join('\n'),
                {
                    methods: true,
                    rest: true,
                    validTypes: ['MyClass'],
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.METHOD,
                description: 'Some\ndescription',
                returnType: 'void',
                name: 'myMethod',
                annotations: [{ type: '@POST', arguments: ['/some/path'] }],
                parameters: [
                    {
                        name: 'header',
                        type: 'string',
                        annotations: [{ type: '@Header', arguments: ['My-Header'] }],
                    },
                    {
                        name: 'id',
                        type: 'string',
                        annotations: [{ type: '@Path', arguments: [] }],
                    },
                    {
                        name: 'tags',
                        type: { name: 'string', list: true },
                        annotations: [{ type: '@Query', arguments: [] }],
                    },
                    {
                        name: 'entity',
                        type: 'MyClass',
                        annotations: [{ type: '@Body', arguments: [] }],
                    },
                ],
            },
        ]);
    });

    test('can parse REST method with optional Query', () => {
        expect(
            DSLParser.parse(
                [
                    '@GET("/some/path")',
                    'search(@Query(optional = true) type: string): string[]'
                ].join('\n'),
                {
                    methods: true,
                    rest: true
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.METHOD,
                description: null,
                returnType: {
                    "list": true,
                    "name": "string"
                },
                name: 'search',
                annotations: [{ type: '@GET', arguments: ['/some/path'] }],
                parameters: [
                    {
                        name: 'type',
                        type: 'string',
                        annotations: [{ type: '@Query', arguments: [], options: {'optional': 'true'}}],
                    },
                ],
            },
        ]);
    })

    test('can parse data type', () => {
        expect(
            DSLParser.parse(
                [
                    '//Some',
                    '//description',
                    '@Test(ok)',
                    'myType {',
                    '\tid:string',
                    '',
                    '\t//Some other type',
                    '\tother:MyClass[]',
                    '',
                    '\tentry: {',
                    '\t\tid:string = "test"',
                    '\t}',
                    '\tchildren: [{',
                    '\t\tname:string',
                    '\t}]',
                    '}',
                ].join('\n'),
                {
                    types: true,
                    typeAnnotations: ['@Test'],
                    validTypes: ['MyClass'],
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.DATATYPE,
                description: 'Some\ndescription',
                name: 'myType',
                annotations: [{ type: '@Test', arguments: ['ok'] }],
                properties: [
                    {
                        name: 'id',
                        type: 'string',
                        description: null,
                        defaultValue: null,
                        annotations: [],
                    },
                    {
                        name: 'other',
                        description: 'Some other type',
                        defaultValue: null,
                        type: { name: 'MyClass', list: true },
                        annotations: [],
                    },
                    {
                        name: 'entry',
                        type: 'object',
                        description: null,
                        defaultValue: null,
                        annotations: [],
                        properties: [
                            {
                                name: 'id',
                                type: 'string',
                                defaultValue: {
                                    type: 'literal',
                                    value: '"test"',
                                },
                                description: null,
                                annotations: [],
                            },
                        ],
                    },
                    {
                        name: 'children',
                        type: { name: 'object', list: true },
                        description: null,
                        defaultValue: null,
                        annotations: [],
                        properties: [
                            {
                                name: 'name',
                                type: 'string',
                                description: null,
                                defaultValue: null,
                                annotations: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    test('can parse enum type', () => {
        expect(
            DSLParser.parse(
                ['//Some', '//description', '@Test(ok)', 'enum myType {', '\tONE,', '\tTWO,', '\tTHREE', '}'].join(
                    '\n'
                ),
                {
                    types: true,
                    typeAnnotations: ['@Test'],
                }
            ).entities
        ).toEqual([
            {
                type: DSLEntityType.ENUM,
                description: 'Some\ndescription',
                name: 'myType',
                annotations: [{ type: '@Test', arguments: ['ok'] }],
                values: ['ONE', 'TWO', 'THREE'],
            },
        ]);
    });

    test('throws if invalid annotation', () => {
        expect(
            () =>
                DSLParser.parse(['//Some', '//description', '@NotExist(ok)', 'enum myType {}'].join('\n'), {
                    types: true,
                    typeAnnotations: ['@Test'],
                }).entities
        ).toThrow('Invalid type annotation - must be one of @Test');
    });

    test('throws if missing character', () => {
        expect(
            () =>
                DSLParser.parse(['//Some', '//description', 'enum myType {'].join('\n'), {
                    types: true,
                }).entities
        ).toThrow('Expected "}" or character but end of input found.');
    });

    test('throws if invalid path for REST method', () => {
        expect(
            () =>
                DSLParser.parse(`@GET('invalid path') doGet():void`, {
                    methods: true,
                    rest: true,
                }).entities
        ).toThrow('Invalid URL path specified. Must start with "/" and not end with "/"');
    });

    test('throws if method is defined and not allowed', () => {
        expect(
            () =>
                DSLParser.parse(`doGet():void`, {
                    methods: false,
                }).entities
        ).toThrow('Method definitions not allowed');
    });

    test('throws if data type is defined and not allowed', () => {
        expect(
            () =>
                DSLParser.parse(`MyType{}`, {
                    types: false,
                }).entities
        ).toThrow('Data type definitions not allowed');
    });

    test('throws if enum type is defined and not allowed', () => {
        expect(
            () =>
                DSLParser.parse(`enum MyType{}`, {
                    types: false,
                }).entities
        ).toThrow('Enum definitions not allowed');
    });

    test('throws if type is unknown', () => {
        expect(
            () =>
                DSLParser.parse(`doGet():MyType`, {
                    methods: true,
                }).entities
        ).toThrow('Type not found: "MyType"');
    });

    test('throws if type does not have generics', () => {
        expect(
            () =>
                DSLParser.parse(`doGet():MyType<string>`, {
                    methods: true,
                    validTypes: ['MyType'],
                }).entities
        ).toThrow('Generic arguments not supported for type: "MyType"');
    });

    test('throws if type has wrong amount of generics', () => {
        expect(
            () =>
                DSLParser.parse(`doGet():MyType<string>`, {
                    methods: true,
                    validTypes: ['MyType<*,*>'],
                }).entities
        ).toThrow('Invalid number of generic arguments: "MyType"');
    });

    test('can get soft errors as array for semantic errors', () => {
        const errors: SoftError[] = [];
        DSLParser.parse(`@DoesntExist doGet():MyType\notherMethod(@NotReal id:Unknown):void\n`, {
            methods: true,
            softErrorHandler: (error) => errors.push(error),
        });

        expect(errors.map((e) => e.type + ':' + e.message)).toEqual([
            'error:Invalid method annotation - must be one of @GET, @POST, @PUT, @PATCH, @DELETE, @HEAD',
            'warning:Type not found: "MyType"',
            'error:Annotations not allowed on methods',
            'error:Annotations not allowed on parameters',
            'warning:Type not found: "Unknown"',
        ]);
    });
});
