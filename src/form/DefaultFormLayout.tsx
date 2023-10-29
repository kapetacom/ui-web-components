/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Box, BoxProps, SxProps } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export type DefaultFormLayoutProps = PropsWithChildren<{
    gap?: BoxProps['gap'];
    sx?: BoxProps['sx'];
}>;

export const DefaultFormLayout = ({ children, gap = 3, sx }: DefaultFormLayoutProps) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={gap}
            sx={{
                '.MuiFormControl-root': {
                    my: 0,
                },
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};
