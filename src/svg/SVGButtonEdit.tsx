/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import './svg-buttons.less';
import { SVGButtonProps } from './types';
import { useMouseDown } from './svgButtonUtils';

export function SVGButtonEdit(props: SVGButtonProps) {
    const button = useMouseDown(props);

    return (
        <svg ref={button} opacity={props.opacity} x={props.x} y={props.y} style={props.style}>
            <g x={0} y={0} className="svg-button edit">
                <circle className={'svg-button-background'} cx="12.9912" cy="12" r="11" />

                <path
                    className={'svg-button-foreground'}
                    d="M15.6404 6.94784C16.0714 6.42437 16.8453 6.34947 17.3687 6.78055C17.8922 7.21163 17.9671 7.98545 17.536 8.50892L11.3239 16.0524L9.42823 14.4913L15.6404 6.94784Z"
                />

                <path
                    className={'svg-button-foreground'}
                    d="M8.79254 15.2633L10.6882 16.8244L7.93895 18.2313L8.79254 15.2633Z"
                />
            </g>
        </svg>
    );
}
