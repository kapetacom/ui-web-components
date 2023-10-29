/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { useMemo } from 'react';

interface Result<T = any> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
    reject: (err?: any) => void;
}

export const usePromise = <T>() => {
    return useMemo((): Result<T> => {
        let resolver, rejector;

        const promise = new Promise<T>((resolve, reject) => {
            resolver = resolve;
            rejector = reject;
        });

        return {
            promise,
            resolve: resolver ? resolver : () => {},
            reject: rejector ? rejector : () => {},
        };
    }, []);
};
