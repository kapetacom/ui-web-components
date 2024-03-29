/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { forwardRef, ForwardedRef } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const PromoIcon = forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    return (
        <SvgIcon {...props} ref={ref}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="m22 11.991-2.218-2.524.309-3.339-3.282-.742L15.091 2.5 12 3.82 8.91 2.5 7.19 5.386l-3.28.733.308 3.348L2 11.99l2.218 2.524-.309 3.348 3.282.742L8.909 21.5 12 20.17l3.09 1.321 1.72-2.886 3.28-.742-.308-3.339L22 11.991Zm-3.59 1.339-.51.588.073.77.163 1.763-1.727.39-.763.171-.4.67-.9 1.52-1.619-.697-.727-.307-.718.307-1.618.697-.9-1.511-.4-.67-.764-.172-1.727-.389.163-1.773.073-.769-.509-.588L4.427 12 5.6 10.661l.51-.588-.083-.778-.163-1.755 1.727-.39.764-.171.4-.67.9-1.52 1.618.697.727.307.718-.307 1.618-.697.9 1.52.4.67.764.171 1.727.39-.163 1.764-.073.769.509.588 1.173 1.33-1.164 1.339Z" />
                <path d="M11.09 7.929h1.82v1.81h-1.82v-1.81Zm0 2.985h1.82v5.157h-1.82v-5.157Z" />
            </svg>
        </SvgIcon>
    );
});
