/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

const authProviderNames = ['google', 'microsoft', 'github', 'linkedin'] as const;

export type AuthProviderIconProps = {
    /**
     * The name of the auth provider
     */
    name: (typeof authProviderNames)[number];
    /**
     * The size of the icon in px (default is 24)
     */
    size?: number;
    /**
     * Override the colors of the paths in the SVG
     */
    color?: string;
};

export const AuthProviderIcon = ({ name, size = 24, color }: AuthProviderIconProps) => {
    if (size < 0) {
        size = 0;
    }

    switch (name) {
        case 'google': {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    fill="none"
                    viewBox="12.41 12.03 37.19 37.94"
                >
                    <path
                        fill={color || '#4280EF'}
                        d="M49.6 31.455c0-1.282-.124-2.604-.33-3.844H31.371v7.316h10.25a8.624 8.624 0 0 1-3.802 5.745l6.117 4.753c3.596-3.348 5.663-8.225 5.663-13.97Z"
                    />
                    <path
                        fill={color || '#34A353'}
                        d="M31.372 49.972c5.125 0 9.424-1.695 12.565-4.588l-6.117-4.712c-1.695 1.157-3.885 1.819-6.448 1.819-4.96 0-9.135-3.348-10.664-7.812l-6.283 4.836a18.953 18.953 0 0 0 16.947 10.457Z"
                    />
                    <path
                        fill={color || '#F6B704'}
                        d="M20.708 34.637a11.526 11.526 0 0 1 0-7.274l-6.283-4.878c-2.686 5.374-2.686 11.698 0 17.03l6.283-4.878Z"
                    />
                    <path
                        fill={color || '#E54335'}
                        d="M31.372 19.55a10.35 10.35 0 0 1 7.275 2.853l5.414-5.456c-3.43-3.224-7.977-4.96-12.689-4.919a18.953 18.953 0 0 0-16.947 10.457l6.283 4.878c1.53-4.506 5.704-7.812 10.664-7.812Z"
                    />
                </svg>
            );
        }
        case 'microsoft': {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    fill="none"
                    viewBox="5.3 4.8 14.4 14.4"
                >
                    <path fill={color || '#2979FF'} d="M5.3 4.8h6.851v6.84H5.3V4.8Z" />
                    <path fill={color || '#7FBA00'} d="M12.849 4.8h6.85v6.84h-6.85V4.8Z" />
                    <path fill={color || '#00A4EF'} d="M5.3 12.37h6.851v6.83H5.3v-6.83Z" />
                    <path fill={color || '#FFB900'} d="M12.849 12.37h6.85v6.83h-6.85v-6.83Z" />
                </svg>
            );
        }
        case 'github': {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    fill="none"
                    viewBox="4.8 4.96 14.4 14.24"
                >
                    <g clipPath="url(#a)">
                        <path
                            fill={color || '#2979FF'}
                            fillRule="evenodd"
                            d="M11.978 4.96c-3.97 0-7.178 3.263-7.178 7.3 0 3.226 2.056 5.958 4.908 6.924.357.073.487-.157.487-.35 0-.17-.011-.75-.011-1.354-1.997.436-2.413-.87-2.413-.87-.32-.846-.796-1.063-.796-1.063-.654-.447.047-.447.047-.447.725.048 1.106.749 1.106.749.641 1.112 1.675.798 2.091.604.06-.471.25-.797.452-.979-1.593-.169-3.268-.797-3.268-3.601 0-.798.285-1.45.736-1.958-.07-.181-.32-.93.072-1.934 0 0 .606-.193 1.973.75a6.842 6.842 0 0 1 1.794-.242c.607 0 1.224.084 1.795.242 1.367-.943 1.973-.75 1.973-.75.392 1.003.142 1.753.071 1.934.464.508.737 1.16.737 1.958 0 2.804-1.676 3.42-3.28 3.601.261.23.487.665.487 1.354 0 .979-.012 1.764-.012 2.006 0 .193.131.423.487.35 2.853-.966 4.909-3.698 4.909-6.924.012-4.037-3.209-7.3-7.167-7.3Z"
                            clipRule="evenodd"
                        />
                    </g>
                    <defs>
                        <clipPath id="a">
                            <path fill={color || '#fff'} d="M4.8 4.96h14.4v14.238H4.8z" />
                        </clipPath>
                    </defs>
                </svg>
            );
        }
        case 'linkedin': {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 310 310">
                    <path
                        fill={color || '#0A66C2'}
                        d="M72.16 99.73H9.927a5 5 0 0 0-5 5v199.928a5 5 0 0 0 5 5H72.16a5 5 0 0 0 5-5V104.73a5 5 0 0 0-5-5zM41.066.341C18.422.341 0 18.743 0 41.362 0 63.991 18.422 82.4 41.066 82.4c22.626 0 41.033-18.41 41.033-41.038C82.1 18.743 63.692.341 41.066.341zM230.454 94.761c-24.995 0-43.472 10.745-54.679 22.954V104.73a5 5 0 0 0-5-5h-59.599a5 5 0 0 0-5 5v199.928a5 5 0 0 0 5 5h62.097a5 5 0 0 0 5-5V205.74c0-33.333 9.054-46.319 32.29-46.319 25.306 0 27.317 20.818 27.317 48.034v97.204a5 5 0 0 0 5 5H305a5 5 0 0 0 5-5V194.995c0-49.565-9.451-100.234-79.546-100.234z"
                    />
                </svg>
            );
        }

        default: {
            name satisfies never;
            throw new Error(`AuthProviderIcon: ${name} is not supported`);
        }
    }
};
