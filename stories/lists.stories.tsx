import React, { useState } from 'react';
import { List } from '../src/list/List';
import _ from 'lodash';
import { ButtonStyle, StandardIcons } from '../src';

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
                        style: ButtonStyle.DEFAULT,
                        icon: StandardIcons.VIEW,
                        on: (account) => {
                            console.log('VIEW', account);
                        },
                    },
                    {
                        style: ButtonStyle.PRIMARY,
                        icon: StandardIcons.EDIT,
                        on: (account) => {
                            console.log('EDIT', account);
                        },
                    },
                    {
                        style: ButtonStyle.DANGER,
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
