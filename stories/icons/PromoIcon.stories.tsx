import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PromoIcon } from '../../src/icons/PromoIcon';

const meta: Meta = {
    title: 'Icons/PromoIcon',
    component: PromoIcon,
};

export default meta;

type Story = StoryObj<typeof PromoIcon>;

export const Basic: Story = {
    args: {
        fontSize: 'large',
    },
};
