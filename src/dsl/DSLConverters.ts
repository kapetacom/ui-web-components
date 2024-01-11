/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import {
    DSLAnnotation,
    DSLDataTypeProperty,
    DSLValue,
    DSLEntity,
    DSLEntityType,
    DSLMethod,
    DSLType,
    BUILT_IN_TYPES,
    DataTypePropertyReader,
    RESTMethodReader,
} from '@kapeta/kaplang-core';

import { HTTPMethod, HTTPTransport, RESTMethod, TypeLike } from '@kapeta/ui-web-types';

import { Entity, EntityProperties, EntityProperty, EntityType } from '@kapeta/schemas';

type SchemaMethods = { [p: string]: RESTMethod };

function fromSchemaDefaultValue(value: EntityProperty): DSLValue | null {
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

        if (!type.endsWith('[]') && !type.includes('<')) {
            return type;
        }

        const out: DSLType = {
            name: type,
        };

        if (out.name.endsWith('[]')) {
            out.list = true;
            out.name = out.name.substring(0, out.name.length - 2);
        }

        if (out.name.includes('<')) {
            const [typeName, args] = out.name.split('<');
            out.name = typeName;
            out.generics = args
                .substring(0, args.length - 1)
                .split(',')
                .map((a) => a.trim());
        }

        return out;
    }

    export function fromDSLType(type: DSLType): string {
        if (!type) {
            return 'void';
        }

        if (typeof type === 'string') {
            return type;
        }

        let name = type.name;

        if (type.generics && type.generics.length > 0) {
            name += '<' + type.generics.join(',') + '>';
        }

        return name + (type.list ? '[]' : '');
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

            const out: DSLDataTypeProperty = {
                name,
                type: asDSLType(stringType),
                annotations,
                description: value.description,
                optional: !value.required,
            };

            let defaultValue = fromSchemaDefaultValue(value);
            if (defaultValue) {
                out.defaultValue = defaultValue;
            }

            if (value.properties) {
                out.properties = fromSchemaProperties(value.properties);
            }

            return out;
        });
    }

    export function toSchemaProperties(properties: DSLDataTypeProperty[]): EntityProperties {
        const out: EntityProperties = {};

        properties?.forEach((property) => {
            const reader = new DataTypePropertyReader(property);
            let typeLike = toSchemaType(reader.type);

            const defaultValue = reader.defaultValue?.value !== undefined ? `${reader.defaultValue?.value}` : undefined;

            out[reader.name] = {
                ...typeLike,
                defaultValue,
                description: reader.description,
            };

            out[reader.name].secret = reader.secret;
            out[reader.name].required = !reader.optional;
            out[reader.name].global = reader.global;
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
            const reader = new RESTMethodReader(method);
            const args: RESTMethod['arguments'] = {};
            if (reader.parameters) {
                reader.parameters.forEach((arg) => {
                    args[arg.name] = {
                        ...toSchemaType(arg.type),
                        transport: arg.transport.toUpperCase(),
                        argument: arg.transportArgument,
                        optional: arg.optional,
                    };
                });
            }

            out[method.name] = {
                responseType: toSchemaType(method.returnType),
                method: reader.method as HTTPMethod,
                path: reader.path,
                description: method.description,
                arguments: args,
            };
        });

        return out;
    }
}
