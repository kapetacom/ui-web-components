/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { DataTypeEditor, MethodEditor } from '../src';
import { DSLEntity, DSLEntityType, DSLMethod } from '@kapeta/kaplang-core';
import { DSLEditor } from '../src/dsl/DSLEditor';
import { ConfigurationEditor } from '../src/dsl/ConfigurationEditor';
import AIAssist from '../src/dsl/AIAssist';

export default {
    title: 'AI Editors',
};

export const AIStory = () => {
    const [content, setContent] = useState('# Not a whole lot yet');
    return (
        <>
            <AIAssist
                onGenerate={async (prompt) => {
                    console.log(prompt);
                    const result = await new Promise<string>((resolve) =>
                        setTimeout(resolve, 1000, '# Super awesome content including ' + prompt)
                    );
                    setContent(result);
                }}
            />
            <pre>{content}</pre>
            <DSLEditor
                types={true}
                methods={true}
                onChange={(result) => console.log('result', result)}
                value={content}
            />
        </>
    );
};
