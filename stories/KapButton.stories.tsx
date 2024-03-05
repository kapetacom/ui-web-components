/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

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

export const CustomStyle: Story = {
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

                <KapButton
                    // Just some random styles to show that you can style the button as you like
                    sx={{
                        mt: 2,
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        color: 'white',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        fontFamily: 'Garamond, serif',
                        outline: '3px solid green',
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .5)',
                        },
                        '&.Mui-disabled': {
                            background: 'linear-gradient(45deg, #CCCCCC 30%, #EEEEEE 90%)',
                            color: '#666666',
                            fontStyle: 'normal',
                            outline: '3px dotted pink',
                            boxShadow: 'none',
                            cursor: 'not-allowed',
                        },
                    }}
                    loading={loading}
                    disabled={disabled}
                >
                    Funky button
                </KapButton>
            </Box>
        );
    },
};
