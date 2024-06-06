/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef, useId, useState } from 'react';

export interface HenrikIconProps extends SvgIconProps {
    animateOnHover?: boolean;
}

export const HenrikIcon = forwardRef((props: HenrikIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    const { animateOnHover, ...rest } = props;

    const [deg, setDeg] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const animDuration = 1000;
    const spin = () => {
        if (animateOnHover && !isSpinning) {
            setIsSpinning(true);
            setDeg((prevDeg) => prevDeg - 360);
            setTimeout(() => {
                setIsSpinning(false);
            }, animDuration);
        }
    };

    return (
        <SvgIcon {...rest} ref={ref} onMouseEnter={spin}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transformOrigin: '50% 50%',
                    transform: `rotate(${deg}deg)`,
                    transition: `transform ${animDuration}ms cubic-bezier(.18,.67,.46,1)`,
                }}
            >
                <circle cx="13.9966" cy="2.54545" r="2.14773" stroke="currentColor" stroke-width="0.795455" />
                <path
                    d="M13.9961 6.57363C13.0589 6.57363 12.2991 7.33339 12.2991 8.2706C12.2991 9.20781 13.0589 9.96757 13.9961 9.96757C14.9333 9.96757 15.6931 9.20781 15.6931 8.2706C15.6931 7.33339 14.9333 6.57363 13.9961 6.57363ZM13.6779 4.92969L13.6779 8.2706L14.3143 8.2706L14.3143 4.92969L13.6779 4.92969Z"
                    fill="currentColor"
                />
                <circle
                    cx="17.2587"
                    cy="6.12784"
                    r="0.954545"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.159091"
                />
                <circle
                    cx="13.9966"
                    cy="13.9986"
                    r="2.14773"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <circle
                    cx="13.9995"
                    cy="25.4545"
                    r="2.14773"
                    transform="rotate(-180 13.9995 25.4545)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M14 21.4264C14.9372 21.4264 15.697 20.6666 15.697 19.7294C15.697 18.7922 14.9372 18.0324 14 18.0324C13.0628 18.0324 12.303 18.7922 12.303 19.7294C12.303 20.6666 13.0628 21.4264 14 21.4264ZM14.3182 23.0703L14.3182 19.7294L13.6818 19.7294L13.6818 23.0703L14.3182 23.0703Z"
                    fill="currentColor"
                />
                <circle
                    cx="10.7374"
                    cy="21.8722"
                    r="1.03409"
                    transform="rotate(-180 10.7374 21.8722)"
                    fill="currentColor"
                />
                <circle
                    cx="25.4526"
                    cy="14.0064"
                    r="2.14773"
                    transform="rotate(90 25.4526 14.0064)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M21.4225 14.0078C21.4225 13.0706 20.6627 12.3108 19.7255 12.3108C18.7883 12.3108 18.0285 13.0706 18.0285 14.0078C18.0285 14.945 18.7883 15.7048 19.7255 15.7048C20.6627 15.7048 21.4225 14.945 21.4225 14.0078ZM23.0664 13.6896L19.7255 13.6896L19.7255 14.326L23.0664 14.326L23.0664 13.6896Z"
                    fill="currentColor"
                />
                <circle
                    cx="21.8722"
                    cy="17.2685"
                    r="1.03409"
                    transform="rotate(90 21.8722 17.2685)"
                    fill="currentColor"
                />
                <circle
                    cx="2.5435"
                    cy="13.9936"
                    r="2.14773"
                    transform="rotate(-90 2.5435 13.9936)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M6.57363 13.9922C6.57363 14.9294 7.33339 15.6892 8.2706 15.6892C9.20781 15.6892 9.96757 14.9294 9.96757 13.9922C9.96757 13.055 9.20781 12.2952 8.2706 12.2952C7.33339 12.2952 6.57363 13.055 6.57363 13.9922ZM4.92969 14.3104L8.2706 14.3104L8.2706 13.674L4.92969 13.674L4.92969 14.3104Z"
                    fill="currentColor"
                />
                <circle
                    cx="6.12393"
                    cy="10.7315"
                    r="1.03409"
                    transform="rotate(-90 6.12393 10.7315)"
                    fill="currentColor"
                />
                <circle
                    cx="22.0977"
                    cy="5.9045"
                    r="2.14773"
                    transform="rotate(45 22.0977 5.9045)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M19.2477 8.75619C18.585 8.09348 17.5105 8.09348 16.8478 8.75619C16.1851 9.4189 16.1851 10.4934 16.8478 11.1561C17.5105 11.8188 18.585 11.8188 19.2477 11.1561C19.9104 10.4934 19.9104 9.4189 19.2477 8.75619ZM20.1852 7.36876L17.8228 9.73114L18.2728 10.1811L20.6351 7.81874L20.1852 7.36876Z"
                    fill="currentColor"
                />
                <circle
                    cx="21.873"
                    cy="10.7437"
                    r="1.03409"
                    transform="rotate(45 21.873 10.7437)"
                    fill="currentColor"
                />
                <circle
                    cx="5.89844"
                    cy="22.0955"
                    r="2.14773"
                    transform="rotate(-135 5.89844 22.0955)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M8.74838 19.2438C9.41109 19.9065 10.4855 19.9065 11.1483 19.2438C11.811 18.5811 11.811 17.5066 11.1483 16.8439C10.4855 16.1812 9.41109 16.1812 8.74838 16.8439C8.08567 17.5066 8.08567 18.5811 8.74838 19.2438ZM7.81093 20.6312L10.1733 18.2689L9.72333 17.8189L7.36095 20.1813L7.81093 20.6312Z"
                    fill="currentColor"
                />
                <circle
                    cx="6.12305"
                    cy="17.2563"
                    r="1.03409"
                    transform="rotate(-135 6.12305 17.2563)"
                    fill="currentColor"
                />
                <circle
                    cx="22.0975"
                    cy="22.0938"
                    r="2.14773"
                    transform="rotate(135 22.0975 22.0938)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M19.2477 19.2438C19.9104 18.5811 19.9104 17.5066 19.2477 16.8439C18.585 16.1812 17.5105 16.1812 16.8478 16.8439C16.1851 17.5066 16.1851 18.5811 16.8478 19.2438C17.5105 19.9065 18.585 19.9065 19.2477 19.2438ZM20.6351 20.1813L18.2728 17.8189L17.8228 18.2689L20.1852 20.6312L20.6351 20.1813Z"
                    fill="currentColor"
                />
                <circle
                    cx="17.2602"
                    cy="21.8672"
                    r="1.03409"
                    transform="rotate(135 17.2602 21.8672)"
                    fill="currentColor"
                />
                <circle
                    cx="5.89864"
                    cy="5.90625"
                    r="2.14773"
                    transform="rotate(-45 5.89864 5.90625)"
                    stroke="currentColor"
                    stroke-width="0.795455"
                />
                <path
                    d="M8.74838 8.75619C8.08567 9.4189 8.08567 10.4934 8.74838 11.1561C9.41109 11.8188 10.4855 11.8188 11.1483 11.1561C11.811 10.4934 11.811 9.4189 11.1483 8.75619C10.4855 8.09348 9.41109 8.09348 8.74838 8.75619ZM7.36095 7.81874L9.72333 10.1811L10.1733 9.73114L7.81093 7.36876L7.36095 7.81874Z"
                    fill="currentColor"
                />
                <circle
                    cx="10.7359"
                    cy="6.13281"
                    r="0.954545"
                    transform="rotate(-45 10.7359 6.13281)"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0.159091"
                />
            </svg>
        </SvgIcon>
    );
});
