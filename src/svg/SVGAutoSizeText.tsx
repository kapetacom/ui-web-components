import React, {KeyboardEvent, useEffect, useRef, useState} from 'react';

import {toClass} from "@blockware/ui-web-utils";

import './SVGAutoSizeText.less';


function wordwrap( str:string, width:number) {

    if (!str) {
        return [''];
    }

    const chunks = Math.ceil(str.length / width);
    const out = [];
    for(let i = 0; i < chunks; i++) {
        const offset = i * width;
        const limit = offset + width;
        let chunk = str.substr(offset, width);
        let nextStart = str.substr(limit, 1);
        if (limit < str.length &&
            !/\s$/.test(chunk) &&
            !/\s$/.test(nextStart)) {
            chunk += '-';
        }

        out.push(chunk);
    }

    return out;
}

interface SVGTextProps {
    value:string
    maxWidth:number
    maxHeight:number
    lineHeight:number
    maxChars:number
    maxLines:number
    className?:string
    x:number
    y:number
    onChange?:(value:string) => void
}

export function SVGAutoSizeText(props: SVGTextProps) {

    const padding = 2;

    const text = useRef<SVGTextElement>(null);

    const [realWidth, setRealWidth] = useState<number>(0);
    const [ratio, setRatio] = useState<number>(1);
    const [editing, setEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(props.value);

    useEffect(() => {
        if (!text.current) {
            return;
        }

        const current = text.current;

        let realWidth = current.getComputedTextLength() + (padding * 2);

        setRealWidth(Math.max(props.maxWidth,realWidth));
        const newRatio = (props.maxWidth) / realWidth;
        setRatio(newRatio);

    },[props, props.value]);

    let textLines = wordwrap(props.value,props.maxChars);

    if (textLines.length > props.maxLines) {
        textLines = textLines.slice(0, props.maxLines);
        const lastIx = props.maxLines - 1;
        textLines[lastIx] = textLines[lastIx].substr(0, textLines[lastIx].length - 3) + '...';
    }

    let usedRatio = ratio;
    if (ratio > 1) {
        usedRatio = 1;
    }

    const onChange = props.onChange;

    const containerClass = toClass({
        'svg-auto-size-text':true,
        [props.className + '-container']:true,
        'editing':editing
    });

    function onKeyDown(evt:KeyboardEvent<HTMLInputElement>) {
        if (evt.which === 27) {
            //ESC
            setEditedValue(props.value);
            setEditing(false);
        }

        if (props.onChange && evt.which === 13) {
            if (!editedValue) {
                return;
            }
            //Enter
            props.onChange(editedValue);
            setEditing(false);
        }
    }

    function onBlur() {
        setEditedValue(props.value);
        setEditing(false);
    }

    function onEditStart() {
        if (!props.onChange) {
            return;
        }

        setEditing(true);
        setEditedValue(props.value);
    }

    const halfWidth = (props.maxWidth / 2);

    let realHeight = props.lineHeight * textLines.length;
    let fullHeight = realHeight;
    let lineHeight = props.lineHeight;
    if (fullHeight > props.maxHeight) {
        fullHeight = props.maxHeight;
    }
    let fontSize = (lineHeight - 2);

    let yOffset = (realHeight - (lineHeight * textLines.length)) / 2;

    const renderTextLines = () => {

        const halfWidth = (realWidth / 2);

        return textLines.map((textLine:string, ix:number) => {
                const lineY = yOffset + ((ix+1) * lineHeight) - (padding*2);
                return (
                    <tspan key={ix}
                           x={halfWidth}
                           y={lineY + 'px'}>{textLine}</tspan>
                )
            })
    };

    let inputFontSize = (fontSize*usedRatio);
    if (inputFontSize < 10) {
        inputFontSize = 10;
    }

    return (
        <>
            <svg x={props.x - halfWidth}
                 y={props.y}
                 className={containerClass}
                 height={fullHeight}
                 width={props.maxWidth}
                 onClick={onEditStart}>

                <rect className={'background'}
                      x={0}
                      y={0}
                      width={props.maxWidth}
                      height={fullHeight} />

                <svg x={0}
                     y={0}
                     height={fullHeight}
                     width={props.maxWidth}
                     viewBox={`0 0 ${realWidth} ${realHeight}`}>
                    <text style={{fontSize: fontSize + 'px'}}
                          className={props.className} >
                        {renderTextLines()}
                    </text>
                </svg>

                {onChange && editing &&
                    <foreignObject
                        x={0}
                        y={0}
                        width={props.maxWidth}
                        height={fullHeight}
                        className={'editing'} >
                        <input type={'text'}
                                style={{fontSize: inputFontSize + 'px'}}
                                onChange={(evt) => setEditedValue(evt.target.value)}
                                onBlur={onBlur}
                                onKeyDown={onKeyDown} autoFocus={true} value={editedValue} />
                    </foreignObject>

                }

            </svg>

            <text className={props.className}
                  style={{
                      fontSize: fontSize + 'px',
                      opacity:0,
                      pointerEvents:'none'
                  }} >
                {textLines.map((textValue, ix) => {
                    if (ix === 0) {
                        return (
                            <tspan
                                key={ix}
                                ref={text}
                                x={0} y={ix + 'em'}>{textValue}</tspan>
                        )
                    }

                    return (
                        <tspan key={ix} x={0} y={ix + 'em'}>{textValue}</tspan>
                    )
                })}
            </text>
        </>

    )
}