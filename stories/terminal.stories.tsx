/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo, useState } from 'react';
import { XTerm, XTermStream } from '../src/terminal/XTerm';
import { EventEmitter } from 'events';
import { useInterval } from 'react-use';

export default {
    title: 'Terminal',
};

export const LogView = () => {
    return (
        <XTerm
            terminalOptions={{
                disableStdin: true,
                convertEol: true,
            }}
            lines={['Hello World', 'This is a test', 'This is a test']}
        />
    );
};

export const StreamLogView = () => {
    const stream = useMemo(() => {
        const em = new EventEmitter();

        return {
            write: (data: string) => {
                em.emit('data', data);
            },
            on: (listener: (line: string) => void) => {
                em.on('data', listener);
                return () => {
                    em.off('data', listener);
                };
            },
        };
    }, []);

    useInterval(() => {
        stream.write('Hello World: ' + Math.random() + '\n');
    }, 1000);

    return (
        <XTerm
            terminalOptions={{
                disableStdin: true,
                convertEol: true,
            }}
            stream={stream}
        />
    );
};

export const Terminal = () => {
    const stream = useMemo(() => {
        const em = new EventEmitter();

        return {
            write: (data: string) => {
                em.emit('data', data);
            },
            on: (listener: (line: string) => void) => {
                em.on('data', listener);
                return () => {
                    em.off('data', listener);
                };
            },
        };
    }, []);

    return <XTerm stream={stream} />;
};
