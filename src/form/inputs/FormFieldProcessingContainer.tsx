/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { FormFieldController } from '../formFieldController';
import { Box, CircularProgress } from '@mui/material';

interface Props extends PropsWithChildren {
    controller: FormFieldController;
    inputElement?: HTMLInputElement | HTMLTextAreaElement;
}

const spinnerSize = 16;

/**
 * This container adds a spinner to the input / textarea element if the controller is processing.
 * The spinner is positioned at the right side of the element. Since MUI TextFields can have end
 * adornments, the spinner is positioned at the end of the <input /> element and not at the end of
 * the TextField wrapper. Vertically the spinner is positioned at the bottom of the element if it is
 * a textarea, otherwise at the middle of the element.
 */
export const FormFieldProcessingContainer = ({ controller, inputElement: element, children }: Props) => {
    const [position, setPosition] = useState({ top: '0px', left: '0px' });

    const tagName = element?.tagName.toLowerCase() as 'input' | 'textarea';

    const containerRef = useRef<HTMLDivElement>(null);

    const frameId = useRef(0); // Ref to store the requestAnimationFrame ID

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const containerElm = containerRef.current;

        const observerCallback = () => {
            const resizeLogic = () => {
                if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const containerRect = containerElm.getBoundingClientRect();
                    const relative = {
                        top: elementRect.top - containerRect.top,
                        left: elementRect.left - containerRect.left,
                    };

                    if (tagName === 'input') {
                        const style = window.getComputedStyle(element);
                        const { paddingTop, paddingRight, paddingBottom, paddingLeft } = style;
                        const innerHeight = elementRect.height - parseFloat(paddingTop) - parseFloat(paddingBottom);
                        setPosition({
                            top: relative.top + parseFloat(paddingTop) + (innerHeight - spinnerSize) / 2 + 'px',
                            left: elementRect.width - parseFloat(paddingRight) - spinnerSize + 'px',
                        });
                    } else if (tagName === 'textarea' && element.parentElement) {
                        // We use the parent element instead for the textarea because the padding is not
                        // in the textarea element but in the parent element.
                        const { paddingRight, paddingBottom, paddingTop } = window.getComputedStyle(
                            element.parentElement
                        );
                        setPosition({
                            top: relative.top + 'px',
                            left: elementRect.width - spinnerSize + parseFloat(paddingRight) + 'px',
                        });
                    }
                }
            };

            // Requesting the frame for resize logic to execute
            frameId.current = window.requestAnimationFrame(resizeLogic);
        };

        const resizeObserver = new ResizeObserver(observerCallback);

        if (element) {
            resizeObserver.observe(element);
        }

        return () => {
            if (frameId.current) {
                window.cancelAnimationFrame(frameId.current);
            }
            resizeObserver.disconnect();
        };
    }, [element, containerRef.current]);

    return (
        <Box position={'relative'} ref={containerRef}>
            {children}
            {controller.processing && (
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                    }}
                    size={spinnerSize}
                />
            )}
        </Box>
    );
};
