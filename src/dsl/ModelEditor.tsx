/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    DATATYPE_CONFIGURATION,
    DataTypeReader,
    DSLEntityType,
    DSLLanguageOptions,
    DSLParser,
    DSLParserOptions,
    DSLResult,
    METHOD_CONFIGURATION,
    RESTControllerReader,
    RESTMethodReader,
    restPathVariableValidator,
} from '@kapeta/kaplang-core';
import { editor, IDisposable, Range, Uri } from 'monaco-editor';
import { DSL_LANGUAGE_ID } from './types';
import * as monaco from 'monaco-editor';
import { DSLTypeDefinitionsMap, DSLTypeReference, DSLTypeReferenceMap, ModelMetadatas } from './DSLModelMetadata';
import { Box, Button, ButtonGroup } from '@mui/material';
import Monaco from '@monaco-editor/react';
import _ from 'lodash';
import { TypeInfo } from '../../../../../kaplang/src/readers';
import { withAdditionalTypes } from './DSLLanguage';
import { DSLValidator } from './DSLValidator';
import { noFileTypeFilter } from './validators';

export enum ModelValueType {
    REST = 'rest',
    ENTITIES = 'entities',
}

export interface ModelValue {
    type: ModelValueType;
    name: string;
    code: string;
}

export interface ModelValueResult extends ModelValue {
    result: DSLResult;
}

interface InternalBasicModel extends ModelValue {
    editorModel: editor.ITextModel;
}

interface InternalModel extends ModelValueResult {
    editorModel: editor.ITextModel;
}

function updateReferenceDecorators(
    editorInstance: editor.IStandaloneCodeEditor,
    decorations: editor.IEditorDecorationsCollection,
    references: DSLTypeReferenceMap | undefined,
    definitions: DSLTypeDefinitionsMap | undefined
) {
    const model = editorInstance.getModel();
    if (!model) {
        return;
    }
    const innerReferences: DSLTypeReferenceMap = {
        ...(references ? _.cloneDeep(references) : {}),
    };
    const innerDefinitions: DSLTypeDefinitionsMap = {
        ...(definitions ? _.cloneDeep(definitions) : {}),
    };
    const newDecorations: editor.IModelDeltaDecoration[] = [];
    let tokens: DSLResult;
    try {
        tokens = DSLParser.parse(model.getValue(), {
            types: true,
            methods: true,
            rest: true,
            ignoreSemantics: true,
        });
    } catch (e) {
        // Ignore - invalid syntax
        return;
    }

    if (tokens.entities) {
        tokens.entities.forEach((entity) => {
            if (entity.type === DSLEntityType.ENUM) {
                innerDefinitions[entity.name] = {
                    sourceUri: model.uri.toString(),
                    columnEnd: entity.location?.end.column,
                    columnStart: entity.location?.start.column,
                    lineEnd: entity.location?.end.line,
                    lineStart: entity.location?.start.line,
                };
                return;
            }
            if (entity.type === DSLEntityType.DATATYPE) {
                innerDefinitions[entity.name] = {
                    sourceUri: model.uri.toString(),
                    columnEnd: entity.location?.end.column,
                    columnStart: entity.location?.start.column,
                    lineEnd: entity.location?.end.line,
                    lineStart: entity.location?.start.line,
                };
                const dataType = new DataTypeReader(entity);
                const typeRefs = dataType.getReferences();
                typeRefs.forEach((ref) => {
                    if (ref.builtIn) {
                        return;
                    }
                    if (!innerReferences[ref.name]) {
                        innerReferences[ref.name] = [];
                    }

                    innerReferences[ref.name].push({
                        sourceUri: model.uri.toString(),
                        columnEnd: entity.location?.end.column,
                        columnStart: entity.location?.start.column,
                        lineEnd: entity.location?.end.line,
                        lineStart: entity.location?.start.line,
                    });
                });
            }
        });
        // Check each entity to see if its in use
        tokens.entities.forEach((entity) => {
            let name = '';
            switch (entity.type) {
                case DSLEntityType.ENUM:
                    name = entity.name;
                    break;
                case DSLEntityType.DATATYPE:
                    name = entity.name;
                    break;
            }

            if (!name || innerReferences[name]) {
                return;
            }

            const firstOccurrence = findFirstOccurrence(model, name);
            if (firstOccurrence) {
                newDecorations.push({
                    range: new Range(
                        firstOccurrence.line,
                        firstOccurrence.start,
                        firstOccurrence.line,
                        firstOccurrence.end
                    ),
                    options: {
                        inlineClassName: 'unused',
                        hoverMessage: {
                            value: `${name} is not in use`,
                        },
                    },
                });
            }
        });
    }
    ModelMetadatas.get(model).updateReferences(innerReferences);
    ModelMetadatas.get(model).updateDefinitions(innerDefinitions);
    // Update decorations
    decorations.set(newDecorations);
}

