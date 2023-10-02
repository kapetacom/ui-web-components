import React, { useId } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { clamp, isFinite } from 'lodash';
import { keyframes } from '@mui/material';

const pulsateAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  15% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  20% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export interface PieChartIconProps extends SvgIconProps {
    /**
     * The value for the pie slice, between 0 and 100.
     * @example
     * value: 25 // The pie slice will start at 12 o'clock and end at 3 o'clock
     */
    value: number;
    /**
     * Whether to animate the pie chart with a pulsating animation. Useful for e.g. indicating that
     * the value is close to 0 or 100. Defaults to false.
     */
    pulsate?: boolean;
    /**
     * The speed of the pulsating animation. Defaults to 1500 (ms)
     */
    pulsateSpeed?: number;
    /**
     * Inverts the colors of the pie slice. If set to false the pie slice has the same color as the
     * border of the pie chart. If set to true the pie slice has the same color as the background.
     * Defaults to false.
     */
    inverted?: boolean;
}

export const PieChartIcon = (props: PieChartIconProps) => {
    const { value, pulsate = false, pulsateSpeed = 1500, inverted = false, sx, ...svgIconProps } = props;

    // The percentage of the pie slice, between 0 and 1
    const percentage = isFinite(value) ? clamp(value / 100, 0, 1) : 0;

    // The size of the svg icon. The size of the icon will be controlled by the consumer like a
    // regular MUI Icon.
    const size = 24;

    // Circle
    const circleRadius = 9;
    const circleStrokeWidth = 2;

    // Pie slice
    const pieRadius = (circleRadius - circleStrokeWidth) / 2;
    const pieCircumference = 2 * Math.PI * pieRadius;
    const pieStrokeWidth = pieRadius * 2;
    const pieArcLength = percentage * pieCircumference;
    const nonPieArcLength = pieCircumference - pieArcLength;
    const pieStrokeDasharray = inverted ? `${pieArcLength} ${nonPieArcLength}` : `0 ${pieArcLength} ${nonPieArcLength}`;

    const maskId = useId();

    return (
        <SvgIcon
            sx={{
                ...sx,
                animation: pulsate ? `${pulsateAnimation} ${pulsateSpeed}ms ease-in-out infinite` : 'none',
            }}
            {...svgIconProps}
        >
            <svg viewBox={`0 0 ${size} ${size}`} fill="currentColor">
                <defs>
                    <mask id={maskId}>
                        <rect width="100%" height="100%" fill="white" />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={pieRadius}
                            strokeWidth={pieStrokeWidth}
                            style={{
                                strokeDasharray: pieStrokeDasharray,
                                // Animate the pie slice when the value changes
                                transition: 'stroke-dasharray 250ms ease-in-out',

                                // A circle stroke starts at 3 o'clock, so we rotate it by -90
                                // degrees to make it start at 12 o'clock
                                transform: 'rotate(-90deg)',
                                transformOrigin: 'center',
                            }}
                            stroke="black"
                            fill="white"
                        />
                    </mask>
                </defs>

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={circleRadius}
                    strokeWidth={circleStrokeWidth}
                    mask={`url(#${maskId})`}
                />
            </svg>
        </SvgIcon>
    );
};
