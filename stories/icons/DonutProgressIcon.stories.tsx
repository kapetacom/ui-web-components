/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { DonutProgressIcon } from '../../src/icons/DonutProgressIcon';
import { StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from '../../src';
import { Box, Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const meta = {
    title: 'Icons/DonutProgress',
    component: DonutProgressIcon,
};

export default meta;

type Story = StoryObj<typeof DonutProgressIcon>;

export const Loading: Story = {
    args: {
        color: '#651fff',
        loading: true,
    },
};

export const LoadingGray: Story = {
    args: {
        color: 'rgba(0,0,0,0.5)',
        loading: true,
    },
};

export const NotLoadingValue0: Story = {
    args: {
        color: '#651fff',
        loading: false,
        value: 0,
    },
};

export const NotLoadingValue100: Story = {
    args: {
        color: '#651fff',
        loading: false,
        value: 100,
    },
};

export const WithTooltip: Story = {
    args: {
        color: '#651fff',
        loading: true,
    },
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <DonutProgressIcon {...args} />
            </Tooltip>
        );
    },
};

export const WithDifferentSizes: Story = {
    render: () => {
        return (
            <Box>
                <DonutProgressIcon color={'#651fff'} loading={true} size="small" />
                <DonutProgressIcon color={'#651fff'} loading={true} size="medium" />
                <DonutProgressIcon color={'#651fff'} loading={true} size="large" />
            </Box>
        );
    },
};

export const MixedWithMUIIcons: Story = {
    render: () => {
        return (
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DonutProgressIcon color={'#651fff'} loading={true} size="large" />
                    <DonutProgressIcon color={'#651fff'} loading={false} value={50} size="large" />
                    <CheckCircleOutlinedIcon color="primary" fontSize="large" />
                    large
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DonutProgressIcon color={'#651fff'} loading={true} size="medium" />
                    <DonutProgressIcon color={'#651fff'} loading={false} value={50} size="medium" />
                    <CheckCircleOutlinedIcon color="primary" fontSize="medium" />
                    medium
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DonutProgressIcon color={'#651fff'} loading={true} size="small" />
                    <DonutProgressIcon color={'#651fff'} loading={false} value={50} size="small" />
                    <CheckCircleOutlinedIcon color="primary" fontSize="small" />
                    small
                </Box>
            </Stack>
        );
    },
};
