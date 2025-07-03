/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SugarCRMIcon } from '../../src/icons/SugarCRMIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';

const meta = {
    title: 'Icons/SugarCRMIcon',
    component: SugarCRMIcon,
};

export default meta;

type Story = StoryObj<typeof SugarCRMIcon>;

export const Basic: Story = {};

export const WithTooltip: Story = {
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <SugarCRMIcon {...args} />
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
                    <SugarCRMIcon fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SugarCRMIcon fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SugarCRMIcon fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
