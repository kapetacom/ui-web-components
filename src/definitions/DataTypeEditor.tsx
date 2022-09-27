import React from "react"

import {DataTypeParser} from "./grammars/DataTypeParser";
import {GrammarEditor} from "./GrammarEditor";

export interface DataTypeEditorProps {
    value?: string
}

export const DataTypeEditor = (props: DataTypeEditorProps) => {

    return (
        <GrammarEditor parser={DataTypeParser} value={props.value} />
    )
}