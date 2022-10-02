import {LANGUAGE_ID} from "./types";

export const DSL_LANGUAGE_ID = LANGUAGE_ID

export interface DSLAnnotation {
    arguments?:string[]
    type:string
}

export interface DSLTypeComplex {
    name:string,
    list?:boolean
}

export type DSLType = DSLTypeComplex|string

export interface DSLDataTypeProperty {
    type:DSLType,
    name:string
    properties?:DSLDataTypeProperty[]
    annotations?:DSLAnnotation[]
    description?:string
}

export interface DSLParameter {
    name:string
    type:DSLType
    annotations?:DSLAnnotation[]
}

export enum DSLEntityType {
    DATATYPE = 'datatype',
    METHOD = 'method',
    COMMENT = 'comment',
}

export interface DSLEntity {
    type:DSLEntityType
}

export interface DSLRichEntity extends DSLEntity {
    name:string
    annotations?:DSLAnnotation[]
    description?:string
}

export interface DSLDataType extends DSLRichEntity {
    properties:DSLDataTypeProperty[]
}

export interface DSLMethod extends DSLRichEntity {
    returnType:DSLType
    parameters:DSLParameter[]
}

export interface DSLComment extends DSLEntity {
    text:string
}

export interface DSLResult {
    code:string
    errors?: [],
    entities?: DSLEntity[]
}

export interface DSLOptions {
    rest?:boolean
    types?: boolean
    methods?: boolean
    validTypes?: string[]
    ignoreSemantics?: boolean
}

export interface DSLLanguageOptions extends DSLOptions {
    parameterAnnotations?: string[]
    methodAnnotations?: string[]
    typeAnnotations?: string[]
    fieldAnnotations?: string[]
}


export function toStandardType(type:DSLType) {
    if (typeof type === 'string') {
        return {
            name: type,
            list: false
        }
    } else {
        return type;
    }
}