function findFirstOccurrence(model: editor.ITextModel, word: string) {
    for (let i = 0; i < model.getLineCount(); i++) {
        let line = model.getLineContent(i + 1);
        let index = line.indexOf(word);
        if (index >= 0) {
            return { line: i + 1, start: index + 1, end: index + word.length + 1 };
        }
    }
    return null;
}

export function createUri(model: ModelValue) {
    return Uri.parse(
        model.type +
            '://kaplang/' +
            model.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9_]+/gi, '_') +
            '#' +
            encodeURIComponent(model.name)
    );
}

function getTypeFromModel(model: editor.ITextModel): ModelValueType {
    return model.uri.scheme as ModelValueType;
}

export interface ModelEditorProps {
    readOnly?: boolean;
    models: ModelValue[];
    onChange: (model: ModelValueResult) => void;
    onError?: (err: any) => any;
}

const PARSING_OPTIONS = {
    [ModelValueType.REST]: {
        ...METHOD_CONFIGURATION,
        rest: true,
        typeFilter: noFileTypeFilter,
    },
    [ModelValueType.ENTITIES]: {
        ...DATATYPE_CONFIGURATION,
        extends: true,
        generics: true,
        methods: false,
        rest: false,
        typeFilter: noFileTypeFilter,
    },
};

const PARSING_CACHE: { [key: string]: { code: string; result: DSLResult } } = {};

function parseModel(model: InternalBasicModel) {
    const parsingOptions = PARSING_OPTIONS[model.type];
    const uri = createUri(model).toString();
    const code = model.editorModel.getValue();
    if (PARSING_CACHE[uri] && PARSING_CACHE[uri].code === code) {
        return PARSING_CACHE[uri].result;
    }

    PARSING_CACHE[uri] = {
        code,
        result: code
            ? DSLParser.parse(code, {
                  ...parsingOptions,
                  ignoreSemantics: true,
              })
            : { code: '', entities: [] },
    };

    return PARSING_CACHE[uri].result;
}

function ensureModel(uri: Uri, code: string) {
    let model = editor.getModel(uri);
    if (!model || model.isDisposed()) {
        model = editor.createModel(code, DSL_LANGUAGE_ID, uri);
    }

    return model;
}

