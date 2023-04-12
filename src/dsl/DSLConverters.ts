import {
    DSLDataTypeProperty,
    DSLEntity,
    DSLEntityType,
    DSLMethod,
    DSLType,
} from './interfaces';
import {
    HTTPMethod,
    HTTPTransport,
    RESTMethod, TypeLike,
} from '@kapeta/ui-web-types';

import {
    Entity,
    EntityProperties,
    EntityType,
    EntityProperty, isList
} from '@kapeta/schemas';

import { BUILT_IN_TYPES } from './types';

type SchemaMethods = { [p: string]: RESTMethod };

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

    export function fromSchemaType(type: TypeLike): string {
        if (!type || type.type === '') {
            return 'void';
        }
        return type && type.ref ? type.ref : type.type;
    }

    export function toSchemaType(dslType: DSLType): TypeLike {
        const type = fromDSLType(dslType);
        let onlyType = type;

        if (onlyType.endsWith('[]')) {
            //We need the type without array indicators to check for built-in
            onlyType = onlyType.substring(0, type.length - 2);
        }

        if (!onlyType) {
            return {type: ''};
        }

        if (onlyType === 'object') {
            return {type: type};
        }

        if (BUILT_IN_TYPES.indexOf(onlyType) === -1) {
            return { ref: type };
        }

        return {type: type};
    }

    export function toSchemaEntity(entity: DSLEntity): Entity {
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
                    properties: entity.properties
                        ? toSchemaProperties(entity.properties)
                        : {},
                };
            case DSLEntityType.COMMENT:
                //Ignore
                break;
            default:
                throw new Error('Unknown dsl type: ' + entity.type);
        }
    }

    export function fromSchemaEntity(entity: Entity): DSLEntity {
        switch (entity.type) {
            case EntityType.Enum:
                return {
                    type: DSLEntityType.ENUM,
                    name: entity.name,
                    description: entity.description,
                    values: entity.values,
                };

            case EntityType.Dto:
                return {
                    type: DSLEntityType.DATATYPE,
                    name: entity.name,
                    description: entity.description,
                    properties: entity.properties
                    ? fromSchemaProperties(entity.properties)
                    : [],
                };
            default:
        }
    }

    export function fromSchemaProperties(properties: EntityProperties): DSLDataTypeProperty[] {
        if (!properties) {
            return [];
        }

        return Object.entries(properties).map(([name, value]:[string,EntityProperty]): DSLDataTypeProperty => {
                const stringType = fromSchemaType(value);

                if (isList(value)) {
                    const typeName = stringType.substring(0, stringType.length - 2);
                    return {
                        name,
                        description: value.description,
                        type: {
                            name: typeName,
                            list: true,
                        }
                    };
                }

                return {
                    name,
                    type: asDSLType(stringType),
                    description: value.description,
                    properties: value.properties
                        ? fromSchemaProperties(value.properties)
                        : undefined,
                };
            }
        );
    }

    export function toSchemaProperties(
        properties: DSLDataTypeProperty[]
    ): EntityProperties {
        const out = {};

        properties.forEach((property) => {
            let type = toSchemaType(property.type);

            if (typeof property.type === 'string' || !property.type.list) {
                out[property.name] = {
                    description: property.description,
                    type,
                    properties: property.properties
                        ? toSchemaProperties(property.properties)
                        : null,
                };
            } else {
                //Normally this includes [] if its a list - we want to strip that off for properties
                //To not create a "List of Lists"
                if (type.type) {
                    if (type.type.endsWith('[]')) {
                        type = {type: type.type.substring(0, type.type.length - 2)};
                    }
                } else {
                    if (type.ref.endsWith('[]')) {
                        type.ref = type.ref.substring(
                            0,
                            type.ref.length - 2
                        );
                    }
                }
                out[property.name] = {
                    type: 'array',
                    description: property.description,
                    items: {
                        type,
                        properties: property.properties
                            ? toSchemaProperties(property.properties)
                            : null,
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
                                            type: fromSchemaTransport(
                                                arg.transport
                                            ),
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
            const args = {};
            if (method.parameters) {
                method.parameters.forEach((arg) => {
                    args[arg.name] = {
                        type: toSchemaType(arg.type),
                        transport: toSchemaTransport(
                            arg.annotations && arg.annotations.length > 0
                                ? arg.annotations[0].type
                                : '@Query'
                        ),
                    };
                });
            }

            const annotations = method.annotations ?? [];
            const firstAnnotation =
                annotations.length > 0 ? annotations[0] : null;

            const path =
                firstAnnotation &&
                firstAnnotation.arguments &&
                firstAnnotation.arguments.length > 0
                    ? firstAnnotation.arguments[0]
                    : '/';

            const httpMethod =
                firstAnnotation && firstAnnotation.type
                    ? firstAnnotation.type.substring(1).toUpperCase()
                    : 'GET';

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
