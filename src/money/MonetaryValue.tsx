/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { ComponentProps } from 'react';

import { Box } from '@mui/material';

export interface FormatMonetaryValueOptions extends Intl.NumberFormatOptions {
    /**
     * The locale to use. If undefined, the browser's locale is used.
     */
    locale?: string;
}

export const formatMonetaryValue = (value: number, currency: string, options: FormatMonetaryValueOptions = {}) => {
    const { locale, ...intlOptions } = options;
    if (typeof value !== 'number' || !currency) {
        throw new Error('value and currency are required');
    }
    return new Intl.NumberFormat(locale, {
        ...intlOptions,
        style: 'currency',
        currency,
    }).format(value);
};

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
