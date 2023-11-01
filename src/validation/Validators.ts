/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
export type AsyncValidationContext = { cancel: () => void; promise: Promise<any> };
export type ValidationContext = { cancel: () => void; errors: Promise<string[]>; hasAsync: boolean };
export type AsyncValidatorFunction = (fieldName: string, value: any) => AsyncValidationContext | void;
export type ValidatorFunction = AsyncValidatorFunction | string;
export type ValidatorList = ValidatorFunction[];
export type ValidatorListUnresolved = ValidatorList | string | ValidatorFunction;

let validators: { [key: string]: ValidatorFunction } = {};

validators.required = (fieldName: string, value: any) => {
    if (value === '' || value === undefined || value === null) {
        throw new Error(`This value is required`);
    }

    if (typeof value === 'object' && _.isEmpty(value)) {
        throw new Error(`This value is required`);
    }
};

validators.email = (fieldName: string, value: any) => {
    if (value && value.indexOf('@') === -1) {
        throw new Error(`Email is not valid`);
    }
};

export const Validators = validators;

export function normaliseValidators(validation?: ValidatorListUnresolved): ValidatorList {
    let validators: ValidatorList = [];
    if (validation) {
        if (Array.isArray(validation)) {
            validators = validation;
        } else {
            validators = [validation];
        }
    }
    return validators;
}

export function useValidation(active: boolean, validation: ValidatorListUnresolved, name: string, value: any) {
    const [validationContext, setValidationContext] = useState<ValidationContext>();

    useEffect(() => {
        if (!active) {
            return () => {};
        }
        const context = applyValidation(validation, name, value);
        setValidationContext(context);
        return () => {
            context.cancel();
            setValidationContext(undefined);
        };
    }, [active, validation, name, value]);

    const errors = useAsync(() => {
        return validationContext?.errors ?? (Promise.resolve([]) as Promise<string[]>);
    }, [validationContext]);

    return {
        errors: errors,
        hasAsync: validationContext?.hasAsync ?? false,
    };
}

/**
 * Debounce an async validator - e.g. if you want to wait for the user to stop typing before validating
 *
 * @param delay
 * @param func
 */
export function debouncedValidator(delay: number, func: AsyncValidatorFunction): AsyncValidatorFunction {
    return (fieldName: string, value: any) => {
        let resolver: (value?: unknown) => void, timer: NodeJS.Timeout;
        let realContext: AsyncValidationContext | undefined;
        const promise = new Promise((resolve, reject) => {
            resolver = resolve;
            timer = setTimeout(() => {
                realContext = func(fieldName, value)!;
                resolve(realContext.promise);
            }, delay);
        });

        return {
            promise,
            cancel: () => {
                clearTimeout(timer);
                resolver && resolver();
                if (realContext) {
                    realContext.cancel();
                }
            },
        };
    };
}

export function applyValidation(validation: ValidatorListUnresolved, name: string, value: any): ValidationContext {
    let validators = normaliseValidators(validation);
    let cancelled = false;
    let doResolve: (value: string[]) => void;
    let anyAsync = false;
    let currentAsyncContext: AsyncValidationContext | undefined;
    const promise = new Promise<string[]>(async (resolve) => {
        doResolve = resolve;
        const errors = [];
        for (let validator of validators) {
            if (cancelled) {
                resolve(errors);
                return;
            }
            if (typeof validator === 'string') {
                if (!Validators[validator]) {
                    throw new Error(`Unknown validator: ${validator}`);
                }

                validator = Validators[validator];
            }

            try {
                if (typeof validator === 'function') {
                    const result = validator.call(Validators, name, value);
                    if (result && result.promise) {
                        //Handle async validators
                        anyAsync = true;
                        currentAsyncContext = result;
                        await result.promise;
                        currentAsyncContext = undefined;
                    }
                }
            } catch (err) {
                if (typeof err === 'string') {
                    errors.push(err);
                } else {
                    errors.push((err as Error).message);
                }
            }
        }

        resolve(errors);
    });

    return {
        errors: promise,
        hasAsync: anyAsync,
        cancel: () => {
            cancelled = true;
            doResolve([]);
            if (currentAsyncContext) {
                currentAsyncContext.cancel();
            }
        },
    };
}
