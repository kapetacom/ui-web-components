/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { List } from '../src/list/List';
import _ from 'lodash';
import { StandardIcons } from '../src';

export default {
    title: 'Lists',
};

export const SimpleList = () => {
    const [accounts, setAccounts] = useState([
        { name: 'Acme', employees: 123, revenue: '15M' },
        { name: 'Microsoft', employees: 321, revenue: '50M' },
        { name: 'Apple', employees: 543, revenue: '720M' },
    ]);

    return (
        <div>
            <List
                title={'name'}
                properties={{
                    employees: { label: 'Employees', type: 'string' },
                    revenue: { label: 'Revenue', type: 'string' },
                }}
                actions={[
                    {
                        color: 'inherit',
                        icon: StandardIcons.VIEW,
                        on: (account) => {
                            console.log('VIEW', account);
                        },
                    },
                    {
                        color: 'primary',
                        icon: StandardIcons.EDIT,
                        on: (account) => {
                            console.log('EDIT', account);
                        },
                    },
                    {
                        color: 'error',
                        icon: StandardIcons.DELETE,
                        on: (account) => {
                            _.pull(accounts, account);
                            setAccounts([...accounts]);
                        },
                    },
                ]}
                data={accounts}
            />
        </div>
    );
};
