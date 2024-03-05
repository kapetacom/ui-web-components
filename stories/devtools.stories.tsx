import { Meta } from '@storybook/react';
import { DevTools } from '../src/devtools/DevTools';
import React from 'react';

const meta: Meta = {
    title: 'DevTools',
    component: DevTools,
};

export default meta;

export const Basic = () => {
    return <DevTools enableMockApiLocalStorageKey="enableMockApi" enableMockApi={console.log} />;
};

export const WithoutAPIMocking = () => {
    return <DevTools />;
};
