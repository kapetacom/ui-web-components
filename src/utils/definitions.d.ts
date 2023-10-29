/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

declare interface KapetaDesktop {
    version: string;
}

declare global {
    interface Window {
        KapetaDesktop?: KapetaDesktop;
    }
}

export {};
