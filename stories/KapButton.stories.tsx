import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { KapButton, KapButtonProps } from '../src/button/KapButton';

const meta: Meta = {
    title: 'Buttons/KapButton',
    component: KapButton,
};

export default meta;

type Story = StoryObj<typeof KapButton>;

const buttonVariants: KapButtonProps['variant'][] = ['contained', 'outlined', 'text'];

const buttonColors: KapButtonProps['color'][] = [
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
    'inherit',
];

const buttonSizes: KapButtonProps['size'][] = ['large', 'medium', 'small'];

export const Basic: Story = {
    render: () => {
        return (
            <>
                <Box gap={1} display="flex" flexDirection="row" flexWrap="wrap">
                    {buttonColors.map((color) => (
                        <KapButton key={color} variant="contained" color={color}>
                            Label
                        </KapButton>
                    ))}
                </Box>
            </>
        );
    },
};

export const Loading: Story = {
    render: () => {
        const [loading, setLoading] = useState(false);
        const [disabled, setDisabled] = useState(false);

        return (
            <Box>
                <Stack direction="column" spacing={0}>
                    <FormControlLabel
                        control={<Switch checked={loading} onChange={() => setLoading(!loading)} />}
                        label="Loading"
                    />
                    <FormControlLabel
                        control={<Switch checked={disabled} onChange={() => setDisabled(!disabled)} />}
                        label="Disabled"
                    />
                </Stack>

                {buttonVariants.map((variant) => (
                    <Box
                        key={variant}
                        gap={1}
                        display="flex"
                        flexDirection="row"
                        flexWrap="wrap"
                        alignItems="flex-start"
                        sx={{ mt: 4 }}
                    >
                        {buttonColors.map((color) =>
                            buttonSizes.map((size) => (
                                <KapButton
                                    key={`${variant}-${color}-${size}`}
                                    variant={variant}
                                    color={color}
                                    loading={loading}
                                    size={size}
                                    disabled={disabled}
                                >
                                    Label
                                </KapButton>
                            ))
                        )}
                    </Box>
                ))}
            </Box>
        );
    },
};
