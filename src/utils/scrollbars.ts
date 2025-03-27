/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { getContrastRatio } from '@mui/material/styles';
import { alpha, SxProps } from '@mui/system';

/**
 * Returns a MUI Sx style object that can be used to style scrollbars in a nice way. The hook will
 * automatically choose the right scrollbar colors based on the background color. If the background
 * color is light, the scrollbar will be dark, and vice versa.
 * @param backgroundColor The background color of the container that the scrollbar is in.
 * @returns A style object that can be used to style the scrollbar.
 */
export const useNiceScrollbars = (backgroundColor: string) => {
    const mode =
        getContrastRatio('#ffffff', backgroundColor) > getContrastRatio('#121212', backgroundColor) ? 'dark' : 'light';

    const scrollbarWidth = '16px';
    const scrollbarThumbBackground = mode === 'light' ? '#d4d4d4' : '#555555';

    const sx: SxProps = {
        '&::-webkit-scrollbar': {
            width: scrollbarWidth,
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(scrollbarThumbBackground, 0.2),
            borderRadius: scrollbarWidth,
            border: '5px solid',
            borderColor: 'transparent',
            backgroundClip: 'content-box', // Prevents the border from being included in the background
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(scrollbarThumbBackground, 0.8) + ' !important',
        },
        '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(scrollbarThumbBackground, 0.5),
        },
        '&::-webkit-scrollbar-button': {
            display: 'none',
        },
        '&::-webkit-scrollbar-corner': {
            backgroundColor: backgroundColor, // Match the background color of the container
        },
        '&::-webkit-resizer': {
            display: 'none',
            borderColor: 'transparent',
            borderRadius: scrollbarWidth,
        },
    };

    return sx;
};
