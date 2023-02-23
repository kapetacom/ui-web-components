import _ from 'lodash';
import * as React from 'react';

import { asHTMLElement, DOMElement, toClass } from '@blockware/ui-web-utils';

import { Size } from '@blockware/ui-web-types';

import StackContext from './StackContext';

import './StackContainer.less';

interface StackContainerProps {
    currentPageId?: string;
    onPageRequest: (pageId: string) => void;
    children: any;
}

export interface StackPageInfo {
    id: string;
    title: string;
    disabled?: boolean;
    count?: number;
    countClass?: string;
}

interface StackContainerState {
    pages: StackPageInfo[];
}

export class StackContainer extends React.Component<
    StackContainerProps,
    StackContainerState
> {
    private container: DOMElement | null = null;

    constructor(props: StackContainerProps) {
        super(props);

        this.state = {
            pages: [],
        };
    }

    private handlePageAdded = (id: string, title: string) => {
        this.setState((state) => {
            const pages = state.pages.slice();
            pages.push({ id, title });
            let currentPageId = this.props.currentPageId;
            if (!currentPageId) {
                currentPageId = id;
                return { pages, currentPageId };
            }

            return { pages };
        });
    };

    private handlePageRemoved = (id: string) => {
        this.setState((state) => {
            const pages = state.pages.filter((page) => page.id !== id);
            return { pages };
        });
    };

    private handlePageUpdated = (id: string, title: string) => {
        this.setState((state) => {
            const pages = state.pages.slice();
            const page = _.find(pages, { id });
            if (page) {
                page.title = title;
            } else {
                pages.push({ id, title });
            }

            return { pages };
        });
    };

    render() {
        const pages = this.state.pages;

        const containerSize: Size = {
            width: 0,
            height: 0,
        };

        if (this.container) {
            const bbox = this.container.getBoundingClientRect();
            containerSize.width = bbox.width;
            containerSize.height = bbox.height;
        }

        const breadCrumbWidth = 25;

        const fullStackWidth = pages.length * breadCrumbWidth;

        return (
            <StackContext.Provider
                value={{
                    currentStackId: this.props.currentPageId,
                    onStackAdded: this.handlePageAdded,
                    onStackRemoved: this.handlePageRemoved,
                    onStackUpdated: this.handlePageUpdated,
                }}
            >
                <div
                    className={'stack-container'}
                    ref={(ref) => (this.container = asHTMLElement(ref))}
                >
                    <div
                        className={'stack-breadcrumbs'}
                        style={{ width: fullStackWidth + 'px' }}
                    >
                        <svg
                            height={containerSize.height}
                            width={fullStackWidth}
                        >
                            {pages.map((page, ix) => {
                                const current =
                                    page.id === this.props.currentPageId;
                                const className = toClass({
                                    'stack-breadcrumb': true,
                                    current,
                                });

                                const offsetX = ix * breadCrumbWidth - ix * 0.5;

                                const position = {
                                    width: breadCrumbWidth,
                                    height: containerSize.height,
                                    y: 0,
                                    x: offsetX,
                                };

                                const textPosition = {
                                    ...position,
                                    y: offsetX + breadCrumbWidth / 2,
                                    x: -10,
                                };

                                return (
                                    <g className={className} key={page.id}>
                                        <rect
                                            {...position}
                                            className={'background'}
                                        />
                                        <text
                                            className={'title'}
                                            {...textPosition}
                                        >
                                            {page.title}
                                        </text>
                                        <rect
                                            className={'mouse-trap'}
                                            onClick={() => {
                                                !current &&
                                                    this.props.onPageRequest(
                                                        page.id
                                                    );
                                            }}
                                            {...position}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className={'stack-pages'}>{this.props.children}</div>
                </div>
            </StackContext.Provider>
        );
    }
}
