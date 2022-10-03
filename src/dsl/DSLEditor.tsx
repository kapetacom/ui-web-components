import React, {useState} from "react"

import './DSLEditor.less';

import Monaco from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
    DSLOptions,
    DSLResult,
    LANGUAGE_ID
} from "./types";

import './DSLLanguage';
import {DSLValidator} from "./DSLValidator";
import {DSLParser, DSLParserOptions} from "./DSLParser";
import {DSLWriter} from "./DSLWriter";
import {withAdditionalTypes} from "./DSLLanguage";
import {restPathVariableValidator} from "./helpers/restPathVariableValidator";

export interface DSLEditorProps extends DSLOptions {
    value?: DSLResult|string
    readOnly?:boolean
    onChange?: (structure:DSLResult) => any
}

export const DSLEditor = (props: DSLEditorProps) => {

    const [current, setCurrent] = useState(() => {
        let value:string;
        const result = props.value as DSLResult;
        if (typeof result === 'object') {
            value = result.code ? result.code : DSLWriter.write(result.entities);
        } else {
            value = props.value as string;
        }

        return value;
    });

    const options:monaco.editor.IStandaloneEditorConstructionOptions = {
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
            enabled: false
        },
        contextmenu: true,
        readOnly: props.readOnly
    };

    const parsingOptions:DSLParserOptions = {
        methods: props.methods,
        rest: props.rest,
        types: props.types,
        validTypes: props.validTypes,
        validator: props.rest ? restPathVariableValidator : null
    };

    return (
        <div className={'dsl-editor'}>
            <Monaco
                options={options}
                value={current}
                onChange={(code) => {
                    setCurrent(code);
                    if (props.onChange) {
                        try {
                            props.onChange(DSLParser.parse(code, parsingOptions));
                        } catch (e) {
                            //Ignore
                        }
                    }
                }}
                language={LANGUAGE_ID}

                onMount={(editor, m) => {
                    //Syntax and semantic validation
                    const validator = new DSLValidator(m.editor, parsingOptions);
                    validator.bind(editor.getModel());

                    if (props.validTypes && props.validTypes.length > 0) {
                        withAdditionalTypes(editor.getModel(), props.validTypes);
                    } else {
                        withAdditionalTypes(editor.getModel(), []);
                    }
                }}

            />
        </div>
    )
}