/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import './styles.less';
import { KeyValue, KeyValueRow } from '../src/blockhub/KeyValue';

export default {
    title: 'Key Value',
};

export const KeyValueView = () => {
    return (
        <div>
            <KeyValueRow>
                <KeyValue label={'Downloads'} value={123} />
                <KeyValue label={'Stars'} value={32} />
                <KeyValue label={'Deployments'} value={31} />
            </KeyValueRow>
            <KeyValueRow>
                <KeyValue label={'License'} value={'MIT'} />
                <KeyValue label={'Version'} value={'1.2.3'} />
            </KeyValueRow>
            <KeyValueRow>
                <KeyValue
                    label={'Repository'}
                    value={<a href={'#'}>https://github.com/orgs/kapetacom/repositories</a>}
                />
            </KeyValueRow>
        </div>
    );
};
