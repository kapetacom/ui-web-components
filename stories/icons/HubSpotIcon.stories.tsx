/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { HubSpotIcon } from '../../src/icons/HubSpotIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';

const meta = {
    title: 'Icons/HubSpotIcon',
    component: HubSpotIcon,
};

export default meta;

type Story = StoryObj<typeof HubSpotIcon>;

export const Basic: Story = {};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <HubSpotIcon {...args} />
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
                    <HubSpotIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HubSpotIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HubSpotIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
