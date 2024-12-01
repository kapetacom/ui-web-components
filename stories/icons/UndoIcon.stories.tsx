/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { UndoIcon } from '../../src/icons/UndoIcon';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Icons/UndoIcon',
    component: UndoIcon,
};

export default meta;

type Story = StoryObj<typeof UndoIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <UndoIcon {...args} />
            </Tooltip>
        );
    },
};
