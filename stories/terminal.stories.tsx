/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo } from 'react';
import { XTerm } from '../src/terminal/XTerm';
import { EventEmitter } from 'events';
import { useInterval, useList } from 'react-use';
import { TerminalOutput } from '../src/terminal/TerminalOutput';

export default {
    title: 'Terminal',
};

export const LogView = () => {
    return (
        <TerminalOutput
            data={['\x1b[1;34mHello World', '\x1b[0;32mThis is a \x1b[39;42;4mtest\x1b[0m', 'This is not formatted']}
        />
    );
};

export const StreamLogView = () => {
    const [data, dataActions] = useList<string>([]);

    useInterval(() => {
        dataActions.push('Hello World: ' + Math.random() + '\n');
    }, 1000);

    return <TerminalOutput data={data} />;
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
