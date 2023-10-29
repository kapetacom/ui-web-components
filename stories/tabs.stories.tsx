/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { TabContainer, TabPage } from '../src';

export default {
    title: 'Tab Pages',
};

export const Controlled = () => {
    const [currentTabId, setCurrentTabId] = useState('second');

    return (
        <div style={{ width: '700px', padding: '10px' }}>
            <TabContainer currentTabId={currentTabId} onTabChange={setCurrentTabId}>
                <TabPage id={'first'} title={'First Tab'}>
                    First tab page
                </TabPage>
                <TabPage id={'second'} title={'Second Tab'}>
                    Second tab page
                </TabPage>
                <TabPage id={'third'} title={'Third Tab'}>
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                    Third tab page
                    <br />
                </TabPage>
            </TabContainer>
        </div>
    );
};

export const Uncontrolled = () => {
    return (
        <div style={{ width: '700px', padding: '10px' }}>
            <TabContainer defaultTab={'second'}>
                <TabPage id={'first'} title={'First Tab'}>
                    First tab page
                </TabPage>
                <TabPage id={'second'} title={'Second Tab'}>
                    Second tab page
                </TabPage>
                <TabPage id={'third'} title={'Third Tab'}>
                    Third tab page
                </TabPage>
            </TabContainer>
        </div>
    );
};
