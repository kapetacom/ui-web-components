/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DevModeIcon } from '../../src/icons/DevModeIcon';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Icons/DevModeIcon',
    component: DevModeIcon,
};

export default meta;

type Story = StoryObj<typeof DevModeIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <DevModeIcon {...args} />
            </Tooltip>
        );
    },
};
