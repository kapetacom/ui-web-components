import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { ConfirmProvider, useConfirm } from '../src/confirm';

const meta: Meta = {
    title: 'MUI Confirmation Dialog',
    component: Button,
    decorators: [
        (Story) => (
            <ConfirmProvider>
                <Story />
            </ConfirmProvider>
        ),
    ],
    argTypes: {
        onClick: { action: 'Open confirmation dialog' },
    },
};
export default meta;

type Story = StoryObj<typeof Button>;

const confirmationAction = () => console.log('Confirmed');
const cancellationAction = () => console.log('Cancelled');

export const Basic: Story = {
    render: () => {
        const confirm = useConfirm();
        return <Button onClick={() => confirm().then(confirmationAction)}>Click</Button>;
    },
};

export const WithDescription: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({ description: 'This action is permanent!' }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

// Continuing from where we left off...

export const WithCustomText: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        title: 'Reset setting?',
                        description: 'This will reset your device to its factory settings.',
                        confirmationText: 'Accept',
                        cancellationText: 'Cancel',
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithDialogProps: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        dialogProps: { disableEscapeKeyDown: true, maxWidth: 'xs' },
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithDialogActionsProps: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        dialogActionsProps: { sx: { justifyContent: 'flex-start' } },
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithCustomButtonProps: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        confirmationButtonProps: { color: 'error', variant: 'contained' },
                        cancellationButtonProps: { variant: 'text' },
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithCustomCallbacks: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm()
                        .then(confirmationAction)
                        .catch(cancellationAction)
                        .finally(() => console.log('closed'));
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithCustomElements: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        title: (
                            <Tooltip title="Fancy tooltip here!">
                                <span>Reset setting?</span>
                            </Tooltip>
                        ),
                        description: <LinearProgress />,
                        confirmationText: 'Accept',
                        cancellationText: 'Cancel',
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithCustomContent: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        content: (
                            <div>
                                <LinearProgress />
                                <Box p={2}>This isn't wrapped in DialogContentText.</Box>
                            </div>
                        ),
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithNaturalCloseDisabled: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        allowClose: false,
                    })
                        .then(confirmationAction)
                        .catch(cancellationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithConfirmationKeyword: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        description: 'This action is permanent. Please enter "DELETE" to confirm the action.',
                        confirmationKeyword: 'DELETE',
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithConfirmationKeywordAndCustomTextFieldProps: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({
                        confirmationKeyword: 'DELETE',
                        confirmationKeywordTextFieldProps: {
                            label: 'Enter DELETE',
                            variant: 'standard',
                        },
                    }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};

export const WithReversedButtons: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={() => {
                    confirm({ buttonOrder: ['confirm', 'cancel'] }).then(confirmationAction);
                }}
            >
                Click
            </Button>
        );
    },
};
