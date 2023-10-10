import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PromoIcon } from '../../src/icons/PromoIcon';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Icons/PromoIcon',
    component: PromoIcon,
};

export default meta;

type Story = StoryObj<typeof PromoIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <PromoIcon {...args} />
            </Tooltip>
        );
    },
};
