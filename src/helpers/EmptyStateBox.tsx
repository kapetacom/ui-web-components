import React from 'react';
import { Box, Paper, PaperProps, Typography } from '@mui/material';
import { EmptyStateIcon, EmptyStateIconName } from './EmptyStateIcon';

export interface EmptyStateBoxProps extends PaperProps {
    title: string;
    description?: string;
    button?: React.ReactNode;
    icon?: EmptyStateIconName;
    size?: number;
}

export const EmptyStateBox = (props: EmptyStateBoxProps) => {
    const { title, description, button, icon = 'default', size = 100, sx, ...otherPaperProps } = props;

    return (
        <Paper
            variant="outlined"
            sx={{
                width: '100%',
                height: 'auto',
                py: 7,
                px: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                ...sx,
            }}
            {...otherPaperProps}
        >
            <EmptyStateIcon icon={icon} size={size} />

            <Typography variant="subtitle1" component="p" sx={{ mt: 2 }}>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" component="p">
                    {description}
                </Typography>
            )}

            {button && <Box sx={{ mt: 0.5 }}>{button}</Box>}
        </Paper>
    );
};
