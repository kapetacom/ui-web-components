/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

const SVGDeleteHexagon = () => {
    return (
        <div className={'delete-attribute-line'}>
            <svg width="24" height="30" viewBox="0 -8 24 28" fill="none">
                <path
                    d="M0.676375 11.0692C0.263313 10.4162 0.263313 9.58376 0.676374 8.93079L5.73711 0.930792C6.1037 0.351295 6.74161 1.61266e-06 7.42732 1.58269e-06L15.7306 1.21974e-06C16.4163 1.18977e-06 17.0542 0.351295 17.4208 0.930789L22.4815 8.93079C22.8946 9.58375 22.8946 10.4162 22.4815 11.0692L17.4208 19.0692C17.0542 19.6487 16.4163 20 15.7306 20L7.42732 20C6.74161 20 6.1037 19.6487 5.73711 19.0692L0.676375 11.0692Z"
                    fill="#E35A4C"
                    fillOpacity="0.6"
                />
                <path d="M15.7891 6.3158L7.36905 14.7368" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7.36816 6.3158L15.7882 14.7368" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div>
    );
};

export default SVGDeleteHexagon;
