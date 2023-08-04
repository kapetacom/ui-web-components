import { useEffect } from 'react';

export const useWindowResize = (cb: () => void, deps: any[]) => {
    useEffect(() => {
        cb();
        window.addEventListener('resize', cb);
        return () => {
            window.removeEventListener('resize', cb);
        };
    }, deps);
};
