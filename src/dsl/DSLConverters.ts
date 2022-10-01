import {DSLDataType, DSLDataTypeProperty, DSLEntityType, DSLMethod} from "./interfaces";
import {
    HTTPMethod,
    HTTPTransport,
    RESTMethod,
    SchemaEntity,
    SchemaEntryType,
    SchemaProperties
} from "@blockware/ui-web-types";

type SchemaMethods = { [p: string]: RESTMethod };

export namespace DSLConverters {

    export function fromSchemaType(type:any):string {
        if (!type) {
            return 'void'
        }
        return type && type.$ref ? type.$ref : type;
    }

    export function toSchemaType(type:string):SchemaEntryType {
        if (!type) {
            return ''
        }

        if (type[0].toUpperCase() === type[0]) {
            return {$ref: type};
        }

        return type;
    }

    export function toSchemaEntity(datatype:DSLDataType):SchemaEntity {
        return {
            name: datatype.name,
            description: datatype.description,
            properties: toSchemaProperties(datatype.properties)
        };
    }

    export function fromSchemaEntity(entity:SchemaEntity):DSLDataType {
        return {
            type: DSLEntityType.DATATYPE,
            name: entity.name,
            description: entity.description,
            properties: fromSchemaProperties(entity.properties)
        };
    }

    export function fromSchemaProperties(properties:SchemaProperties):DSLDataTypeProperty[] {
        return Object.entries(properties).map(([name, value]):DSLDataTypeProperty => {
            // @ts-ignore
            const stringType = fromSchemaType(value.type);

            if (stringType === 'array') {
                return {
                    name,
                    type: fromSchemaType(value.items?.type),
                    list: true,
                    properties: value.items?.properties ? fromSchemaProperties(value.items?.properties) : undefined
                }
            }

            return {
                name,
                type: stringType,
                list: stringType.endsWith('[]'),
                properties: value.properties ? fromSchemaProperties(value.properties) : undefined
            }
        });
    }

    export function toSchemaProperties(properties:DSLDataTypeProperty[]):SchemaProperties {
        const out = {};

        properties.forEach(property => {

            const type = toSchemaType(property.type);

            if (property.list) {
                out[property.name] = {
                    type: 'array',
                    items: {
                        type,
                        properties: property.properties ? toSchemaProperties(property.properties) : null
                    }
                }
            } else {
                out[property.name] = {
                    type,
                    properties: property.properties ? toSchemaProperties(property.properties) : null
                }
            }

        })

        return out;
    }

    export function fromSchemaTransport(transport:string) {
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

        throw new Error('Unknown schema transport: ' + transport);
    }

    export function fromSchemaMethods(methods: SchemaMethods):DSLMethod[] {
        return Object.entries(methods).map(([name, method]) => {

            return {
                name,
                returnType: fromSchemaType(method.responseType),
                type: DSLEntityType.METHOD,
                description: method.description,
                parameters: method.arguments ? Object.entries(method.arguments).map(([name, arg]) => {
                    return {
                        name,
                        type: fromSchemaType(arg.type),
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
                        arguments: [ method.path ]
                    }
                ]
            }
        });
    }

    export function toSchemaMethods(methods:DSLMethod[]):SchemaMethods {
        const out:SchemaMethods = {}

        methods.forEach(method => {

            const args = {};
            method.parameters.forEach((arg) => {
                args[arg.name] = {
                    type: toSchemaType(arg.type),
                    transport: arg.annotations && arg.annotations.length > 0 ? arg.annotations[0].type : HTTPTransport.QUERY
                };
            })

            out[method.name] = {
                responseType: toSchemaType(method.returnType),
                method: (method.annotations ? method?.annotations[0].type?.substring(1).toUpperCase() : 'GET') as HTTPMethod,
                path: (method.annotations && method.annotations[0].arguments ? method?.annotations[0].arguments[0] : '/'),
                description: method.description || '',
                arguments: args
            }
        });

        return out;
    }
}