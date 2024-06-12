/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Box, Stack } from '@mui/material';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { AIEventIcon, AIEventIcons } from '../../src/icons/AIEventIcon';

const meta = {
    title: 'Icons/AIEventIcon',
    component: AIEventIcon,
};

export default meta;

type Story = StoryObj<typeof AIEventIcon>;

export const Basic: Story = {
    render: () => {
        return (
            <Box>
                {AIEventIcons.map((type) => (
                    <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AIEventIcon type={type} />
                        {type}
                    </Box>
                ))}
            </Box>
        );
    },
};

export const WithTooltip: Story = {
    args: { type: 'API' },
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <AIEventIcon {...args} />
            </Tooltip>
        );
    },
};

export const Sizes: Story = {
    args: { type: 'API' },
    render: (args) => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AIEventIcon {...args} fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AIEventIcon {...args} fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AIEventIcon {...args} fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
