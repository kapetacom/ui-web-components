/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export interface PageProps {
    title?: string;
    introduction?: string;
    children: any;
    /**
     * @deprecated The `type` prop is deprecated (not used anymore)
     */
    type?: string;
}

export const Page = ({ title, introduction, children }: PageProps) => {
    return (
        <Box sx={{ p: 8, bgcolor: 'primary.contrast' }}>
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
};
