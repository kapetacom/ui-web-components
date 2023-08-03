import React, { Context, useContext, useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { Task, TaskService, TaskStatus } from '@kapeta/ui-web-context';

interface KapetaDesktop {
    version: string;
}

interface DesktopContextData {
    version?: string;
    valid: boolean;
}

const defaultValue: DesktopContextData = {
    valid: false,
};

export const DesktopContext: Context<DesktopContextData> = React.createContext(defaultValue);

export const useDesktop = (): KapetaDesktop | null => {
    const desktopContext = useContext(DesktopContext);
    if (desktopContext && desktopContext.valid) {
        return {
            version: desktopContext.version,
        };
    }

    if (window.KapetaDesktop) {
        return window.KapetaDesktop;
    }

    return null;
};

export const DesktopContainer = ({ version, children }) => {
    return <DesktopContext.Provider value={{ version, valid: true }}>{children}</DesktopContext.Provider>;
};

interface TaskState {
    task: Task | null;
    active: boolean;
    ready: boolean;
}

/**
 * Hook to get a background task on desktop
 */
export const useDesktopTask = (taskId: string, cb?: (task: Task) => void | Promise<void>): TaskState => {
    const desktop = useDesktop();
    if (!desktop) {
        return {
            ready: true,
            active: false,
            task: null,
        };
    }

    async function handleCallback(task: Task) {
        if (cb) {
            await cb(task);
        }
    }

    const [task, setTask] = useState<Task>(null);
    const [processing, setProcessing] = useState(false);

    const loader = useAsync(async () => {
        const t = await TaskService.get(taskId);
        if (t) {
            setTask(t);
            await handleCallback(task);
        }
    }, [taskId]);

    useEffect(() => {
        return TaskService.subscribe(
            async (task) => {
                if (task.id === taskId) {
                    setTask(task);
                    setProcessing(true);
                    try {
                        await handleCallback(task);
                    } finally {
                        setProcessing(false);
                    }
                }
            },
            () => setTask(null)
        );
    }, [taskId]);

    return {
        task,
        active: task && [TaskStatus.RUNNING, TaskStatus.PENDING].includes(task.status),
        ready: !loader.loading && !processing,
    };
};
