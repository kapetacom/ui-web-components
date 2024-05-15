/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo } from 'react';

import { DiffEditor } from '@monaco-editor/react';
import { DSLEntity } from '@kapeta/kaplang-core';
import { DSL_LANGUAGE_ID } from './types';
import { DSLWriter } from '..';
import { editor } from 'monaco-editor';

export interface DiffEditorProps {
    entitiesA?: DSLEntity[];
    entitiesB?: DSLEntity[];
    readOnly?: boolean;
}

export const DSLDiffEditor = (props: DiffEditorProps) => {
    const original = DSLWriter.write(props.entitiesA || []);
    const modified = DSLWriter.write(props.entitiesB || []);

    const options = useMemo(() => {
        return {
            readOnly: !!props.readOnly,
            lineNumbersMinChars: 3,
            folding: true,
            roundedSelection: false,
            automaticLayout: true,
            lineDecorationsWidth: 5,
            wordWrap: 'off',
            wordWrapColumn: 120,
            scrollBeyondLastLine: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 3,
            overviewRulerBorder: true,
        } satisfies editor.IStandaloneEditorConstructionOptions;
    }, [props.readOnly]);

    return (
        <div className={'dsl-editor'}>
            <DiffEditor language={DSL_LANGUAGE_ID} original={original} modified={modified} options={options} />
        </div>
    );
};
