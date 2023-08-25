import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';

type DefaultFormLayoutProps = PropsWithChildren<{
    gap?: number;
}>;

export default function DefaultFormLayout({ children, gap = 3 }: DefaultFormLayoutProps) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={gap}
            sx={{
                '.MuiFormControl-root': {
                    my: 0,
                },
            }}
        >
            {children}
        </Box>
    );
}
