import React from 'react';
import { ActionType, ListElement } from './ListElement';

import './List.less';

interface Props {
    data: any[];
    emptyText?: string;
    title: string;
    actions?: ActionType[];
    properties: { [key: string]: { type: string; label: string } };
}

export const List = (props: Props) => {
    return (
        <div className={'component-list'}>
            {props.data.map((entry, ix) => {
                return (
                    <ListElement
                        key={`list_element_${ix}`}
                        title={props.title}
                        actions={props.actions}
                        properties={props.properties}
                        entry={entry}
                    />
                );
            })}

            {props.data.length === 0 && (
                <div className={'empty'}>
                    {props.emptyText || 'No elements found'}
                </div>
            )}
        </div>
    );
};
