import {
    ButtonProps,
    DialogActionsProps,
    DialogContentProps,
    DialogProps,
    DialogTitleProps,
    TextFieldProps,
} from '@mui/material';

export interface ConfirmOptions {
    title?: React.ReactNode;
    titleProps?: DialogTitleProps;
    description?: React.ReactNode;
    content?: React.ReactNode | null;
    contentProps?: DialogContentProps;
    confirmationText?: React.ReactNode;
    icon?: React.ReactNode;
    cancellationText?: React.ReactNode;
    dialogProps?: Omit<DialogProps, 'open'>;
    dialogActionsProps?: DialogActionsProps;
    confirmationButtonProps?: ButtonProps;
    cancellationButtonProps?: ButtonProps;
    allowClose?: boolean;
    confirmationKeyword?: string;
    confirmationKeywordTextFieldProps?: TextFieldProps;
    hideCancelButton?: boolean;
    buttonOrder?: string[];
}
