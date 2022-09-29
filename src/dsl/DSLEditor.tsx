import React, {useState} from "react"

import './DSLEditor.less';

import Monaco from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {DSLOptions, LANGUAGE_ID} from "./types";

import './DSLLanguage';
import {DSLValidator} from "./DSLValidator";

export interface DSLEditorProps extends DSLOptions {
    value?: string
    readOnly?:boolean
}

export const DSLEditor = (props: DSLEditorProps) => {

    const [current, setCurrent] = useState(props.value);

    const options:monaco.editor.IStandaloneEditorConstructionOptions = {
        lineNumbersMinChars: 3,
        folding: true,
        roundedSelection: false,
        lineDecorationsWidth: 5,
        wordWrap: 'off',
        wordWrapColumn: 120,
        scrollBeyondLastLine: false,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        minimap: {
            enabled: false
        },
        contextmenu: true,
        readOnly: props.readOnly
    };

    return (
        <div className={'dsl-editor'}>
            <Monaco
                options={options}
                value={current}
                onChange={(value) => setCurrent(value)}
                language={LANGUAGE_ID}

                onMount={(editor, m) => {
                    //Syntax and semantic validation
                    const validator = new DSLValidator(m.editor, {
                        methods: props.methods,
                        rest: props.rest,
                        types: props.types,
                        validTypes: props.validTypes
                    });

                    validator.bind(editor.getModel());
                }}

            />
        </div>
    )
}