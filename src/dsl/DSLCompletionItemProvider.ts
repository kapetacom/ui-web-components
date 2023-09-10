import { IDisposable, Position, CancellationToken, languages, editor } from 'monaco-editor';
import { BUILT_IN_TYPES, CONFIG_FIELD_ANNOTATIONS, METHOD_ANNOTATIONS, PARAMETER_ANNOTATIONS } from './types';
import { TokenParser } from './TokenParser';

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
        let tokens = [];
        const code = model.getValue();

        const additionalTypes = this._additionalTypes[model.id] || [];

        try {
            tokens = TokenParser.parse(code);
        } catch (ex) {
            //Ignore
        }
        const dataTypeNames: string[] = tokens.filter((t) => 'datatype_name' === t.type).map((t) => t.value);

        const enumNames: string[] = tokens.filter((t) => 'enum_name' === t.type).map((t) => t.value);

        let suggestions: languages.CompletionItem[] = [];

        const TYPES = [...BUILT_IN_TYPES.map((t) => t.name), ...dataTypeNames, ...additionalTypes];

        const typeChoice = TYPES.join(',');

        const methodAnnotationChoice = METHOD_ANNOTATIONS.map((a) => a.name.substring(1)).join(',');

        suggestions.push(
            {
                label: '# Insert: Function',
                kind: languages.CompletionItemKind.Function,
                documentation: 'Insert function',
                insertText: '${1:name}( $0 ):${2|' + typeChoice + '|}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,
            },

            {
                label: '# Insert: REST method',
                kind: languages.CompletionItemKind.Function,
                documentation: 'Insert REST method',
                insertText:
                    '@${1|' + methodAnnotationChoice + "|}('/${2:path}')\n${3:name}( $0 ):${4|" + typeChoice + '|}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,
            },
            {
                label: '# Insert: Data type',
                kind: languages.CompletionItemKind.Struct,
                documentation: 'Insert data type',
                insertText: '${1:name} {\n\t$0\n}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,
            },
            {
                label: '# Insert: Enum type',
                kind: languages.CompletionItemKind.Enum,
                documentation: 'Insert enum type',
                insertText: 'enum ${1:name} {\n\t$0\n}',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,
            },
            {
                label: '# Insert: Variable',
                kind: languages.CompletionItemKind.Variable,
                insertText: '${1:name}:${2|' + typeChoice + '|}',
                documentation: 'Insert variable with type',
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: null,
            }
        );

        //Type
        suggestions.push(
            ...TYPES.map((type) => {
                return {
                    label: type,
                    insertText: type,
                    kind: languages.CompletionItemKind.TypeParameter,
                    range: null,
                };
            })
        );

        suggestions.push(
            ...enumNames.map((type) => {
                return {
                    label: type,
                    insertText: type,
                    kind: languages.CompletionItemKind.Enum,
                    range: null,
                };
            })
        );

        suggestions.push(
            ...METHOD_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate: ' + type,
                    insertText: type + '("/$0")',
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null,
                };
            })
        );

        suggestions.push(
            ...PARAMETER_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate: ' + type.name,
                    insertText: type.name,
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null,
                };
            })
        );

        suggestions.push(
            ...CONFIG_FIELD_ANNOTATIONS.map((type) => {
                return {
                    label: 'Annotate: ' + type.name,
                    insertText: type.name,
                    documentation: type.description,
                    kind: languages.CompletionItemKind.TypeParameter,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: null,
                };
            })
        );

        return {
            suggestions: suggestions,
        };
    }
}
