import React from 'react';

import { DSLDiffEditor } from '../src/dsl/DiffEditor';
import { DSLDataType, DSLEntity, DSLEntityType } from '@kapeta/kaplang-core';
import _ from 'lodash';

export default {
    title: 'DSL Diffing',
};

const entA: DSLDataType[] = [
    {
        type: DSLEntityType.DATATYPE,
        name: 'Derp',
        properties: [
            {
                name: 'fisk',
                type: 'string',
            },
        ],
    },
] as const;

const entB = _.cloneDeep(entA);
entB[0].properties[0].type = 'number';

export const demo = () => {
    return <DSLDiffEditor entitiesA={entA} entitiesB={entB} readOnly />;
};
