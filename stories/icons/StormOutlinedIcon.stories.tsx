/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { StormOutlinedIcon } from '../../src/icons/StormOutlinedIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';

const meta = {
    title: 'Icons/StormOutlinedIcon',
    component: StormOutlinedIcon,
};

export default meta;

type Story = StoryObj<typeof StormOutlinedIcon>;

export const Basic: Story = {};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <StormOutlinedIcon {...args} />
            </Tooltip>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StormOutlinedIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StormOutlinedIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StormOutlinedIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
