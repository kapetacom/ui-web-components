/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import githubRemarkPlugin from 'remark-gfm';

interface Props {
    content: string;
}

export const Markdown = (props: Props) => {
    const remarkPlugins = useMemo(() => [githubRemarkPlugin], []);
    return (
        <ReactMarkdown
            remarkPlugins={remarkPlugins}
            components={{
                a: (props) => {
                    const { node, ...rest } = props;
                    return <a target="_blank" rel="noopener noreferrer" {...rest} />;
                },
            }}
            children={props.content}
        />
    );
};
