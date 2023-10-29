/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { roundPathCorners } from '../utils/rounding';
import { createHexagon } from '../utils/hexagon';

import './buttons.less';
import { toClass } from '@kapeta/ui-web-utils';

const BUTTON_HEIGHT = 40;
const BUTTON_POINT_SIZE = 10;

const cssMasks: { [key: number]: string } = {};

const createCSSMask = (width: number) => {
    if (!cssMasks[width]) {
        //We store these ad-hoc SVG images as blob urls and reuse them to speed things up
        const path = createHexagon(width, BUTTON_HEIGHT, BUTTON_POINT_SIZE);
        const roundPath = roundPathCorners(path, 2, false);

        const svgData = `<svg xmlns='http://www.w3.org/2000/svg' width="${width}px" height="${BUTTON_HEIGHT}px">
                    <path 
                        stroke='transparent' 
                        fill='black' 
                        d="${roundPath}" />
                 </svg>`;

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });

        cssMasks[width] = URL.createObjectURL(svgBlob);
    }

    return `url('${cssMasks[width]}')`;
};

export enum StandardIcons {
    VIEW = 'fad fa-eye',
    DELETE = 'fad fa-trash',
    EDIT = 'fad fa-pencil',
    SAVE = 'fad fa-save',
    CANCEL = 'fa fa-times',
}

/**
 * @deprecated Use MUI Button instead
 */
export enum ButtonStyle {
    PRIMARY = 'primary',
    PRIMARY_SHINE = 'primary_shine',
    SECONDARY = 'secondary',
    DEFAULT = 'default',
    DANGER = 'danger',
}

/**
 * @deprecated Use MUI Button instead
 */
export enum ButtonType {
    BUTTON = 'button',
    SUBMIT = 'submit',
    RESET = 'reset',
}

/**
 * @deprecated Use MUI Button instead
 */
export enum ButtonShape {
    HEXAGON = 'hexagon',
    ICON = 'icon',
    SQUARE = 'square',
}

/**
 * @deprecated Use MUI Button instead
 */
export enum ButtonSize {
    ICON = 26,
    SMALL = 90,
    MEDIUM = 160,
    LARGE = 240,
    HUGE = 320,
}

interface ButtonProps {
    text: string;
    width?: number;
    disabled?: boolean;
    style?: ButtonStyle;
    type?: ButtonType;
    shape?: ButtonShape;
    onClick?: () => void;
}

const ButtonHexagon = (props: ButtonProps) => {
    const cssMask = createCSSMask(props.width);

    return (
        <div
            className={'inner'}
            style={{
                WebkitMaskImage: cssMask,
                maskImage: cssMask,
                width: props.width,
            }}
        >
            {props.text}
        </div>
    );
};

const ButtonSquare = (props: ButtonProps) => {
    return (
        <div className={'inner'} style={{ width: props.width }}>
            {props.text}
        </div>
    );
};

const ButtonIcon = (props: ButtonProps) => {
    const size = props.width + 'px';
    const fontSize = props.width / 2 + 'px';
    return (
        <div
            className={'inner'}
            style={{
                width: size,
                height: size,
                borderRadius: size,
                lineHeight: size,
            }}
        >
            <i
                style={{
                    fontSize,
                    lineHeight: size,
                }}
                className={`${props.text}`}
            />
        </div>
    );
};

const ButtonInner = (props: ButtonProps) => {
    const shape = props.shape || ButtonShape.HEXAGON;
    switch (shape) {
        case ButtonShape.ICON:
            return ButtonIcon(props);

        case ButtonShape.SQUARE:
            return ButtonSquare(props);

        default:
        case ButtonShape.HEXAGON:
            return ButtonHexagon(props);
    }

    return <></>;
};

/**
 * @deprecated Use MUI Button instead
 */
export const Button = (props: ButtonProps) => {
    const width = props.width ? props.width : props.shape === ButtonShape.ICON ? ButtonSize.ICON : ButtonSize.MEDIUM;

    const style = props.style || ButtonStyle.DEFAULT;
    const type = props.type || ButtonType.BUTTON;
    const shape = props.shape || ButtonShape.HEXAGON;

    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={toClass({ button: true, [style]: true, [shape]: true })}
            type={type}
        >
            {ButtonInner({
                type,
                width,
                shape,
                style,
                ...props,
            })}
        </button>
    );
};

interface LogoProps {
    text: string;
    logo: string;
    href: string;
    width?: number;
}

/**
 *
 * @deprecated Use MUI Button instead
 */
export const LogoButton = (props: LogoProps) => {
    const width = props.width ? props.width : ButtonSize.MEDIUM;
    const logoWidth = 50;

    const cssMask = createCSSMask(width);

    const logoMask = createCSSMask(logoWidth);

    return (
        <a className={'button logo'} href={props.href}>
            <div className={'inner'} style={{ WebkitMaskImage: cssMask, maskImage: cssMask, width }}>
                <div
                    className={'logo'}
                    style={{
                        WebkitMaskImage: logoMask,
                        maskImage: logoMask,
                        width: logoWidth,
                    }}
                >
                    <img src={props.logo} alt={props.text} />
                </div>
                <div className={'name'}>{props.text}</div>
            </div>
        </a>
    );
};

interface ActionsProps {
    children: any;
}

export const Actions = (props: ActionsProps) => {
    return <div className={'actions'}>{props.children}</div>;
};
