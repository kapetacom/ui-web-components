/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { IDisposable, Position, CancellationToken, languages, editor } from 'monaco-editor';
import {
    TokenParser,
    BUILT_IN_TYPES,
    CONFIG_FIELD_ANNOTATIONS,
    METHOD_ANNOTATIONS,
    PARAMETER_ANNOTATIONS,
} from '@kapeta/kaplang-core';
import { DSLConverters } from './DSLConverters';

type CompletionContext = languages.CompletionContext;
type ITextModel = editor.ITextModel;

export class DSLCompletionItemProvider implements languages.CompletionItemProvider {
    private _additionalTypes: { [key: string]: string[] } = {};

    private _listenerDisposables: { [key: string]: IDisposable } = {};

    setAdditionalTypes(model: ITextModel, types: string[]) {
        if (this._listenerDisposables[model.id]) {
            this._listenerDisposables[model.id].dispose();
            delete this._listenerDisposables[model.id];
        }

        if (types.length < 1) {
            delete this._additionalTypes[model.id];
            return;
        }

        this._additionalTypes[model.id] = types;
        this._listenerDisposables[model.id] = model.onWillDispose(() => {
            delete this._additionalTypes[model.id];
        });
    }

    provideCompletionItems(
        model: ITextModel,
        position: Position,
        context: CompletionContext,
        token: CancellationToken
    ) {
        let tokens: { type: string; value: string }[] = [];
        const code = model.getValue();

        const additionalTypes = this._additionalTypes[model.id] || [];

        try {
            tokens = TokenParser.parse(code);
        } catch (ex) {
            //Ignore
        }
        const dataTypeNames: string[] = tokens.filter((t) => 'datatype_name' === t.type).map((t) => t.value);

        const enumNames: string[] = tokens.filter((t) => 'enum_name' === t.type).map((t) => t.value);

        // TODO: These completions seem to work without range, so we're casting ranges to any
        let suggestions: languages.CompletionItem[] = [];

        const TYPES = [...BUILT_IN_TYPES.map((t) => t.name), ...dataTypeNames, ...additionalTypes];

        const typeChoice = TYPES.join(',');

        const methodAnnotationChoice = METHOD_ANNOTATIONS.map((a) => a.name.substring(1)).join(',');

        suggestions.push(
            ...['type', 'enum', 'extends'].map((keyword) => ({
                label: keyword,
                kind: languages.CompletionItemKind.Keyword,
                insertText: keyword,
                insertTextRules: languages.CompletionItemInsertTextRule.None,
                range: null as any,
            }))
        );

        suggestions.push(
            {
                label: '# Insert: Function',
                kind: languages.CompletionItemKind.Function,
                documentation: 'Insert function',
                insertText: '${1:name}( $0 ):${2|' + typeChoice + '|}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null as any,
            },

            {
                label: '# Insert: REST method',
                kind: languages.CompletionItemKind.Function,
                documentation: 'Insert REST method',
                insertText:
                    '@${1|' + methodAnnotationChoice + "|}('/${2:path}')\n${3:name}( $0 ):${4|" + typeChoice + '|}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null as any,
            },
            {
                label: '# Insert: Data type',
                kind: languages.CompletionItemKind.Struct,
                documentation: 'Insert data type',
                insertText: 'type ${1:name} {\n\t$0\n}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null as any,
            },
            {
                label: '# Insert: Enum type',
                kind: languages.CompletionItemKind.Enum,
                documentation: 'Insert enum type',
                insertText: 'enum ${1:name} {\n\t$0\n}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null as any,
            },
            {
                label: '# Insert: Variable',
                kind: languages.CompletionItemKind.Variable,
                insertText: '${1:name}:${2|' + typeChoice + '|}',
                documentation: 'Insert variable with type',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null as any,
            }
        );

        //Type
        suggestions.push(
            ...TYPES.map((type) => {
                const parsedType = DSLConverters.asDSLType(type);
                if (typeof parsedType !== 'string' && parsedType.generics && parsedType.generics?.length > 0) {
                    const argsText = parsedType.generics.map((_, ix) => {
                        return `$\{${ix + 1}|${typeChoice}|}`;
                    });
                    const text = parsedType.name + '<' + argsText.join(',') + '>';
                    return {
                        label: parsedType.name,
                        kind: languages.CompletionItemKind.TypeParameter,
                        insertText: text,
                        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: null as any,
                    };
                }
                return {
                    label: type,
                    insertText: type,
                    kind: languages.CompletionItemKind.TypeParameter,
                    range: null as any,
                };
            })
        );

        suggestions.push(
            ...enumNames.map((type) => {
                return {
                    label: type,
                    insertText: type,
                    kind: languages.CompletionItemKind.Enum,
                    range: null as any,
                };
            })
        );

        suggestions.push(
            ...METHOD_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate method: ' + type.name,
                    insertText: type.name + '("/$0")',
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null as any,
                };
            })
        );

        suggestions.push(
            ...PARAMETER_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate parameter: ' + type.name,
                    insertText: type.name,
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null as any,
                };
            })
        );

        suggestions.push(
            ...CONFIG_FIELD_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate field: ' + type.name,
                    insertText: type.name,
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null as any,
                };
            })
        );

        return {
            suggestions: suggestions,
        };
    }
}
