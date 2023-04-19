import React from 'react';

import { DSLEditor } from './DSLEditor';
import {DSLResult, FIELD_ANNOTATIONS} from './types';

export interface ConfigurationEditorProps {
    value?: DSLResult | string;
    onChange?: (structure: DSLResult) => any;
    validTypes?: string[];
}

export const ConfigurationEditor = (props: ConfigurationEditorProps) => {
    return (
        <DSLEditor
            types={true}
            fieldAnnotations={FIELD_ANNOTATIONS}
            validTypes={props.validTypes}
            onChange={props.onChange}
            methods={false}
            rest={false}
            value={props.value}
        />
    );
};
