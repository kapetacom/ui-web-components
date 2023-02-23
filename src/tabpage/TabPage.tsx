import * as React from 'react';

import { toClass } from '@blockware/ui-web-utils';

import TabContext, { TabContextType } from './TabContext';

import './TabPage.less';

interface TabPageProps {
    id: string;
    title: string;
    children: any;
}

export class TabPage extends React.Component<TabPageProps, any> {
    static contextType = TabContext;
    context!: React.ContextType<TabContextType>;

    componentDidMount() {
        this.context.onTabAdded(this.props.id, this.props.title);
    }

    componentWillUnmount() {
        this.context.onTabRemoved(this.props.id);
    }

    render() {
        const className = toClass({
            'tab-page': true,
            current: this.context.currentTabId === this.props.id,
        });

        return <div className={className}>{this.props.children}</div>;
    }
}
