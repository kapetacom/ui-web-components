import React from "react";
import {roundPathCorners} from '../utils/rounding';
import {createHexagon} from '../utils/hexagon';

import './buttons.less';
import {toClass} from "@blockware/ui-web-utils";

const BUTTON_HEIGHT = 40;
const BUTTON_POINT_SIZE = 10;

const cssMasks = {};

const createCSSMask = (width:number) => {
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

        const svgBlob = new Blob([svgData], {type : 'image/svg+xml'});

        cssMasks[width] = URL.createObjectURL(svgBlob);
    }

    return `url('${cssMasks[width]}')`;
};

export enum ButtonStyle {
    PRIMARY = 'primary',
    PRIMARY_SHINE = 'primary_shine',
    SECONDARY = 'secondary',
    DEFAULT = 'default',
    DANGER = 'danger'
}

export enum ButtonType {
    BUTTON = 'button',
    SUBMIT = 'submit'
}

export enum ButtonSize {
    SMALL = 90,
    MEDIUM = 160,
    LARGE = 240,
    HUGE = 320
}

interface ButtonProps {
    text: string
    width?: number
    disabled?: boolean
    style?: ButtonStyle
    type?: ButtonType,
    onClick?:() => void
}

export const Button = (props:ButtonProps) =>  {
    const width = props.width ? props.width : ButtonSize.MEDIUM;
    const cssMask = createCSSMask(width);
    const style = props.style || ButtonStyle.DEFAULT;
    const type = props.type || ButtonType.BUTTON;

    return (
        <button onClick={props.onClick}
                disabled={props.disabled}
                className={toClass({button:true,[style]:true})} type={type} >
            <div className={'inner'} style={{WebkitMaskImage:cssMask,MaskImage:cssMask, width}}>
                {props.text}
            </div>
        </button>
    );
};

interface LogoProps {
    text:string
    logo:string
    href: string
    width?: number
}


export const LogoButton = (props:LogoProps) =>  {

    const width = props.width ? props.width : ButtonSize.MEDIUM;
    const logoWidth = 50;

    const cssMask = createCSSMask(width);

    const logoMask = createCSSMask(logoWidth);

    return (
        <a className={'button logo'} href={props.href} >
            <div className={'inner'} style={{WebkitMaskImage:cssMask,MaskImage:cssMask, width}}>
                <div className={'logo'} style={{WebkitMaskImage:logoMask,MaskImage:logoMask, width: logoWidth}}>
                    <img src={props.logo} alt={props.text} />
                </div>
                <div className={'name'}>
                    {props.text}
                </div>
            </div>
        </a>
    );
};