import React from 'react';
import {storiesOf} from '@storybook/react';
import {Dialog, DialogControl} from '../src';

DialogControl.setTitle("test title");

storiesOf('Confirm dialog', module)
    .add("Dialog sandbox", () => (
        <div style={{width: '390px', padding: '10px'}}>
            <button onClick={() => {
                if (DialogControl.open) {
                    DialogControl.hide();
                } else {
                    DialogControl.setAcceptAction(() => {});
                    DialogControl.show();
                }
            }}>Open dialog</button>
            <button type="button" onClick={() => {
                DialogControl.setTitle("Some title!");
                DialogControl.setText("Some text!");
            }}>set title to : Random string
            </button>
            <button type="button" onClick={() => {
                DialogControl.setTitle("Random string")

            }}>set title to : Random string
            </button>
            <Dialog/>
        </div>
    ));



