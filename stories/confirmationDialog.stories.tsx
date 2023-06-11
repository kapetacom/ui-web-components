import React from 'react';
import { Dialog, DialogControl, OverlayContainer, showConfirm, showDelete, showPrompt, Type } from '../src';

DialogControl.setTitle('test title');

export default {
    title: 'Dialogs',
};

export const DeleteDialog = () => (
    <div style={{ width: '390px', padding: '10px' }}>
        <OverlayContainer>
            <button
                onClick={async () => {
                    const ok = await showDelete('Delete this?', 'Are you sure?');
                    ok && alert('Deleted!');
                }}
            >
                Open dialog
            </button>
            <Dialog />
        </OverlayContainer>
    </div>
);

DeleteDialog.story = {
    name: ' Delete Dialog',
};

export const ConfirmationDialog = () => (
    <div style={{ width: '390px', padding: '10px' }}>
        <OverlayContainer>
            <button
                onClick={async () => {
                    const ok = await showConfirm('Proceed?', 'Are you sure?');
                    ok && alert('Proceeding!');
                }}
            >
                Open dialog
            </button>
            <Dialog />
        </OverlayContainer>
    </div>
);

ConfirmationDialog.story = {
    name: ' Confirmation Dialog',
};

export const PromptDialog = () => (
    <div style={{ width: '390px', padding: '10px' }}>
        <OverlayContainer>
            <button
                onClick={async () => {
                    const name = await showPrompt('Your name please?', 'Input your name');
                    alert(`Your name is: ${name}`);
                }}
            >
                Open prompt dialog with input type text
            </button>
            <button
                onClick={async () => {
                    const age = await showPrompt('Your name please?', 'Input your name', Type.NUMBER);
                    alert(`Your age is: ${age}`);
                }}
            >
                Open prompt dialog with input type number
            </button>
            <Dialog />
        </OverlayContainer>
    </div>
);

PromptDialog.story = {
    name: ' Prompt Dialog',
};
