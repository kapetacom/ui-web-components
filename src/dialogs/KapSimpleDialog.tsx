/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import { KapDialog, KapDialogProps } from './KapDialog';

export type KapSimpleDialogProps<OnCloseFn extends (...args: any[]) => any> = PropsWithChildren<{
    open: KapDialogProps<OnCloseFn>['open'];
    onClose: (...args: any[]) => any;
    title?: ReactNode;
    actions?: ReactNode;
}>;

export const KapSimpleDialog = <OnCloseFn extends (...args: any[]) => any>({
    open,
    onClose,
    title,
    children,
    actions,
}: KapSimpleDialogProps<OnCloseFn>) => {
    return (
        <KapDialog open={open} onClose={onClose}>
            {title && <KapDialog.Title>{title}</KapDialog.Title>}
            {children && <KapDialog.Content>{children}</KapDialog.Content>}
            {actions && <KapDialog.Actions>{actions}</KapDialog.Actions>}
        </KapDialog>
    );
};
