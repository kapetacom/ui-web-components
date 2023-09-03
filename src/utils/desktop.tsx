import React, { Context, PropsWithChildren, useContext } from 'react';
import { Task } from '@kapeta/ui-web-context';

export type TaskGetter = (taskId: string, cb?: (task: Task) => void | Promise<void>) => TaskState;

interface DesktopContextData {
    version?: string;
    valid: boolean;
    getTask?: TaskGetter;
}

const defaultValue: DesktopContextData = {
    valid: false,
};

export const DesktopContext: Context<DesktopContextData> = React.createContext(defaultValue);

export const useDesktop = (): DesktopContextData => {
    const desktopContext = useContext(DesktopContext);
    if (desktopContext && desktopContext.valid) {
        return desktopContext;
    }

    if (window.KapetaDesktop) {
        return {
            version: window.KapetaDesktop.version,
            valid: false,
        };
    }

    return {
        valid: false,
    };
};

interface DesktopContainerProps extends PropsWithChildren {
    version?: string;
    taskGetter?: TaskGetter;
}

export const DesktopContainer = (props: DesktopContainerProps) => {
    return (
        <DesktopContext.Provider value={{ version: props.version, valid: true, getTask: props.taskGetter }}>
            {props.children}
        </DesktopContext.Provider>
    );
};

export interface TaskState {
    task: Task | null;
    active: boolean;
    ready: boolean;
}
