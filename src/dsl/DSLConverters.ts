import {DSLDataTypeProperty, DSLEntity, DSLEntityType, DSLMethod, DSLType} from "./interfaces";
import {
    HTTPMethod,
    HTTPTransport,
    RESTMethod,
    SchemaEntity,
    SchemaEntityType,
    SchemaEntryType,
    SchemaProperties
} from "@blockware/ui-web-types";
import {BUILT_IN_TYPES} from "./types";

type SchemaMethods = { [p: string]: RESTMethod };

export namespace DSLConverters {

    export function asDSLType(type: string): DSLType {
        if (!type) {
            return 'void'
        }
        if (type.endsWith('[]')) {
            return {
                name: type.substring(0, type.length - 2),
                list: true
            }
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

    export function fromSchemaType(type: any): string {
        if (!type) {
            return 'void'
        }
        return type && type.$ref ? type.$ref : type;
    }

    export function toSchemaType(dslType: DSLType): SchemaEntryType {

        const type = fromDSLType(dslType);
        let onlyType = type;

        if (onlyType.endsWith('[]')) {
            //We need the type without array indicators to check for built-in
            onlyType = onlyType.substring(0, type.length - 2);
        }

        if (!onlyType) {
            return ''
        }

        if (onlyType === 'object') {
            return type;
        }

        if (BUILT_IN_TYPES.indexOf(onlyType) === -1) {
            return {$ref: type};
        }

        return type;
    }

    export function toSchemaEntity(entity: DSLEntity): SchemaEntity {
        switch (entity.type) {
            case DSLEntityType.ENUM:
                return {
                    type: SchemaEntityType.ENUM,
                    name: entity.name,
                    description: entity.description,
                    values: entity.values
                };
            case DSLEntityType.DATATYPE:
                return {
                    type: SchemaEntityType.DTO,
                    name: entity.name,
                    description: entity.description,
                    properties: entity.properties ? toSchemaProperties(entity.properties) : {}
                };
            case DSLEntityType.COMMENT:
                //Ignore
                break;
            default:
                throw new Error('Unknown dsl type: ' + entity.type);
        }
    }

    export function fromSchemaEntity(entity: SchemaEntity): DSLEntity {
        switch (entity.type) {
            case SchemaEntityType.ENUM:
                return {
                    type: DSLEntityType.ENUM,
                    name: entity.name,
                    description: entity.description,
                    values: entity.values
                };

            default:
            case SchemaEntityType.DTO:
                return {
                    type: DSLEntityType.DATATYPE,
                    name: entity.name,
                    description: entity.description,
                    properties: entity.properties ? fromSchemaProperties(entity.properties) : []
                };

        }

    }

    export function fromSchemaProperties(properties: SchemaProperties): DSLDataTypeProperty[] {
        return Object.entries(properties).map(([name, value]): DSLDataTypeProperty => {
            // @ts-ignore
            const stringType = fromSchemaType(value.type);

            if (stringType === 'array') {
                return {
                    name,
                    description: value.description,
                    type: {
                        name: fromSchemaType(value.items?.type),
                        list: true
                    },
                    properties: value.items?.properties ? fromSchemaProperties(value.items?.properties) : undefined
                }
            }

            return {
                name,
                type: asDSLType(stringType),
                description: value.description,
                properties: value.properties ? fromSchemaProperties(value.properties) : undefined
            }
        });
    }

    export function toSchemaProperties(properties: DSLDataTypeProperty[]): SchemaProperties {
        const out = {};

        properties.forEach(property => {
            let type = toSchemaType(property.type);

            if (typeof property.type === 'string' ||
                !property.type.list) {
                out[property.name] = {
                    description: property.description,
                    type,
                    properties: property.properties ? toSchemaProperties(property.properties) : null
                }
            } else {
                //Normally this includes [] if its a list - we want to strip that off for properties
                //To not create a "List of Lists"
                if (typeof type === 'string') {
                    if (type.endsWith('[]')) {
                        type = type.substring(0, type.length - 2);
                    }
                } else {
                    if (type.$ref.endsWith('[]')) {
                        type.$ref = type.$ref.substring(0, type.$ref.length - 2);
                    }
                }
                out[property.name] = {
                    type: 'array',
                    description: property.description,
                    items: {
                        type,
                        properties: property.properties ? toSchemaProperties(property.properties) : null
                    }
                }
            }

        })

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
                parameters: method.arguments ? Object.entries(method.arguments).map(([name, arg]) => {
                    return {
                        name,
                        type: asDSLType(fromSchemaType(arg.type)),
                        annotations: arg.transport ? [
                            {
                                type: fromSchemaTransport(arg.transport)
                            }
                        ] : []
                    }
                }) : [],
                annotations: [
                    {
                        type: `@${method.method}`,
                        arguments: [method.path]
                    }
                ]
            }
        });
    }

    export function toSchemaMethods(methods: DSLMethod[]): SchemaMethods {
        const out: SchemaMethods = {}

        methods.forEach(method => {
            const args = {};
            if (method.parameters) {
                method.parameters.forEach((arg) => {
                    args[arg.name] = {
                        type: toSchemaType(arg.type),
                        transport: toSchemaTransport(arg.annotations && arg.annotations.length > 0 ? arg.annotations[0].type : '@Query')
                    };
                })
            }

            out[method.name] = {
                responseType: toSchemaType(method.returnType),
                method: (method.annotations ? method.annotations[0].type?.substring(1).toUpperCase() : 'GET') as HTTPMethod,
                path: (method.annotations && method.annotations[0].arguments ? method?.annotations[0].arguments[0] : '/'),
                description: method.description,
                arguments: args
            }
        });

        return out;
    }
}