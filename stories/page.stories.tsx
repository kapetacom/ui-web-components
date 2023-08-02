import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Page, PageProps } from '../src/special/Page';

const meta: Meta = {
    title: 'Page',
    component: Page,
    argTypes: {
        title: { control: { type: 'text' } },
        introduction: { control: { type: 'text' } },
    },
    decorators: [
        (Story) => (
            <div>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<PageProps>;

export const Default: Story = {
    args: {
        title: 'Page title',
        introduction: 'Page introduction',
        children: (
            <div
                style={{
                    width: '100%',
                    height: '200px',
                    border: '1px dashed #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                Page content
            </div>
        ),
    },
};
