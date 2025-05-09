/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from 'react';
import { toClass } from '@kapeta/ui-web-utils';

import './SimpleLoader.less';

export enum LoaderType {
    CIRCLE = 'circle',
    DUAL_RING = 'dual-ring',
    FACEBOOK = 'facebook',
    HEART = 'heart',
    RING = 'ring',
    ROLLER = 'roller',
    DEFAULT = 'default',
    ELLIPSIS = 'ellipsis',
    GRID = 'grid',
    HOURGLASS = 'hourglass',
    RIPPLE = 'ripple',
    SPINNER = 'spinner',
}

const DIV_COUNTS = {
    [LoaderType.CIRCLE]: 1,
    [LoaderType.DUAL_RING]: 0,
    [LoaderType.FACEBOOK]: 3,
    [LoaderType.HEART]: 1,
    [LoaderType.RING]: 4,
    [LoaderType.ROLLER]: 8,
    [LoaderType.DEFAULT]: 12,
    [LoaderType.ELLIPSIS]: 4,
    [LoaderType.GRID]: 9,
    [LoaderType.HOURGLASS]: 0,
    [LoaderType.RIPPLE]: 2,
    [LoaderType.SPINNER]: 12,
};

interface Props {
    loader?: () => Promise<any>;
    loading?: boolean;
    text?: string;
    type?: LoaderType;
    children?: any;
}

export const SimpleLoader = (props: Props) => {
    let loading = !!props.loading;

    const [uncontrolledLoading, setUncontrolledLoading] = useState(true);

    useEffect(() => {
        if (props.loader) {
            loading = uncontrolledLoading;
            setUncontrolledLoading(true);
            props
                .loader()
                .then(() => {
                    setUncontrolledLoading(false);
                })
                .catch(() => {
                    setUncontrolledLoading(false);
                });
        }
    }, [props.loader]);

    const type: LoaderType = props.type || LoaderType.RIPPLE;

    const className = toClass({
        animation: true,
        [`type-${type}`]: true,
    });

    const divCount = DIV_COUNTS[type];

    const divs = [];
    for (let i = 0; i < divCount; i++) {
        divs.push(i);
    }

    const text = props.text || 'Loading... please wait';

    return (
        <>
            {loading && (
                <div className={'simple-loader'}>
                    <div className={className}>
                        {divs.map((ix) => (
                            <div key={'div_' + ix}></div>
                        ))}
                    </div>
                    {text}
                </div>
            )}

            {!loading && props.children}
        </>
    );
};
