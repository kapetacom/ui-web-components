import React, { PropsWithChildren } from 'react';
import { FormFieldController } from '../formFieldController';
import { Box, CircularProgress } from '@mui/material';

interface Props extends PropsWithChildren {
    controller: FormFieldController;
}

export const FormFieldProcessingContainer = (props: Props) => {
    return (
        <Box position={'relative'}>
            {props.children}
            {props.controller.processing && (
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: '24px',
                        right: '16px',
                    }}
                    size={16}
                />
            )}
        </Box>
    );
};
