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

export interface DSLOptions {
    rest?:boolean,
    types?: boolean,
    methods?: boolean,
    validTypes?: string[]
}

export interface DSLLanguageOptions extends DSLOptions{
    parameterAnnotations?: string[],
    methodAnnotations?: string[],
    typeAnnotations?: string[],
    fieldAnnotations?: string[],
    builtInTypes?: string[]
}