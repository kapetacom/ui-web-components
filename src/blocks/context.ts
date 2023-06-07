import { BlockDefinition, BlockInstance } from '@kapeta/schemas';
import { InstanceStatus } from '@kapeta/ui-web-context';
import { createContext } from 'react';

export const BlockContext = createContext<{
    readOnly?: boolean;
    definition?: BlockDefinition | null;
    instance?: BlockInstance | null;
    status?: InstanceStatus;
    callbacks: {
        onInstanceNameChange: (name: string) => void;
    };
}>({
    readOnly: true,
    definition: null,
    instance: null,
    status: null,
    callbacks: {
        onInstanceNameChange: () => {},
    },
});
export const BlockContextProvider = BlockContext.Provider;
