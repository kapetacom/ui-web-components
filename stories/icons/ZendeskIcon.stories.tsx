/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ZendeskIcon } from '../../src/icons/ZendeskIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';

const meta = {
    title: 'Icons/ZendeskIcon',
    component: ZendeskIcon,
};

export default meta;

type Story = StoryObj<typeof ZendeskIcon>;

export const Basic: Story = {};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <ZendeskIcon {...args} />
            </Tooltip>
        );
    },
};

export const WithBrandColor: Story = { args: { useBrandColor: true } };

export const WithCurrentColor: Story = {
    render: () => {
        return (
            <Box style={{ color: 'limegreen' }}>
                <ZendeskIcon />
            </Box>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ZendeskIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ZendeskIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ZendeskIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
