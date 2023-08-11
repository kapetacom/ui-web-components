import React from 'react';
import { BlockContext, BlockContextData } from './context';

export const useBlock = (): BlockContextData => {
    // If we need to make transforms to the context value, we can do that here.
    return React.useContext(BlockContext);
};
