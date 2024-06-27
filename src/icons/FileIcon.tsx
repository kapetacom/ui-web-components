import React, { ForwardedRef, forwardRef } from 'react';
import { getIcon } from 'material-file-icons';
import { Box, SvgIconProps } from '@mui/material';

export interface FileIconProps extends Pick<SvgIconProps, 'fontSize'> {
    filename: string;
}

export const FileIcon = forwardRef((props: FileIconProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { filename, fontSize, ...rest } = props;

    let scale = 1;
    if (fontSize === 'small') {
        scale = 1.429;
    } else if (fontSize === 'medium') {
        scale = 1.7145;
    } else if (fontSize === 'large') {
        scale = 2.5;
    } else if (fontSize === 'inherit') {
        scale = 1;
    }

    return (
        <Box
            ref={ref}
            {...rest}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1em',
                height: '1em',
                fontSize: `${scale}em`,
            }}
            dangerouslySetInnerHTML={{ __html: getIcon(filename).svg }}
        />
    );
});
