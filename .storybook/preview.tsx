import React from 'react';
import { Preview } from '@storybook/react';
import { configure } from 'mobx';
import '../styles/index.less';
import '../styles/tailwind.css';

configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true,
});

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        layout: 'fullscreen',
    },
    globalTypes: {
        darkMode: {
            defaultValue: false,
        },
    },
    decorators: [
        (Story) => {
            return (
                <div className={`bg-white p-4 dark:bg-gray-800`}>
                    <Story />
                </div>
            );
        },
    ],
};
export default preview;
