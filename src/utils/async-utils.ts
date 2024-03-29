/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

export const asyncTimeout = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const asyncInterval = (callback: () => Promise<any>, ms: number) => {
    let out = {
        resource: null as null | NodeJS.Timeout,
        cancel() {
            if (this.resource) {
                clearTimeout(this.resource);
            }
            this.resource = null;
        },
    };
    const timer = async () => {
        await callback();
        out.resource = setTimeout(timer, ms);
    };

    out.resource = setTimeout(timer, ms);

    return out;
};

export const asDelayed = async <T = any>(data: T, ms: number): Promise<T> => {
    await asyncTimeout(ms);

    return data;
};

export const withDelay = async <T = any>(func: () => Promise<T>, ms: number): Promise<T> => {
    const result: T = await func();

    return asDelayed(result, ms);
};
