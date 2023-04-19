import React, { useState } from 'react';
import { SortableContainer, SortableItem } from '../src';

export default {
    title: 'Sortable',
};

export const SortableList = () => {
    const [accounts, setAccounts] = useState([
        { name: 'Acme', employees: 123, revenue: '15M' },
        { name: 'Microsoft', employees: 321, revenue: '50M' },
        { name: 'Apple', employees: 543, revenue: '720M' },
    ]);

    return (
        <div>
            <SortableContainer
                list={accounts}
                onUpdate={(changedList) => {
                    setAccounts(changedList);
                }}
                onChanged={(changedList) => {
                    console.log('changed list', changedList);
                }}
            >
                <div className={'sortable-list'}>
                    {accounts.map((account, ix) => {
                        return (
                            <SortableItem item={account} key={`account_${account.name}`} handle={'h3 > .handle'}>
                                <div className={'sortable-item'}>
                                    <h3>
                                        <div className={'handle'}>
                                            <i className={'fa fa-grip-vertical'} />
                                        </div>
                                        <span className={'name'}>{account.name}</span>
                                    </h3>
                                    <div className={'description'}>
                                        Employees: {account.employees} <br />
                                        Revenue: {account.revenue}
                                    </div>
                                </div>
                            </SortableItem>
                        );
                    })}
                </div>
            </SortableContainer>
        </div>
    );
};
