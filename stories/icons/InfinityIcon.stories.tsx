import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { InfinityIcon } from '../../src/icons/InfinityIcon';
import { Tooltip } from '../../src';

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

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <InfinityIcon {...args} />
            </Tooltip>
        );
    },
};
