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
    { id: '*', name: 'All permissions' },
    { id: 'identity:read', name: 'Identity Management Viewer' },
    { id: 'identity:write', name: 'Identity Management Editor' },
    { id: 'registry:read', name: 'Registry Viewer' },
    { id: 'registry:write', name: 'Registry Editor' },
    { id: 'deployment:read', name: 'Deployment Viewer' },
    { id: 'deployment:write', name: 'Deployment Editor' },
    { id: 'logging:read', name: 'Logging Viewer' },
    { id: 'runtime:read', name: 'Runtime Statistics Viewer' },
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
