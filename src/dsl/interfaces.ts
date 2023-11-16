/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

export const DSL_LANGUAGE_ID = 'kapeta-dsl';

export interface DSLAnnotation {
    arguments?: string[];
    type: string;
}

export interface DSLTypeComplex {
    name: string;
    generics?: string[];
    list?: boolean;
}

export type DSLType = DSLTypeComplex | string;

export interface DSLDefaultValue {
    type: 'reference' | 'literal' | 'enum';
    value: string | number | boolean | null;
}

export interface PEGLocationCoord {
    offset: number;
    line: number;
    column: number;
}

export interface PEGLocation {
    start: PEGLocationCoord;
    end: PEGLocationCoord;
}

export interface PEGValidationEntity<T = any> {
    type: string;
    location: PEGLocation;
    data: T;
}

export interface DSLDataTypeProperty {
    type: DSLType;
    name: string;
    defaultValue?: DSLDefaultValue | null;
    properties?: DSLDataTypeProperty[];
    annotations?: DSLAnnotation[];
    description?: string;
}

export interface DSLParameter {
    name: string;
    type: DSLType;
    annotations?: DSLAnnotation[];
}

export enum DSLEntityType {
    DATATYPE = 'datatype',
    ENUM = 'enum',
    METHOD = 'method',
    COMMENT = 'comment',
}

export interface DSLEntityBase {
    type: DSLEntityType;
}

export interface DSLRichEntity extends DSLEntityBase {
    name: string;
    annotations?: DSLAnnotation[];
    description?: string;
}

export interface DSLEnum extends DSLRichEntity {
    type: DSLEntityType.ENUM;
    values: string[];
}

export interface DSLDataType extends DSLRichEntity {
    type: DSLEntityType.DATATYPE;
    properties: DSLDataTypeProperty[];
}

export interface DSLMethod extends DSLRichEntity {
    type: DSLEntityType.METHOD;
    returnType: DSLType;
    parameters?: DSLParameter[];
}

export interface DSLComment extends DSLEntityBase {
    type: DSLEntityType.COMMENT;
    text: string;
}

export type DSLEntity = DSLEnum | DSLDataType | DSLMethod | DSLComment;

export interface DSLResult {
    code: string;
    errors?: [];
    entities?: DSLEntity[];
}

export interface DSLOptions {
    rest?: boolean;
    types?: boolean;
    methods?: boolean;
    validTypes?: string[];
    stringableTypes?: string[];
    ignoreSemantics?: boolean;
}

export interface DSLLanguageOptions extends DSLOptions {
    parameterAnnotations?: string[];
    methodAnnotations?: string[];
    typeAnnotations?: string[];
    fieldAnnotations?: string[];
}

export function toStandardType(type: DSLType) {
    if (typeof type === 'string') {
        return {
            name: type,
            generics: [],
            list: false,
        };
    } else {
        return type;
    }
}
