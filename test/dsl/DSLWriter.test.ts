import { describe, expect, test } from '@jest/globals';
import { DSLWriter } from '../../src/dsl/DSLWriter';
import { DSLEntityType } from '../../src/dsl/types';

describe('DSLWriter', () => {
    test('can write comments', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.COMMENT,
                    text: 'Some comment',
                },
                {
                    type: DSLEntityType.COMMENT,
                    text: 'Other comment',
                },
            ])
        ).toBe(`#Some comment\n\n#Other comment`);
    });

    test('can write method', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.METHOD,
                    name: 'myMethod',
                    annotations: [{ type: '@GET', arguments: ['/path'] }],
                    returnType: { name: 'MyClass', list: true },
                    description: 'Some description\non Multiple Lines',
                    parameters: [
                        {
                            type: 'string',
                            name: 'id',
                            annotations: [{ type: '@ID', arguments: ['value'] }],
                        },
                        {
                            type: { name: 'string', list: true },
                            name: 'tags',
                            annotations: [{ type: '@Tags', arguments: ['value'] }],
                        },
                    ],
                },
            ])
        ).toBe(`//Some description\n//on Multiple Lines
@GET("/path")
myMethod(@ID("value") id:string, @Tags("value") tags:string[]):MyClass[]`);
    });

    test('can write enum type', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.ENUM,
                    name: 'myType',
                    annotations: [{ type: '@SomeType', arguments: ['/path'] }],
                    description: 'Some description\non Multiple Lines',
                    values: ['ONE', 'TWO', 'THREE'],
                },
            ])
        ).toBe(`//Some description
//on Multiple Lines
@SomeType("/path")
enum myType {
\tONE,
\tTWO,
\tTHREE
}`);
    });

    test('can write data type without annotations', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.ENUM,
                    name: 'Status',
                    description: 'Enum values for status',
                    values: ['ENABLED', 'DISABLED', 'UNKNOWN'],
                },
                {
                    type: DSLEntityType.DATATYPE,
                    name: 'MyDataType',
                    description: 'Some info about my data type\nWith multiple lines',
                    properties: [
                        {
                            name: 'id',
                            type: 'string',
                        },
                        {
                            name: 'tags',
                            type: { name: 'string', list: true },
                        },
                        {
                            name: 'children',
                            type: 'object',
                            properties: [
                                {
                                    name: 'childId',
                                    type: 'integer',
                                },
                            ],
                        },
                    ],
                },
            ])
        ).toBe(`//Enum values for status
enum Status {
\tENABLED,
\tDISABLED,
\tUNKNOWN
}

//Some info about my data type
//With multiple lines
MyDataType {
\tid: string
\ttags: string[]
\tchildren: {
\t\tchildId: integer
\t}
}`);

        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.DATATYPE,
                    name: 'myType',
                    annotations: [],
                    description: 'Some description\non Multiple Lines',
                    properties: [
                        {
                            type: 'string',
                            name: 'id',
                            description: 'Some id',
                            annotations: [],
                        },
                        {
                            type: { name: 'string', list: true },
                            name: 'tags',
                            description: 'Some tags',
                            annotations: [],
                        },
                    ],
                },
            ])
        ).toBe(`//Some description
//on Multiple Lines
myType {
\t//Some id
\tid: string
\t//Some tags
\ttags: string[]
}`);
    });

    test('can write data type with annotations', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.DATATYPE,
                    name: 'myType',
                    annotations: [{ type: '@SomeType', arguments: ['/path'] }],
                    description: 'Some description\non Multiple Lines',
                    properties: [
                        {
                            type: 'string',
                            name: 'id',
                            description: 'Some id',
                            annotations: [{ type: '@ID', arguments: ['value'] }],
                        },
                        {
                            type: { name: 'string', list: true },
                            name: 'tags',
                            description: 'Some tags',
                            annotations: [{ type: '@Tags', arguments: ['value'] }],
                        },
                    ],
                },
            ])
        ).toBe(`//Some description
//on Multiple Lines
@SomeType("/path")
myType {
\t//Some id
\t@ID("value")
\tid: string
\t//Some tags
\t@Tags("value")
\ttags: string[]
}`);
    });

    test('can write data type with inner types', () => {
        expect(
            DSLWriter.write([
                {
                    type: DSLEntityType.DATATYPE,
                    name: 'myType',
                    annotations: [{ type: '@SomeType', arguments: ['/path'] }],
                    description: 'Some description\non Multiple Lines',
                    properties: [
                        {
                            type: 'object',
                            name: 'parent',
                            description: 'Some parent',
                            annotations: [{ type: '@Entity', arguments: ['value'] }],
                            properties: [
                                {
                                    name: 'id',
                                    description: 'Parent id',
                                    type: 'string',
                                    annotations: [{ type: '@ID', arguments: ['value'] }],
                                },
                            ],
                        },
                        {
                            type: { name: 'object', list: true },
                            name: 'children',
                            description: 'Some children',
                            annotations: [{ type: '@Entity', arguments: ['value'] }],
                            properties: [
                                {
                                    name: 'id',
                                    description: 'Child id',
                                    type: 'string',
                                    annotations: [{ type: '@ID', arguments: ['value'] }],
                                },
                            ],
                        },
                    ],
                },
            ])
        ).toBe(`//Some description
//on Multiple Lines
@SomeType("/path")
myType {
\t//Some parent
\t@Entity("value")
\tparent: {
\t\t//Parent id
\t\t@ID("value")
\t\tid: string
\t}
\t//Some children
\t@Entity("value")
\tchildren: [{
\t\t//Child id
\t\t@ID("value")
\t\tid: string
\t}]
}`);
    });
});
