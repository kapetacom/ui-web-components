/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */
import React, { useMemo } from 'react';
import Convert from 'ansi-to-html';
import { Box } from '@mui/material';

interface Props {
    /** The default foreground color used when reset color codes are encountered. */
    fg?: string;
    /** The default background color used when reset color codes are encountered. */
    bg?: string;
    /** Convert newline characters to `<br/>`. */
    newline?: boolean;
    /** Generate HTML/XML entities. */
    escapeXML?: boolean;
    /** Save style state across invocations of `toHtml()`. */
    stream?: boolean;
    /** Can override specific colors or the entire ANSI palette. */
    colors?: string[] | { [code: number]: string };

    data?: string[];
}

export const TerminalOutput = (props: Props) => {
    const converter = useMemo(() => {
        return new Convert({
            fg: '#000',
            bg: '#FFF',
            newline: true,
            escapeXML: false,
            stream: true,
            ...props,
        });
    }, [props.fg, props.bg, props.newline, props.escapeXML, props.stream, props.colors]);

    return (
        <Box
            className={'terminal-output'}
            sx={{
                fontFamily: 'monospace',
                fontSize: 14,
                lineHeight: '1.5em',
                overflow: 'auto',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                pre: {
                    m: 0,
                },
            }}
        >
            {props.data?.map((line, i) => (
                <pre key={i} dangerouslySetInnerHTML={{ __html: converter.toHtml(line.trim()) }} />
            ))}
        </Box>
    );
};
