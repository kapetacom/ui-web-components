/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Link, Alert, AlertProps } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

interface Props extends AlertProps {
    readMoreLink?: string;
    readMoreText?: string;
}

export const InfoBox = (props: Props) => {
    const { variant, severity = 'info', sx, readMoreLink, readMoreText, children, icon = false, ...alertProps } = props;

    return (
        <Alert variant={variant} severity={severity} sx={{ ...sx }} {...alertProps} icon={icon}>
            {children}

            {readMoreLink ? (
                <Link
                    href={props.readMoreLink}
                    target="_blank"
                    sx={{
                        display: 'inline',
                    }}
                >
                    <InfoOutlined
                        fontSize={'inherit'}
                        sx={{
                            ml: 1,
                            mr: 0.5,
                            transform: 'translateY(2px)',
                        }}
                    />

                    {readMoreText ? readMoreText : 'Click here to read more'}
                </Link>
            ) : null}
        </Alert>
    );
};
