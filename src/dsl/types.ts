export const LANGUAGE_ID = 'blockware-dsl';

export const BUILT_IN_TYPES = [
    'void',
    'integer',
    'double',
    'float',
    'long',
    'char',
    'byte',
    'string',
    'boolean',
    'date'
]

export const METHOD_ANNOTATIONS = [
    '@GET',
    '@POST',
    '@PUT',
    '@PATCH',
    '@DELETE',
    '@HEAD'
]

export const PARAMETER_ANNOTATIONS = [
    '@Path',
    '@Header',
    '@Query',
    '@Body'
]

export const BUILT_IN_ANNOTATIONS = [
    ...METHOD_ANNOTATIONS,
    ...PARAMETER_ANNOTATIONS
]

export interface DSLAnnotation {
    arguments:string[]
    type:string
}

export interface DSLDataTypeProperty {
    type:string,
    name:string
    annotations:DSLAnnotation[]
    description:string
    list:boolean
    properties?:DSLDataTypeProperty[]
}

export interface DSLParameter {
    annotations:DSLAnnotation[]
    name:string
    type:string
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
    annotations:DSLAnnotation[]
    name:string
    description:string
}

export interface DSLDataType extends DSLRichEntity {
    properties:DSLDataTypeProperty[]
}

export interface DSLMethod extends DSLRichEntity {
    returnType:string
    parameters:DSLParameter[]
}

export interface DSLComment extends DSLEntity {
    text:string
}

export interface DSLResult {
    code:string
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