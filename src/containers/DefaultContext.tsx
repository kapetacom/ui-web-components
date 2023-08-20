import React from 'react';
import { ToastContainer } from '../toast/ToastComponent';
import { ConfirmProvider } from '../confirm';

interface Props {
    children?: any;
}

export const DefaultContext = (props: Props) => {
    return (
        <div className={'application'}>
            <ConfirmProvider>{props.children}</ConfirmProvider>
            <ToastContainer />
        </div>
    );
};
