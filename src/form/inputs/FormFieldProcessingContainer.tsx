import React, { PropsWithChildren, useEffect, useState } from 'react';
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
    const [position, setPosition] = useState({ bottom: '0px', left: '0px' });

    const tagName = element?.tagName.toLowerCase() as 'input' | 'textarea';

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (element) {
                if (tagName === 'input') {
                    const rect = element.getBoundingClientRect();
                    const style = window.getComputedStyle(element);
                    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = style;
                    const innerHeight = rect.height - parseFloat(paddingTop) - parseFloat(paddingBottom);
                    setPosition({
                        bottom: parseFloat(paddingBottom) + (innerHeight - spinnerSize) / 2 + 'px',
                        left: rect.width - parseFloat(paddingRight) - spinnerSize + 'px',
                    });
                } else if (tagName === 'textarea') {
                    // We use the parent element instead for the textarea because the padding is not
                    // in the textarea element but in the parent element.
                    const rect = element.parentElement.getBoundingClientRect();
                    const { paddingRight, paddingBottom } = window.getComputedStyle(element.parentElement);
                    setPosition({
                        bottom: paddingBottom,
                        left: rect.width - parseFloat(paddingRight) - spinnerSize + 'px',
                    });
                }
            }
        });

        if (element) {
            resizeObserver.observe(element);
        }

        return () => resizeObserver.disconnect();
    }, [element]);

    return (
        <Box position={'relative'}>
            {children}
            {controller.processing && (
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        bottom: position.bottom,
                        left: position.left,
                    }}
                    size={spinnerSize}
                />
            )}
        </Box>
    );
};