/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState, useRef } from 'react';
import { Terminal, ITerminalOptions, ITerminalInitOnlyOptions } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { Box } from '@mui/material';

import 'xterm/css/xterm.css';

export interface XTermStream {
    write(data: string): void;
    on(cb: (line: string) => void): () => void;
}

interface Props {
    terminalOptions?: ITerminalOptions & ITerminalInitOnlyOptions;
    lines?: string[];
    stream?: XTermStream;
    onData?: (string) => void;
}

export const escapeSequence = (str: string) => {
    return `\x1b[${str}`;
};

export const XTerm = (props: Props) => {
    const xtermContainer = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal>(undefined);

    useEffect(() => {
        if (!xtermContainer.current) {
            return () => {};
        }
        try {
            const fitAddon = new FitAddon();
            const term = new Terminal(props.terminalOptions);
            term.loadAddon(new WebLinksAddon());
            term.loadAddon(fitAddon);
            term.open(xtermContainer.current);
            fitAddon.fit();
            setTerminal(term);
            return () => {
                setTerminal(undefined);
                term.dispose();
            };
        } catch (e) {
            console.error('Failed to open terminal', e);
            return () => {};
        }
    }, [xtermContainer.current]);

    useEffect(() => {
        if (!terminal) {
            return () => {};
        }
        if (props.onData) {
            const disposer = terminal.onData(props.onData);
            return () => {
                disposer.dispose();
            };
        }
        return () => {};
    }, [terminal, props.onData]);

    useEffect(() => {
        if (terminal) {
            if (props.terminalOptions?.disableStdin) {
                terminal.write(escapeSequence('?25l')); //Hide cursor
            } else {
                terminal.write(escapeSequence('?25h')); //Show cursor
            }
        }

        return () => {};
    }, [props.terminalOptions?.disableStdin, terminal]);

    useEffect(() => {
        if (!terminal) {
            return;
        }
        terminal.clear();
        props.lines?.forEach((log) => terminal.writeln(log));
    }, [terminal, props.lines]);

    useEffect(() => {
        if (!terminal || !props.stream) {
            return () => {};
        }

        const listenerDisposer = props.stream.on((line) => {
            line = line.replace(/\n?\r/g, '\n\r');
            terminal.write(line);
        });

        const disposer = terminal.onData((data) => {
            props.stream.write(data);
        });

        return () => {
            listenerDisposer();
            disposer.dispose();
        };
    }, [terminal, props.stream]);

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                p: 1,
                bgcolor: 'black',
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                }}
                ref={xtermContainer}
            ></Box>
        </Box>
    );
};
