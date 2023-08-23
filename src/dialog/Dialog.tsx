import React, { createContext, useContext } from 'react';
import {
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
    DialogTitle,
    DialogTitleProps,
    DialogContent,
    DialogContentProps,
    DialogActions,
    DialogActionsProps,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type DialogProps<OnCloseFn extends (...args: any[]) => any> = Omit<MuiDialogProps, 'onClose'> & {
    onClose: OnCloseFn;
};

const DialogContext = createContext<{ onClose?: (...args: any[]) => any }>({});

export const Dialog = <OnCloseFn extends (...args: any[]) => any>(props: DialogProps<OnCloseFn>) => {
    return (
        <DialogContext.Provider value={{ onClose: props.onClose }}>
            <MuiDialog fullWidth PaperProps={{ elevation: 10 }} {...props}>
                {props.children}
            </MuiDialog>
        </DialogContext.Provider>
    );
};

Dialog.Title = ({ sx, children, ...props }: DialogTitleProps) => {
    const { onClose } = useContext(DialogContext);

    if (!onClose) {
        throw new Error('Dialog.Title must be used inside a Dialog component');
    }

    return (
        <DialogTitle sx={{ pr: 6, ...sx }} noWrap {...props}>
            {children}
            <IconButton
                aria-label="close"
                onClick={(event) => onClose(event)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'action.active',
                }}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
};

Dialog.Content = ({ sx, ...props }: DialogContentProps) => {
    if (!useContext(DialogContext)) {
        throw new Error('Dialog.Content must be used inside a Dialog component');
    }

    return <DialogContent sx={{ px: 3, py: 1, ...sx }} {...props} />;
};

Dialog.Actions = ({ sx, ...props }: DialogActionsProps) => {
    if (!useContext(DialogContext)) {
        throw new Error('Dialog.Actions must be used inside a Dialog component');
    }

    return <DialogActions sx={{ px: 3, py: 2, ...sx }} {...props} />;
};
