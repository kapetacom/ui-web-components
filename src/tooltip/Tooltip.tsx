/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

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
    /**
     * Background color of the tooltip and arrow
     */
    backgroundColor?: string;
    /**
     * Text text color of the tooltip
     */
    color?: string;
};

export const Tooltip = styled(
    ({
        className,
        maxWidth = 220,
        arrow = true,
        placement = 'top',
        backgroundColor,
        color,
        ...props
    }: TooltipProps) => <MuiTooltip {...props} arrow={arrow} placement={placement} classes={{ popper: className }} />
)(({ theme, maxWidth, backgroundColor, color }) => ({
    [`& .${tooltipClasses.arrow}::before`]: {
        color: backgroundColor || '#ffffff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: backgroundColor || '#ffffff',
        color: color || 'rgba(0, 0, 0, 0.87)',
        maxWidth: maxWidth,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0px 0px 26px 0px rgba(5, 9, 13, 0.16)',
        padding: theme.spacing(1, 2),
    },
}));
