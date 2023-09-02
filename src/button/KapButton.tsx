import { Box, Button, ButtonProps, CircularProgress } from '@mui/material';
import React, { ElementType } from 'react';
import { CSSTransition } from 'react-transition-group';

export type KapButtonProps<C extends ElementType = 'button'> = ButtonProps<C, { component?: C }> & {
    loading?: boolean;
};

export const KapButton = (props: KapButtonProps<ElementType>) => {
    const { children, loading, ...buttonProps } = props;

    const sizeToSpinnerSize = {
        small: 16,
        medium: 20,
        large: 24,
    };

    return (
        <Button
            {...buttonProps}
            sx={{
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
                        transition: 'all 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28)',
                    },

                    '&-enter-active, &-enter-done': {
                        opacity: 1,
                        transform: 'scale(1)',
                    },

                    '&-exit': {
                        opacity: 1,
                    },

                    '&-exit-active': {
                        transition: 'all 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28)',
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
                        transition: 'all 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28)',
                    },

                    '&-enter-active, &-enter-done': {
                        opacity: 1,
                    },

                    '&-exit': {
                        opacity: 1,
                    },

                    '&-exit-active': {
                        transition: 'all 0.3s cubic-bezier(0.46, -0.27, 0.49, 1.28)',
                    },

                    '&-exit-active, &-exit-done': {
                        opacity: 0,
                    },
                },
            }}
        >
            <CSSTransition in={!loading} appear timeout={400} classNames="button-text">
                <Box component="span" className="button-text">
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
            >
                <Box component="span" className="button-circular-progress">
                    <CircularProgress
                        size={sizeToSpinnerSize[buttonProps.size || 'medium']}
                        color="inherit"
                        sx={{ opacity: 0.5 }}
                    />
                </Box>
            </CSSTransition>
        </Button>
    );
};
