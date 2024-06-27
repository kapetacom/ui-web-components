/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';

import './DSLEditor.less';

import Monaco from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import './DSLLanguage';
import { DSLValidator } from './DSLValidator';

import { withAdditionalTypes } from './DSLLanguage';
import { DSLLanguageOptions, DSLParser, DSLParserOptions, DSLResult, KaplangWriter } from '@kapeta/kaplang-core';
import { DSL_LANGUAGE_ID } from './types';
import { Box, BoxProps, useTheme } from '@mui/material';

export interface DSLEditorProps extends DSLLanguageOptions {
    value?: DSLResult | string;
    readOnly?: boolean;
    validator?: (object: any) => void;
    onChange?: (structure: DSLResult) => any;
    onCodeChange?: (code: string) => any;
    onError?: (err: any) => any;
    /**
     * Around the DSLEditor there is a wrapping div. This property allows to pass props to this div
     * (MUI Box component)
     */
    wrapperProps?: BoxProps;
}

export const DSLEditor = (props: DSLEditorProps) => {
    const [current, setCurrent] = useState(() => {
        let value: string;
        const result = props.value as DSLResult;
        if (typeof result === 'object') {
            value = result.code ? result.code : KaplangWriter.write(result.entities || []);
        } else {
            value = props.value as string;
        }

        return value;
    });

    const options: editor.IStandaloneEditorConstructionOptions = {
        lineNumbersMinChars: 3,
        folding: true,
        roundedSelection: false,
        automaticLayout: true,
        lineDecorationsWidth: 5,
        wordWrap: 'off',
        wordWrapColumn: 120,
        scrollBeyondLastLine: false,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        minimap: {
            enabled: false,
        },
        contextmenu: true,
        readOnly: props.readOnly,
    };

    const parsingOptions: DSLParserOptions = {
        methods: props.methods,
        rest: props.rest,
        types: props.types,
        validTypes: props.validTypes,
        validator: props.validator,
        fieldAnnotations: props.fieldAnnotations,
        methodAnnotations: props.methodAnnotations,
        ignoreSemantics: props.ignoreSemantics,
        parameterAnnotations: props.parameterAnnotations,
        typeAnnotations: props.typeAnnotations,
        typeFilter: props.typeFilter,
        entitiesType: props.entitiesType,
    };

    const isDarkMode = useTheme().palette.mode === 'dark';

    return (
        <Box className={'dsl-editor'} {...props.wrapperProps}>
            <Monaco
                theme={isDarkMode ? 'vs-dark' : 'light'}
                options={options}
                value={current}
                onChange={(code) => {
                    setCurrent(code || '');
                    if (props.onCodeChange) {
                        props.onCodeChange(code || '');
                    }
                    if (props.onChange) {
                        try {
                            props.onChange(
                                code
                                    ? DSLParser.parse(code, parsingOptions)
                                    : {
                                          code: '',
                                          entities: [],
                                      }
                            );
                        } catch (e: any) {
                            props.onError && props.onError(e);
                            //Ignore
                        }
                    }
                }}
                language={DSL_LANGUAGE_ID}
                onMount={(editor, m) => {
                    //Syntax and semantic validation
                    const validator = new DSLValidator(m.editor, parsingOptions);
                    const model = editor.getModel();
                    if (model) {
                        validator.bind(model);

                        if (props.validTypes && props.validTypes.length > 0) {
                            withAdditionalTypes(model, props.validTypes);
                        } else {
                            withAdditionalTypes(model, []);
                        }
                    }
                }}
            />
        </Box>
    );
};
