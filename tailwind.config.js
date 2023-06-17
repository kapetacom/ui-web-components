const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{tsx,jsx,ts,js}'],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant('Mui-focused', '&.Mui-focused');
            addVariant('Mui-focusVisible', '&.Mui-focusVisible');
        }),
    ],
    darkMode: ['class', '[data-mode="dark"]'],
};
