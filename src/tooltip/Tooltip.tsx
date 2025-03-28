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
     * Background color of the tooltip and arrow. If not provided, it will use the default
     * background color of the theme for the elevation.
     */
    backgroundColor?: string;
    /**
     * Text text color of the tooltip. If not provided, it will use the primary text color of the
     * theme.
     */
    color?: string;
    /**
     * The elevation of the tooltip.
     * @default 1
     */
    elevation?: number;
};

type PaperElevation = `paper-elevation-${
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24}`;

export const Tooltip = styled(
    ({
        className,
        maxWidth = 220,
        arrow = true,
        placement = 'top',
        backgroundColor,
        color,
        elevation,
        ...props
    }: TooltipProps) => <MuiTooltip {...props} arrow={arrow} placement={placement} classes={{ popper: className }} />
)(({ theme, maxWidth, backgroundColor, color, elevation }) => {
    if (typeof elevation === 'undefined') {
        elevation = 1;
    } else if (typeof elevation === 'number' && (elevation < 0 || elevation > 24)) {
        console.error(`Tooltip: The elevation prop must be between 0 and 24. Received ${elevation}. Defaulting to 1.`);
        elevation = 1;
    }

    // We know elevation is a number between 0->24. But there are only 0->23 shadows, so if
    // elevation is 24, we need to use shadow 23
    const shadow = theme.shadows[elevation === 24 ? 23 : elevation];

    const paperElevation = `paper-elevation-${elevation}` as PaperElevation;

    return {
        [`&& .${tooltipClasses.arrow}::before`]: {
            color: backgroundColor || theme.palette.background[paperElevation] + ' !important',
        },
        [`&& .${tooltipClasses.tooltip}`]: {
            backgroundColor: backgroundColor || theme.palette.background[paperElevation] + ' !important',
            color: color || theme.palette.text.primary,
            maxWidth: maxWidth,
            fontSize: theme.typography.pxToRem(12),
            boxShadow: shadow,
            padding: theme.spacing(1, 2),
        },
    };
});
