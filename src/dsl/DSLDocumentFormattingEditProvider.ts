import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

type DocumentFormattingEditProvider = monaco.languages.DocumentFormattingEditProvider;
type CancellationToken = monaco.CancellationToken;
type FormattingOptions = monaco.languages.FormattingOptions;
type ITextModel = monaco.editor.ITextModel;
type TextEdit = monaco.languages.TextEdit;
type ProviderResult<T> = monaco.languages.ProviderResult<T>;

export class DSLDocumentFormattingEditProvider implements DocumentFormattingEditProvider {
    readonly displayName: 'Blockware Code';

    provideDocumentFormattingEdits(
        model: ITextModel,
        options: FormattingOptions,
        token: CancellationToken): ProviderResult<TextEdit[]> {

        return [];
    }

}