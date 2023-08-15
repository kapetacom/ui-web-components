import React from 'react';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { ToastContainer } from '../toast/ToastComponent';
import { Dialog } from '../dialog/Dialog';
import { ConfirmProvider } from '../confirm';

interface Props {
    children?: any;
}

export const DefaultContext = (props: Props) => {
    return (
        <div className={'application'}>
            <ConfirmProvider>
                <OverlayContainer>{props.children}</OverlayContainer>
            </ConfirmProvider>
            <ToastContainer />
            <Dialog />
        </div>
    );
};
