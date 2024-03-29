/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import './svg-buttons.less';
import { SVGButtonProps } from './types';
import { useMouseDown } from './svgButtonUtils';

export const SVGButtonWarning = (props: SVGButtonProps) => {
    const button = useMouseDown(props);

    return (
        <svg fill="none" ref={button} x={props.x} opacity={props.opacity} y={props.y} style={props.style}>
            <g x={0} y={0} className="svg-button warning">
                <path
                    className={'svg-button-background'}
                    d="M14.768 3C15.5378 1.66667 17.4622 1.66667 18.232 3L29.0574 21.75C29.8272 23.0833 28.8649 24.75 27.3253 24.75H5.67468C4.13508 24.75 3.17283 23.0833 3.94263 21.75L14.768 3Z"
                />
                <path
                    className={'svg-button-foreground'}
                    d="M15.1446 17.333V9.797H17.8326V17.333H15.1446ZM18.0566 19.765C18.0566 19.9783 18.014 20.181 17.9286 20.373C17.854 20.5543 17.742 20.7143 17.5926 20.853C17.454 20.981 17.2886 21.0823 17.0966 21.157C16.9046 21.2423 16.702 21.285 16.4886 21.285C16.2753 21.285 16.0726 21.2477 15.8806 21.173C15.6993 21.0983 15.5393 20.9917 15.4006 20.853C15.262 20.7143 15.15 20.5543 15.0646 20.373C14.9793 20.1917 14.9366 19.9943 14.9366 19.781C14.9366 19.5783 14.974 19.3863 15.0486 19.205C15.134 19.013 15.246 18.8477 15.3846 18.709C15.5233 18.5703 15.6886 18.4637 15.8806 18.389C16.0726 18.3037 16.2753 18.261 16.4886 18.261C16.702 18.261 16.9046 18.3037 17.0966 18.389C17.2886 18.4637 17.454 18.5703 17.5926 18.709C17.742 18.837 17.854 18.997 17.9286 19.189C18.014 19.3703 18.0566 19.5623 18.0566 19.765Z"
                />
            </g>
        </svg>
    );
};
