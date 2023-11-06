/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import {
    DSLAnnotation,
    DSLDataTypeProperty,
    DSLDefaultValue,
    DSLEntity,
    DSLEntityType,
    DSLMethod,
    DSLType,
} from './interfaces';
import { HTTPMethod, HTTPTransport, RESTMethod, TypeLike } from '@kapeta/ui-web-types';

import { Entity, EntityProperties, EntityType, EntityProperty, isList } from '@kapeta/schemas';

import { BUILT_IN_TYPES } from './types';

type SchemaMethods = { [p: string]: RESTMethod };

function fromSchemaDefaultValue(value: EntityProperty): DSLDefaultValue | null {
    if (value.defaultValue === undefined) {
        return null;
    }

    if (/^[0-9]+(\.[0-9]+)?$/.test(value.defaultValue)) {
        return {
            type: 'literal',
            value: parseFloat(value.defaultValue),
        };
    }
    if ('null' === value.defaultValue.toLowerCase()) {
        return {
            type: 'literal',
            value: null,
        };
    }

    if (/^(false|true)$/i.test(value.defaultValue)) {
        return {
            type: 'literal',
            value: value.defaultValue.toLowerCase() === 'true',
        };
    }

    if (
        !value.defaultValue.startsWith('"') &&
        !value.defaultValue.startsWith("'") &&
        value.defaultValue.indexOf('.') > -1
    ) {
        return {
            type: 'reference',
            value: value.defaultValue,
        };
    }

    return {
        type: 'literal',
        value: value.defaultValue,
    };
}

export namespace DSLConverters {
    export function asDSLType(type: string): DSLType {
        if (!type) {
            return 'void';
        }
        if (type.endsWith('[]')) {
            return {
                name: type.substring(0, type.length - 2),
                list: true,
            };
        }

        return type;
    }

    export function fromDSLType(type: DSLType): string {
        if (!type) {
            return 'void';
        }

        if (typeof type === 'string') {
            return type;
        }

        return type.name + (type.list ? '[]' : '');
    }

    export function fromSchemaType(type?: TypeLike): string {
        if (!type || type.type === '') {
            return 'void';
        }
        return type && type.ref ? type.ref : type.type || 'void';
    }

    export function toSchemaType(dslType: DSLType): TypeLike {
        const type = fromDSLType(dslType);
        let onlyType = type;

        if (onlyType.endsWith('[]')) {
            //We need the type without array indicators to check for built-in
            onlyType = onlyType.substring(0, type.length - 2);
        }

        if (!onlyType) {
            return { type: '' };
        }

        if (onlyType === 'object') {
            return { type: type };
        }

        if (!BUILT_IN_TYPES.some((t) => t.name === onlyType)) {
            return { ref: type };
        }

        return { type: type };
    }

    export function toSchemaEntity(entity: DSLEntity): Entity | undefined {
        switch (entity.type) {
            case DSLEntityType.ENUM:
                return {
                    type: EntityType.Enum,
                    name: entity.name,
                    description: entity.description,
                    values: entity.values,
                };
            case DSLEntityType.DATATYPE:
                return {
                    type: EntityType.Dto,
                    name: entity.name,
                    description: entity.description,
                    properties: entity.properties ? toSchemaProperties(entity.properties) : {},
                };
            case DSLEntityType.COMMENT:
                //Ignore
                break;
            default:
                throw new Error('Unknown dsl type: ' + entity.type);
        }
    }

    export function fromSchemaEntity(entity: Entity): DSLEntity | undefined {
        switch (entity.type) {
            case EntityType.Enum:
                return {
                    type: DSLEntityType.ENUM,
                    name: entity.name,
                    description: entity.description,
                    values: entity.values || [],
                };

            case EntityType.Dto:
                return {
                    type: DSLEntityType.DATATYPE,
                    name: entity.name,
                    description: entity.description,
                    properties: entity.properties ? fromSchemaProperties(entity.properties) : [],
                };
            default:
        }
    }

    export function fromSchemaProperties(properties: EntityProperties): DSLDataTypeProperty[] {
        if (!properties) {
            return [];
        }

        return Object.entries(properties).map(([name, value]: [string, EntityProperty]): DSLDataTypeProperty => {
            const stringType = fromSchemaType(value);

            let annotations: DSLAnnotation[] = [];

            if (value.required) {
                annotations.push({
                    type: '@required',
                });
            }

            if (value.secret) {
                annotations.push({
                    type: '@secret',
                });
            }

            if (value.global) {
                annotations.push({
                    type: '@global',
                });
            }

            if (isList(value)) {
                const typeName = stringType.substring(0, stringType.length - 2);
                return {
                    name,
                    description: value.description,
                    annotations,
                    type: {
                        name: typeName,
                        list: true,
                    },
                };
            }

            let defaultValue = fromSchemaDefaultValue(value);

            return {
                name,
                type: asDSLType(stringType),
                annotations,
                description: value.description,
                defaultValue,
                properties: value.properties ? fromSchemaProperties(value.properties) : undefined,
            };
        });
    }

