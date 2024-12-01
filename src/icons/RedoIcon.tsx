/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import React, { forwardRef, ForwardedRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const RedoIcon = forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M15.579 3.86794L16.8953 2.48242L22.207 8.07374L16.8953 13.665L15.579 12.2795L18.6438 9.05344H9.72212C7.15201 9.05344 5.06848 11.2466 5.06848 13.952C5.06848 16.6574 7.15201 18.8506 9.72212 18.8506H15.3065V20.81H9.72212C6.12393 20.81 3.20703 17.7396 3.20703 13.952C3.20703 10.1644 6.12393 7.09402 9.72212 7.09402H18.6438L15.579 3.86794Z"
                    fill="currentColor"
                />
            </svg>
        </SvgIcon>
    );
});
