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
    return <ReactMarkdown remarkPlugins={remarkPlugins} children={props.content} />;
};
Markdown remarkPlugins={remarkPlugins} children={props.content} />;
};
