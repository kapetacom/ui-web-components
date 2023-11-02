/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useContext, useState } from 'react';
import { AssetNameInput, AsyncValidatorFunction, FormContainer, FormContext } from '../src';

export default {
    title: 'Asset Name Input',
};

const defaultState = {
    name: '',
    namespaces: ['myuser'],
};

const FormState = () => {
    const context = useContext(FormContext);
    return (
        <>
            <pre>{JSON.stringify(context.container?.context)}</pre>
            <pre>{JSON.stringify(context.container?.state, null, 4)}</pre>
        </>
    );
};

const createStory =
    (description: string, _props: any, initialState = defaultState) =>
    () => {
        const [state, setState] = useState(initialState);

        const checkUnique: AsyncValidatorFunction = (name: string, value: string) => {
            let timeout: NodeJS.Timeout;
            const promise = new Promise((resolve, reject) => {
                timeout = setTimeout(() => {
                    if (value === 'kapeta/exists') {
                        reject('Name already exists');
                    } else {
                        resolve(null);
                    }
                }, 1000);
            });

            return {
                promise,
                cancel: () => {
                    clearTimeout(timeout);
                },
            };
        };

        return (
            <FormContainer initialValue={initialState}>
                <p>{description}</p>
                <AssetNameInput
                    label={'Name'}
                    name={'name'}
                    help={'Select a name for your asset. Use kapeta/exists to test unique validation'}
                    namespaces={state.namespaces}
                    validation={checkUnique}
                />
                <FormState />
            </FormContainer>
        );
    };

export const SingleOption = createStory('Single namespace should force select the namespace', {});
export const MultiOption = createStory(
    'Should allow selecions when multiple namespaces are available',
    {},
    { name: 'kapeta/test', namespaces: ['myuser', 'kapeta'] }
);

export const UnknownNamespace = createStory(
    'Should prevent values outside of user namespaces',
    {},
    { name: 'supersecret/test', namespaces: ['myuser', 'kapeta'] }
);
