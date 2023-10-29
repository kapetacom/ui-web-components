/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { BlockDefinition, BlockInstance } from '@kapeta/schemas';
import { InstanceStatus } from '@kapeta/ui-web-context';
import { createContext } from 'react';

export interface BlockContextData {
    readOnly?: boolean;
    definition?: BlockDefinition | undefined;
    instance?: BlockInstance | undefined;
    status?: InstanceStatus | undefined;
    callbacks: {
        onInstanceNameChange?: (name: string) => void;
    };
}

export const BlockContext = createContext<BlockContextData>({
    readOnly: false,
    callbacks: {
        onInstanceNameChange: undefined,
    },
});
export const BlockContextProvider = BlockContext.Provider;
