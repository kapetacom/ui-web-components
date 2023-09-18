import React, { ComponentProps } from 'react';
import { FormatMonetaryValueOptions, formatMonetaryValue } from '../utils/money';
import { Box } from '@mui/material';

export interface MonetaryValueProps extends ComponentProps<'span'> {
    value: number;
    currency: string;
    options?: FormatMonetaryValueOptions;
}

export const MonetaryValue = (props: MonetaryValueProps) => {
    const { value, currency, options } = props;

    return (
        <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
            {formatMonetaryValue(value, currency, options)}
        </Box>
    );
};
