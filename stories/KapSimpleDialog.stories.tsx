import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';
import { KapSimpleDialog } from '../src/dialogs/KapSimpleDialog';

const meta: Meta = {
    title: 'Dialogs/KapSimpleDialog',
    component: KapSimpleDialog,
};

export default meta;

type Story = StoryObj<typeof KapSimpleDialog>;

export const Basic: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        return (
            <>
                <Button onClick={openDialog}>Open Dialog</Button>
                <KapSimpleDialog
                    open={isOpen}
                    onClose={closeDialog}
                    title="Dialog Title"
                    actions={
                        <>
                            <Button variant="contained" onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={closeDialog}>
                                Okay
                            </Button>
                        </>
                    }
                >
                    Dialog Content
                </KapSimpleDialog>
            </>
        );
    },
};
