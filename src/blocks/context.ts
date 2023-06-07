import { BlockDefinition, BlockInstance } from '@kapeta/schemas';
import { InstanceStatus } from '@kapeta/ui-web-context';
import { createContext } from 'react';

export const BlockContext = createContext<{
    readOnly?: boolean;
    definition?: BlockDefinition;
    instance?: BlockInstance;
    status?: InstanceStatus;
    callbacks: {
        onInstanceNameChange?: (name: string) => void;
    };
}>({
    readOnly: false,
    callbacks: {
        onInstanceNameChange: undefined,
    },
});
export const BlockContextProvider = BlockContext.Provider;
