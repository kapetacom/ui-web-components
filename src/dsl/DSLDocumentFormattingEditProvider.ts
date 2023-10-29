/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { languages, CancellationToken, editor } from 'monaco-editor';
import { DSLParser } from './DSLParser';
import { DSLWriter } from './DSLWriter';

type DocumentFormattingEditProvider = languages.DocumentFormattingEditProvider;
type FormattingOptions = languages.FormattingOptions;
type ITextModel = editor.ITextModel;
type TextEdit = languages.TextEdit;
type ProviderResult<T> = languages.ProviderResult<T>;

export class DSLDocumentFormattingEditProvider implements DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        model: ITextModel,
        options: FormattingOptions,
        token: CancellationToken
    ): ProviderResult<TextEdit[]> {
        let result, formattedCode;

        try {
            result = DSLParser.parse(model.getValue(), {
                types: true,
                rest: true,
                methods: true,
                ignoreSemantics: true,
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
                text: formattedCode,
            },
        ];
    }
}
