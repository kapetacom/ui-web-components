/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

let Z_INDEX = 1000;

let BACKDROP_COUNTER = 0;

export function openModalIndex(backdrop: boolean) {
    Z_INDEX++;
    if (backdrop) {
        BACKDROP_COUNTER++;
    }

    return {
        panelIndex: Z_INDEX,
        backgroundIndex: BACKDROP_COUNTER,
    };
}

export function closeModalIndex(backdrop: boolean) {
    Z_INDEX--;
    if (backdrop && BACKDROP_COUNTER > 0) {
        BACKDROP_COUNTER--;
    }

    return {
        panelIndex: Z_INDEX,
        backgroundIndex: BACKDROP_COUNTER,
    };
}
