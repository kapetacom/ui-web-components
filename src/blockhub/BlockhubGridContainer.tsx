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
    filter?: AssetType;
    onFilterChange: (filter: AssetType) => void;
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
                maxWidth: '1152px',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Stack
                sx={{
                    height: '100%',
                    '& > .MuiStack-root': {
                        width: '100%',
                        flex: 0,
                        paddingRight: '22px',
                        '&.blockhub-grid': {
                            flex: 1,
                            overflowY: 'auto',
                        },
                    },
                }}
                direction="column"
                alignItems="flex-start"
                gap={2}
            >
                {props.title && (
                    <Stack direction="row" alignItems="center" gap={2}>
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
                            <HtmlTooltip title={props.tooltip} arrow placement="right">
                                <InfoIcon />
                            </HtmlTooltip>
                        ) : null}
                    </Stack>
                )}

                <Stack direction="row">
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
                        pb: 1,
                        '& > .blockhub-tile': {
                            boxSizing: 'border-box',
                            display: 'block',
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
            </Stack>
        </Box>
    );
}
