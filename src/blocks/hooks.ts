import React from 'react';
import { BlockContext } from './context';

export const useBlock = () => {
    // If we need to make transforms to the context value, we can do that here.
    return React.useContext(BlockContext);
};
