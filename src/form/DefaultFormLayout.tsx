import { Box } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export type DefaultFormLayoutProps = PropsWithChildren<{
    gap?: number;
}>;

export const DefaultFormLayout = ({ children, gap = 3 }: DefaultFormLayoutProps) => {
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
};
