import React from 'react';

import { DSLEditor } from './DSLEditor';
import { DSLResult } from './types';

export interface DataTypeEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
    validTypes?: string[];
}

export const DataTypeEditor = (props: DataTypeEditorProps) => {
    return (
        <DSLEditor
            types={true}
            validTypes={props.validTypes}
            onChange={props.onChange}
            methods={false}
            rest={false}
            value={props.value}
        />
    );
};