    export function toSchemaProperties(properties: DSLDataTypeProperty[]): EntityProperties {
        const out: EntityProperties = {};

        properties.forEach((property) => {
            let typeLike = toSchemaType(property.type);
            const secret = property.annotations?.some((annotation) => annotation.type === '@secret') || false;
            const required = property.annotations?.some((annotation) => annotation.type === '@required') || false;
            const global = property.annotations?.some((annotation) => annotation.type === '@global') || false;

            if (typeof property.type === 'string' || !property.type.list) {
                const defaultValue =
                    property.defaultValue?.value !== undefined ? `${property.defaultValue?.value}` : undefined;

                out[property.name] = {
                    ...typeLike,
                    defaultValue,
                    description: property.description,
                    properties: property.properties ? toSchemaProperties(property.properties) : null,
                };

                if (!property.properties) {
                    out[property.name].secret = secret;
                    out[property.name].required = required;
                    out[property.name].global = global;
                }
            } else {
                //Normally this includes [] if its a list - we want to strip that off for properties
                //To not create a "List of Lists"
                if (typeLike.type) {
                    if (typeLike.type.endsWith('[]')) {
                        typeLike = {
                            type: typeLike.type.substring(0, typeLike.type.length - 2),
                        };
                    }
                } else {
                    if (typeLike.ref?.endsWith('[]')) {
                        typeLike.ref = typeLike.ref.substring(0, typeLike.ref.length - 2);
                    }
                }
                out[property.name] = {
                    type: 'array',
                    description: property.description,
                    items: {
                        ...typeLike,
                        secret,
                        required,
                        global,
                        properties: property.properties ? toSchemaProperties(property.properties) : null,
                    },
                };
            }
        });

        return out;
    }

    export function fromSchemaTransport(transport: string) {
        switch (transport.toLowerCase()) {
            case 'path':
                return '@Path';
            case 'header':
                return '@Header';
            case 'query':
                return '@Query';
            case 'body':
                return '@Body';
        }
        //We default to query if the type is invalid
        return '@Query';
    }

    export function toSchemaTransport(transport: string): HTTPTransport {
        switch (transport.toLowerCase()) {
            case '@path':
                return HTTPTransport.PATH;
            case '@header':
                return HTTPTransport.HEADER;
            case '@query':
                return HTTPTransport.QUERY;
            case '@body':
                return HTTPTransport.BODY;
        }

        return HTTPTransport.QUERY;
    }

    export function fromSchemaMethods(methods: SchemaMethods): DSLMethod[] {
        return Object.entries(methods).map(([name, method]) => {
            return {
                name,
                returnType: asDSLType(fromSchemaType(method.responseType)),
                type: DSLEntityType.METHOD,
                description: method.description,
                parameters: method.arguments
                    ? Object.entries(method.arguments).map(([name, arg]) => {
                          return {
                              name,
                              type: asDSLType(fromSchemaType(arg)),
                              annotations: arg.transport
                                  ? [
                                        {
                                            type: fromSchemaTransport(arg.transport),
                                            argument: arg.argument,
                                        },
                                    ]
                                  : [],
                          };
                      })
                    : [],
                annotations: [
                    {
                        type: `@${method.method}`,
                        arguments: [method.path],
                    },
                ],
            };
        });
    }

    export function toSchemaMethods(methods: DSLMethod[]): SchemaMethods {
        const out: SchemaMethods = {};

        methods.forEach((method) => {
            const args: RESTMethod['arguments'] = {};
            if (method.parameters) {
                method.parameters.forEach((arg) => {
                   let restArgs = !(arg.annotations && arg.annotations.length > 0) ? "" : (arg.annotations[0].arguments && arg.annotations[0].arguments[0])
                    args[arg.name] = {
                        ...toSchemaType(arg.type),
                        transport: toSchemaTransport(
                            arg.annotations && arg.annotations.length > 0 ? arg.annotations[0].type : '@Query'
                        ),
                        argument: restArgs,
                    };
                });
            }

            const annotations = method.annotations ?? [];
            const firstAnnotation = annotations.length > 0 ? annotations[0] : null;

            const path =
                firstAnnotation && firstAnnotation.arguments && firstAnnotation.arguments.length > 0
                    ? firstAnnotation.arguments[0]
                    : '/';

            const httpMethod =
                firstAnnotation && firstAnnotation.type ? firstAnnotation.type.substring(1).toUpperCase() : 'GET';

            out[method.name] = {
                responseType: toSchemaType(method.returnType),
                method: httpMethod as HTTPMethod,
                path,
                description: method.description,
                arguments: args,
            };
        });

        return out;
    }
}
