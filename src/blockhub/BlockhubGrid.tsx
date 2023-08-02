import React, { ReactNode, useState } from 'react';
import { AssetDisplay, CoreTypes } from './types';
import { Box, Paper, Stack, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AsyncState } from 'react-use/lib/useAsync';

import InfoIcon from '@mui/icons-material/InfoOutlined';
import { AssetType, AssetTypeFilter, AssetTypes } from './AssetTypeFilter';
import { AssetSortSelect, Sorting } from './AssetSortSelect';
import { orderBy } from 'lodash';
import { SimpleLoader } from '../helpers/SimpleLoader';

export interface BlockhubGridProps {
    title?: string;
    tooltip?: ReactNode;
    assets: AsyncState<AssetDisplay[]>;
    renderAsset: (asset: AssetDisplay) => React.ReactNode;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}::before`]: {
        color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0px 0px 20px rgba(5, 9, 13, 0.16)',
        padding: theme.spacing(1, 2),
    },
}));

export function BlockhubGrid(props: BlockhubGridProps) {
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');

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
        <Box component="main" className="BlockhubGrid" sx={{ maxWidth: '1130px' }}>
            <Stack direction="row" alignItems="center" mb={2} gap={2}>
                <Typography variant="h5" sx={{ display: 'inline-block' }}>
                    {props.title || 'Blockhub assets'}
                </Typography>

                {props.tooltip ? (
                    <HtmlTooltip title={props.tooltip} arrow placement="right">
                        <InfoIcon />
                    </HtmlTooltip>
                ) : null}
            </Stack>

            <Stack direction="row" pb={3}>
                <AssetTypeFilter value={assetTypeFilter} onChange={(t) => setAssetTypeFilter(t)} />
                <Box sx={{ flexGrow: 1 }} />
                <AssetSortSelect value={sorting} onChange={(s) => setSorting(s)} />
            </Stack>

            <Stack
                direction="row"
                gap={2}
                alignItems={'stretch'}
                flexWrap={'wrap'}
                alignContent={'flex-start'}
                sx={{
                    '& > .BlockhubTile': {
                        boxSizing: 'border-box',
                        width: '366px',
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
        </Box>
    );
}
