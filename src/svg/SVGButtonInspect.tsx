import React from 'react';

import './svg-buttons.less';
import { SVGButtonProps } from './types';
import { useMouseDown } from './svgButtonUtils';

export function SVGButtonInspect(props: SVGButtonProps) {
    const button = useMouseDown(props);

    return (
        <svg
            ref={button}
            opacity={props.opacity}
            fill="none"
            x={props.x}
            y={props.y}
            style={props.style}
        >
            <g x={0} y={0} className="svg-button inspect">
                <circle
                    className={'svg-button-background'}
                    cx="12.9912"
                    cy="12"
                    r="11"
                />
                <svg
                    viewBox="0 0 512 512"
                    width="13"
                    height="13"
                    x="6"
                    y="4.5"
                    overflow="visible"
                >
                    <path
                        className={'svg-button-foreground'}
                        strokeWidth="1.5"
                        d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
                    />
                </svg>
            </g>
        </svg>
    );
}
