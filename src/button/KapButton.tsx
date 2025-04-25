/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { ElementType, forwardRef } from 'react';
import { Box, Button, ButtonProps, CircularProgress } from '@mui/material';
import { CSSTransition } from 'react-transition-group';

export type KapButtonProps<C extends ElementType = 'button'> = ButtonProps<C, { component?: C }> & {
    loading?: boolean;
};

export const KapButton = forwardRef<HTMLButtonElement, KapButtonProps<ElementType>>((props, buttonRef) => {
    const { children, loading, sx, ...buttonProps } = props;

    const sizeToSpinnerSize = {
        small: 16,
        medium: 20,
        large: 24,
    };

    const textRef = React.useRef(null);
    const spinnerRef = React.useRef(null);

    return (
        <Button
            ref={buttonRef}
            {...buttonProps}
            sx={{
                ...sx,
                overflow: 'hidden',
                '.button-text': {
                    opacity: 0,

                    // CSS transition classes
                    '&-appear, &-appear-active, &-appear-done': {
                        opacity: 1,
                        transform: 'scale(1)',
                    },

                    '&-enter': {
                        opacity: 0,
                        transform: 'scale(0.5)',
                    },

                    '&-enter-active': {
                        transition:
                            'transform 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28) 0.2s, opacity 0.3s ease-in-out 0.2s',
                    },

                    '&-enter-active, &-enter-done': {
                        opacity: 1,
                        transform: 'scale(1)',
                    },

                    '&-exit': {
                        opacity: 1,
                    },

                    '&-exit-active': {
                        transition: 'transform 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28), opacity 0.3s ease-in-out',
                    },

                    '&-exit-active, &-exit-done': {
                        opacity: 0,
                        transform: 'scale(0.5)',
                    },
                },

                '.button-circular-progress': {
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    top: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,

                    // CSS transition classes
                    '&-appear, &-appear-active, &-appear-done': {
                        opacity: 1,
                    },

                    '&-enter': {
                        opacity: 0,
                    },

                    '&-enter-active': {
                        transition: 'opacity 0.3s ease-in-out',
                    },

                    '&-enter-active, &-enter-done': {
                        opacity: 1,
                    },

                    '&-exit': {
                        opacity: 1,
                    },

                    '&-exit-active': {
                        transition: 'opacity 0.3s ease-in-out',
                    },

                    '&-exit-active, &-exit-done': {
                        opacity: 0,
                    },
                },
            }}
        >
            <CSSTransition in={!loading} appear timeout={400} classNames="button-text" nodeRef={textRef}>
                <Box component="span" className="button-text" ref={textRef}>
                    {children}
                </Box>
            </CSSTransition>
            <CSSTransition
                in={loading}
                appear
                timeout={400}
                classNames="button-circular-progress"
                mountOnEnter
                unmountOnExit
                nodeRef={spinnerRef}
            >
                <Box component="span" className="button-circular-progress" ref={spinnerRef}>
                    <CircularProgress
                        size={sizeToSpinnerSize[(buttonProps.size as keyof typeof sizeToSpinnerSize) || 'medium']}
                        color="inherit"
                        sx={{ opacity: 0.5 }}
                    />
                </Box>
            </CSSTransition>
        </Button>
    );
});

KapButton.displayName = 'KapButton';
