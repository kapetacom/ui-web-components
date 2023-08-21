import { createContext } from 'react';
import { ConfirmOptions } from './types';

export const ConfirmContext = createContext<((options?: ConfirmOptions) => Promise<boolean>) | undefined>(undefined);