export const ModelEditor = (props: ModelEditorProps) => {
    const [monacoEditor, setMonacoEditor] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);
    const [currentModelIndex, setCurrentModelIndex] = useState(0);

    const basicModels = useMemo<InternalBasicModel[]>(() => {
        return props.models.map((model) => {
            const uri = createUri(model);
            const editorModel = ensureModel(uri, model.code);

            return {
                ...model,
                editorModel,
            };
        });
    }, [props.models]);

    useEffect(() => {
        return () => {
            basicModels.forEach((model) => {
                model.editorModel.dispose();
            });
        };
    }, [basicModels]);

    const parsedModels = useMemo<InternalModel[]>(() => {
        return basicModels.map((m) => {
            return {
                ...m,
                result: parseModel(m),
            };
        });
    }, [basicModels, currentModelIndex]);

    const { references, definitions, validTypes } = useMemo(() => {
        const references: DSLTypeReferenceMap = {};
        const definitions: DSLTypeDefinitionsMap = {};
        const validTypes = new Set<string>();
        parsedModels.forEach((model) => {
            if (model.result.entities) {
                model.result.entities.forEach((entity) => {
                    const refAdder = (ref: TypeInfo) => {
                        if (ref.builtIn) {
                            return;
                        }
                        if (!references[ref.name]) {
                            references[ref.name] = [];
                        }

                        references[ref.name].push({
                            sourceUri: createUri(model).toString(),
                            columnEnd: entity.location?.end.column,
                            columnStart: entity.location?.start.column,
                            lineEnd: entity.location?.end.line,
                            lineStart: entity.location?.start.line,
                        });
                    };

                    if (entity.type === DSLEntityType.DATATYPE) {
                        validTypes.add(entity.name);
                        definitions[entity.name] = {
                            sourceUri: createUri(model).toString(),
                            columnEnd: entity.location?.end.column,
                            columnStart: entity.location?.start.column,
                            lineEnd: entity.location?.end.line,
                            lineStart: entity.location?.start.line,
                        };
                        const dataType = new DataTypeReader(entity);
                        const typeRefs = dataType.getReferences();
                        typeRefs.forEach(refAdder);
                    }
                    if (entity.type === DSLEntityType.ENUM) {
                        validTypes.add(entity.name);
                        definitions[entity.name] = {
                            sourceUri: createUri(model).toString(),
                            columnEnd: entity.location?.end.column,
                            columnStart: entity.location?.start.column,
                            lineEnd: entity.location?.end.line,
                            lineStart: entity.location?.start.line,
                        };
                    }
                    if (entity.type === DSLEntityType.METHOD) {
                        const restMethod = new RESTMethodReader(entity);
                        const typeRefs = restMethod.getReferences();
                        typeRefs.forEach(refAdder);
                    }
                    if (entity.type === DSLEntityType.CONTROLLER) {
                        const controller = new RESTControllerReader(entity);
                        controller.methods.forEach((method) => {
                            const typeRefs = method.getReferences();
                            typeRefs.forEach((ref) => {
                                if (ref.builtIn) {
                                    return;
                                }
                                if (!references[ref.name]) {
                                    references[ref.name] = [];
                                }

                                const location = method.raw.location;

                                references[ref.name].push({
                                    sourceUri: createUri(model).toString(),
                                    columnEnd: location?.end.column,
                                    columnStart: location?.start.column,
                                    lineEnd: location?.end.line,
                                    lineStart: location?.start.line,
                                });
                            });
                        });
                    }
                });
            }
        });
        return {
            references,
            definitions,
            validTypes: Array.from(validTypes),
        };
    }, [parsedModels]);

    const decorations = useMemo(() => {
        return monacoEditor ? monacoEditor.createDecorationsCollection() : undefined;
    }, [monacoEditor]);

    useEffect(() => {
        if (!monacoEditor) {
            return () => {};
        }
        const updateDecorators = (editorInstance: editor.IStandaloneCodeEditor) => {
            return decorations && updateReferenceDecorators(editorInstance, decorations, references, definitions);
        };

        const disposables: IDisposable[] = [];

        disposables.push(
            monacoEditor.onDidChangeModelContent(() => {
                updateDecorators(monacoEditor);
            })
        );

        disposables.push(
            monacoEditor.onDidChangeModel((evt) => {
                let newModelUri = evt.newModelUrl;
                if (!newModelUri) {
                    return;
                }

                const modelIndex = basicModels.findIndex(
                    (m) => m.editorModel.uri.toString() === newModelUri!.toString()
                );
                if (modelIndex > -1) {
                    setCurrentModelIndex(modelIndex);
                }

                updateDecorators(monacoEditor);
            })
        );

        updateDecorators(monacoEditor);

        return () => {
            disposables.forEach((d) => d.dispose());
        };
    }, [monacoEditor, decorations, references, definitions]);

    const createParsingOptions = useCallback(
        (parsedModel: InternalModel) => {
            const options: DSLParserOptions = {
                ...PARSING_OPTIONS[parsedModel.type],
            };

            if (validTypes && validTypes.length > 0 && parsedModel.type === ModelValueType.REST) {
                options.validTypes = validTypes;
                options.validator = restPathVariableValidator;
                options.typeFilter = noFileTypeFilter;
            }
            return options;
        },
        [validTypes]
    );

    useEffect(() => {
        const disposables = parsedModels.map((model) => {
            return model.editorModel.onDidChangeContent(() => {
                const code = model.editorModel.getValue() ?? '';
                const parsingOptions = createParsingOptions(model);
                try {
                    props.onChange({
                        type: model.type,
                        name: model.name,
                        code,
                        result: code
                            ? DSLParser.parse(code, parsingOptions)
                            : {
                                  code: '',
                                  entities: [],
                              },
                    });
                } catch (e: any) {
                    console.warn('Error parsing code', e);
                    props.onError && props.onError(e);
                    //Ignore
                }
            });
        });

        return () => {
            disposables.forEach((disposable) => disposable.dispose());
        };
    }, [parsedModels, createParsingOptions]);

    useEffect(() => {
        const disposers = parsedModels.map((parsedModel, ix) => {
            const options: DSLParserOptions = createParsingOptions(parsedModel);

            const validator = new DSLValidator(editor, options);

            if (validTypes && validTypes.length > 0) {
                withAdditionalTypes(parsedModel.editorModel, validTypes);
            } else {
                withAdditionalTypes(parsedModel.editorModel, []);
            }

            return validator.bind(parsedModel.editorModel);
        });

        return () => {
            disposers.forEach((disposer) => disposer.dispose());
        };
    }, [parsedModels, validTypes, createParsingOptions]);

    const options: editor.IStandaloneEditorConstructionOptions = useMemo(
        () => ({
            lineNumbersMinChars: 3,
            folding: true,
            roundedSelection: false,
            automaticLayout: true,
            lineDecorationsWidth: 5,
            wordWrap: 'off',
            wordWrapColumn: 120,
            scrollBeyondLastLine: false,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            minimap: {
                enabled: false,
            },
            contextmenu: true,
            readOnly: props.readOnly,
            definitionLinkOpensInPeek: true,
        }),
        [props.readOnly]
    );
    const onMount = useCallback((instance: editor.IStandaloneCodeEditor) => {
        //Syntax and semantic validation
        setMonacoEditor(instance);
    }, []);

    useEffect(() => {
        if (monacoEditor && basicModels.length > 0) {
            monacoEditor.setModel(basicModels[0].editorModel);
        }
    }, [monacoEditor, basicModels]);
    return (
        <Box className={'dsl-editor'}>
            {parsedModels.length > 0 && (
                <ButtonGroup
                    variant="outlined"
                    sx={{
                        mb: 1,
                    }}
                >
                    {parsedModels.map((parsedModel, ix) => {
                        const name = parsedModel.name;

                        return (
                            <Button
                                key={parsedModel.editorModel.uri.toString()}
                                size={'small'}
                                color={'secondary'}
                                variant={currentModelIndex === ix ? 'contained' : 'outlined'}
                                onClick={() => {
                                    setCurrentModelIndex(ix);
                                    monacoEditor?.setModel(parsedModel.editorModel);
                                }}
                            >
                                {name}
                            </Button>
                        );
                    })}
                </ButtonGroup>
            )}
            <Monaco options={options} keepCurrentModel={true} language={DSL_LANGUAGE_ID} onMount={onMount} />
        </Box>
    );
};
