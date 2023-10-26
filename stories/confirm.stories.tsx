import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { ConfirmProvider, useConfirm } from '../src/confirm';
import { useConfirmDelete, useConfirmInfo, useConfirmSuccess, useConfirmWarn } from '../src/confirm/useConfirm';
import { Tooltip } from '../src';

const meta: Meta = {
    title: 'Dialogs/Confirm',
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

const confirmHandler = (ok: boolean) => (ok ? console.log('Confirmed') : console.log('Cancelled'));

export const Basic: Story = {
    render: () => {
        const [isConfirming, setIsConfirming] = React.useState(false);
        const confirm = useConfirm();
        return (
            <Button
                onClick={async () => {
                    setIsConfirming(true);
                    confirmHandler(await confirm());
                    setIsConfirming(false);
                }}
                disabled={isConfirming}
            >
                Click
            </Button>
        );
    },
};

export const Icons: Story = {
    render: () => {
        const confirmDeletion = useConfirmDelete();
        const confirmWarn = useConfirmWarn();
        const confirmInfo = useConfirmInfo();
        const confirmSuccess = useConfirmSuccess();
        return (
            <>
                <Button
                    onClick={async () =>
                        confirmHandler(
                            await confirmDeletion('Do you want to delete this?', 'This action is permanent!')
                        )
                    }
                >
                    Delete
                </Button>

                <Button
                    onClick={async () =>
                        confirmHandler(await confirmWarn('Do you want to delete this?', 'This action is permanent!'))
                    }
                >
                    Warn
                </Button>

                <Button onClick={async () => confirmHandler(await confirmInfo('This happened!', 'Everything is fine'))}>
                    Info
                </Button>

                <Button onClick={async () => confirmHandler(await confirmSuccess('It worked!', 'Well done'))}>
                    Success
                </Button>
            </>
        );
    },
};

export const WithDescription: Story = {
    render: () => {
        const confirm = useConfirm();
        return (
            <Button
                onClick={async () => {
                    const ok = await confirm({ description: 'This action is permanent!' });
                    confirmHandler(ok);
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                        confirmationButtonProps: { color: 'error' },
                        cancellationButtonProps: { variant: 'text' },
                    }).then(confirmHandler);
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
                        .then(confirmHandler)
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                    }).then(confirmHandler);
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
                    confirm({ buttonOrder: ['confirm', 'cancel'] }).then(confirmHandler);
                }}
            >
                Click
            </Button>
        );
    },
};
