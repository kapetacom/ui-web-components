/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Box, MenuItem, Select } from '@mui/material';
import { CoreTypes } from './types';

import { FilterList } from '@mui/icons-material';

export const AssetTypes = {
    PLAN: [CoreTypes.PLAN],
    BLOCK: [],
    PROVIDERS: [
        CoreTypes.BLOCK_TYPE,
        CoreTypes.BLOCK_TYPE_OPERATOR,
        CoreTypes.BLOCK_TYPE_EXECUTABLE,
        CoreTypes.PROVIDER_INTERNAL,
        CoreTypes.PROVIDER_OPERATOR,
        CoreTypes.PROVIDER_EXTENSION,
        CoreTypes.LANGUAGE_TARGET,
        CoreTypes.DEPLOYMENT_TARGET,
    ],
    ALL: [] as readonly string[],
} as const;

const AssetTypeLabels: Record<keyof typeof AssetTypes, string> = {
    PLAN: 'Plans',
    BLOCK: 'Blocks',
    PROVIDERS: 'Providers',
    ALL: 'All assets',
} as const;

export type AssetType = keyof typeof AssetTypes;

export interface AssetTypeFilterProps {
    value: AssetType;
    onChange: (assetType: AssetType) => void;
    options?: AssetType[];
}

export function AssetTypeFilter(props: AssetTypeFilterProps) {
    const options = props.options || (Object.keys(AssetTypeLabels) as AssetType[]);
    return (
        <Select
            data-kap-id="blockhub-asset-type-filter"
            size="small"
            renderValue={(v) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
                        <FilterList />
                        <span className="Value">Filter: {AssetTypeLabels[v]}</span>
                    </Box>
                );
            }}
            displayEmpty
            value={props.value}
            onChange={(evt) => {
                props.onChange(evt.target.value as AssetType);
            }}
        >
            {options.map((assetType) => (
                <MenuItem value={assetType} key={assetType}>
                    {AssetTypeLabels[assetType]}
                </MenuItem>
            ))}
        </Select>
    );
}
