/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';
import { MondayIcon } from '../../src/icons/MondayIcon';

const meta = {
    title: 'Icons/MondayIcon',
    component: MondayIcon,
};

export default meta;

type Story = StoryObj<typeof MondayIcon>;

export const Basic: Story = {};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <MondayIcon {...args} />
            </Tooltip>
        );
    },
};

export const WithBrandColor: Story = { args: { useBrandColor: true } };

export const Sizes: Story = {
    render: () => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MondayIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MondayIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MondayIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
