/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef } from 'react';

export interface SugarCRMIconProps extends SvgIconProps {
    /**
     * If true, fill icon with the company’s default brand color
     * instead of inheriting currentColor.
     * @default false
     */
    useBrandColor?: boolean;
}

export const SugarCRMIcon = forwardRef((props: SugarCRMIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    const { useBrandColor, ...otherProps } = props;
    return (
        <SvgIcon {...otherProps} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.0269 2L2 5.87444V8.4574L12.0269 12.3856L22 8.4574V5.87444L12.0269 2ZM2 15.5426V18.0718L12.0269 22L22 18.0718V15.5426L12.0269 19.417L2 15.5426ZM2 10.6816V13.2646L12.0269 17.1928L22 13.2646V10.6816L12.0269 14.6099L2 10.6816Z"
                    fill={useBrandColor ? '#101820' : 'currentColor'}
                />
            </svg>
        </SvgIcon>
    );
});
