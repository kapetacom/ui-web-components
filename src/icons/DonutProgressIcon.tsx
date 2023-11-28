import React, { ForwardedRef, forwardRef } from 'react';
import { isFinite } from 'lodash';
import { Box, CircularProgress, circularProgressClasses } from '@mui/material';

export interface DonutProgressIconProps {
    size?: 'small' | 'medium' | 'large';
    color: string;
    loading: boolean;
    value?: number;
}

export const DonutProgressIcon = forwardRef((props: DonutProgressIconProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { color, loading, value, size = 'medium', ...rest } = props;

    const dimension = { small: 20, medium: 24, large: 35 }[size];
    const margin = { small: 1.6666666667, medium: 2, large: 2.9166666667 }[size];

    return (
        <Box
            {...rest}
            sx={{
                position: 'relative',
                width: `${dimension}px`,
                height: `${dimension}px`,
            }}
            ref={ref}
        >
            {/* Background circle */}
            <CircularProgress
                variant="determinate"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: `${margin}px`,
                    color,
                    opacity: 0.3,
                    overflow: 'visible',
                }}
                value={100}
                size={dimension - 2 * margin}
                thickness={4.5}
            />

            {/* Foreground circle - a.k.a the donut */}
            <CircularProgress
                variant={loading ? 'indeterminate' : 'determinate'}
                value={loading ? undefined : isFinite(value) ? value : 100}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: `${margin}px`,
                    color,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                        animationDuration: '4s',
                    },
                    overflow: 'visible',
                }}
                size={dimension - 2 * margin}
                thickness={4.5}
            />
        </Box>
    );
});
