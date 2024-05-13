/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { DiffEditor } from '@monaco-editor/react';
import { DSLEntity } from '@kapeta/kaplang-core';
import { DSL_LANGUAGE_ID } from './types';
import { DSLWriter } from '..';

export interface DiffEditorProps {
    entitiesA?: DSLEntity[];
    entitiesB?: DSLEntity[];
    readOnly?: boolean;
}

export const DSLDiffEditor = (props: DiffEditorProps) => {
    const original = DSLWriter.write(props.entitiesA || []);
    const modified = DSLWriter.write(props.entitiesB || []);

    return (
        <DiffEditor
            language={DSL_LANGUAGE_ID}
            original={original}
            modified={modified}
            options={{
                readOnly: !!props.readOnly,
            }}
        />
    );
};
