import React, { ReactElement, ReactNode, SyntheticEvent } from 'react';
import { Box, Chip, Menu, MenuItem, Paper, Rating, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVert from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { AssetFetcher, AssetDisplay, CoreTypes } from './types';
import { AssetKindIconText } from '../icons/AssetIcon';

import useSWR from 'swr';

export interface BlockhubTileActionButtonProps {
    label: string;
    onClick: (evt: SyntheticEvent) => void;
    icon?: ReactElement;
    menuItems?: {
        label: string;
        onClick: (evt: SyntheticEvent) => void;
    }[];
    color?: 'primary' | 'secondary' | 'default';
}

export function BlockhubTileActionButton(props: BlockhubTileActionButtonProps) {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const handleClose = () => setAnchorEl(null);
    const openMenu = (e: SyntheticEvent) => props.menuItems && setAnchorEl(e.currentTarget);
    const icon = props.icon || <MoreVert />;
    const color = props.color || 'default';

    return (
        <div>
            <Chip label={props.label} onDelete={openMenu} deleteIcon={icon} onClick={props.onClick} color={color} />

            {props.menuItems ? (
                <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
                    {props.menuItems.map((item) => (
                        <MenuItem
                            onClick={(e) => {
                                item.onClick(e);
                                handleClose();
                            }}
                            key={item.label}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            ) : null}
        </div>
    );
}

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
    subtitle: string;
    description: string;
    version?: string;

    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
    labels?: React.ReactNode[];

    href?: string;
    selected?: boolean;
    // AssetStats
    stats?: {
        rating?: number;
        downloads?: number;
    };
}

export function BlockhubTile(props: BlockhubTileProps) {
    const link = (content: ReactNode) =>
        props.href ? (
            <Link to={props.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                {content}
            </Link>
        ) : (
            content
        );

    return (
        <Paper
            sx={(theme) => ({
                border: `1px solid ${theme.palette.divider}`,
                '&.Selected': {
                    border: `1px solid ${theme.palette.primary.main}`,
                },
            })}
            className={['BlockhubTile', props.selected ? 'Selected' : ''].filter(Boolean).join(' ')}
            elevation={0}
        >
            <Stack gap={2} justifyContent="space-between" p={2} sx={{ height: '100%', boxSizing: 'border-box' }}>
                {/* Title group */}
                <Stack direction={'row'} gap={2}>
                    <div>{link(props.icon)}</div>

                    {/* Flexbox introduces a new initial value for min-width and min-height: auto. */}
                    {/* To make the overflow hidden work, we need to reset it to zero */}
                    <Stack flexGrow={1} minWidth={0}>
                        <Stack direction={'row'} gap={1} alignItems={'center'} justifyContent={'space-between'}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                title={props.title}
                            >
                                {link(props.title)}
                            </Typography>

                            {props.actionButton}
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {props.subtitle}
                        </Typography>
                    </Stack>
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
                    <Stack sx={{ fontSize: '12px' }} gap={'4px'}>
                        {props.version ? (
                            <Box sx={{ textDecoration: 'underline', lineHeight: '166%' }}>{props.version}</Box>
                        ) : null}
                        <Stack className="labels" direction={'row'} gap="5px" alignItems={'center'}>
                            {props.labels}
                        </Stack>
                    </Stack>

                    {props.stats ? <BlockhubStats stats={props.stats} /> : null}
                </Stack>
            </Stack>
        </Paper>
    );
}
