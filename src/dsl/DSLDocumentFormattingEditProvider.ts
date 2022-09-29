import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {DSLParser} from "./DSLParser";
import {DSLWriter} from "./DSLWriter";

type DocumentFormattingEditProvider = monaco.languages.DocumentFormattingEditProvider;
type CancellationToken = monaco.CancellationToken;
type FormattingOptions = monaco.languages.FormattingOptions;
type ITextModel = monaco.editor.ITextModel;
type TextEdit = monaco.languages.TextEdit;
type ProviderResult<T> = monaco.languages.ProviderResult<T>;

export class DSLDocumentFormattingEditProvider implements DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        model: ITextModel,
        options: FormattingOptions,
        token: CancellationToken): ProviderResult<TextEdit[]> {
        let result,formattedCode;

        try {
            result = DSLParser.parse(model.getValue(), {
                types: true,
                rest: true,
                methods: true,
                ignoreSemantics: true
            });
            formattedCode = DSLWriter.write(result.entities);
        } catch (e) {
            console.warn('Failed to parse while formatting', e);
            //Ignore this
            return;
        }

        return [
            {
                range: model.getFullModelRange(),
                text: formattedCode
            },
        ];
    }

}