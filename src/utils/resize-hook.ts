/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState } from 'react';

export const useWindowResize = <T>(cb: () => T | null, deps: any[]): T | null => {
    const [result, setResult] = useState(null);

    function doCallback() {
        setResult(cb());
    }

    useEffect(() => {
        doCallback();
        window.addEventListener('resize', doCallback);
        return () => {
            window.removeEventListener('resize', doCallback);
        };
    }, deps);

    return result;
};
