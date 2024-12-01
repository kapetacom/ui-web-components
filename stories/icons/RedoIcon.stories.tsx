/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RedoIcon } from '../../src/icons/RedoIcon';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Icons/RedoIcon',
    component: RedoIcon,
};

export default meta;

type Story = StoryObj<typeof RedoIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <RedoIcon {...args} />
            </Tooltip>
        );
    },
};
