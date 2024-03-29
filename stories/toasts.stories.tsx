/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { showToasty, ToastType, ToastContainer } from '../src';

export default {
    title: 'Toasts',
};

export const Toasts = () => (
    <div style={{ width: '390px', padding: '10px' }}>
        <ToastContainer />
        <button
            onClick={() =>
                showToasty({
                    type: ToastType.SUCCESS,
                    title: 'Something good!',
                    message: 'Really great stuff just happened',
                })
            }
        >
            Show success
        </button>
        <button
            onClick={() =>
                showToasty({
                    type: ToastType.ALERT,
                    title: 'Something bad!',
                    message: `Oh no this wasn't meant to happen`,
                })
            }
        >
            Show alert
        </button>
        <button
            onClick={() =>
                showToasty({
                    type: ToastType.DANGER,
                    title: 'Something ugly!',
                    message: `Daaaaaaaamnit this is the end of it!`,
                })
            }
        >
            Show danger
        </button>
        <button
            onClick={() =>
                showToasty(
                    {
                        type: ToastType.DANGER,
                        title: 'Error',
                        message: `Very important error information that you should read`,
                    },
                    {
                        autoClose: false,
                    }
                )
            }
        >
            Show persistent
        </button>
    </div>
);
