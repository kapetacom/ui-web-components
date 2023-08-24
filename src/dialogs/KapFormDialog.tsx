import React, { ReactNode } from 'react';
import { KapDialog, KapDialogProps } from './KapDialog';
import { FormContainer, FormContainerProps } from '../form/FormContainer';

export type KapFormDialogProps<OnCloseFn extends (...args: any[]) => any> = {
    open: KapDialogProps<OnCloseFn>['open'];
    onClose: OnCloseFn;
    title?: ReactNode;
    content?: ReactNode;
    actions?: ReactNode;
} & Omit<FormContainerProps, 'children'>;

export const KapFormDialog = <OnCloseFn extends (...args: any[]) => any>({
    open,
    onClose,
    title,
    content,
    actions,
    ...formContainerProps
}: KapFormDialogProps<OnCloseFn>) => {
    return (
        <KapDialog open={open} onClose={onClose}>
            <FormContainer {...formContainerProps}>
                {title && <KapDialog.Title>{title}</KapDialog.Title>}
                {content && <KapDialog.Content>{content}</KapDialog.Content>}
                {actions && <KapDialog.Actions>{actions}</KapDialog.Actions>}
            </FormContainer>
        </KapDialog>
    );
};
