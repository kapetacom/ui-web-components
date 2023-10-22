import React, { PropsWithChildren } from 'react';
import { Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

interface Props extends PropsWithChildren {
    sx?: SxProps<Theme>;
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

    return <Typography sx={infoBoxSX}>{props.children}</Typography>;
};
