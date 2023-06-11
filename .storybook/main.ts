import type { StorybookConfig } from '@storybook/react-webpack5';
import lessPreprocessor from 'less';

const config: StorybookConfig = {
    stories: ['../stories/**/*.stories.tsx'],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    docs: {
        autodocs: true,
    },

    addons: [
        '@storybook/addon-essentials',
        {
            name: '@storybook/addon-styling',
            options: {
                less: {
                    implementation: lessPreprocessor,
                },
            },
        },
    ],

    webpackFinal: async (config, { configType }) => {
        if (config.module && config.module.rules) {
            config.module.rules.push(
                {
                    test: /\.pegjs$/,
                    use: 'pegjs-loader',
                },
                {
                    test: /\.ya?ml$/,
                    use: ['json-loader', 'yaml-loader'],
                }
            );
        }
        return config;
    },
};

export default config;
