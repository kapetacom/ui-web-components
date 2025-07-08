/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef } from 'react';

export interface ZendeskIconProps extends SvgIconProps {
    /**
     * If true, fill icon with the company’s default brand color
     * instead of inheriting currentColor.
     * @default false
     */
    useBrandColor?: boolean;
}

export const ZendeskIcon = forwardRef((props: ZendeskIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    const { useBrandColor, ...otherProps } = props;
    return (
        <SvgIcon {...otherProps} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.2381 19.6557V8.50237L2 19.6557H11.2381Z"
                    fill={useBrandColor ? '#11110d' : 'currentColor'}
                />
                <path
                    d="M9.88518 7.76615C10.7514 6.89991 11.2381 5.72504 11.2381 4.5H2C2 5.72504 2.48665 6.89991 3.35288 7.76615C4.21912 8.63239 5.39399 9.11903 6.61903 9.11903C7.84408 9.11903 9.01895 8.63239 9.88518 7.76615Z"
                    fill={useBrandColor ? '#11110d' : 'currentColor'}
                />
                <path
                    d="M14.1128 16.3905C13.2466 17.2567 12.76 18.4316 12.76 19.6566H21.998C21.998 18.4316 21.5114 17.2567 20.6451 16.3905C19.7789 15.5243 18.604 15.0376 17.379 15.0376C16.1539 15.0376 14.9791 15.5243 14.1128 16.3905Z"
                    fill={useBrandColor ? '#11110d' : 'currentColor'}
                />
                <path d="M12.76 4.5V15.6533L22 4.5H12.76Z" fill={useBrandColor ? '#11110d' : 'currentColor'} />
            </svg>
        </SvgIcon>
    );
});
