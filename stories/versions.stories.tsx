import React from 'react';

import './styles.less';
import { VersionGraph } from '../src/blockhub/Versions';
import { VersionInfo } from './blockhub.data';

export default {
    title: 'Versions',
};

export const VersionsListView = () => {
    return (
        <div style={{ width: '600px' }}>
            <VersionGraph {...VersionInfo} />
        </div>
    );
};
