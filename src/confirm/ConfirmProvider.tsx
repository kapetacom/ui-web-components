import React, { useState, useCallback } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ConfirmOptions } from './types';

interface ConfirmProviderProps {
    children: React.ReactNode;
    defaultOptions?: ConfirmOptions;
}

const DEFAULT_OPTIONS: ConfirmOptions = {
    title: 'Are you sure?',
    description: '',
    content: null,
    confirmationText: 'Ok',
    cancellationText: 'Cancel',
    dialogProps: {},
    dialogActionsProps: {
        sx: { py: 2, px: 3 },
    },
    confirmationButtonProps: {
        variant: 'contained',
        color: 'primary',
    },
    cancellationButtonProps: {
        variant: 'text',
        color: 'inherit',
    },
    titleProps: {},
    contentProps: {
        sx: { py: 1, px: 3 },
    },
    allowClose: true,
    confirmationKeywordTextFieldProps: {},
    hideCancelButton: false,
    buttonOrder: ['cancel', 'confirm'],
};

const buildOptions = (defaultOptions, options) => {
    const dialogProps = {
        ...(defaultOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
        ...(options.dialogProps || {}),
    };
    const dialogActionsProps = {
        ...(defaultOptions.dialogActionsProps || DEFAULT_OPTIONS.dialogActionsProps),
        ...(options.dialogActionsProps || {}),
    };
    const confirmationButtonProps = {
        ...(defaultOptions.confirmationButtonProps || DEFAULT_OPTIONS.confirmationButtonProps),
        ...(options.confirmationButtonProps || {}),
    };
    const cancellationButtonProps = {
        ...(defaultOptions.cancellationButtonProps || DEFAULT_OPTIONS.cancellationButtonProps),
        ...(options.cancellationButtonProps || {}),
    };
    const titleProps = {
        ...(defaultOptions.titleProps || DEFAULT_OPTIONS.titleProps),
        ...(options.titleProps || {}),
    };
    const contentProps = {
        ...(defaultOptions.contentProps || DEFAULT_OPTIONS.contentProps),
        ...(options.contentProps || {}),
    };
    const confirmationKeywordTextFieldProps = {
        ...(defaultOptions.confirmationKeywordTextFieldProps || DEFAULT_OPTIONS.confirmationKeywordTextFieldProps),
        ...(options.confirmationKeywordTextFieldProps || {}),
    };

    return {
        ...DEFAULT_OPTIONS,
        ...defaultOptions,
        ...options,
        dialogProps,
        dialogActionsProps,
        confirmationButtonProps,
        cancellationButtonProps,
        titleProps,
        contentProps,
        confirmationKeywordTextFieldProps,
    };
};

type Resolver = { apply: (ok: boolean) => void };

export const ConfirmProvider = ({ children, defaultOptions = {} }: ConfirmProviderProps) => {
    const [options, setOptions] = useState<ConfirmOptions>({});
    const [resolver, setResolver] = useState<Resolver>();

    const confirm = useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(options);
            setResolver({ apply: resolve });
        });
    }, []);

    const cleanup = useCallback(() => {
        setResolver(undefined);
    }, []);

    const handleCancel = useCallback(() => {
        if (resolver) {
            resolver.apply(false);
        }
        cleanup();
    }, [resolver, cleanup]);

    const handleConfirm = useCallback(() => {
        if (resolver) {
            resolver.apply(true);
        }
        cleanup();
    }, [resolver, cleanup]);

    return (
        <>
            <ConfirmContext.Provider value={confirm}>{children}</ConfirmContext.Provider>
            <ConfirmationDialog
                open={!!resolver}
                options={buildOptions(defaultOptions, options)}
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </>
    );
};
