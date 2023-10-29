/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { editor, MarkerSeverity } from 'monaco-editor';
import { DSLParser } from './DSLParser';
import { DSL_LANGUAGE_ID, DSLLanguageOptions } from './types';

type ITextModel = editor.ITextModel;
type Editor = typeof editor;

export class DSLValidator {
    private readonly editor: Editor;
    private readonly options: DSLLanguageOptions;

    constructor(editor: Editor, options: DSLLanguageOptions) {
        this.editor = editor;
        this.options = options;
    }

    static validateCode(options: DSLLanguageOptions, code: string) {
        let errors = [];
        try {
            DSLParser.parse(code, {
                ...options,
                softErrorHandler: (error) => {
                    let severity: MarkerSeverity = MarkerSeverity.Error;
                    switch (error.type) {
                        case 'warning':
                            severity = MarkerSeverity.Warning;
                            break;
                        case 'hint':
                            severity = MarkerSeverity.Hint;
                            break;
                        case 'info':
                            severity = MarkerSeverity.Info;
                            break;
                    }
                    delete error.type;
                    errors.push({
                        code: '2',
                        severity,
                        ...error,
                    });
                },
            });
        } catch (ex) {
            if (!ex.location) {
                throw ex;
            }
            errors.push({
                code: '2',
                severity: MarkerSeverity.Error,
                endColumn: ex.location.end.column,
                endLineNumber: ex.location.end.line,
                message: ex.message,
                startColumn: ex.location.start.column,
                startLineNumber: ex.location.start.line,
            });
        }

        return errors;
    }

    validate(model: ITextModel) {
        const code = model.getValue();

        const errors = DSLValidator.validateCode(this.options, code);

        this.editor.setModelMarkers(model, DSL_LANGUAGE_ID, errors);
    }

    bind(model) {
        let validationHandle;

        //Syntax and semantic validation

        model.onDidChangeContent(() => {
            // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
            // otherwise if the user is still typing, we cancel the
            clearTimeout(validationHandle);
            validationHandle = setTimeout(() => this.validate(model), 200);
        });
        this.validate(model);
    }
}
