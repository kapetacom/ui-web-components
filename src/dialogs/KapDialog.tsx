/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { createContext, useContext } from 'react';
import {
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
    DialogTitle as MuiDialogTitle,
    DialogTitleProps as MuiDialogTitleProps,
    DialogContent as MuiDialogContent,
    DialogContentProps as MuiDialogContentProps,
    DialogActions as MuiDialogActions,
    DialogActionsProps as MuiDialogActionsProps,
    IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const KapDialogContext = createContext<{ onClose?: (...args: any[]) => any }>({});

export type KapDialogProps<OnCloseFn extends (...args: any[]) => any> = Omit<MuiDialogProps, 'onClose'> & {
    onClose?: OnCloseFn;
};
export type KapDialogTitleProps = MuiDialogTitleProps;
export type KapDialogContentProps = MuiDialogContentProps;
export type KapDialogActionsProps = MuiDialogActionsProps;

export const KapDialog = <OnCloseFn extends (...args: any[]) => any>(props: KapDialogProps<OnCloseFn>) => {
    return (
        <KapDialogContext.Provider value={{ onClose: props.onClose }}>
            <MuiDialog fullWidth PaperProps={{ elevation: 10 }} {...props}>
                {props.children}
            </MuiDialog>
        </KapDialogContext.Provider>
    );
};

KapDialog.Title = ({ sx, children, ...props }: KapDialogTitleProps) => {
    const { onClose } = useContext(KapDialogContext);

    return (
        <MuiDialogTitle sx={{ pr: 6, ...sx }} noWrap {...props}>
            {children}
            {onClose && (
                <IconButton
                    aria-label="close"
                    onClick={(event) => onClose(event)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'action.active',
                    }}
                >
                    <Close />
                </IconButton>
            )}
        </MuiDialogTitle>
    );
};

KapDialog.Content = ({ sx, ...props }: KapDialogContentProps) => {
    if (!useContext(KapDialogContext)) {
        throw new Error('KapDialog.Content must be used inside a KapDialog component');
    }

    return <MuiDialogContent sx={{ px: 3, py: 1, ...sx }} {...props} />;
};

KapDialog.Actions = ({ sx, ...props }: KapDialogActionsProps) => {
    if (!useContext(KapDialogContext)) {
        throw new Error('KapDialog.Actions must be used inside a KapDialog component');
    }

    return <MuiDialogActions sx={{ px: 3, py: 2, ...sx }} {...props} />;
};
