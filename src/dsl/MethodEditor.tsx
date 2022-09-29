import React from "react"

import {DSLEditor} from "./DSLEditor";

export interface MethodEditorProps {
    value?: string
    restMethods?: boolean
    validTypes?: string[]
}

export const MethodEditor = (props: MethodEditorProps) => {

    return (
        <DSLEditor rest={props.restMethods} validTypes={props.validTypes} methods={true} types={false} value={props.value} />
    )
}