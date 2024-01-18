/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useContext } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmOptions } from './types';
import { CheckCircleOutlined, Delete, Info, Warning } from '@mui/icons-material';
import { Box, ButtonProps } from '@mui/material';

export const useConfirm = (): ((options?: ConfirmOptions) => Promise<boolean>) => {
    const confirm = useContext(ConfirmContext);
    if (!confirm) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return confirm;
};

export const useConfirmIcon = (icon: React.ReactNode, color: ButtonProps['color'], defaultOptions?: ConfirmOptions) => {
    const confirm = useConfirm();

    const iconContainer = (
        <Box width={'100px'} textAlign={'center'}>
            <Box
                borderRadius={'50%'}
                bgcolor={`${color}.light`}
                width={'35px'}
                height={'35px'}
                p={2}
                boxSizing={'content-box'}
                display={'inline-block'}
                fontSize={'35px'}
                color={`${color}.contrastText`}
            >
                {icon}
            </Box>
        </Box>
    );

    return (title: string, description?: string, options?: ConfirmOptions) => {
        return confirm({
            title: title,
            description: description,
            icon: iconContainer,
            confirmationButtonProps: {
                color: color,
            },
            ...options,
            ...defaultOptions,
        });
    };
};

export const useConfirmDelete = () => {
    return useConfirmIcon(<Delete fontSize={'inherit'} />, 'error');
};

export const useConfirmWarn = () => {
    return useConfirmIcon(<Warning fontSize={'inherit'} />, 'warning');
};

export const useConfirmInfo = () => {
    return useConfirmIcon(<Info fontSize={'inherit'} />, 'info', {
        hideCancelButton: true,
    });
};

export const useConfirmSuccess = () => {
    return useConfirmIcon(<CheckCircleOutlined fontSize={'inherit'} />, 'success', {
        hideCancelButton: true,
    });
};
