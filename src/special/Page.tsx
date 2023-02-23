import React from 'react';

import { toClass } from '@blockware/ui-web-utils';

import './Page.less';

export interface PageProps {
    type: string;
    title?: string;
    introduction?: string;
    children: any;
}

export const Page = (props: PageProps) => {
    return (
        <div className={toClass({ page: true, [props.type]: true })}>
            {props.title && <h2>{props.title}</h2>}
            {props.introduction && (
                <p className={'introduction'}>{props.introduction}</p>
            )}

            {props.children}
        </div>
    );
};
