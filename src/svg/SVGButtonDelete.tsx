import React from 'react';

import './svg-buttons.less';
import { SVGButtonProps } from './types';
import { useMouseDown } from './svgButtonUtils';

export function SVGButtonDelete(props: SVGButtonProps) {
    const button = useMouseDown(props);

    return (
        <svg ref={button} opacity={props.opacity} fill="none" x={props.x} y={props.y} style={props.style}>
            <g x={0} y={0} className="svg-button delete">
                <circle className={'svg-button-background'} cx="12.9912" cy="12" r="11" />

                <path
                    className={'svg-button-foreground'}
                    d="M 17.2338 7.75738 L 8.74854 16.2427 M 8.7486 7.75738 L 17.2339 16.2427"
                />
            </g>
        </svg>
    );
}
