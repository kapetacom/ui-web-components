import { Preview } from '@storybook/react';
import { configure } from 'mobx';
import '../styles/index.less';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { lightTheme, darkTheme } from '@kapeta/style';
import { useMemo } from 'react';
import React from 'react';

configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true,
});

const THEMES = {
    light: createTheme(lightTheme),
    dark: createTheme(darkTheme),
};

const withMuiTheme = (Story, context) => {
    const { theme: themeKey } = context.globals;

    const theme = useMemo(() => THEMES[themeKey] || THEMES['light'], [themeKey]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Story />
        </ThemeProvider>
    );
};

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
    },
    globalTypes: {
        theme: {
            name: 'Theme',
            title: 'Theme',
            description: 'Theme for our components',
            defaultValue: 'light',
            toolbar: {
                icon: 'paintbrush',
                dynamicTitle: true,
                items: [
                    { value: 'light', left: '☀️', title: 'Light mode' },
                    { value: 'dark', left: '🌙', title: 'Dark mode' },
                ],
            },
        },
    },
    decorators: [withMuiTheme],
};
export default preview;
