/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { languages, editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import loader from '@monaco-editor/loader';
import IRichLanguageConfiguration = languages.LanguageConfiguration;
import ILanguage = languages.IMonarchLanguage;
import { DSLCompletionItemProvider } from './DSLCompletionItemProvider';
import { DSLDocumentFormattingEditProvider } from './DSLDocumentFormattingEditProvider';

import CodeAction = languages.CodeAction;
import { BUILT_IN_TYPES, DSL_LANGUAGE_ID } from '@kapeta/kaplang-core';

const configuration: IRichLanguageConfiguration = {
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
        ['<', '>'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '<', close: '>' },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '<', close: '>' },
    ],
};

const language: ILanguage = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',

    keywords: ['enum', 'true', 'false', 'null', 'type', 'extends', 'controller'],
    operators: [],
    typeKeywords: BUILT_IN_TYPES.map((t) => t.name),

    symbols: /[=><!~?:&,|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            [/\b[A-Z]\b/, 'keyword'],

            //@Annotation
            [/@[a-zA-Z_][\w$]*/, 'annotation'],

            //:type
            [
                /(\??:)(\s*)([a-zA-Z_][\w$]*)/,
                [
                    { token: 'colon' },
                    { token: 'whitespace' },
                    {
                        cases: {
                            '@keywords': { token: 'keyword.$0' },
                            '@default': 'type',
                        },
                    },
                ],
            ],

            //Keywords
            [/\b(true|false|null)\b/, ['keyword']],

            //Enum name
            [/(enum)(\s*)([a-zA-Z_][\w$]+)(?=\s*\{)/, ['keyword', '', 'entity']],

            //Type name
            [/(type)(\s*)([a-zA-Z_][\w$]+)(?=\s*(?:\bextends\b|\{|<))/, ['keyword', '', 'entity']],

            //Enum value
            [/([a-zA-Z_][\w$]*)(\.)([a-zA-Z_][\w$]+)/, ['type', '', 'variable.name']],

            //Method name
            [/([a-zA-Z_][\w$]+)(?=\s*\()/, 'entity'],

            //Data Type name
            [/([a-zA-Z_][\w$]+)(?=\s*\{)/, 'entity'],

            [
                /[A-Z][\w$]+/,
                {
                    cases: {
                        '@keywords': { token: 'keyword.$0' },
                        '@default': 'type',
                    },
                },
            ],

            //Variable name:
            [/[a-zA-Z_][\w$]+(?=\s*\??:)/, 'variable.name'],

            { include: '@identifier' },

            { include: '@whitespace' },

            { include: '@comment' },

            { include: '@number' },

            { include: '@string' },

            { include: '@symbols_brackets' },
        ],

        symbols_brackets: [
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [
                /@symbols/,
                {
                    cases: {
                        '@operators': 'delimiter',
                        '@default': '',
                    },
                },
            ],
        ],

        whitespace: [[/[ \t\r\n]+/, '']],

        comment: [
            [/\/\/.*$/, 'comment'],
            [/#.*$/, 'comment'],
        ],

        identifier: [
            [
                /[a-zA-Z_][\w$]*/,
                {
                    cases: {
                        '@keywords': { token: 'keyword' },
                        '@typeKeywords': { token: 'type' },
                        '@default': 'identifier',
                    },
                },
            ],
        ],

        number: [
            [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
            [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
            [/(@digits)n?/, 'number'],
        ],

        string: [
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],

        string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop'],
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop'],
        ],
    },
};

const completionItemProvider = new DSLCompletionItemProvider();
const documentFormattingEditProvider = new DSLDocumentFormattingEditProvider();

export const withAdditionalTypes = (model: editor.ITextModel, types: string[]) => {
    completionItemProvider.setAdditionalTypes(model, types);
};

loader.config({
    monaco,
});

loader.init().then((monacoInstance) => {
    const languages = monacoInstance.languages;
    languages.register({ id: DSL_LANGUAGE_ID });

    languages.onLanguage(DSL_LANGUAGE_ID, () => {
        //Tokens and language configuration
        languages.setMonarchTokensProvider(DSL_LANGUAGE_ID, language);
        languages.setLanguageConfiguration(DSL_LANGUAGE_ID, configuration);

        //Auto-formatting:
        languages.registerDocumentFormattingEditProvider(DSL_LANGUAGE_ID, documentFormattingEditProvider);

        //Auto-complete:
        languages.registerCompletionItemProvider(DSL_LANGUAGE_ID, completionItemProvider);

        languages.registerCodeActionProvider(DSL_LANGUAGE_ID, {
            provideCodeActions(model, range, context, token): languages.ProviderResult<languages.CodeActionList> {
                const actions: CodeAction[] = context.markers
                    .map((marker): CodeAction | undefined => {
                        const value = model.getValueInRange(marker).trim();
                        const GO_ARRAY_RX = /^\[]([a-z][a-z0-9_]*)$/i;

                        if (GO_ARRAY_RX.test(value)) {
                            const [, name] = GO_ARRAY_RX.exec(value)!;
                            //Go-Style array definition - suggest to replace with DSL-style array definition
                            return {
                                kind: 'quickfix',
                                diagnostics: [marker],
                                title: 'Fix array definition',
                                edit: {
                                    edits: [
                                        {
                                            resource: model.uri,
                                            versionId: model.getVersionId(),
                                            textEdit: {
                                                range: marker,
                                                text: name + '[]',
                                            },
                                        },
                                    ],
                                },
                                isPreferred: true,
                            };
                        }
                    })
                    .filter((action) => action !== undefined) as CodeAction[];

                return {
                    actions,
                    dispose() {},
                };
            },
        });
    });
});
