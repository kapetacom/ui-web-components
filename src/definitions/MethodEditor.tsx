import React from "react"


import {GrammarEditor} from "./GrammarEditor";
import {MethodParser} from "./grammars/MethodParser";

export interface MethodEditorProps {
    value?: string
    restMethods?: boolean
}

export const MethodEditor = (props: MethodEditorProps) => {

    return (
        <GrammarEditor parser={MethodParser} value={props.value} />
    )
}