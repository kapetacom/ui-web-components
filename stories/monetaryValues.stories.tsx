import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MonetaryValue, MonetaryValueProps } from '../src/money/MonetaryValue';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const meta: Meta = {
    title: 'Monetary Values',
    component: MonetaryValue,
};
export default meta;

type Story = StoryObj<typeof MonetaryValue>;
export const MonetaryValues: Story = {
    render: () => {
        const value = 1234.5678;
        const currency = 'USD';

        const props: MonetaryValueProps[] = [
            // No options
            { value, currency },

            // notation
            { value, currency, options: { notation: 'compact' } },
            { value, currency, options: { notation: 'standard' } },

            // currencyDisplay
            { value, currency, options: { currencyDisplay: 'symbol' } },
            { value, currency, options: { currencyDisplay: 'narrowSymbol' } },
            { value, currency, options: { currencyDisplay: 'code' } },
            { value, currency, options: { currencyDisplay: 'name' } },

            // currencySign
            { value: -1 * value, currency, options: { currencySign: 'standard' } },
            { value: -1 * value, currency, options: { currencySign: 'accounting' } },

            // signDisplay
            { value: -1 * value, currency, options: { signDisplay: 'auto' } },
            { value: -1 * value, currency, options: { signDisplay: 'always' } },
            { value: -1 * value, currency, options: { signDisplay: 'exceptZero' } },
            { value: 0, currency, options: { signDisplay: 'exceptZero' } },
            { value: -1 * value, currency, options: { signDisplay: 'never' } },

            // useGrouping
            { value, currency, options: { useGrouping: true } },
            { value, currency, options: { useGrouping: false } },

            // min/max digits
            { value, currency, options: { minimumIntegerDigits: 6 } },
            { value, currency, options: { minimumFractionDigits: 4 } },
            { value, currency, options: { maximumFractionDigits: 0 } },
            { value, currency, options: { minimumSignificantDigits: 10 } },
            { value, currency, options: { maximumSignificantDigits: 2 } },
        ];
        return (
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ p: 0.5 }}>Output</TableCell>
                        <TableCell sx={{ p: 0.5 }}>Props</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.map((p) => (
                        <TableRow>
                            <TableCell sx={{ p: 0.5 }}>
                                <MonetaryValue {...p} />
                            </TableCell>

                            <TableCell sx={{ p: 0.5 }}>
                                <pre style={{ fontSize: '12px', lineHeight: '14px', margin: 0 }}>
                                    {JSON.stringify(p, null, 2)}
                                </pre>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    },
};
