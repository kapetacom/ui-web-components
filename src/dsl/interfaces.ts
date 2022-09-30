
export interface DSLAnnotation {
    arguments?:string[]
    type:string
}

export interface DSLDataTypeProperty {
    type:string,
    name:string
    properties?:DSLDataTypeProperty[]
    annotations?:DSLAnnotation[]
    description?:string
    list?:boolean
}

export interface DSLParameter {
    name:string
    type:string
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
    returnType:string
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