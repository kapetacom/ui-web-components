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

const getEmojiSizeInPx = (size: EmojiSize): number => {
    switch (size) {
        case 'small':
            return 20;
        case 'medium':
            return 24;
        case 'large':
            return 35;
        default:
            return size;
    }
};

const getEmojiSize = (svgDimension: Dimension, size: EmojiSize): Dimension => {
    const sizeInPx = getEmojiSizeInPx(size);
    const ratio = svgDimension.width / svgDimension.height;

    let width, height;

    if (svgDimension.width > svgDimension.height) {
        width = sizeInPx;
        height = sizeInPx / ratio;
    } else {
        width = sizeInPx * ratio;
        height = sizeInPx;
    }

    // Ensure the dimensions do not exceed the max size
    width = Math.min(width, sizeInPx);
    height = Math.min(height, sizeInPx);

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
