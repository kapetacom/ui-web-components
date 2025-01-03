/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { AssetKindIcon, AssetKindIconText } from '../src/icons/AssetIcon';
import { IconType, IconValue, Kind } from '@kapeta/schemas';
import './styles.less';
import { AuthProviderIcon } from '../src/icons/AuthProviderIcon';
import { Box, TextField, Typography } from '@mui/material';

export default {
    title: 'Icons',
};

const jsIcon: IconValue = { type: IconType.Fontawesome5, value: 'fab fa-js' };
const desktopIcon: IconValue = { type: IconType.Fontawesome5, value: 'fa fa-desktop' };
const dbIcon: IconValue = { type: IconType.Fontawesome5, value: 'fa fa-database' };
const gcpIcon: IconValue = {
    type: IconType.URL,
    value: 'https://storage.googleapis.com/kapeta-public-cdn/icons/gcp.svg',
};

const PLAN: Kind = { kind: 'core/plan', metadata: { name: 'kapeta/my-plan', title: 'My Plan' }, spec: {} };
const BLOCK_TYPE: Kind = {
    kind: 'core/block-type',
    metadata: { name: 'kapeta/my-block-type', title: 'Frontend' },
    spec: {
        icon: desktopIcon,
    },
};
const BLOCK_TYPE_OPERATOR: Kind = {
    kind: 'core/block-type-operator',
    metadata: { name: 'kapeta/my-block-operator', title: 'Gateway' },
    spec: {},
};

const BLOCK_TYPE_EXECUTABLE: Kind = {
    kind: 'core/block-type-executable',
    metadata: { name: 'kapeta/my-block-executable', title: 'Executable' },
    spec: {},
};

const RESOURCE_TYPE_INTERNAL: Kind = {
    kind: 'core/resource-type-internal',
    metadata: { name: 'kapeta/my-resource-type', title: 'REST API' },
    spec: {},
};
const RESOURCE_TYPE_OPERATOR: Kind = {
    kind: 'core/resource-type-operator',
    metadata: { name: 'kapeta/my-resource-type', title: 'MongoDB' },
    spec: {
        icon: dbIcon,
    },
};
const RESOURCE_TYPE_EXTENSION: Kind = {
    kind: 'core/resource-type-extension',
    metadata: { name: 'kapeta/my-resource-type', title: 'Payment' },
    spec: {},
};

const LANGUAGE_TARGET: Kind = {
    kind: 'core/language-target',
    metadata: { name: 'kapeta/my-lang-type', title: 'Javascript' },
    spec: {
        icon: jsIcon,
    },
};
const DEPLOYMENT_TARGET: Kind = {
    kind: 'core/deployment-target',
    metadata: { name: 'kapeta/my-deploy-type', title: 'GCP' },
    spec: {
        icon: gcpIcon,
    },
};

export const AssetIcons = () => {
    const size = 36;
    return (
        <div style={{ fontSize: size + 'px', fontWeight: '100', lineHeight: size + 'px' }}>
            <p>
                <AssetKindIcon size={size} asset={PLAN} />
                <span style={{ marginLeft: '5px' }}>Plan</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={BLOCK_TYPE} />
                <span style={{ marginLeft: '5px' }}>Block type</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={BLOCK_TYPE_OPERATOR} />
                <span style={{ marginLeft: '5px' }}>Block type operator</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={BLOCK_TYPE_EXECUTABLE} />
                <span style={{ marginLeft: '5px' }}>Block type executable</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={LANGUAGE_TARGET} />
                <span style={{ marginLeft: '5px' }}>Language target</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={DEPLOYMENT_TARGET} />
                <span style={{ marginLeft: '5px' }}>Deployment target</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={RESOURCE_TYPE_INTERNAL} />
                <span style={{ marginLeft: '5px' }}>Resource type internal</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={RESOURCE_TYPE_OPERATOR} />
                <span style={{ marginLeft: '5px' }}>Resource type operator</span>
            </p>
            <p>
                <AssetKindIcon size={size} asset={RESOURCE_TYPE_EXTENSION} />
                <span style={{ marginLeft: '5px' }}>Resource type extension</span>
            </p>
        </div>
    );
};

export const AssetIconTexts = () => {
    const size = 12;
    return (
        <div style={{ fontSize: '14px' }}>
            <p>
                <AssetKindIconText size={size} asset={PLAN} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={BLOCK_TYPE} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={BLOCK_TYPE_OPERATOR} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={BLOCK_TYPE_EXECUTABLE} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={LANGUAGE_TARGET} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={DEPLOYMENT_TARGET} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={RESOURCE_TYPE_INTERNAL} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={RESOURCE_TYPE_OPERATOR} />
            </p>
            <p>
                <AssetKindIconText size={size} asset={RESOURCE_TYPE_EXTENSION} />
            </p>
        </div>
    );
};

export const AuthProviderIcons = () => {
    const [color, setColor] = React.useState('#000000');
    const [size, setSize] = React.useState(50);

    return (
        <>
            <Typography variant="body1">Default</Typography>
            <Box display="flex" flexDirection="row" gap={3} marginBottom={5}>
                <AuthProviderIcon name={'google'} size={50} />
                <AuthProviderIcon name={'microsoft'} size={50} />
                <AuthProviderIcon name={'github'} size={50} />
                <AuthProviderIcon name={'linkedin'} size={50} />
            </Box>

            <Typography variant="body1">Color</Typography>
            <Box display="flex" flexDirection="row" gap={3} marginBottom={5} alignItems="center">
                <AuthProviderIcon name={'google'} size={50} color={color} />
                <AuthProviderIcon name={'microsoft'} size={50} color={color} />
                <AuthProviderIcon name={'github'} size={50} color={color} />
                <AuthProviderIcon name={'linkedin'} size={50} color={color} />
                <TextField value={color} onChange={(e) => setColor(e.target.value)} variant="outlined" />
            </Box>

            <Box sx={{ color: 'slateblue' }}>
                <Typography variant="body1">currentColor: "slateblue"</Typography>
                <Box display="flex" flexDirection="row" gap={3} marginBottom={5} alignItems="center">
                    <AuthProviderIcon name={'google'} size={50} color="currentColor" />
                    <AuthProviderIcon name={'microsoft'} size={50} color="currentColor" />
                    <AuthProviderIcon name={'github'} size={50} color="currentColor" />
                    <AuthProviderIcon name={'linkedin'} size={50} color="currentColor" />
                    <TextField value="currentColor" variant="outlined" disabled />
                </Box>
            </Box>

            <Typography variant="body1">Size</Typography>
            <Box display="flex" flexDirection="row" gap={3} marginBottom={5} alignItems="center">
                <AuthProviderIcon name={'google'} size={size} />
                <AuthProviderIcon name={'microsoft'} size={size} />
                <AuthProviderIcon name={'github'} size={size} />
                <AuthProviderIcon name={'linkedin'} size={size} />
                <TextField
                    type="number"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value, 10))}
                    variant="outlined"
                />
            </Box>
        </>
    );
};
