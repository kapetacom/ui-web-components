

module.exports = {
    stories: [
        '../stories/**/*.stories.tsx'
    ],
    addons: [
        '@storybook/addon-actions/register',
        '@storybook/addon-links/register'
    ],
    core: {
        builder: 'webpack5'
    }
}