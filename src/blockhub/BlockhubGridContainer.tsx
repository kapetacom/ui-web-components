/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { ReactNode, useState } from 'react';
import { AssetDisplay, CoreTypes } from './types';
import { Box, Paper, Stack, Typography } from '@mui/material';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AsyncState } from 'react-use/lib/useAsync';

import InfoIcon from '@mui/icons-material/InfoOutlined';
import { AssetType, AssetTypeFilter, AssetTypes } from './AssetTypeFilter';
import { AssetSortSelect, Sorting } from './AssetSortSelect';
import { orderBy } from 'lodash';
import { SimpleLoader } from '../helpers/SimpleLoader';
import { Tooltip } from '../tooltip/Tooltip';

export interface BlockhubGridProps {
    title?: string;
    tooltip?: ReactNode;
    filter?: AssetType;
    onFilterChange: (filter: AssetType) => void;
    assets: AsyncState<AssetDisplay[]>;
    renderAsset: (asset: AssetDisplay) => React.ReactNode;
}

export function BlockhubGridContainer(props: BlockhubGridProps) {
    const assetTypeFilter = props.filter ?? 'ALL';

    const [sorting, setSorting] = useState<Sorting>('-lastModified');

    const Fallback = ({ error }: FallbackProps) => (
        <Paper sx={{ p: 3, width: '358px', overflowX: 'hidden', wordWrap: 'break-word' }}>
            Failed to render asset: {error.message}
        </Paper>
    );

    let filteredAssets: AssetDisplay[] = [];
    if (props.assets.value) {
        const nonCoreKinds = props.assets.value.filter((asset) => !asset.content.kind.startsWith('core/'));

        filteredAssets = props.assets.value
            .filter((asset) => {
                if (assetTypeFilter === 'ALL') {
                    return true;
                }

                if (assetTypeFilter === 'BLOCK' && !asset.content.kind.startsWith('core/')) {
                    // Only blocks have a kind that doesn't start with core/
                    return true;
                }

                return (AssetTypes[assetTypeFilter] as readonly CoreTypes[]).includes(asset.content.kind as CoreTypes);
            })
            .filter((asset) => asset.content.kind !== 'core/environment');
    }

    const emptyMessage = props.assets.loading ? '' : 'No assets found.';

    return (
        <Box
            component="main"
            sx={{
                width: '100%',
                height: '100%',
            }}
        >
            <Stack
                sx={{
                    height: '100%',
                    '& > .MuiStack-root': {
                        flex: 0,
                        '&.blockhub-grid': {
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        },
                    },
                }}
                direction="column"
                alignItems="flex-start"
                gap={2}
            >
                {props.title && (
                    <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                display: 'inline-block',
                                padding: '16px 0',
                                fontWeight: 500,
                            }}
                        >
                            {props.title}
                        </Typography>

                        {props.tooltip ? (
                            <Tooltip title={props.tooltip} placement="right">
                                <InfoIcon />
                            </Tooltip>
                        ) : null}
                    </Stack>
                )}

                <Stack direction="row" sx={{ width: '100%' }}>
                    <AssetTypeFilter value={assetTypeFilter} onChange={(t) => props.onFilterChange(t)} />
                    <Box sx={{ flexGrow: 1 }} />
                    <AssetSortSelect value={sorting} onChange={(s) => setSorting(s)} />
                </Stack>
                <Stack
                    direction="row"
                    gap={2}
                    alignItems={'stretch'}
                    flexWrap={'wrap'}
                    alignContent={'flex-start'}
                    className={'blockhub-grid'}
                    sx={{
                        mb: 2,
                        width: 'calc(100% + 44px)',
                        paddingRight: '22px',
                        '& > .blockhub-tile': {
                            display: 'block',
                            width: '366px',
                            minWidth: '366px',
                            maxWidth: '366px',
                            height: '246px',
                        },
                    }}
                >
                    {props.assets.loading && <SimpleLoader loading text="Loading assets..." />}
                    {filteredAssets.length && !props.assets.loading
                        ? orderBy(
                              filteredAssets,
                              [sorting.replace('-', '')],
                              [sorting.startsWith('-') ? 'desc' : 'asc']
                          )?.map((asset) => (
                              <ErrorBoundary
                                  FallbackComponent={Fallback}
                                  key={asset.content.metadata.name + ':' + asset.version}
                              >
                                  {props.renderAsset(asset)}
                              </ErrorBoundary>
                          ))
                        : emptyMessage}
                </Stack>
            </Stack>
        </Box>
    );
}
