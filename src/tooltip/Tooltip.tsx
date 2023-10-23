import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps, styled, tooltipClasses } from '@mui/material';
import React from 'react';

export type TooltipProps = MuiTooltipProps & {
    /**
     * The maximum width of the tooltip.
     * @default 220
     */
    maxWidth?: number;
    /**
     * If `true`, adds an arrow to the tooltip.
     * @default true
     */
    arrow?: boolean;
    /**
     * Tooltip placement
     * @default 'top'
     */
    placement?: MuiTooltipProps['placement'];
};

export const Tooltip = styled(
    ({ className, maxWidth = 220, arrow = true, placement = 'top', ...props }: TooltipProps) => (
        <MuiTooltip {...props} arrow={arrow} placement={placement} classes={{ popper: className }} />
    )
)(({ theme, maxWidth }) => ({
    [`& .${tooltipClasses.arrow}::before`]: {
        color: '#ffffff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: maxWidth,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0px 0px 26px 0px rgba(5, 9, 13, 0.16)',
        padding: theme.spacing(1, 2),
    },
}));
