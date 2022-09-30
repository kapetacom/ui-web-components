import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {BUILT_IN_TYPES, METHOD_ANNOTATIONS, PARAMETER_ANNOTATIONS} from "./types";
import {TokenParser} from "./TokenParser";
import {IDisposable} from "monaco-editor";

type CancellationToken = monaco.CancellationToken;
type Position = monaco.Position;
type CompletionContext = monaco.languages.CompletionContext;
type ITextModel = monaco.editor.ITextModel;

export class DSLCompletionItemProvider implements monaco.languages.CompletionItemProvider {

    private _additionalTypes:{[key:string]:string[]} = {};

    private _listenerDisposables:{[key:string]:IDisposable} = {};

    setAdditionalTypes(model: ITextModel, types:string[]) {

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

    provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken) {

        let tokens = [];
        const code = model.getValue();

        const additionalTypes = this._additionalTypes[model.id] || [];

        console.log('additionalTypes', additionalTypes);

        try {
            tokens = TokenParser.parse(code);
        } catch (ex) {
            //Ignore
        }
        const dataTypeNames:string[] = tokens.filter(t => 'datatype_name' === t.type).map(t => t.value);

        let suggestions:monaco.languages.CompletionItem[] = [];

        const TYPES = [
            ...BUILT_IN_TYPES,
            ...dataTypeNames,
            ...additionalTypes
        ]

        const typeChoice = TYPES.join(',');

        const methodAnnotationChoice = METHOD_ANNOTATIONS.map(a => a.substring(1)).join(',');

        //Type
        suggestions = TYPES.map(type => {
            return {
                label: type,
                insertText: type,
                kind: monaco.languages.CompletionItemKind.TypeParameter,
                range: null
            };
        });

        suggestions.push(...METHOD_ANNOTATIONS.map(type => {
            return {
                label: 'Annotate: ' + type,
                insertText: type + '("/$0")',
                kind: monaco.languages.CompletionItemKind.TypeParameter,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            };
        }));

        suggestions.push(...PARAMETER_ANNOTATIONS.map(type => {
            return {
                label: 'Annotate: ' + type,
                insertText: type,
                kind: monaco.languages.CompletionItemKind.TypeParameter,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            };
        }));

        suggestions.push(
            {
                label: "method",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: "${1:name}( $0 ):${2|" + typeChoice + "|}",
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,

            },

            {
                label: "REST method",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: "@${1|" + methodAnnotationChoice + "|}('/${2:path}')\n${3:name}( $0 ):${4|" + typeChoice + "|}",
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,

            },
            {
                label: "type",
                kind: monaco.languages.CompletionItemKind.Struct,
                insertText: "${1:name} { \n$0\n}",
                commitCharacters: ['\n', '\t'],
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            },
            {
                label: "variable",
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: "${1:name}:${2|" + typeChoice + "|}",
                documentation: 'Insert variable with type',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null
            }
        );

        return {
            suggestions: suggestions
        };
    }

}