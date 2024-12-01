/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import React, { forwardRef, ForwardedRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const UndoIcon = forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.42097 3.86794L7.10473 2.48242L1.79297 8.07374L7.10473 13.665L8.42097 12.2795L5.35617 9.05344H14.2779C16.848 9.05344 18.9315 11.2466 18.9315 13.952C18.9315 16.6574 16.848 18.8506 14.2779 18.8506H8.69354V20.81H14.2779C17.8761 20.81 20.793 17.7396 20.793 13.952C20.793 10.1644 17.8761 7.09402 14.2779 7.09402H5.3562L8.42097 3.86794Z"
                    fill="currentColor"
                />
            </svg>
        </SvgIcon>
    );
});
