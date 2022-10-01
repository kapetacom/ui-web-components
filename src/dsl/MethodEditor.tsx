import React from "react"

import {DSLEditor} from "./DSLEditor";
import {DSLResult} from "./types";

export interface MethodEditorProps {
    value?: DSLResult|string
    onChange?: (structure:DSLResult) => any
    restMethods?: boolean
    validTypes?: string[]
}

export const MethodEditor = (props: MethodEditorProps) => {


    return (
        <DSLEditor rest={props.restMethods}
                   validTypes={props.validTypes}
                   onChange={props.onChange}
                   methods={true}
                   types={false}
                   value={props.value} />
    )
}