import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps, styled, tooltipClasses } from '@mui/material';
import React from 'react';

export type TooltipProps = MuiTooltipProps & {
    maxWidth?: number;
};

export const Tooltip = styled(({ className, maxWidth, ...props }: TooltipProps) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme, maxWidth }) => ({
    [`& .${tooltipClasses.arrow}::before`]: {
        color: '#ffffff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: maxWidth ?? 220,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0px 0px 26px 0px rgba(5, 9, 13, 0.16)',
        padding: theme.spacing(1, 2),
    },
}));
