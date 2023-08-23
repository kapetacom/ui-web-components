import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '../src/dialog/Dialog';
import { Button } from '@mui/material';

const meta: Meta = {
    title: 'Dialog',
    component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Simple: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        return (
            <>
                <Button onClick={openDialog}>Open Dialog</Button>
                <Dialog open={isOpen} onClose={closeDialog}>
                    <Dialog.Title>Dialog Title</Dialog.Title>
                    <Dialog.Content>Dialog Content</Dialog.Content>
                    <Dialog.Actions>
                        <Button onClick={closeDialog}>Okay</Button>
                    </Dialog.Actions>
                </Dialog>
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
                <Button onClick={openDialog}>Open Dialog</Button>
                <Dialog open={isOpen} onClose={closeDialog}>
                    <Dialog.Title>
                        This is a very long title that will not wrap but instead it will be truncated
                    </Dialog.Title>
                    <Dialog.Content>
                        The title gets truncated because it is too long. Notice that the "..." doesn't overlap with the
                        close button.
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button variant="contained" onClick={closeDialog}>
                            Alright
                        </Button>
                    </Dialog.Actions>
                </Dialog>
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
                <Button onClick={openDialog}>Open Dialog</Button>
                <Dialog open={isOpen} onClose={closeDialog}>
                    <Dialog.Title>Dialog Title</Dialog.Title>
                    <Dialog.Content dividers sx={{ borderBottom: 'none' }}>
                        The dialog content has <strong>{`dividers={true}`}</strong> but the bottom border has been
                        removed with <strong>sx={`{{ borderBottom: 'none' }}`}</strong>.
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button variant="contained" onClick={closeDialog}>
                            Okay
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </>
        );
    },
};
