import React from 'react';
import {storiesOf} from '@storybook/react';
import {showToasty, ToastType, ToastContainer} from "../src";


storiesOf('Toasts', module)
    .add("Toasts", () => (
        <div style={{width: '390px', padding: '10px'}}>
            <ToastContainer />
            <button onClick={() => showToasty({
                type: ToastType.SUCCESS,
                title: 'Something good!',
                message: 'Really great stuff just happened'
            })}>Show success</button>
            <button onClick={() => showToasty({
                type: ToastType.ALERT,
                title: 'Something bad!',
                message: `Oh no this wasn't meant to happen`
            })}>Show alert</button>
            <button onClick={() => showToasty({
                type: ToastType.DANGER,
                title: 'Something ugly!',
                message: `Daaaaaaaamnit this is the end of it!`
            })}>Show danger</button>
        </div>
    ))