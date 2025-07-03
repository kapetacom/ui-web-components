/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef } from 'react';

export interface MondayIconProps extends SvgIconProps {
    /**
     * If true, fill icon with the company’s default brand color
     * instead of inheriting currentColor.
     * @default false
     */
    useBrandColor?: boolean;
}

export const MondayIcon = forwardRef((props: MondayIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.0306 17.9797C11.1558 17.9583 10.4342 17.5724 9.97337 16.7668C9.50104 15.934 9.52161 15.0815 10.0252 14.2693C11.2241 12.3364 12.4387 10.4142 13.6459 8.48698C13.8927 8.09282 14.1338 7.6929 14.3922 7.30615C14.7352 6.77717 15.2712 6.40299 15.886 6.26328C16.5007 6.12357 17.1458 6.22937 17.6837 6.55816C18.8201 7.25843 19.2003 8.71492 18.4926 9.86283C17.046 12.219 15.5788 14.5636 14.091 16.8968C13.6327 17.6184 12.9374 17.9665 12.0306 17.9797Z"
                    fill={props.useBrandColor ? '#FFCB00' : 'currentColor'}
                />
                <path
                    d="M4.51801 17.9834C3.63506 17.962 2.91752 17.5588 2.46576 16.7565C2.00001 15.9237 2.02963 15.0696 2.53488 14.2574C3.8246 12.1881 5.12008 10.1219 6.42132 8.05866C6.5859 7.79205 6.75047 7.51886 6.92657 7.26047C7.28365 6.74298 7.82812 6.38477 8.44469 6.26168C9.06126 6.13859 9.70153 6.2603 10.2299 6.60102C10.7584 6.94174 11.1334 7.47474 11.2757 8.08716C11.418 8.69958 11.3164 9.34335 10.9924 9.88216C9.55072 12.2101 8.08929 14.5298 6.62704 16.847C6.15224 17.5983 5.45362 17.9702 4.51801 17.9834Z"
                    fill={props.useBrandColor ? '#FF3D57' : 'currentColor'}
                />
                <path
                    d="M19.5925 13.2657C20.9231 13.2723 22.0003 14.3297 21.9978 15.6265C21.9978 16.9431 20.8919 18.0046 19.5489 17.9882C18.206 17.9717 17.1478 16.9258 17.1494 15.6232C17.1511 14.3017 18.2323 13.2574 19.5925 13.2657Z"
                    fill={props.useBrandColor ? '#00D647' : 'currentColor'}
                />
            </svg>
        </SvgIcon>
    );
});
