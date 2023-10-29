/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { Context, useContext, useEffect, useMemo } from 'react';
import { FormContainer } from './FormContainer';
import { ValidatorList } from '../validation/Validators';

export type ResetListener = (value: any) => void;

interface FormContextData {
    valid: boolean;
    validators?: ValidatorList;
    processing: boolean;
    isDirty: boolean;
    container?: FormContainer;
    onReadyStateChanged: (childName: any, ready: boolean) => void;
    onValueChanged: (name: string, value: any) => void;
    onReset(name: string, callback: ResetListener): () => void;
}

export interface FormContextType extends Context<FormContextData> {}

const defaultValue: FormContextData = {
    valid: false,
    validators: [],
    processing: false,
    isDirty: false,
    onReadyStateChanged: () => {},
    onValueChanged: () => {},
    onReset: () => {
        return () => {};
    },
};

export const FormContext: FormContextType = React.createContext(defaultValue);

export function useFormContextField<T = any>(fieldName: string, resetHandler?: ResetListener) {
    const context = useContext(FormContext);

    useEffect(() => {
        if (!resetHandler) {
            return () => {};
        }
        return context.onReset(fieldName, resetHandler);
    }, [fieldName, resetHandler]);

    useEffect(() => {
        return () => {
            //We mark fields as ready when they get detached
            context.onReadyStateChanged(fieldName, true);
        };
    }, []);

    return useMemo(() => {
        return {
            get(defaultValue?: T): T {
                return context.container?.getValue(fieldName) ?? defaultValue;
            },
            set(value: T) {
                context.onValueChanged(fieldName, value);
            },
            valid() {
                context.onReadyStateChanged(fieldName, true);
            },
            invalid() {
                context.onReadyStateChanged(fieldName, false);
            },
        };
    }, [fieldName, context.container]);
}

export function FormContextWatcher({ onChange }: { onChange: (context: FormContextData) => void }) {
    const context = useContext(FormContext);
    useEffect(() => {
        onChange(context);
        return () => {};
    });
    return null;
}
