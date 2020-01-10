import React from 'react';

import './svg-buttons.less';
import {SVGButtonProps} from "./types";
import {useMouseDown} from "./svgButtonUtils";

export function SVGButtonAdd(props:SVGButtonProps) {

    const button = useMouseDown(props);

    return (
        <svg ref={button}
             opacity={props.opacity}
             fill="none"
             x={props.x}
             y={props.y}
             style={props.style}>
            <g x={0} y={0} className="svg-button add">
                <circle className={'svg-button-background'} cx="12.9912" cy="12" r="11"  />

                <path d="M12.9912 6V18" className={'svg-button-foreground'} stroke-width="2" stroke-linecap="round"/>
                <path d="M6.99121 12L18.9912 12" className={'svg-button-foreground'} stroke-width="2" stroke-linecap="round"/>

            </g>
        </svg>
    );
}