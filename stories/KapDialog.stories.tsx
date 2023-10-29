/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { KapDialog } from '../src/dialogs/KapDialog';
import { Button } from '@mui/material';

const meta: Meta = {
    title: 'Dialogs/KapDialog',
    component: KapDialog,
};

export default meta;

type Story = StoryObj<typeof KapDialog>;

export const Basic: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        return (
            <>
                <Button onClick={openDialog} disabled={isOpen}>
                    Open Dialog
                </Button>
                <KapDialog open={isOpen} onClose={closeDialog}>
                    <KapDialog.Title>Dialog Title</KapDialog.Title>
                    <KapDialog.Content>Dialog Content</KapDialog.Content>
                    <KapDialog.Actions>
                        <Button onClick={closeDialog}>Okay</Button>
                    </KapDialog.Actions>
                </KapDialog>
            </>
        );
    },
};

export const LongTitle: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        return (
            <>
                <Button onClick={openDialog} disabled={isOpen}>
                    Open Dialog
                </Button>
                <KapDialog open={isOpen} onClose={closeDialog}>
                    <KapDialog.Title>
                        This is a very long title that will not wrap but instead it will be truncated
                    </KapDialog.Title>
                    <KapDialog.Content>
                        The title gets truncated because it is too long. Notice that the "..." doesn't overlap with the
                        close button.
                    </KapDialog.Content>
                    <KapDialog.Actions>
                        <Button variant="contained" onClick={closeDialog}>
                            Alright
                        </Button>
                    </KapDialog.Actions>
                </KapDialog>
            </>
        );
    },
};

export const WithStyleTweaks: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        return (
            <>
                <Button onClick={openDialog} disabled={isOpen}>
                    Open Dialog
                </Button>
                <KapDialog open={isOpen} onClose={closeDialog}>
                    <KapDialog.Title>Dialog Title</KapDialog.Title>
                    <KapDialog.Content dividers sx={{ borderBottom: 'none' }}>
                        The dialog content has <strong>{`dividers={true}`}</strong> but the bottom border has been
                        removed with <strong>sx={`{{ borderBottom: 'none' }}`}</strong>.
                    </KapDialog.Content>
                    <KapDialog.Actions>
                        <Button variant="contained" onClick={closeDialog}>
                            Okay
                        </Button>
                    </KapDialog.Actions>
                </KapDialog>
            </>
        );
    },
};
