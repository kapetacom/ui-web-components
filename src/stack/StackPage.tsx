/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';

import { toClass } from '@kapeta/ui-web-utils';

import StackContext, { StackContextType } from './StackContext';

import './StackPage.less';

interface TabPageProps {
    id: string;
    title: string;
    children: any;
}

export class StackPage extends React.Component<TabPageProps, any> {
    static contextType = StackContext;
    context!: React.ContextType<StackContextType>;

    componentDidMount() {
        this.context.onStackAdded(this.props.id, this.props.title);
    }

    componentWillUnmount() {
        this.context.onStackRemoved(this.props.id);
    }

    render() {
        const className = toClass({
            'stack-page': true,
            current: this.context.currentStackId === this.props.id,
        });

        return <div className={className}>{this.props.children}</div>;
    }
}
