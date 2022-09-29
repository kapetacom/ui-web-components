import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {DSLParser} from "./DSLParser";
import {DSLLanguageOptions, LANGUAGE_ID} from "./types";

type ITextModel = monaco.editor.ITextModel;
type Editor = typeof monaco.editor;

export class DSLValidator {
    private readonly editor: Editor;
    private readonly options: DSLLanguageOptions;

    constructor(editor: Editor, options:DSLLanguageOptions) {
        this.editor = editor;
        this.options = options;
    }

    validate(model:ITextModel) {
        const code = model.getValue();
        let errors = [];
        try {
            DSLParser.parse(code, {
                ...this.options
            });
        } catch (ex) {
            if (!ex.location) {
                throw ex;
            }
            errors.push({
                code: '2',
                severity: monaco.MarkerSeverity.Error,
                endColumn: ex.location.end.column,
                endLineNumber: ex.location.end.line,
                message: ex.message,
                startColumn: ex.location.start.column,
                startLineNumber: ex.location.start.line
            })
        }

        this.editor.setModelMarkers(model, LANGUAGE_ID, errors);
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