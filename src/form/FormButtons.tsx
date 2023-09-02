import React, { useContext } from 'react';
import { FormContext } from './FormContext';
import { Box, BoxProps, Button } from '@mui/material';
import { KapButton } from '../button/KapButton';

export type FormButtonsProps = {
    /**
     * Add a wrapper div around the buttons with gap between them and right alignment.
     */
    addWrapperDiv?: boolean;
    children: React.ReactNode;
} & BoxProps;

const FormButtons: React.FC<FormButtonsProps> = ({ addWrapperDiv = true, sx, children }) => {
    const context = useContext(FormContext);

    const newChildren = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            const { props } = child;

            const isButton = child.type === 'button';
            const isMuiButton = child.type === Button;
            const isKapButton = child.type === KapButton;
            const isSubmitButton = props.type === 'submit';

            if (isButton || isMuiButton || isKapButton) {
                return (
                    <KapButton
                        key={index}
                        {...props}
                        loading={isSubmitButton && context.processing}
                        disabled={
                            typeof props.disabled === 'boolean'
                                ? // If the consumer passes the disabled prop we use it.
                                  props.disabled
                                : // Otherwise we use the form context.
                                  isSubmitButton && (!context.isDirty || !context.valid || context.processing)
                        }
                    >
                        {props.children}
                    </KapButton>
                );
            }
            return child;
        }
        return child;
    });

    return addWrapperDiv ? (
        <Box
            className="form-buttons"
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            sx={{
                gap: 2,
                pt: 4,
                ...sx,
            }}
        >
            {newChildren}
        </Box>
    ) : (
        newChildren
    );
};

export { FormButtons };
