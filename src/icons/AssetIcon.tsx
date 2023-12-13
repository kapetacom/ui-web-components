/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { IconValue, Kind } from '@kapeta/schemas';
import './AssetIcon.less';

interface KindIconProps {
    kind: string;
    icon?: IconValue;
    size?: number;
    title?: string;
}

export const KindIcon = (props: KindIconProps) => {
    const size = props.size || 16;
    const style = {
        fontSize: size + 'px',
        height: size + 'px',
    };
    if (props.icon) {
        switch (props.icon.type) {
            case 'fontawesome5':
                return <i style={style} className={`asset-icon ${props.icon.value}`} title={props.title} />;
            case 'url':
                return <img style={style} className="asset-icon" src={props.icon.value} alt={props.title} />;
        }
    }

    if (props.kind.startsWith('core/')) {
        //Core concepts
        switch (props.kind) {
            case 'core/plan':
                return <i style={style} className="asset-icon kap-icon-plan" title={props.title} />;

            case 'core/language-target':
                return <i style={style} className="asset-icon fa fa-code" title={props.title} />;

            case 'core/deployment-target':
                return <i style={style} className="asset-icon fa fa-cloud-upload" title={props.title} />;

            case 'core/block-type':
            case 'core/block-type-operator':
                return <i style={style} className="asset-icon kap-icon-block" title={props.title} />;

            case 'core/resource-type-operator':
            case 'core/resource-type-internal':
            case 'core/resource-type-extension':
                return <i style={style} className="asset-icon kap-icon-resource" title={props.title} />;
        }

        return <i style={style} className="asset-icon fa fa-cog" title={props.title} />;
    }

    return <i style={style} className="asset-icon kap-icon-block" title={props.title} />;
};

interface KindIconTextProps extends KindIconProps {
    title: string;
}

export const KindIconText = (props: KindIconTextProps) => {
    let text = props.title;
    if (props.kind === 'core/plan') {
        text = 'Plan';
    }
    return (
        <span className="asset-icon-text">
            <KindIcon {...props} />
            <span className={'title'}>{text}</span>
        </span>
    );
};

interface AssetKindIconProps {
    asset: Kind;
    size?: number;
}
export const AssetKindIcon = (props: AssetKindIconProps) => {
    if (!props.asset) {
        return null;
    }
    return (
        <KindIcon
            kind={props.asset.kind}
            icon={props.asset.spec?.icon}
            size={props.size}
            title={props.asset.metadata.title}
        />
    );
};

export const AssetKindIconText = (props: AssetKindIconProps) => {
    if (!props.asset) {
        return null;
    }

    let title = props.asset.metadata.title ?? props.asset.metadata.name;
    return <KindIconText kind={props.asset.kind} icon={props.asset.spec?.icon} size={props.size} title={title} />;
};
