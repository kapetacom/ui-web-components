import React from 'react';
import {storiesOf} from '@storybook/react';
import {Dialog, DialogControl, DialogTypes, PromptInputType} from '../src';

DialogControl.setTitle("test title");

storiesOf('Dialogs', module)
    .add(" Delete Dialog", () => (
        <div style={{width: '390px', padding: '10px'}}>
            <button onClick={() => {
                if (DialogControl.open) {
                    DialogControl.hide();
                } else {
                    DialogControl.setAcceptAction(() => {});
                    DialogControl.show(null,null,null,DialogTypes.DELETE);
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
    ))

    .add(" Confirmation Dialog", () => (
        <div style={{width: '390px', padding: '10px'}}>
            <button onClick={() => {
                if (DialogControl.open) {
                    DialogControl.hide();
                } else {
                    DialogControl.show("Test confirmation title!",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    ()=>{},
                    DialogTypes.CONFIRMATION,
                    PromptInputType.TEXT
                    );
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
    ))

    .add(" Prompt Dialog", () => (
        <div style={{width: '390px', padding: '10px'}}>
            <button onClick={() => {
                if (DialogControl.open) {
                    DialogControl.hide();
                } else {
                    DialogControl.show("Test prompt title!",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    (value)=> console.log("Value from prompt callback:", value),
                    DialogTypes.PROMPT,
                    PromptInputType.TEXT
                    );
                }
            }}>Open propmpt dialog with input type text </button>
                        <button onClick={() => {
                if (DialogControl.open) {
                    DialogControl.hide();
                } else {
                    DialogControl.show("Test prompt title!",
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
                    (value)=> console.log("Value from prompt callback:", value),
                    DialogTypes.PROMPT,
                    PromptInputType.NUMBER
                    );
                }
            }}>Open propmpt dialog with input type number </button>
            <button type="button" onClick={() => {
                DialogControl.setTitle("Some title!");
                DialogControl.setText("Some Text ");
            }}>set title to : Random string
            </button>
            <button type="button" onClick={() => {
                DialogControl.setTitle("Random string")

            }}>set title to : Random string
            </button>
            <Dialog/>
        </div>
    ))