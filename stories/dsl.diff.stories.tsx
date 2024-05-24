import React from 'react';

import { DSLDiffEditor } from '../src/dsl/DiffEditor';
import { DSLDataType, DSLEntity, DSLEntityType, DSLEnum } from '@kapeta/kaplang-core';
import _ from 'lodash';

export default {
    title: 'DSL Diffing',
};

const entitiesA: DSLEntity[] = [
    {
        type: DSLEntityType.ENUM,
        name: 'PostStatus',
        description: 'Enum values for a posts status',
        values: ['PUBLISHED', 'DRAFT', 'UNKNOWN'],
    } satisfies DSLEnum,
    {
        type: DSLEntityType.DATATYPE,
        name: 'Post',
        description: 'A post object',
        properties: [
            {
                name: 'id',
                type: 'string',
            },
            {
                name: 'tags',
                type: { name: 'string', list: true, generics: [] },
            },
            {
                name: 'metadata',
                optional: true,
                type: { name: 'Map', generics: ['string', 'string'] },
            },
            {
                name: 'text',
                type: 'string',
            },
        ],
    } satisfies DSLDataType,
    {
        type: DSLEntityType.DATATYPE,
        name: 'User',
        description: 'A user object',
        properties: [
            {
                name: 'id',
                type: 'string',
            },
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'email',
                type: 'string',
            },
        ],
    },
    {
        type: DSLEntityType.DATATYPE,
        name: 'Comment',
        description: 'A comment object',
        properties: [
            {
                name: 'id',
                type: 'string',
            },
            {
                name: 'postId',
                type: 'string',
            },
            {
                name: 'text',
                type: 'string',
            },
        ],
    },
] as const;

const entitiesB = _.cloneDeep(entitiesA);

// Change things in entitiesB
const firstEntityB = entitiesB[0] as DSLEnum;
firstEntityB.values[2] = 'DELETED';

const secondEntityB = entitiesB[1] as DSLDataType;
if (secondEntityB.properties) {
    secondEntityB.properties[0].name = 'postId';
}
secondEntityB.properties?.push({
    name: 'newProperty',
    type: 'string',
});

export const demo = () => {
    return <DSLDiffEditor entitiesA={entitiesA} entitiesB={entitiesB} readOnly />;
};
