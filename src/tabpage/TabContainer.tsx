import * as React from "react";
import _ from 'lodash';

import {toClass} from "@blockware/ui-web-utils";

import TabContext from "./TabContext";

import './TabContainer.less';

interface TabContainerProps {
    defaultTab?:string
    children:any
}

export interface TabPageInfo {
    id:string
    title:string
    disabled?:boolean
    count?:number
    countClass?:string
}

interface TabContainerState {
    currentPageId?:string
    pages:TabPageInfo[]
}

export class TabContainer extends React.Component<TabContainerProps, TabContainerState> {

    constructor(props:TabContainerProps) {
        super(props);

        this.state = {
            currentPageId: props.defaultTab,
            pages:[]
        };
    }

    private setCurrentPage(id:string) {
        this.setState({
            currentPageId: id
        });
    }

    private handlePageAdded = (id:string, title:string) => {


        this.setState((state) => {
            const pages = state.pages.slice();
            pages.push({id,title});
            let currentPageId = state.currentPageId;
            if (!currentPageId) {
                currentPageId = id;
                return {pages, currentPageId};
            }

            return {pages};
        });
    };

    private handlePageRemoved = (id:string) => {
        this.setState((state) => {
            const pages = state.pages.filter(page => page.id !== id);
            return {pages};
        });
    };

    private handlePageUpdated = (id:string, title:string) => {

        this.setState((state) => {
            const pages = state.pages.slice();
            const page = _.find(pages,{id});
            if (page) {
                page.title = title;
            } else {
                pages.push({id, title});
            }

            return {pages};
        });
    };

    render() {

        return (
            <TabContext.Provider value={{
                currentTabId: this.state.currentPageId,
                onTabAdded: this.handlePageAdded,
                onTabRemoved: this.handlePageRemoved,
                onTabUpdated: this.handlePageUpdated
            }}>
                <div className={'tab-container'}>
                    <ul className={'tab-buttons'}>
                        {
                            this.state.pages.map((page) => {
                                const className = toClass({
                                    'tab-button':true,
                                    'current': page.id === this.state.currentPageId
                                });

                                return (
                                    <li key={page.id} className={className}>
                                        <button type={'button'} onClick={() => this.setCurrentPage(page.id)}>
                                            {page.title}
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className={'tab-pages'}>
                        {this.props.children}
                    </div>
                </div>
            </TabContext.Provider>
        )
    }
}