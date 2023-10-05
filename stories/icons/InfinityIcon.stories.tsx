import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { InfinityIcon } from '../../src/icons/InfinityIcon';

const meta: Meta = {
    title: 'Icons/InfinityIcon',
    component: InfinityIcon,
};

export default meta;

type Story = StoryObj<typeof InfinityIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};
