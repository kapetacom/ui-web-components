/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { forwardRef } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';

export interface PageProps extends BoxProps {
    title?: string;
    introduction?: string;
    /**
     * @deprecated The `type` prop is deprecated (not used anymore)
     */
    type?: string;
}

export const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    const { title, introduction, children, sx, ...boxProps } = props;

    return (
        <Box
            ref={ref}
            sx={{
                ...sx,
                p: 8,
                bgcolor: 'primary.contrast',
            }}
            {...boxProps}
        >
            {title && (
                <Typography variant="h4" component="h2" sx={{ py: 2 }}>
                    {title}
                </Typography>
            )}
            {introduction && (
                <Typography variant="body1" component="p">
                    {introduction}
                </Typography>
            )}
            {children}
        </Box>
    );
});
