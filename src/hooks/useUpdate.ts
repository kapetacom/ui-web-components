/**
 * Copyright 2024 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useRef, type DependencyList, type EffectCallback } from 'react';

/**
 *
 * @param effect
 * @param deps
 * @param applyChanges
 */
export function useUpdate(effect: EffectCallback, deps: DependencyList, applyChanges = true) {
    const isInitialMount = useRef(true);

    useEffect(
        isInitialMount.current || !applyChanges
            ? () => {
                  isInitialMount.current = false;
              }
            : effect,
        deps
    );
}

export default useUpdate;
