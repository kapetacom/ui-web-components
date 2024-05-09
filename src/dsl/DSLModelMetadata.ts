import { editor, languages, Uri, IRange, Selection } from 'monaco-editor';

// @ts-ignore
import { StandaloneCodeEditorService } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditorService.js';

// Monkeypatch the service to be able to load the right model
StandaloneCodeEditorService.prototype.findModel = function (_: editor.IEditor, resource: Uri) {
    return editor.getModel(resource);
};

type EditorInput = {
    resource: Uri;
    options: {
        selectionRevealType: any;
        selectionSource: string;
        selection: IRange;
    };
};

StandaloneCodeEditorService.prototype.doOpenEditor = function (editor: editor.IEditor, input: EditorInput) {
    const model = this.findModel(editor, input.resource);
    if (!model) {
        console.warn('Model not found for', input.resource);
        return;
    }

    editor.setModel(model);
    if (input.options.selection && input.options.selection.startColumn > -1) {
        const position = {
            column: input.options.selection.startColumn,
            lineNumber: input.options.selection.startLineNumber,
        };
        editor.setPosition(position);
        editor.revealPositionNearTop(position);
    }
};
export interface DSLTypeReferenceSourceBlock {
    type: 'block';
}

export interface DSLTypeReferenceSourceResource {
    type: 'resource';
    resourceName: string;
    resourceType: 'consumer' | 'provider';
}

export type DSLTypeReferenceSource = DSLTypeReferenceSourceBlock | DSLTypeReferenceSourceResource;

export enum DSLTypeReferenceType {
    CONFIGURATION,
    DATATYPE,
    METHOD,
    REST_METHOD,
}

export interface DSLTypeReference {
    sourceUri: string;
    lineStart?: number;
    columnStart?: number;
    lineEnd?: number;
    columnEnd?: number;
}

export interface DSLTypeDefinition extends DSLTypeReference {}

export type DSLTypeReferenceMap = { [key: string]: DSLTypeReference[] };

export type DSLTypeDefinitionsMap = { [key: string]: DSLTypeDefinition };

export class DSLModelMetadata {
    public references: DSLTypeReferenceMap = {};

    public definitions: DSLTypeDefinitionsMap = {};

    private viewState: editor.ICodeEditorViewState | null = null;

    private name: string = '';

    public getDefinitionFor(typeName: string): languages.Location | null {
        const definition = this.definitions[typeName];
        if (!definition) {
            return null;
        }
        return {
            uri: Uri.parse(definition.sourceUri),
            range: {
                startLineNumber: definition.lineStart ?? 1,
                startColumn: definition.columnStart ?? 1,
                endLineNumber: definition.lineEnd ?? 1,
                endColumn: definition.columnEnd ?? 1,
            },
        };
    }

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    getReferencesFor(typeName: string): languages.Location[] {
        const ref = this.references[typeName];
        if (!ref) {
            return [];
        }

        return ref.map((r) => {
            return {
                uri: Uri.parse(r.sourceUri),
                range: {
                    startLineNumber: r.lineStart ?? 1,
                    startColumn: r.columnStart ?? 1,
                    endLineNumber: r.lineEnd ?? 1,
                    endColumn: r.columnEnd ?? 1,
                },
            };
        });
    }

    updateDefinitions(innerDefinitions: DSLTypeDefinitionsMap) {
        this.definitions = innerDefinitions;
    }

    updateReferences(innerReferences: DSLTypeReferenceMap) {
        this.references = innerReferences;
    }

    setViewState(viewState: editor.ICodeEditorViewState | null) {
        this.viewState = viewState;
    }

    getViewState() {
        return this.viewState;
    }
}

export class DSLModelMetadataHandler {
    private metadata: { [key: string]: DSLModelMetadata } = {};

    get(model: editor.ITextModel): DSLModelMetadata {
        const key = model.uri.toString();
        if (!this.metadata[key]) {
            if (model.isDisposed()) {
                throw new Error('Attempt to get metadata for disposed model');
            }
            const out = new DSLModelMetadata();
            this.metadata[key] = out;
            model.onWillDispose(() => {
                delete this.metadata[key];
            });
            return out;
        }
        return this.metadata[key];
    }
}

export const ModelMetadatas = new DSLModelMetadataHandler();
