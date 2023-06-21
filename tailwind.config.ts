import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{tsx,jsx,ts,js}', '.storybook/**/*.{tsx,jsx,ts,js}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                'primary-dark': {
                    DEFAULT: 'hsl(var(--primary-dark))',
                    foreground: 'hsl(var(--primary-dark-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                'secondary-dark': {
                    DEFAULT: 'hsl(var(--secondary-dark))',
                    foreground: 'hsl(var(--secondary-dark-foreground))',
                },
                error: {
                    DEFAULT: 'hsl(var(--error))',
                    foreground: 'hsl(var(--error-foreground))',
                },
                'error-dark': {
                    DEFAULT: 'hsl(var(--error-dark))',
                    foreground: 'hsl(var(--error-dark-foreground))',
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                },
                'warning-dark': {
                    DEFAULT: 'hsl(var(--warning-dark))',
                    foreground: 'hsl(var(--warning-dark-foreground))',
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    foreground: 'hsl(var(--info-foreground))',
                },
                'info-dark': {
                    DEFAULT: 'hsl(var(--info-dark))',
                    foreground: 'hsl(var(--info-dark-foreground))',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                },
                'success-dark': {
                    DEFAULT: 'hsl(var(--success-dark))',
                    foreground: 'hsl(var(--success-dark-foreground))',
                },
                disabled: {
                    DEFAULT: 'hsl(var(--disabled) / 12%)',
                    foreground: 'hsl(var(--disabled-foreground) / 38%)',
                },
            },
        },
    },
    darkMode: ['class'],
} satisfies Config;
