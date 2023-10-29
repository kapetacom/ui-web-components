/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';

import './styles.less';
import { AvatarEditor, AvatarResultType } from '../src/avatars/AvatarEditor';
import { ToastContainer } from '../src';
import { UserAvatar } from '../src/avatars/UserAvatar';

export default {
    title: 'User Avatar',
};

export const AvatarEmpty = () => {
    return (
        <div>
            <UserAvatar />
        </div>
    );
};

export const AvatarCher = () => {
    return (
        <div>
            <UserAvatar name={'Cher'} />
        </div>
    );
};

export const AvatarBoss = () => {
    return (
        <div>
            <UserAvatar name={'Bruce Springsteen'} />
        </div>
    );
};

export const AvatarDark = () => {
    // Check that it's not a super dark color / contrast
    return (
        <div style={{ backgroundColor: 'rgb(18, 18, 18)', padding: '12px' }}>
            <UserAvatar name={'aa'} />
        </div>
    );
};
