/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CursorSelectIcon } from '../../src/icons/CursorSelectIcon';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Icons/CursorSelectIcon',
    component: CursorSelectIcon,
};

export default meta;

type Story = StoryObj<typeof CursorSelectIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <CursorSelectIcon {...args} />
            </Tooltip>
        );
    },
};
