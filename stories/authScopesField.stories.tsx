/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { FormContainer } from '../src/form/FormContainer';
import { AuthScopesField } from '../src/special/oauth/AuthScopesField';
import { AuthScope } from '../src/special/oauth/scopes';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
    title: 'AuthScopesField',
    component: AuthScopesField,
};
export default meta;

type Story = StoryObj<typeof AuthScopesField>;

const allScopes: AuthScope[] = [
    {
        id: '*',
        name: 'Full access',
        description: 'All permissions that exist in the system and future permissions that may be added.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/identity:read',
        name: 'Identity Management Viewer',
        description: 'Read access to the identity management system.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/identity:write',
        name: 'Identity Management Editor',
        description: 'Write access to the identity management system.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/registry:read',
        name: 'Registry Viewer',
        description: 'Read access to the registry.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/registry:write',
        name: 'Registry Editor',
        description: 'Write access to the registry.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/deployment:read',
        name: 'Deployment Viewer',
        description: 'Read access to the deployment system.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/deployment:write',
        name: 'Deployment Editor',
        description: 'Write access to the deployment system.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/logging:read',
        name: 'Logging Viewer',
        description: 'Read access to the logging system.',
    },
    {
        id: 'https://auth.kapeta.com/scopes/runtime:read',
        name: 'Runtime Statistics Viewer',
        description: 'Read access to the runtime statistics system.',
    },
];

const member = {
    id: 's8d9s8d-0d99-4872-b853-c29813cc21b2',
    name: 'John Doe',
    handle: 'john_doe',
    scopes: ['identity:read', 'identity:write'],
};

export const Default: Story = {
    args: {
        name: 'scopes',
        scopes: allScopes,
    },
    decorators: [
        (Story) => (
            <FormContainer
                initialValue={member}
                onSubmitData={(data) => console.log('submitted', data)}
                onChange={(data) => console.log('change', data)}
            >
                <Story />
            </FormContainer>
        ),
    ],
};
