/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps, styled, tooltipClasses } from '@mui/material';
import React from 'react';

export type ElevationNumber =
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
    | 24;

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
    elevation?: ElevationNumber;
};

type PaperElevation = `paper-elevation-${ElevationNumber}`;

// Paper elevation background is a combination of the background color and a linear gradient added
// on top as a background image.
const elevationBackgroundImage = {
    0: 'linear-gradient(rgba(255, 255, 255, 0.0), rgba(255, 255, 255, 0.0))',
    1: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    2: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))',
    3: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))',
    4: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))',
    5: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
    6: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))',
    7: 'linear-gradient(rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.11))',
    8: 'linear-gradient(rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.11))',
    9: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
    10: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
    11: 'linear-gradient(rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.13))',
    12: 'linear-gradient(rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.13))',
    13: 'linear-gradient(rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.14))',
    14: 'linear-gradient(rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.14))',
    15: 'linear-gradient(rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.14))',
    16: 'linear-gradient(rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.14))',
    17: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
    18: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
    19: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
    20: 'linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))',
    21: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
    22: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
    23: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
    24: 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
};

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
            backgroundImage: elevationBackgroundImage[elevation],
        },
        [`&& .${tooltipClasses.tooltip}`]: {
            backgroundColor: backgroundColor || theme.palette.background[paperElevation] + ' !important',
            backgroundImage: elevationBackgroundImage[elevation],
            color: color || theme.palette.text.primary,
            maxWidth: maxWidth,
            fontSize: theme.typography.pxToRem(12),
            boxShadow: shadow,
            padding: theme.spacing(1, 2),
        },
    };
});
