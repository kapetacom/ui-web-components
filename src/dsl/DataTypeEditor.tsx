import React from "react"

import {DSLEditor} from "./DSLEditor";

export interface DataTypeEditorProps {
    value?: string
    validTypes?: string[]
}

export const DataTypeEditor = (props: DataTypeEditorProps) => {

    return (
        <DSLEditor types={true} validTypes={props.validTypes} methods={false} rest={false} value={props.value} />
    )
}