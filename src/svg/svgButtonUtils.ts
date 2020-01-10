import {useEffect, useRef} from "react";
import {SVGButtonProps} from "./types";

export function useMouseDown(props:SVGButtonProps) {

    const button = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!button.current) {
            return;
        }

        const current = button.current;

        const listener = (evt:MouseEvent) => {
            evt.stopPropagation();
            if (!props.onClick) {
                return;
            }

            props.onClick();
        };

        //Has to be done "the old school" way - otherwise stopPropagation doesn't take effect for some reason
        current.addEventListener('mousedown', listener);

        return () => {
            if (!current) {
                return;
            }

            current.removeEventListener('mousedown', listener);
        };
    });

    return button;
}