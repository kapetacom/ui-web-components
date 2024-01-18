/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Box, MenuItem, Select } from '@mui/material';
import React from 'react';

import { Sort } from '@mui/icons-material';

const sortingOptions = {
    '-lastModified': 'Most recent',
    lastModified: 'Least recent',
    'content.metadata.title': 'Name A-Z',
    '-content.metadata.title': 'Name Z-A',
    '-downloadCount': 'Most downloaded',
    downloadCount: 'Least downloaded',
    '-rating': 'Highest rating',
    rating: 'Lowest rating',
};

export type Sorting = keyof typeof sortingOptions;

interface AssetSortSelectProps {
    value: Sorting;
    onChange: (sorting: Sorting) => void;
    options?: Sorting[];
}

export function AssetSortSelect(props: AssetSortSelectProps) {
    const options = props.options || (Object.keys(sortingOptions) as Sorting[]);

    return (
        <Select
            data-kap-id="blockhub-asset-sort"
            size="small"
            renderValue={(v) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
                        <Sort />
                        <span className="Value">Sort: {sortingOptions[props.value]}</span>
                    </Box>
                );
            }}
            displayEmpty
            value={props.value}
            onChange={(e) => props.onChange(e.target.value as Sorting)}
        >
            {options.map((sorting) => (
                <MenuItem value={sorting} key={sorting}>
                    {sortingOptions[sorting]}
                </MenuItem>
            ))}
        </Select>
    );
}
