/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { AssetVersionInfo, Version } from './types';
import { toClass } from '@kapeta/ui-web-utils';
import { toDateText } from '../dates';
import './Versions.less';

interface GraphProps extends AssetVersionInfo {}

export const VersionGraph = (props: GraphProps) => {
    return (
        <div className={'version-graph'}>
            <VersionList branch={'master'} versions={props.primary} />
            {props.branches &&
                props.branches.map((branch, ix) => {
                    return (
                        <BranchContainer key={`branch_${ix}`} branch={branch.id}>
                            <VersionElement version={branch.version} />
                        </BranchContainer>
                    );
                })}
        </div>
    );
};

interface BranchContainerProps {
    branch: string;
    children: any;
}

export const BranchContainer = (props: BranchContainerProps) => {
    return (
        <div className={'branch-container'}>
            <div className={'branch'}>
                Branch: <span className={'value'}>{props.branch}</span>
            </div>
            <div className={'content'}>{props.children}</div>
        </div>
    );
};

interface ElementProps {
    version: Version;
}

export const VersionElement = (props: ElementProps) => {
    const current = !!props.version.current;
    return (
        <div
            className={toClass({
                'version-element': true,
                current,
            })}
        >
            <div className={'id'}>
                {props.version.id}
                {current && <span className={'badge'}>Current</span>}
            </div>
            <div className={'details'}>
                <span className={'published'}>
                    Published {toDateText({ date: props.version.created })} by{' '}
                    <span className={'value'}>{props.version.author.name}</span>
                </span>
                <span className={'commit'}>
                    <i className={'fab fa-github'} /> {props.version.commit.substring(0, 6)}
                </span>
            </div>
        </div>
    );
};

interface ListProps {
    branch: string;
    versions: Version[];
}

export const VersionList = (props: ListProps) => {
    return (
        <BranchContainer branch={props.branch}>
            <div className={'version-list'}>
                {props.versions.map((v, ix) => {
                    return <VersionElement key={`version_${ix}`} version={v} />;
                })}
            </div>
        </BranchContainer>
    );
};
           })}
            </div>
        </BranchContainer>
    );
};
