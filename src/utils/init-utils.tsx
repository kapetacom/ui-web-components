import React, {ComponentType} from 'react';
import ReactDOM from 'react-dom/client';

import {DefaultContext} from "../containers/DefaultContext";
import {globalObject} from "./global-object";

export const initApplication = (Application:ComponentType) => {

    if (!globalObject.Blockware) {
        throw new Error('Global object not initialised. Make sure you load shared libraries first');
    }

    const root = (

        <React.StrictMode>
            <DefaultContext>
                <Application />
            </DefaultContext>
        </React.StrictMode>
    );

    const rootElm = document.getElementById('root');
    if (rootElm &&
        root) {
        ReactDOM.createRoot(rootElm).render(root);
    } else {
        throw new Error('Failed to create and render root');
    }
}