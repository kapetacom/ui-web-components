import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

const emptyStateIconNames = ['default', 'card', 'invoice', 'usage'] as const;
export type EmptyStateIconName = (typeof emptyStateIconNames)[number];

export interface EmptyStateIconProps {
    icon: EmptyStateIconName;
    size: number;
}

export const EmptyStateIcon = (props: EmptyStateIconProps) => {
    const { icon, size } = props;

    let emptyStateSvg: ReactNode;

    switch (icon) {
        case 'default':
            emptyStateSvg = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={(size / 100) * 81}
                    height={(size / 100) * 34}
                    fill="none"
                    viewBox="0 0 81 34"
                >
                    <path
                        fill="#BDBDBD"
                        stroke="#BDBDBD"
                        strokeWidth=".268"
                        d="M6.68 17.357a3.188 3.188 0 1 1-6.375 0 3.188 3.188 0 0 1 6.376 0Z"
                    />
                    <rect width="58.687" height="6.644" x="1.555" y=".748" fill="#F9F9F9" rx="3.215" />
                    <rect width="58.687" height="6.644" x="21.763" y="14.035" fill="#F1F1F1" opacity=".5" rx="3.215" />
                    <rect width="40.417" height="6.644" x="10.69" y="26.717" fill="#F1F1F1" opacity=".5" rx="3.215" />
                    <path
                        stroke="#BDBDBD"
                        strokeWidth=".268"
                        d="M66.752 30.039a3.188 3.188 0 1 1-6.376 0 3.188 3.188 0 0 1 6.376 0Z"
                    />
                    <circle cx="70.208" cy="4.069" r="3.322" fill="#F1F1F1" />
                </svg>
            );
            break;
        case 'card':
            emptyStateSvg = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={(size / 100) * 92}
                    height={(size / 100) * 75}
                    fill="none"
                    viewBox="0 0 92 75"
                >
                    <path
                        fill="#BDBDBD"
                        stroke="#BDBDBD"
                        strokeWidth=".268"
                        d="M7.71 55.942a3.628 3.628 0 1 1-7.257 0 3.628 3.628 0 0 1 7.256 0Z"
                    />
                    <rect width="66.461" height="7.524" x="1.887" y="37.132" fill="#F9F9F9" rx="3.215" />
                    <rect width="66.461" height="7.524" x="24.772" y="52.18" fill="#F1F1F1" opacity=".5" rx="3.215" />
                    <rect width="45.77" height="7.524" x="12.232" y="66.541" fill="#F1F1F1" opacity=".5" rx="3.215" />
                    <path
                        stroke="#BDBDBD"
                        strokeWidth=".268"
                        d="M75.738 70.303a3.628 3.628 0 1 1-7.256 0 3.628 3.628 0 0 1 7.256 0Z"
                    />
                    <circle cx="79.634" cy="40.894" r="3.762" fill="#F1F1F1" />
                    <g filter="url(#a)">
                        <rect
                            width="40.755"
                            height="26.961"
                            x="10.151"
                            y="9.596"
                            fill="#fff"
                            rx="2.143"
                            transform="rotate(-12.973 10.151 9.596)"
                        />
                        <rect
                            width="39.928"
                            height="26.134"
                            x="10.647"
                            y="9.906"
                            stroke="#EEE"
                            strokeWidth=".826"
                            rx="1.73"
                            transform="rotate(-12.973 10.647 9.906)"
                        />
                    </g>
                    <g filter="url(#b)">
                        <rect width="40.755" height="26.961" x="31.469" y="15.494" fill="#fff" rx="2.143" />
                        <rect
                            width="39.928"
                            height="26.134"
                            x="31.882"
                            y="15.907"
                            stroke="#EEE"
                            strokeWidth=".826"
                            rx="1.73"
                        />
                    </g>
                    <path fill="#DDD" d="M32.124 22.76h39.669v5.785H32.124z" opacity=".6" />
                    <path
                        stroke="#999"
                        strokeLinecap="round"
                        strokeWidth=".804"
                        d="M32.41 22.705h14.734m1.41 0h3.606m1.41 0h14.422m3.134 5.643H60.781m-3.605 0h-17.87"
                        opacity=".3"
                    />
                    <defs>
                        <filter
                            id="a"
                            width="47.402"
                            height="37.057"
                            x="9.334"
                            y=".873"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            />
                            <feOffset dy="1.244" />
                            <feGaussianBlur stdDeviation=".622" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix values="0 0 0 0 0.0196078 0 0 0 0 0.0352941 0 0 0 0 0.0509804 0 0 0 0.16 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2564_14283" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2564_14283" result="shape" />
                        </filter>
                        <filter
                            id="b"
                            width="43.242"
                            height="29.448"
                            x="30.225"
                            y="15.494"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            />
                            <feOffset dy="1.244" />
                            <feGaussianBlur stdDeviation=".622" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix values="0 0 0 0 0.0196078 0 0 0 0 0.0352941 0 0 0 0 0.0509804 0 0 0 0.16 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2564_14283" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2564_14283" result="shape" />
                        </filter>
                    </defs>
                </svg>
            );
            break;
        case 'invoice':
            emptyStateSvg = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={(size / 100) * 101}
                    height={(size / 100) * 100}
                    fill="none"
                    viewBox="0 0 101 100"
                >
                    <g clipPath="url(#a)">
                        <rect width="74.396" height="7.048" x="7.82" y="78.16" fill="#F1F1F1" rx="3.046" />
                        <rect width="62.977" height="7.129" x="29.462" y="92.41" fill="#F1F1F1" rx="3.046" />
                        <path
                            fill="#F1F1F1"
                            stroke="#BDBDBD"
                            strokeWidth=".254"
                            d="M22.154 96.435a3.438 3.438 0 1 1-6.875 0 3.438 3.438 0 0 1 6.875 0Z"
                        />
                        <circle cx="88.496" cy="81.716" r="3.565" fill="#F1F1F1" />
                    </g>
                    <g filter="url(#c)">
                        <rect
                            width="43.277"
                            height="60.107"
                            x="40.765"
                            y="32.417"
                            fill="#fff"
                            rx="2.143"
                            transform="rotate(2.5 40.765 32.417)"
                        />
                        <rect
                            width="42.45"
                            height="59.28"
                            x="41.16"
                            y="32.848"
                            stroke="#EEE"
                            strokeWidth=".826"
                            rx="1.73"
                            transform="rotate(2.5 41.16 32.848)"
                        />
                    </g>
                    <g filter="url(#d)">
                        <rect
                            width="43.277"
                            height="60.107"
                            x="17"
                            y="30.039"
                            fill="#fff"
                            rx="2.143"
                            transform="rotate(-7.5 17 30.039)"
                        />
                        <rect
                            width="42.45"
                            height="59.28"
                            x="17.464"
                            y="30.394"
                            stroke="#EEE"
                            strokeWidth=".826"
                            rx="1.73"
                            transform="rotate(-7.5 17.464 30.394)"
                        />
                    </g>
                    <path
                        fill="#EEE"
                        d="M17.35 32.692a2 2 0 0 1 1.721-2.244l38.941-5.127a2 2 0 0 1 2.244 1.722l1.455 11.053-42.906 5.649-1.456-11.053Z"
                    />
                    <rect
                        width="1.803"
                        height="6.011"
                        x="69.238"
                        y="26.192"
                        fill="#999"
                        fillOpacity=".5"
                        opacity=".2"
                        rx=".902"
                        transform="rotate(82.5 69.238 26.192)"
                    />
                    <rect
                        width="1.803"
                        height="6.011"
                        x="52.77"
                        y="16.235"
                        fill="#999"
                        fillOpacity=".5"
                        rx=".902"
                        transform="rotate(-7.5 52.77 16.235)"
                    />
                    <rect
                        width="1.803"
                        height="6.011"
                        x="63.335"
                        y="17.876"
                        fill="#999"
                        fillOpacity=".5"
                        opacity=".7"
                        rx=".902"
                        transform="rotate(37.5 63.335 17.876)"
                    />
                    <rect
                        width="34.862"
                        height="2.404"
                        x="23.29"
                        y="48.579"
                        fill="#DCDCDC"
                        rx="1.202"
                        transform="rotate(-7.5 23.29 48.58)"
                    />
                    <rect
                        width="34.862"
                        height="2.404"
                        x="24.859"
                        y="60.498"
                        fill="#DCDCDC"
                        rx="1.202"
                        transform="rotate(-7.5 24.859 60.498)"
                    />
                    <rect
                        width="34.862"
                        height="2.404"
                        x="26.428"
                        y="72.416"
                        fill="#DCDCDC"
                        rx="1.202"
                        transform="rotate(-7.5 26.428 72.416)"
                    />
                    <rect
                        width="12.622"
                        height="2.404"
                        x="23.918"
                        y="53.347"
                        fill="#EEE"
                        rx="1.202"
                        transform="rotate(-7.5 23.918 53.347)"
                    />
                    <rect
                        width="12.622"
                        height="2.404"
                        x="25.486"
                        y="65.265"
                        fill="#EEE"
                        rx="1.202"
                        transform="rotate(-7.5 25.486 65.265)"
                    />
                    <rect
                        width="12.622"
                        height="2.404"
                        x="27.056"
                        y="77.184"
                        fill="#EEE"
                        rx="1.202"
                        transform="rotate(-7.5 27.056 77.184)"
                    />
                    <defs>
                        <filter
                            id="c"
                            width="48.162"
                            height="64.242"
                            x="36.991"
                            y="32.509"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            />
                            <feOffset dy="1.244" />
                            <feGaussianBlur stdDeviation=".622" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix values="0 0 0 0 0.0196078 0 0 0 0 0.0352941 0 0 0 0 0.0509804 0 0 0 0.16 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2563_23721" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2563_23721" result="shape" />
                        </filter>
                        <filter
                            id="d"
                            width="52.717"
                            height="67.206"
                            x="16.017"
                            y="24.651"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            />
                            <feOffset dy="1.244" />
                            <feGaussianBlur stdDeviation=".622" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix values="0 0 0 0 0.0196078 0 0 0 0 0.0352941 0 0 0 0 0.0509804 0 0 0 0.16 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2563_23721" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2563_23721" result="shape" />
                        </filter>
                        <clipPath id="a">
                            <path fill="#fff" d="M.5 0h100v100H.5z" />
                        </clipPath>
                    </defs>
                </svg>
            );
            break;
        case 'usage':
            emptyStateSvg = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={(100 / size) * 101}
                    height={(100 / size) * 100}
                    fill="none"
                    viewBox="0 0 101 100"
                >
                    <g clipPath="url(#a)">
                        <rect width="74.396" height="7.048" x="7.82" y="78.16" fill="#F1F1F1" rx="3.046" />
                        <rect width="62.977" height="7.129" x="29.462" y="92.41" fill="#F1F1F1" rx="3.046" />
                        <path
                            fill="#F1F1F1"
                            stroke="#BDBDBD"
                            strokeWidth=".254"
                            d="M22.154 96.435a3.438 3.438 0 1 1-6.875 0 3.438 3.438 0 0 1 6.875 0Z"
                        />
                        <circle cx="88.496" cy="81.716" r="3.565" fill="#F1F1F1" />
                        <g filter="url(#c)">
                            <path
                                fill="#fff"
                                stroke="#EEE"
                                strokeWidth=".958"
                                d="M23.17 23.503h53.878a2.653 2.653 0 0 1 2.653 2.653V91.94a2.653 2.653 0 0 1-2.653 2.653H23.169a2.653 2.653 0 0 1-2.653-2.653V26.156a2.653 2.653 0 0 1 2.653-2.653Z"
                            />
                        </g>
                        <path
                            fill="#DDD"
                            d="M43.843 32.421H27.555a1.88 1.88 0 0 0 0 3.76h16.288a1.88 1.88 0 0 0 0-3.76Z"
                        />
                        <path
                            fill="#F1F1F1"
                            d="M67.337 40.41H32.88c-1.298 0-2.35.876-2.35 1.957s1.052 1.958 2.35 1.958h34.457c1.298 0 2.35-.877 2.35-1.958s-1.052-1.958-2.35-1.958Z"
                        />
                        <path
                            fill="#DDD"
                            d="M43.843 49.336H27.555a1.88 1.88 0 0 0 0 3.76h16.288a1.88 1.88 0 0 0 0-3.76Z"
                        />
                        <path
                            fill="#F1F1F1"
                            d="M67.337 57.638H32.88c-1.298 0-2.35.876-2.35 1.958 0 1.08 1.052 1.957 2.35 1.957h34.457c1.298 0 2.35-.876 2.35-1.957 0-1.082-1.052-1.958-2.35-1.958Z"
                        />
                        <path
                            fill="#DDD"
                            d="M43.843 66.252H27.555a1.88 1.88 0 1 0 0 3.759h16.288a1.88 1.88 0 1 0 0-3.759Z"
                        />
                        <path
                            fill="#F1F1F1"
                            d="M67.337 74.084H32.88c-1.298 0-2.35.876-2.35 1.957 0 1.082 1.052 1.958 2.35 1.958h34.457c1.298 0 2.35-.876 2.35-1.958 0-1.081-1.052-1.957-2.35-1.957Z"
                        />
                    </g>
                    <defs>
                        <clipPath id="a">
                            <path fill="#fff" d="M.5 0h100v100H.5z" />
                        </clipPath>
                        <filter
                            id="c"
                            width="63.028"
                            height="74.931"
                            x="18.595"
                            y="23.024"
                            colorInterpolationFilters="sRGB"
                            filterUnits="userSpaceOnUse"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                                in="SourceAlpha"
                                result="hardAlpha"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            />
                            <feOffset dy="1.442" />
                            <feGaussianBlur stdDeviation=".721" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix values="0 0 0 0 0.0196078 0 0 0 0 0.0352941 0 0 0 0 0.0509804 0 0 0 0.16 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2563_23433" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2563_23433" result="shape" />
                        </filter>
                    </defs>
                </svg>
            );
            break;
        default:
            icon satisfies never;
            return null;
    }

    return (
        <Box
            sx={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(129, 31, 255, 0.18), rgba(217, 217, 217, 0) 77%)',
                opacity: 0.98,
            }}
        >
            {emptyStateSvg}
        </Box>
    );
};
