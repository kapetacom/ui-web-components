/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

interface Props {
    list: any[];
    empty?: string;
    item: (item: any) => any;
}

export const ElementList = (props: Props) => {
    const empty = props.empty || 'No elements found';

    return (
        <ul className={'element-list'}>
            {props.list.length > 0 &&
                props.list.map((item, key) => {
                    return <li key={key}>{props.item(item)}</li>;
                })}

            {props.list.length === 0 && <li className={'empty'}>{empty}</li>}
        </ul>
    );
};
