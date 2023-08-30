import React, { PropsWithChildren, ReactNode } from 'react';
import { KapDialog, KapDialogProps } from './KapDialog';
import { FormContainer, FormContainerProps } from '../form/FormContainer';

export type KapFormDialogProps<OnCloseFn extends (...args: any[]) => any> = PropsWithChildren<{
    open: KapDialogProps<OnCloseFn>['open'];
    onClose: OnCloseFn;
    title?: ReactNode;
    actions?: ReactNode;
}> &
    Omit<FormContainerProps, 'children'>;

export const KapFormDialog = <OnCloseFn extends (...args: any[]) => any>({
    open,
    onClose,
    title,
    children,
    actions,
    ...formContainerProps
}: KapFormDialogProps<OnCloseFn>) => {
    return (
        <KapDialog open={open} onClose={onClose}>
            <FormContainer {...formContainerProps}>
                {title && <KapDialog.Title>{title}</KapDialog.Title>}
                {children && <KapDialog.Content>{children}</KapDialog.Content>}
                {actions && (
                    <KapDialog.Actions
                        sx={
                            // Remove the padding from form-buttons if the dialog actions has such.
                            // This is to avoid double padding
                            { '.MuiStack-root.form-buttons': { pt: 0 } }
                        }
                    >
                        {actions}
                    </KapDialog.Actions>
                )}
            </FormContainer>
        </KapDialog>
    );
};
