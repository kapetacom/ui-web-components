/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef } from 'react';

export interface RightSidebarIconProps extends SvgIconProps {}

export const RightSidebarIcon = forwardRef((props: RightSidebarIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                    x="3.17857"
                    y="3.17857"
                    width="17.6429"
                    height="17.6429"
                    rx="2.03571"
                    stroke="currentColor"
                    strokeWidth="1.35714"
                />
                <path d="M14.7148 3.85938H16.072V20.1451H14.7148V3.85938Z" fill="currentColor" />
            </svg>
        </SvgIcon>
    );
});
