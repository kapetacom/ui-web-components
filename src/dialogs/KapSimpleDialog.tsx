import React, { ReactNode } from 'react';
import { KapDialog, KapDialogProps } from './KapDialog';

export type KapSimpleDialogProps<OnCloseFn extends (...args: any[]) => any> = {
    open: KapDialogProps<OnCloseFn>['open'];
    onClose: (...args: any[]) => any;
    title?: ReactNode;
    content?: ReactNode;
    actions?: ReactNode;
};

export const KapSimpleDialog = <OnCloseFn extends (...args: any[]) => any>({
    open,
    onClose,
    title,
    content,
    actions,
}: KapSimpleDialogProps<OnCloseFn>) => {
    return (
        <KapDialog open={open} onClose={onClose}>
            {title && <KapDialog.Title>{title}</KapDialog.Title>}
            {content && <KapDialog.Content>{content}</KapDialog.Content>}
            {actions && <KapDialog.Actions>{actions}</KapDialog.Actions>}
        </KapDialog>
    );
};
