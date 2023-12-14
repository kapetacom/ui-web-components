/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Box, BoxProps } from '@mui/material';

export type EmojiSize = 'small' | 'medium' | 'large' | number;

type Dimension = {
    width: number;
    height: number;
};

const EMOJI_SIZES = {
    small: 20,
    medium: 24,
    large: 35,
};

const getEmojiSizeInPx = (size: EmojiSize): number => {
    if (typeof size === 'number') {
        return size;
    }

    if (!EMOJI_SIZES[size]) {
        throw new Error(`Invalid EmojiSize: ${size}`);
    }

    return EMOJI_SIZES[size];
};

const calculateAspectRatio = (width: number, height: number): number => {
    if (height === 0) {
        throw new Error('Height cannot be zero for aspect ratio calculation.');
    }
    return width / height;
};

const getEmojiSize = (svgDimension: Dimension, size: EmojiSize): Dimension => {
    if (!svgDimension || svgDimension.width <= 0 || svgDimension.height <= 0) {
        throw new Error('Invalid svgDimension provided.');
    }

    const sizeInPx = getEmojiSizeInPx(size);
    const ratio = calculateAspectRatio(svgDimension.width, svgDimension.height);

    let width = sizeInPx;
    let height = sizeInPx;

    if (ratio > 1) {
        // Width is greater than height
        height = sizeInPx / ratio;
    } else if (ratio < 1) {
        // Height is greater than width
        width = sizeInPx * ratio;
    }

    return { width, height };
};

export interface EmojiWrapperProps extends Omit<BoxProps, 'children'> {
    /**
     * Defines the size of the emoji. If a numeric value is provided, it represents the size in
     * pixels. Alternatively, it can be one of the predefined sizes: `small`, `medium`, or `large`.
     */
    size?: EmojiSize;
    /**
     * The emoji SVG
     */
    children: React.ReactElement<SVGSVGElement>;
    /**
     * The data-kap-id attribute.
     */
    'data-kap-id'?: string;
    /**
     * The ref to the wrapping div element.
     */
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}

export type EmojiProps = Omit<EmojiWrapperProps, 'children'>;

export const EmojiWrapper = (props: EmojiWrapperProps) => {
    const { size = 'medium', children, 'data-kap-id': dataKapId, forwardedRef, sx, ...otherBoxProps } = props;

    const { width, height } = getEmojiSize(
        {
            // Get the original width and height of the SVG element
            width: parseFloat(children.props.width as unknown as string),
            height: parseFloat(children.props.height as unknown as string),
        },
        size
    );

    const svgElement = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                // Remove the width and height attributes from the SVG element
                width: undefined,
                height: undefined,
                // Add new width and height to the SVG element
                style: {
                    ...child.props.style,
                    width: `${width}px`,
                    height: `${height}px`,
                },
            });
        }
        return child;
    });

    return (
        <Box
            ref={forwardedRef}
            sx={{
                width: `${width}px`,
                height: `${height}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
            {...otherBoxProps}
            data-kap-id={dataKapId}
        >
            {svgElement}
        </Box>
    );
};
