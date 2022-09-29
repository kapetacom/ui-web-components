import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import loader from '@monaco-editor/loader';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;
import {BUILT_IN_TYPES, LANGUAGE_ID} from "./types";
import {DSLCompletionItemProvider} from "./DSLCompletionItemProvider";
import {DSLValidator} from "./DSLValidator";
import {DSLDocumentFormattingEditProvider} from "./DSLDocumentFormattingEditProvider";

const configuration: IRichLanguageConfiguration = {
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],
    autoClosingPairs: [
        {open: '{', close: '}'},
        {open: '[', close: ']'},
        {open: '(', close: ')'},
        {open: '"', close: '"'},
        {open: "'", close: "'"}
    ],
    surroundingPairs: [
        {open: '{', close: '}'},
        {open: '[', close: ']'},
        {open: '(', close: ')'},
        {open: '"', close: '"'},
        {open: "'", close: "'"},
        {open: '<', close: '>'}
    ],
};

const monarch: ILanguage = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',


    keywords: [],
    operators: [],
    typeKeywords: BUILT_IN_TYPES,

    symbols: /[=><!~?:&,|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            //@Annotation
            [/@[a-zA-Z_][\w$]*/, 'annotation'],

            //:type
            [/(:)(\s*)([a-zA-Z_][\w$]*)/, [
                {token: 'colon'},
                {token: 'whitespace'},
                {
                    cases: {
                        '@keywords': {token: 'keyword'},
                        '@default': 'type'
                    }
                }]
            ],

            //Method name
            [/([a-zA-Z_][\w$]*)(?=\s*\()/, 'entity'],

            //Data Type name
            [/([a-zA-Z_][\w$]*)(?=\s*\{)/, 'entity'],

            //Variable name:
            [/[a-zA-Z_][\w$]*(?=\s*:)/, 'variable.name'],

            {include: '@identifier'},

            {include: '@whitespace'},

            {include: '@comment'},

            {include: '@number'},

            {include: '@string'},

            {include: '@symbols_brackets'},
        ],

        symbols_brackets: [
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [
                /@symbols/,
                {
                    cases: {
                        '@operators': 'delimiter',
                        '@default': ''
                    }
                }
            ]
        ],

        whitespace: [
            [/[ \t\r\n]+/, '']
        ],

        comment: [
            [/\/\/.*$/, 'comment'],
            [/#.*$/, 'comment']
        ],

        identifier: [
            [/[a-zA-Z_][\w$]*/, {
                cases: {
                    '@keywords': {token: 'keyword'},
                    '@typeKeywords': {token: 'type'},
                    '@default': 'identifier'
                }
            }]
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
            [/'/, 'string', '@string_single']
        ],

        string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ]
    },
}

loader.init().then((monaco) => {
    const languages = monaco.languages;
    languages.register({id: LANGUAGE_ID});
        languages.onLanguage(LANGUAGE_ID, () => {

        //Tokens and language configuration
        languages.setMonarchTokensProvider(LANGUAGE_ID, monarch);
        languages.setLanguageConfiguration(LANGUAGE_ID, configuration);

        //Auto-formatting:
        languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, new DSLDocumentFormattingEditProvider());

        //Auto-complete:
        languages.registerCompletionItemProvider(LANGUAGE_ID, new DSLCompletionItemProvider());


    });
})

export const DSL_LANGUAGE_ID = LANGUAGE_ID;