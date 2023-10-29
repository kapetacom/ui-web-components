/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { forwardRef, useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material';
import { BlockhubGridContainer } from './BlockhubGridContainer';
import { BlockhubTile, DependencyKindLabel } from './BlockhubTile';
import { AssetKindIcon } from '../icons/AssetIcon';
import { AssetInstallButton, InstallerService } from './AssetInstallButton';
import Apartment from '@mui/icons-material/Apartment';
import DownloadDone from '@mui/icons-material/DownloadDone';
import GroupWorkOutlined from '@mui/icons-material/GroupWorkOutlined';
import Paid from '@mui/icons-material/Paid';

import { AssetDisplay, AssetFetcher } from './types';
import { Plan } from '@kapeta/schemas';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { Asset } from '@kapeta/ui-web-types';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { AssetType } from './AssetTypeFilter';

const toId = (asset: AssetDisplay) => {
    return parseKapetaUri(`${asset.content.metadata.name}:${asset.version}`).id;
};

interface TileCheckboxProps {
    service: InstallerService;
    checked: boolean;
    assetRef: string;
    onChange: (checked: boolean) => void;
}

const TileCheckbox = (props: TileCheckboxProps) => {
    return (
        <Checkbox
            checked={props.checked}
            value={props.assetRef}
            onClick={(evt) => {
                evt.stopPropagation();
            }}
            onChange={(evt, checked) => {
                props.onChange(checked);
            }}
        />
    );
};

export enum BlockhubMode {
    PAGE,
    MODAL_STANDALONE,
    MODAL_SELECTION,
}

export enum BlockhubCategory {
    INSTALLED,
    OWN,
    COMMUNITY,
    PREMIUM,
}

interface Props {
    installerService?: InstallerService;
    plan?: Asset<Plan>;
    fetcher: AssetFetcher;
    assets: AsyncState<AssetDisplay[]>;
    mode: BlockhubMode;
    category?: BlockhubCategory;
    onCategoryChange?: (category: BlockhubCategory) => void;
    selection?: AssetDisplay[];
    disableNavigation?: boolean;
    onSelectionChange?: (selection: AssetDisplay[]) => void;
    onAssetClick?: (asset: AssetDisplay) => void;
    linkMaker?: (asset: AssetDisplay) => string;
    subscriptions?: boolean;
    contextHandle?: string;
    filter?: AssetType;
    onFilterChange: (filter: AssetType) => void;
}

export const Blockhub = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
    const tabs = [
        {
            title: props.subscriptions ? 'Available assets' : 'Installed assets',
            icon: <DownloadDone />,
            type: BlockhubCategory.INSTALLED,
            tooltip: props.subscriptions ? (
                <>
                    <b>Assets that are available on your account</b>
                    <p>These are the assets currently owned or added to your account. </p>
                </>
            ) : (
                <>
                    <b>Assets that are installed on your computer</b>
                    <p>These are the assets currently downloaded to your local machine. </p>
                </>
            ),
        },
        {
            title: 'Your organization',
            icon: <Apartment />,
            type: BlockhubCategory.OWN,
            tooltip: (
                <>
                    <b>Assets in your organization</b>
                    <p>You have access to all assets in your organisation. All you have to do is install them...</p>
                </>
            ),
        },
        {
            title: 'Community',
            icon: <GroupWorkOutlined />,
            type: BlockhubCategory.COMMUNITY,
            tooltip: (
                <>
                    <b>Search the community for available assets</b>
                    <p>Find new community-made assets to add new capabilities to your software</p>
                </>
            ),
        },
        {
            title: 'Premium',
            icon: <Paid />,
            type: BlockhubCategory.PREMIUM,
            tooltip: (
                <>
                    <b>Coming soon!</b>
                    <p>Find new paid assets to add new capabilities to your software</p>
                </>
            ),
        },
    ];
    const [tab, setTab] = useState(props.category ? tabs.findIndex((tab) => tab.type === props.category) : 0);

    useEffect(() => {
        const ix = tabs.findIndex((tab) => tab.type === props.category);
        if (ix !== -1) {
            setTab(ix);
        } else {
            setTab(0);
        }
    }, [props.category]);
    const currentTab = tabs[tab];
    const currentSelection = props.selection || [];

    const isForPlan = !!props.plan;
    const selectBlocksForPlan = props.mode === BlockhubMode.MODAL_SELECTION && isForPlan;

    return (
        <Stack
            ref={ref}
            className={'blockhub-container'}
            direction={'row'}
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                '*': {
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box
                className="blockhub-details"
                sx={{
                    width: 256,
                    minWidth: 256,
                    maxWidth: 256,
                    overflowY: 'auto',
                }}
            >
                <List
                    sx={{
                        gap: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        alignSelf: 'stretch',
                        padding: '24px 16px',
                        '.MuiListItem-root,.MuiListSubheader-root': {
                            display: 'block',
                            width: '100%',
                        },
                        '.MuiButtonBase-root': {
                            borderRadius: '10px',
                        },
                    }}
                >
                    <ListSubheader
                        sx={{
                            padding: '0',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: '500',
                                lineHeight: '150%',
                                letterSpacing: '0.15px',
                                marginBottom: '16px',
                                color: 'text.primary',
                            }}
                        >
                            Block Hub
                        </Typography>
                        <Divider variant={'fullWidth'} />
                    </ListSubheader>
                    {tabs.map((tabInfo, index) => (
                        <ListItem disablePadding={true} key={`nav_${index}`}>
                            <ListItemButton
                                disabled={tabInfo.type === BlockhubCategory.PREMIUM}
                                selected={tab === index}
                                onClick={() => {
                                    setTab(index);
                                    props.onCategoryChange?.(tabInfo.type);
                                }}
                            >
                                <ListItemIcon>{tabInfo.icon}</ListItemIcon>
                                <ListItemText>
                                    <Typography>{tabInfo.title}</Typography>
                                    {tabInfo.type === BlockhubCategory.PREMIUM && (
                                        <Typography variant={'caption'} color={'secondary.text'}>
                                            Coming soon!
                                        </Typography>
                                    )}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box
                className={'blockhub-main'}
                sx={{
                    flex: 1,
                    pb: 2,
                    bgcolor: '#EFEFEF',
                    padding: '29px 88px 16px 44px',
                    overflowX: 'hidden',
                    transition: 'width 200ms ease-in-out',
                    width: '500px',
                    '@media (min-width: 1200px)': {
                        width: '879px',
                    },
                    '@media (min-width: 1600px)': {
                        width: '1263px',
                    },
                    '@media (min-width: 2000px)': {
                        width: '1644px',
                    },
                    '@media (min-width: 2400px)': {
                        width: '2027px',
                    },
                    '@media (min-width: 2800px)': {
                        width: '2408px',
                    },
                }}
            >
                <BlockhubGridContainer
                    assets={props.assets}
                    filter={props.filter ?? (selectBlocksForPlan ? 'BLOCK' : undefined)}
                    title={currentTab.title}
                    onFilterChange={props.onFilterChange}
                    tooltip={currentTab.tooltip}
                    renderAsset={(asset) => {
                        const url = props.linkMaker
                            ? props.linkMaker(asset)
                            : `/${asset.content.metadata.name}/${asset.version}`;
                        const id = toId(asset);
                        const uri = parseKapetaUri(asset.content.metadata.name);
                        const title = asset.content.metadata.title || uri.name;
                        const isBlock = !asset.content.kind.startsWith('core/');
                        const showCheckbox = props.mode === BlockhubMode.MODAL_SELECTION && (isBlock || !isForPlan);

                        const isSelected = showCheckbox ? currentSelection.some((a) => toId(a) === id) : false;

                        const actionButton = showCheckbox ? (
                            <TileCheckbox
                                service={props.installerService}
                                checked={isSelected}
                                assetRef={id}
                                onChange={(checked) => {
                                    if (!props.onSelectionChange) {
                                        return;
                                    }
                                    if (checked) {
                                        props.onSelectionChange([...currentSelection, asset]);
                                    } else {
                                        props.onSelectionChange(currentSelection.filter((item) => toId(item) !== id));
                                    }
                                }}
                            />
                        ) : (
                            <AssetInstallButton
                                subscriptions={props.subscriptions}
                                contextHandle={props.contextHandle}
                                service={props.installerService}
                                asset={asset}
                                type={'chip'}
                            />
                        );

                        return (
                            <BlockhubTile
                                title={title}
                                onClick={() => {
                                    props.onAssetClick?.(asset);
                                }}
                                handle={uri.handle}
                                description={asset.content.metadata.description!}
                                icon={<AssetKindIcon size={64} asset={asset.content} />}
                                version={asset.version}
                                // AssetStats
                                stats={{
                                    downloads: asset.downloadCount,
                                    rating: asset.rating,
                                }}
                                href={props.disableNavigation ? undefined : url}
                                actionButton={actionButton}
                                assetKindLabel={
                                    <DependencyKindLabel
                                        fetcher={props.fetcher}
                                        dependency={{ name: asset.content.kind }}
                                    />
                                }
                                languageTargetLabel={
                                    asset.dependencies?.map((dep) =>
                                        dep.type === 'Language target' ? (
                                            <DependencyKindLabel
                                                fetcher={props.fetcher}
                                                key={dep.name}
                                                dependency={{ name: dep.name }}
                                            />
                                        ) : null
                                    ) || []
                                }
                            />
                        );
                    }}
                />
            </Box>
        </Stack>
    );
});
