/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { HenrikIcon } from '../../src/icons/HenrikIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';

const meta = {
    title: 'Icons/HenrikIcon',
    component: HenrikIcon,
};

export default meta;

type Story = StoryObj<typeof HenrikIcon>;

export const Basic: Story = {};

export const AnimateOnHover: Story = {
    args: {
        animateOnHover: true,
    },
};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <HenrikIcon {...args} />
            </Tooltip>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HenrikIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HenrikIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HenrikIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
