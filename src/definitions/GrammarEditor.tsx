import React, {useState} from "react"

import './GrammarEditor.less';

import {TokenParser} from "./grammars/TokenParser";
import Editor from 'react-simple-code-editor';
import {Parser} from "peggy";


export interface GrammarEditorProps {
    value?: string
    parser: Parser
}

export const GrammarEditor = (props: GrammarEditorProps) => {

    const [current, setCurrent] = useState(props.value);

    let result,
        error;
    try {
        result = props.parser.parse(current)
    } catch (err) {
        error = `${err.message} at line ${err.location.start.line} column ${err.location.start.column}`;
    }

    console.log('result', result);

    const render = (code) => {
        const tokens = TokenParser.parse(code);
        return <span className={'code-token-highlight'}>
            {tokens.map((t,ix) => <span key={`token_${ix}`} className={`token ${t.type}`}>{t.value}</span>)}
        </span>
    }

    return (
        <div className={'grammar-editor'}>
            <Editor
                value={current}
                onValueChange={setCurrent}
                padding={10}
                highlight={code => render(code)}
            />
            {error &&
                <div className={'error'}>{error}</div>
            }

        </div>
    )
}