import React from 'react';
import { IconValue, Kind } from '@kapeta/schemas';
import './AssetIcon.less';

interface Props {
    asset: Kind;
    size?: number;
}

export const AssetKindIcon = (props: Props) => {
    const size = props.size || 16;
    const style = {
        fontSize: size + 'px',
        height: size + 'px',
    };
    if ('icon' in props.asset.spec) {
        const icon = props.asset.spec.icon as IconValue;
        switch (icon.type) {
            case 'fontawesome5':
                return <i style={style} className={`asset-icon ${icon.value}`} />;
            case 'url':
                return <img style={style} className="asset-icon" src={icon.value} alt={props.asset.metadata.title} />;
        }
    }

    if (props.asset.kind.startsWith('core/')) {
        //Core concepts
        switch (props.asset.kind) {
            case 'core/plan':
                return <i style={style} className="asset-icon kap-icon-plan" />;

            case 'core/language-target':
                return <i style={style} className="asset-icon fa fa-code" />;

            case 'core/deployment-target':
                return <i style={style} className="asset-icon fa fa-cloud-upload" />;

            case 'core/block-type':
            case 'core/block-type-operator':
                return <i style={style} className="asset-icon kap-icon-block" />;

            case 'core/resource-type-operator':
            case 'core/resource-type-internal':
            case 'core/resource-type-extension':
                return <i style={style} className="asset-icon kap-icon-resource" />;
        }

        return <i style={style} className="asset-icon fa fa-cog" />;
    }

    return <i style={style} className="asset-icon kap-icon-block" />;
};

export const AssetKindIconText = (props: Props) => {
    let text = props.asset.metadata.title ?? props.asset.metadata.name;
    if (props.asset.kind === 'core/plan') {
        text = 'Plan';
    }
    return (
        <span className="asset-icon-text">
            <AssetKindIcon asset={props.asset} size={props.size} />
            <span className={'title'}>{text}</span>
        </span>
    );
};
