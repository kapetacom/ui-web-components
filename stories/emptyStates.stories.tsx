import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { EmptyStateBox } from '../src/helpers/EmptyStateBox';
import { Button } from '@mui/material';

const meta: Meta = {
    title: 'Empty States',
    component: EmptyStateBox,
};

export default meta;

type Story = StoryObj<typeof EmptyStateBox>;

export const Default: Story = {
    args: {
        title: 'Nothing here yet',
    },
};

export const WithDescription: Story = {
    args: {
        title: 'Nothing here yet',
        description: 'Slightly longer body text goes here',
    },
};

export const WithButton: Story = {
    args: {
        title: 'Nothing here yet',
        description: 'Slightly longer body text goes here',
        button: (
            <Button variant="text" color="primary">
                Button
            </Button>
        ),
    },
};

export const WithUsageIcon: Story = {
    args: {
        title: 'No registred usage',
        description: 'Your unbilled usage will be listed here',
        icon: 'usage',
    },
};

export const WithCardIcon: Story = {
    args: {
        title: 'No stored cards',
        description: 'Add a payment card to get the full benefit out of Kapeta',
        icon: 'card',
        button: (
            <Button variant="text" color="primary">
                Add card now
            </Button>
        ),
    },
};

export const WithInvoiceIcon: Story = {
    args: {
        title: 'No invoices to display',
        description: 'Your invoice for this billing cycle will appear here once it is generated',
        icon: 'invoice',
    },
};
