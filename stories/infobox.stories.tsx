/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { ConfirmProvider, useConfirm } from '../src/confirm';
import { useConfirmDelete, useConfirmInfo, useConfirmSuccess, useConfirmWarn } from '../src/confirm/useConfirm';
import { InfoBox, Tooltip } from '../src';

const meta: Meta = {
    title: 'InfoBox',
    component: InfoBox,
};
export default meta;

export const InfoBoxExample = () => {
    return (
        <Box>
            <InfoBox>This is an info box</InfoBox>
            <InfoBox readMoreLink="https://kapeta.com">This is an info box with a read more link</InfoBox>
        </Box>
    );
};
