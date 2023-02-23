import React, { useCallback, useState } from 'react';
import { AssetNameInput } from '../src';

export default {
    title: 'Asset Name Input',
};

const defaultState = {
    name: 'myuser/test',
    namespaces: ['myuser'],
};

const createStory =
    (description, props, initialState = defaultState) =>
    () => {
        const [state, setState] = useState(initialState);
        const onChange = useCallback(
            (name, value) => setState((state) => ({ ...state, [name]: value })),
            [setState]
        );
        return (
            <div>
                <p>{description}</p>
                <AssetNameInput
                    name={'name'}
                    namespaces={state.namespaces}
                    onChange={onChange}
                    value={state.name}
                    label={'Name'}
                ></AssetNameInput>
                <pre>{JSON.stringify(state)}</pre>
            </div>
        );
    };

export const SingleOption = createStory(
    'Single namespace should force select the namespace',
    {}
);
export const MultiOption = createStory(
    'Should allow selecions when multiple namespaces are available',
    {},
    { name: 'blockware/test', namespaces: ['myuser', 'blockware'] }
);

export const UnknownNamespace = createStory(
    'Should prevent values outside of user namespaces',
    {},
    { name: 'supersecret/test', namespaces: ['myuser', 'blockware'] }
);
