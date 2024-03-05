/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback } from 'react';
import { Box, BoxProps, FormControlLabel, FormHelperText, IconButton, Switch } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { KapDialog } from '../dialogs/KapDialog';
import { KapButton } from '../button/KapButton';

export interface DevToolsProps extends BoxProps {
    enableMockApiLocalStorageKey?: string;
    enableMockApi?: (enable: boolean) => void;
}

export const DevTools = (props: DevToolsProps) => {
    const { enableMockApiLocalStorageKey, enableMockApi, ...boxProps } = props;

    const [open, setOpen] = React.useState(false);
    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);

    const [isMockingAPI, setIsMockingAPI] = React.useState<boolean>(
        !!enableMockApiLocalStorageKey && localStorage.getItem(enableMockApiLocalStorageKey) === 'true'
    );
    const toggleMockingAPI = () => {
        setIsMockingAPI((prev) => {
            const next = !prev;
            enableMockApi?.(next);
            return next;
        });
    };

    return (
        <Box {...boxProps}>
            <IconButton onClick={onOpen} size="small">
                <CodeIcon fontSize="inherit" />
            </IconButton>

            <KapDialog open={open} onClose={onClose}>
                <KapDialog.Title>DevTools</KapDialog.Title>
                <KapDialog.Content>
                    <FormControlLabel
                        control={<Switch checked={isMockingAPI} onChange={toggleMockingAPI} />}
                        label="Mock API"
                        disabled={!enableMockApi}
                    />

                    {/* API Mocking */}
                    <FormHelperText>
                        {enableMockApi
                            ? isMockingAPI
                                ? 'API mocking is enabled. Requests will be intercepted and mocked.'
                                : 'API mocking is disabled. Requests will be made as normal.'
                            : 'Provide a callback to the enableMockApi prop to enable this toggle.'}
                    </FormHelperText>
                </KapDialog.Content>
                <KapDialog.Actions>
                    <KapButton onClick={onClose}>Close</KapButton>
                </KapDialog.Actions>
            </KapDialog>
        </Box>
    );
};
