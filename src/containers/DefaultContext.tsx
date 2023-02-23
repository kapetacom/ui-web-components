import React from 'react';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { ToastContainer } from '../toast/ToastComponent';
import { Dialog } from '../dialog/Dialog';

interface Props {
    children?: any;
}

export const DefaultContext = (props: Props) => {
    return (
        <div className={'application'}>
            <OverlayContainer>{props.children}</OverlayContainer>
            <ToastContainer />
            <Dialog />
        </div>
    );
};
