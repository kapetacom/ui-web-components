import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonTw, ButtonTwProps } from './buttonTw';

const meta: Meta<typeof ButtonTw> = {
    title: 'Tailwind components/Button',
    component: ButtonTw,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ButtonTw>;

const props: ButtonTwProps = {
    variant: 'primary',
    size: 'md',
};

export const Default: Story = {
    args: {
        children: 'Label',
    },
};

export const OverviewOfButtons: Story = {
    render: () => {
        const variants = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as ButtonTwProps['variant'][];
        const sizes = ['sm', 'md', 'lg'] as ButtonTwProps['size'][];

        return (
            <div className="relative overflow-x-auto ">
                <table className="text-xs font-normal text-gray-900 dark:text-gray-400">
                    <tbody>
                        <tr>
                            <td></td>
                            {sizes.map((size) => (
                                <th
                                    scope="col"
                                    className="p-3 px-3 font-normal first-of-type:border-l dark:first-of-type:border-l-gray-700"
                                    key={size}
                                >
                                    size <span className="font-mono font-bold">{size}</span>
                                </th>
                            ))}
                            <th scope="col" className="border-l p-3 px-3 font-normal dark:border-l-gray-700">
                                <span className="font-mono font-bold ">disabled</span>
                            </th>
                        </tr>
                        {variants.map((variant) => (
                            <tr key={variant}>
                                <th scope="row" className="px-3 text-left font-normal">
                                    variant <span className="font-mono font-bold">{variant}</span>
                                </th>
                                {sizes.map((size) => (
                                    <td
                                        className="px-3 py-2 first-of-type:border-l dark:first-of-type:border-l-gray-700"
                                        key={size}
                                    >
                                        <ButtonTw variant={variant} size={size}>
                                            Label
                                        </ButtonTw>
                                    </td>
                                ))}
                                <td className="border-l px-3 py-2 dark:border-l-gray-700">
                                    <ButtonTw variant={variant} size="lg" disabled>
                                        Label
                                    </ButtonTw>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    },
};

export const Link: Story = {
    name: 'Link (asChild)',
    args: {
        children: <a href="https://google.com">Google</a>,
        asChild: true,
    },
};
