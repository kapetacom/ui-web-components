/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { PropsWithChildren } from 'react';
import { Link, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { InfoOutlined } from '@mui/icons-material';

interface Props extends PropsWithChildren {
    sx?: SxProps<Theme>;
    readMoreLink?: string;
}

export const InfoBox = (props: Props) => {
    const infoBoxSX = {
        fontSize: '12px',
        backgroundColor: grey[100],
        padding: '10px',
        margin: 0,
        marginBottom: '10px',
        ...props.sx,
    };

    const readMoreLink = props.readMoreLink ? (
        <>
            <Link
                href={props.readMoreLink}
                target="_blank"
                sx={{
                    display: 'flex',
                    direction: 'row',
                    alignItems: 'center',
                }}
            >
                <InfoOutlined fontSize={'inherit'} sx={{ mr: '2px' }} />
                Click here to read more
            </Link>
        </>
    ) : null;

    return (
        <Typography sx={infoBoxSX}>
            {props.children}
            {readMoreLink}
        </Typography>
    );
};
