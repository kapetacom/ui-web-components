/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Duration } from 'luxon';
import { Box, BoxProps } from '@mui/material';

/**
 * Convert a duration in milliseconds to a human readable format
 * @example toTimeDuration(0, 1000) // 1s
 * @example toTimeDuration(0, 86401000) // 1d, 1s
 */
export const toTimeDuration = (from: number, to: number) => {
    const duration = Duration.fromMillis(to - from).shiftTo('days', 'hours', 'minutes', 'seconds', 'milliseconds');

    const format = "d'd', h'h', m'm', s's'";

    let formattedDuration = duration.toFormat(format);

    // Remove parts with zero values
    formattedDuration = formattedDuration
        .split(', ')
        .filter((p) => p.charAt(0) !== '0')
        .join(', ');

    return formattedDuration;
};

export type TimeDurationProps = (
    | {
          from: number;
          to: number;
      }
    | {
          duration: number;
      }
) &
    BoxProps;

/**
 * Convert a duration in milliseconds to a human readable format
 */
export const TimeDuration = (props: TimeDurationProps) => {
    if ('from' in props && 'to' in props) {
        const { from, to, ...boxProps } = props;
        return (
            <Box component="span" className="time-duration" {...boxProps}>
                {toTimeDuration(from, to)}
            </Box>
        );
    }
    const { duration, ...boxProps } = props;
    return (
        <Box component="span" className="time-duration" {...boxProps}>
            {toTimeDuration(0, props.duration)}
        </Box>
    );
};
