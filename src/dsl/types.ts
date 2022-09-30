
export * from './interfaces';

export const LANGUAGE_ID = 'blockware-dsl';

/**
 * Types that can easily be converted to or from strings (E.g. in paths and similar)
 */
export const STRINGABLE_TYPES = [
    'integer',
    'double',
    'float',
    'long',
    'string'
]


export const BUILT_IN_TYPES = [
    ...STRINGABLE_TYPES,
    'char',
    'byte',
    'boolean',
    'date',
    'void'
]

export const REST_METHOD_ANNOTATIONS = [
    '@GET',
    '@POST',
    '@PUT',
    '@PATCH',
    '@DELETE',
    '@HEAD'
]

export const METHOD_ANNOTATIONS = [
    ...REST_METHOD_ANNOTATIONS
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