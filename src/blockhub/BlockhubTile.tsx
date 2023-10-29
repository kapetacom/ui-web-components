/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { ReactNode } from 'react';
import { Box, Paper, Rating, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from 'react-router-dom';

import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { AssetDisplay, AssetFetcher, CoreTypes } from './types';
import { AssetKindIconText } from '../icons/AssetIcon';

import useSWR from 'swr';
import { toClass } from '@kapeta/ui-web-utils';
import { Tooltip } from '../tooltip/Tooltip';

export function BlockhubStats(props: { stats: { rating?: number; downloads?: number } }) {
    return (
        <Stack className="metrics">
            {/* Downloads */}
            {typeof props.stats.downloads !== 'undefined' ? (
                <Stack direction={'row'} gap={1} alignItems={'center'} justifyContent={'flex-end'}>
                    <Typography variant="caption">{props.stats.downloads.toLocaleString()}</Typography>
                    <TrendingUpIcon sx={(theme) => ({ color: theme.palette.success.light })} />
                </Stack>
            ) : null}
            {typeof props.stats.rating !== 'undefined' ? (
                <Rating
                    name="read-only"
                    title={`${props.stats.rating} / 5`}
                    value={props.stats.rating}
                    readOnly
                    max={5}
                    precision={0.5}
                />
            ) : null}
        </Stack>
    );
}

export const coreNames: Record<CoreTypes, string> = {
    [CoreTypes.PLAN]: 'Plan',
    [CoreTypes.BLOCK_GROUP]: 'Block group',
    [CoreTypes.BLOCK_TYPE]: 'Block type',
    [CoreTypes.BLOCK_TYPE_OPERATOR]: 'Block type',
    [CoreTypes.CORE]: 'Concept',
    [CoreTypes.DEPLOYMENT]: 'Deployment',
    [CoreTypes.DEPLOYMENT_TARGET]: 'Deployment target',
    [CoreTypes.LANGUAGE_TARGET]: 'Language target',
    [CoreTypes.PROVIDER_INTERNAL]: 'Resource type',
    [CoreTypes.PROVIDER_OPERATOR]: 'Resource type',
    [CoreTypes.PROVIDER_EXTENSION]: 'Resource type',
};

export const getNameForKind = (kind: string) => {
    return coreNames[kind] ?? 'Asset';
};

export function DependencyKindLabel(props: { dependency: { name: string }; fetcher: AssetFetcher }) {
    const assetReq = useSWR(
        props.dependency.name,
        async (url) => {
            const { fullName, version, handle } = parseKapetaUri(url);
            if (handle === 'core') {
                return {
                    content: {
                        kind: fullName,
                        metadata: { name: coreNames[fullName] },
                        spec: {},
                    },
                } as AssetDisplay;
            }
            return props.fetcher(fullName, version || 'current');
        },
        { keepPreviousData: true, revalidateOnFocus: false }
    );
    const asset = assetReq.data;
    return asset ? (
        <div style={{ overflowX: 'hidden', whiteSpace: 'nowrap' }}>
            <AssetKindIconText size={12} asset={asset.content} />
        </div>
    ) : null;
}

export interface BlockhubTileProps {
    title: string;
    handle: string;
    description: string;
    version?: string;

    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
    assetKindLabel?: React.ReactNode;
    languageTargetLabel?: React.ReactNode[];

    href?: string;
    onClick?: () => void;
    selected?: boolean;
    // AssetStats
    stats?: {
        rating?: number;
        downloads?: number;
    };
}

export function BlockhubTile(props: BlockhubTileProps) {
    const containerClass = toClass({
        'blockhub-tile': true,
        selected: props.selected,
    });
    const link = (content: ReactNode) =>
        props.href ? (
            <Link
                to={props.href}
                style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: '100%',
                    height: '100%',
                }}
            >
                {content}
            </Link>
        ) : (
            <a style={{ cursor: props.onClick ? 'pointer' : undefined }}>{content}</a>
        );

    return (
        <div className={containerClass} onClick={props.onClick}>
            {link(
                <Paper
                    sx={(theme) => ({
                        width: '100%',
                        height: '100%',

                        border: `1px solid ${props.selected ? theme.palette.primary.main : theme.palette.divider}`,
                    })}
                    elevation={0}
                >
                    <Stack
                        gap={2}
                        justifyContent="space-between"
                        p={2}
                        sx={{
                            height: '100%',
                            // boxSizing: 'border-box'
                        }}
                    >
                        {/* Title group */}
                        <Stack direction={'row'} gap={2} alignItems={'flex-start'}>
                            {props.icon}

                            {/* Flexbox introduces a new initial value for min-width and min-height: auto. */}
                            {/* To make the overflow hidden work, we need to reset it to zero */}
                            <Stack flexGrow={1} minWidth={0}>
                                <Tooltip title={props.title}>
                                    <Typography variant="h6" component="div" noWrap>
                                        {props.title}
                                    </Typography>
                                </Tooltip>

                                <Typography variant="caption" color="text.primary" noWrap>
                                    {props.assetKindLabel}
                                </Typography>

                                <Typography variant="caption" color="text.primary" noWrap>
                                    By {props.handle}
                                </Typography>
                            </Stack>

                            {props.actionButton}
                        </Stack>

                        {/* Description group */}
                        <Box
                            sx={{
                                // Make it take up whatever space is left
                                flexGrow: 1,
                                flexShrink: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    // Make it use up to 3 lines and truncate
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    // All browsers still use '-webkit' prefix
                                    // https://css-tricks.com/almanac/properties/l/line-clamp/
                                    display: '-webkit-box',
                                    lineClamp: '3',
                                    WebkitLineClamp: '3',
                                    boxOrient: 'vertical',
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {props.description || 'No description'}
                            </Typography>
                        </Box>
                        {/* Footer group */}

                        <Stack direction={'row'} gap={2} justifyContent="space-between" alignItems={'flex-end'}>
                            <Stack sx={{ fontSize: '12px' }} gap={'4px'} minWidth={0}>
                                {props.version ? (
                                    <Box sx={{ textDecoration: 'underline', lineHeight: '166%' }}>{props.version}</Box>
                                ) : null}
                                <Stack className="labels" direction={'row'} gap="5px" alignItems={'center'}>
                                    {props.languageTargetLabel}
                                </Stack>
                            </Stack>

                            {props.stats ? <BlockhubStats stats={props.stats} /> : null}
                        </Stack>
                    </Stack>
                </Paper>
            )}
        </div>
    );
}
