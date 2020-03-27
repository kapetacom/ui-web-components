import React from "react";
import {SVGText} from "..";

import "./Button.less";

import { createHexagonPath, Orientation, toClass } from "@blockware/ui-web-utils";

export enum HorizontalPositioning {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
}

export enum MouseState {
    HOVER = "hover",
    ACTIVE = "active",
    DEFAULT = "default"
}

export enum ButtonType {
    CANCEL = "cancel-button",
    REGULAR = "regular-button",
    PROCEED = "proceed-button"
}

interface ButtonState {
    width: number
    height: number
    text: string
    pointSize: number
    maxWidth: number
    radius: number
    buttonType: ButtonType
    textSize: number
    textDefinedWidth: boolean
    disabled: boolean
    onClick?: (evt: React.MouseEvent<SVGSVGElement, MouseEvent>)=>void
}


interface ButtonProps {
    onClick?: (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
    text: string
    style?: React.CSSProperties
    width?: number
    height?: number
    x?: number
    y?: number
    type?:string
    pointSize?: number
    maxWidth?: number
    radius?: number
    letterWidth?: number
    buttonType?: ButtonType
    disabled?: boolean
}
/**
 * The Button component in taking in a number of arguments the size of the button 
 * has a hierarchy that goes: maxWidth->width->textSize
 * if the component is used with maxWidth or width the text will trail (Tex...)
 * if you want the button to expand to enclose the full text please don't pass width and maxWidth as props
 * 
 * 
 */
export const Button = (props: ButtonProps) => {

    let getHorizontalTextPosition = (values: ButtonState) => {

        if (values.textDefinedWidth) {
            return values.maxWidth / 2 - values.pointSize;//done
        } else if (values.textSize > values.width || values.textSize > values.maxWidth) {
            return values.maxWidth / 2 - values.pointSize;
        } else {
            return values.maxWidth / 2 + values.pointSize/2;
        }
    };

    let calculateValues = () => {
        let width: number = 0;
        let height: number = 30;
        let letterWidth = 10;
        let text: string = "";
        let pointSize: number = 10;
        let maxWidth: number = 0;
        let radius: number = 3;
        let type: string = "";
        let buttonType: ButtonType = ButtonType.REGULAR;
        let textDefinedWidth = false;
        let disabled = false;

        text = props.text;
        if (props.radius) {
            radius = +props.radius;
        }
   
        if (props.type) {
            type = props.type;
        }

        if (props.height) {
            height = +props.height;
        }

        if (props.disabled) {
            disabled = props.disabled;
        }
        if (props.buttonType) {
            buttonType = props.buttonType;
        }
        if (props.pointSize) {
            pointSize = +props.pointSize;
        }
        if (props.letterWidth) {
            letterWidth = +props.letterWidth;
        }
        let textSize = (props.text.length * letterWidth);
        textDefinedWidth = !props.maxWidth && !props.width;
        if (props.maxWidth) {
            maxWidth = +props.maxWidth;
            if (props.width) {
                if (props.width) {
                    width = +props.width;
                } else {
                    width = maxWidth - pointSize * 2;
                }
                if (textSize > width && textSize < maxWidth) {
                    width = textSize;
                }
            } else {
                if (textSize < maxWidth - pointSize * 2) {
                    width = textSize;
                } else {
                    width = textSize;
                    maxWidth = width + pointSize * 2;
                }
            }
        } else {
            if (props.width) {
                width = +props.width;
                maxWidth = width + pointSize * 2;
            } else {
                width = textSize;
                maxWidth = width + pointSize * 2;
            }
        }



        return { 
            onClick: props.onClick,
            type, width, height, text, 
            pointSize, maxWidth, radius,  
            buttonType,  textSize, 
            textDefinedWidth, disabled 
        }
    };

    let values = calculateValues();

    let textClasses = toClass({
        "blockware-button-text": true,
        "trailed": values.textSize > values.width || values.textSize > values.maxWidth
    });

    let pathClasses = toClass({
        "button-shape": true,
    });

    let buttonClasses = toClass({
        [values.buttonType]: true,
        "blockware-button": true,
        "submit":values.type==="submit",
        "button-disabled": values.disabled
    });

    return (
        <div>
            <svg className={buttonClasses} onClick={!values.disabled ? values.onClick : (evt: React.MouseEvent<SVGSVGElement, MouseEvent>) => { }} width={values.width} height={values.height} style={props.style} >
                <defs>
                    <filter id="hover-shadow" x="-50%" y="-50%" width="200%" height="200%" >
                        <feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#ccc" floodOpacity="1" />
                    </filter>
                    <filter id="active-shadow" x="-50%" y="-50%" width="200%" height="200%" >
                        <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#ccc" floodOpacity="1" />
                    </filter>
                </defs>
                <g className={pathClasses}>
                    <path style={props.style}
                        d={createHexagonPath(values.maxWidth * 1.25, values.height, values.radius, Orientation.HORIZONTAL, values.pointSize)}
                    />
                    <SVGText className={textClasses}
                        maxWidth={values.width }
                        value={values.text} x={getHorizontalTextPosition(values)} y={values.height ? values.height / 2 : props.y ? props.y : 10} />
                </g>
            </svg>
        </div>
    );

};