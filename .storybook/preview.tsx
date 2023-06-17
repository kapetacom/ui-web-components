import { Preview } from '@storybook/react';
import { configure } from 'mobx';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
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
    },
};
export default preview;

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            light: 'light',
            dark: 'dark',
        },
        defaultTheme: 'light',
        attributeName: 'data-mode',
    }),
];
