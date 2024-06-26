import React, { useMemo } from 'react';
import { Preview } from '@storybook/react';
import { configure } from 'mobx';
import { MemoryRouter } from 'react-router-dom';
import { Box, CssBaseline, GlobalStyles, ThemeProvider, createTheme } from '@mui/material';
import { lightTheme, darkTheme } from '@kapeta/style';
import '../styles/index.less';
import { useNiceScrollbars } from '../src/utils/scrollbars';

configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true,
});

// Add your theme configurations to an object that you can
// pull your desired theme from.
const THEMES = {
    // TODO: fix theme json to match mui theme
    light: createTheme(lightTheme as any),
    dark: createTheme(darkTheme as any),
};

const withMuiTheme = (Story, context) => {
    // The theme global we just declared
    const { theme: themeKey } = context.globals;

    // only recompute the theme if the themeKey changes
    const theme = useMemo(() => THEMES[themeKey] || THEMES['light'], [themeKey]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    html: { height: '100%', width: '100%' },
                    body: {
                        height: '100%',
                        width: '100%',
                        backgroundColor: themeKey === 'side-by-side' ? '#e4e4e4' : undefined,
                    },
                    '#storybook-root': { height: '100%', width: '100%', display: 'flex' },
                }}
            />

            {themeKey === 'side-by-side' ? (
                // If the theme is side-by-side, render the story twice in two different themes
                <Box sx={{ display: 'flex', gap: '1rem', width: '100%', height: '100%' }}>
                    <ThemeProvider theme={THEMES['light']}>
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flex: 1,
                                backgroundColor: 'background.paper',
                                overflow: 'auto',
                                ...useNiceScrollbars(theme.palette.background.paper),
                            })}
                        >
                            <Story />
                        </Box>
                    </ThemeProvider>
                    <ThemeProvider theme={THEMES['dark']}>
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flex: 1,
                                backgroundColor: theme.palette.background.paper,
                                overflow: 'auto',
                                ...useNiceScrollbars(theme.palette.background.paper),
                            })}
                        >
                            <Story />
                        </Box>
                    </ThemeProvider>
                </Box>
            ) : (
                <Story />
            )}
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
                    { value: 'side-by-side', left: '🌗', title: 'Side by side' },
                ],
            },
        },
    },
    decorators: [withMuiTheme],
};

export default preview;
