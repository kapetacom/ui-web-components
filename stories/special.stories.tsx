/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Logo } from '../src';

export default {
    title: 'Special',
};

export const LogoView = () => {
    return (
        <>
            <div style={{ backgroundColor: '#333', width: 300, height: 30 }}>
                <Logo light={true} />
            </div>
            <div style={{ backgroundColor: '#CCC', width: 300, height: 30 }}>
                <Logo />
            </div>
            <div style={{ backgroundColor: '#333', width: 300, height: 30 }}>
                <Logo light={true} width={150} height={30} />
            </div>
            <div style={{ backgroundColor: '#CCC', width: 300, height: 30 }}>
                <Logo width={150} height={30} />
            </div>
        </>
    );
};
