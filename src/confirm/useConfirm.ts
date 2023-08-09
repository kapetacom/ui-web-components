import { useContext } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmOptions } from './types';

const useConfirm = (): ((options?: ConfirmOptions) => Promise<void>) => {
    const confirm = useContext(ConfirmContext);
    if (!confirm) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return confirm;
};

export { useConfirm };
