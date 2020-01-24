import React, {useEffect, useRef, useState} from 'react';

interface SVGTextProps {
    value:string
    maxWidth:number
    className?:string
    x?:number
    y?:number
}

export function SVGText(props: SVGTextProps) {
    
    const text = useRef<SVGTextElement>(null);
    
    const [state,setState] = useState({
        text:props.value
    });
    
    const overflowPostfix = '...';

    useEffect(() => {
        if (!text.current) {
            return;
        }

        const current = text.current;
        let maxWidth = props.maxWidth;
        let textWidth = current.getComputedTextLength();
        let chars = props.value.length;
        let overflows = false;

        if (maxWidth < textWidth) {
            maxWidth -= 30; //Make space for "..."
            while (chars > 0 && maxWidth < textWidth) {
                chars--;
                textWidth = current.getSubStringLength(0, chars);
                overflows = true;
            }
        }

        const newText = props.value.substr(0, chars) + overflowPostfix;

        if (overflows &&
            state.text !== newText) {
            setState({
                text: props.value.substr(0, chars) + '...'
            });
        } else if (!overflows && state.text !== props.value) {
            setState({
                text: props.value
            });
        }
    },[props.maxWidth, props.value, state.text]);

    return (
        <>
            <text className={props.className}
                  x={props.x}
                  y={props.y}
                  >
                {state.text}
            </text>
            <text ref={text}
                  className={props.className}
                  style={{opacity:0, pointerEvents:'none'}} >
                {props.value}
            </text>
        </>

    )
}