/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import React, { forwardRef, ForwardedRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const DevModeIcon = forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M7.905 6.921a1.25 1.25 0 1 0-1.69-1.842l1.69 1.842Zm-6.443 4.21.845.922-.845-.922Zm0 .738.845-.922-.845.922Zm4.753 6.052a1.25 1.25 0 1 0 1.69-1.842l-1.69 1.842Zm0-12.842L.617 10.21l1.69 1.843L7.905 6.92 6.215 5.08ZM.617 12.79l5.598 5.131 1.69-1.842-5.598-5.132-1.69 1.843Zm0-2.58a1.75 1.75 0 0 0 0 2.58l1.69-1.843a.75.75 0 0 1 0 1.106L.617 10.21ZM16.056 16.079a1.25 1.25 0 0 0 1.689 1.842l-1.69-1.842Zm6.442-4.21-.844-.922.844.922Zm0-.738-.844.922.844-.922ZM17.745 5.08a1.25 1.25 0 1 0-1.69 1.842l1.69-1.842Zm0 12.842 5.598-5.131-1.69-1.843-5.597 5.132 1.689 1.842Zm5.598-7.711-5.598-5.131-1.69 1.842 5.599 5.132 1.689-1.843Zm0 2.58a1.75 1.75 0 0 0 0-2.58l-1.69 1.843a.75.75 0 0 1 0-1.106l1.69 1.843ZM15.213 3.803a1.25 1.25 0 0 0-2.426-.606l2.426.606ZM8.787 19.197a1.25 1.25 0 0 0 2.426.606l-2.426-.606Zm4-16-4 16 2.426.606 4-16-2.426-.606Z"
                />
            </svg>
        </SvgIcon>
    );
});
