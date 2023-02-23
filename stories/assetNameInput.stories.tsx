import React, { useCallback, useContext, useState } from 'react';
import {
    AssetNameInput,
    FormContainer,
    FormContext,
    useFormContextField,
} from '../src';

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
    (description, props, initialState = defaultState) =>
    () => {
        const [state, setState] = useState(initialState);
        const onChange = useCallback(
            (name, value) => setState((state) => ({ ...state, [name]: value })),
            [setState]
        );
        return (
            <FormContainer initialValue={initialState}>
                <p>{description}</p>
                <AssetNameInput
                    label={'Name'}
                    name={'name'}
                    namespaces={state.namespaces}
                ></AssetNameInput>
                <FormState />
            </FormContainer>
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
