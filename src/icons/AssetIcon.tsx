/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { IconValue, Kind } from '@kapeta/schemas';
import './AssetIcon.less';
import { useTheme } from '@mui/material';

interface KindIconProps {
    kind: string;
    icons?: IconValue[];
    size?: number;
    title?: string;
}

export const KindIcon = (props: KindIconProps) => {
    const size = props.size || 16;
    const theme = useTheme().palette.mode;
    const isDarkMode = theme === 'dark';
    const style = {
        fontSize: size + 'px',
        height: size + 'px',
    };

    // Select icon based on theme, priority order:
    // - matching theme (light/dark)
    // - fontawesome icon (if available)
    // - opposite theme (light/dark) - invert it
    const faIcon = props.icons?.find((icon) => icon.type === 'fontawesome5');
    const svgIcons =
        props.icons?.filter((icon) => icon.type === 'url').map((icon) => ({ ...icon, theme: icon.theme || 'light' })) ||
        [];
    const themeIcon = svgIcons.find((icon) => icon.theme === theme);
    const invertIcon = svgIcons.find((icon) => icon.theme !== theme);

    if (themeIcon) {
        return <img style={style} className="asset-icon" src={themeIcon.value} alt={props.title} />;
    } else if (faIcon) {
        return <i style={style} className={`asset-icon ${faIcon.value}`} title={props.title} />;
    } else if (invertIcon) {
        return (
            <img
                style={{
                    ...style,
                    filter: 'invert(1) brightness(2) contrast(1.5)',
                }}
                className="asset-icon"
                src={invertIcon.value}
                alt={props.title}
            />
        );
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
            case 'core/block-type-executable':
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
            icons={props.asset.spec?.icons ?? [props.asset.spec?.icon].filter(Boolean)}
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
    return (
        <KindIconText
            kind={props.asset.kind}
            icons={props.asset.spec?.icons ?? [props.asset.spec?.icon].filter(Boolean)}
            size={props.size}
            title={title}
        />
    );
};
