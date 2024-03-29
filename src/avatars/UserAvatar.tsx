/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Avatar } from '@mui/material';

function stringToColor(string?: string) {
    if (!string) {
        return 'text.primary';
    }
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    // Transform hash to hex, and add a leading zero if only one hex digit
    // only allow values between 64 and 255 to avoid too dark colors
    const minValue = 64;
    const maxValue = 255;
    const sourceRange = 255;
    for (i = 0; i < 3; i += 1) {
        let value = (hash >> (i * 8)) & 0xff;
        value = (value * (maxValue - minValue)) / sourceRange + minValue;
        color += `00${Math.round(value).toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function getInitialsForName(name: string) {
    const nameParts = name.split(' ').filter(Boolean);
    let initials = '';
    if (nameParts.length === 1) {
        return name.substring(0, 2);
    }

    return nameParts[0][0] + nameParts[1][0];
}

interface Props {
    name?: string | undefined;
    size?: number;
}

export const UserAvatar = (props: Props) => {
    const size = props.size || 32;

    return (
        <Avatar
            sx={{
                width: `${size}px !important`,
                height: `${size}px !important`,
                fontSize: `${Math.round(size / 2) - 4}px !important`,
                bgcolor: `${stringToColor(props.name)} !important `,
            }}
            alt={props.name}
        >
            {props.name ? getInitialsForName(props.name) : <i className={'fa fa-user'} />}
        </Avatar>
    );
};
