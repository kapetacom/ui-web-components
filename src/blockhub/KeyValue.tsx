import React from 'react';

import './KeyValue.less';

interface KeyValueRowProps {
    children: any;
}

export const KeyValueRow = (props: KeyValueRowProps) => {
    return <div className={'key-value-row'}>{props.children}</div>;
};

interface KeyValueProps {
    label: string;
    value: any;
}

export const KeyValue = (props: KeyValueProps) => {
    return (
        <div className={'key-value'}>
            <div className={'label'}>{props.label}</div>
            <div className={'value'}>{props.value}</div>
        </div>
    );
};
