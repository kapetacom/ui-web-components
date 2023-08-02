import React from 'react';
import {
    Box,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
} from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { BlockhubTile, BlockhubTileActionButton, DependencyKindLabel } from '../src/blockhub/BlockhubTile';
import { BlockhubGrid } from '../src/blockhub/BlockhubGrid';
import { BlockhubSidebar } from '../src/blockhub/BlockhubSidebar';
import { BlockhubDetails } from '../src/blockhub/BlockhubDetails';

import {
    Assets,
    BlockGroupAsset,
    FrontendBlockTypeAsset,
    DeploymentAsset,
    DeploymentTargetAsset,
    FrontendBlockAsset,
    LanguageTargetAsset,
    PlanAsset,
    ProviderInternalAsset,
    ProviderOperatorAsset,
    ServiceBlockAsset,
    VersionInfo,
    assetFetcher,
} from './blockhub.data';
import { AssetCoreDisplay, AssetDisplay, AssetSimpleDisplay, CoreTypes } from '../src/blockhub/types';
import { AssetKindIcon } from '../src/icons/AssetIcon';

const assetMapper = (name: string): AssetSimpleDisplay | AssetCoreDisplay => {
    if (name.startsWith('core/')) {
        return {
            version: '',
            content: {
                kind: CoreTypes.CORE,
                metadata: {
                    name,
                },
                spec: {},
            },
        };
    }

    const [assetId, version] = name.split(/:/);

    const out = Assets.find(
        (a) => a.content?.metadata?.name?.toLowerCase() === assetId.toLowerCase() && (!version || a.version === version)
    );

    if (!out) {
        console.log('Assets', Assets);
        throw new Error('Asset not found: ' + assetId + ':' + version);
    }
    return out;
};

function getRelated(asset: AssetDisplay) {
    const dependencies: AssetCoreDisplay[] = asset.dependencies
        ? asset.dependencies.map((dep) => assetMapper(dep.name))
        : [];
    const dependants: AssetCoreDisplay[] = asset.dependants ? asset.dependants.map((dep) => assetMapper(dep.name)) : [];

    return {
        dependencies,
        dependants,
    };
}

export default {
    title: 'Blockhub',
};

export const CardTypes = () => {
    const props = {
        title: 'ChatGPT',
        subtitle: 'OpenAI',
        description: `The Datree app allows engineering teams to automatically identify errors in newly committed YAML configs, including k8s manifests.`,
        stats: {
            rating: 2.5,
            downloads: 2301,
        },
        labels: [
            <DependencyKindLabel fetcher={assetFetcher} key={'kind'} dependency={{ name: 'core/block-type' }} />,
            <DependencyKindLabel
                key={'language-target'}
                fetcher={assetFetcher}
                dependency={{ name: 'kapeta/language-target-react-ts:1.0.1' }}
            />,
        ],
    };

    return (
        <div>
            <Stack
                direction={'row'}
                flexWrap={'wrap'}
                gap={2}
                sx={{
                    '& > .BlockhubTile': {
                        maxWidth: 'calc(33.33% - 16px)',
                    },
                }}
            >
                {/* Select */}
                <BlockhubTile {...props} actionButton={<Checkbox />} />
                {/* Selected */}
                <BlockhubTile {...props} actionButton={<Checkbox checked />} />

                <BlockhubTile
                    {...props}
                    actionButton={
                        <BlockhubTileActionButton
                            label="100$"
                            onClick={() => console.log('Action!')}
                            menuItems={[
                                { label: 'overflow', onClick() {} },
                                { label: 'even more', onClick() {} },
                            ]}
                        />
                    }
                />
                <BlockhubTile
                    {...props}
                    actionButton={
                        <BlockhubTileActionButton
                            label="Free"
                            onClick={() => console.log('Action!')}
                            menuItems={[
                                { label: 'overflow', onClick() {} },
                                { label: 'even more', onClick() {} },
                            ]}
                        />
                    }
                />
                <BlockhubTile
                    {...props}
                    actionButton={
                        <BlockhubTileActionButton
                            label="Open"
                            onClick={() => console.log('Action!')}
                            menuItems={[
                                { label: 'overflow', onClick() {} },
                                { label: 'even more', onClick() {} },
                            ]}
                        />
                    }
                />
            </Stack>
        </div>
    );
};

export const BlockhubView = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                '& > .BlockhubGrid': {
                    boxSizing: 'content-box',
                    p: 2,
                },
            }}
        >
            <BlockhubSidebar>
                <List subheader={<ListSubheader>Blockhub</ListSubheader>}>
                    <ListItem>
                        <ListItemButton disabled>
                            <ListItemIcon>
                                <CheckCircleOutline />
                            </ListItemIcon>
                            <ListItemText>Installed assets</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </BlockhubSidebar>
            <BlockhubGrid
                assets={{
                    loading: false,
                    value: Assets,
                }}
                renderAsset={(asset) => (
                    <BlockhubTile
                        title={asset.content.metadata.title!}
                        subtitle={asset.content.metadata.title!}
                        description={asset.content.metadata.description!}
                        icon={<AssetKindIcon asset={asset.content} size={64} />}
                        // AssetStats
                        stats={{
                            downloads: 1231,
                            rating: 3,
                        }}
                        labels={[
                            <DependencyKindLabel
                                fetcher={assetFetcher}
                                key={'kind'}
                                dependency={{ name: asset.content.kind }}
                            />,
                            ...(asset.dependencies?.map((dep) =>
                                dep.type === 'Language target' ? (
                                    <DependencyKindLabel
                                        fetcher={assetFetcher}
                                        key={'language-target'}
                                        dependency={{ name: dep.name }}
                                    />
                                ) : null
                            ) || []),
                        ]}
                        // selected
                        href={`/${asset.content.metadata.name}/${asset.version}`}
                        actionButton={<BlockhubTileActionButton label="Get" onClick={() => console.log('Get it?')} />}
                    />
                )}
            />
        </Box>
    );
};

export const BlockhubViewLoading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                '& > .BlockhubGrid': {
                    flexGrow: 1,
                    p: 3,
                },
            }}
        >
            <BlockhubSidebar>
                <List subheader={<ListSubheader>Blockhub</ListSubheader>}>
                    <ListItem>
                        <ListItemButton disabled>
                            <ListItemIcon>
                                <CheckCircleOutline />
                            </ListItemIcon>
                            <ListItemText>Installed assets</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </BlockhubSidebar>
            <BlockhubGrid
                assets={{
                    loading: true,
                }}
                renderAsset={() => null}
            />
        </Box>
    );
};

export const BlockhubViewEmpty = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                '& > .BlockhubGrid': {
                    flexGrow: 1,
                    p: 3,
                },
            }}
        >
            <BlockhubSidebar>
                <List subheader={<ListSubheader>Blockhub</ListSubheader>}>
                    <ListItem>
                        <ListItemButton disabled>
                            <ListItemIcon>
                                <CheckCircleOutline />
                            </ListItemIcon>
                            <ListItemText>Installed assets</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </BlockhubSidebar>
            <BlockhubGrid
                assets={{
                    loading: false,
                    value: [],
                }}
                renderAsset={() => null}
            />
        </Box>
    );
};

export const BlockTypeView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={FrontendBlockTypeAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(FrontendBlockTypeAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const LanguageTargetView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={LanguageTargetAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(LanguageTargetAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const DeploymentTargetView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={DeploymentTargetAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(DeploymentTargetAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const ProviderOperatorView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={ProviderOperatorAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(ProviderOperatorAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const ProviderInternalView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={ProviderInternalAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(ProviderInternalAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const BlockGroupView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={BlockGroupAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(BlockGroupAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const PlanView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={PlanAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(PlanAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const DeploymentView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={DeploymentAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(DeploymentAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const FrontendBlockView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={FrontendBlockAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(FrontendBlockAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};

export const ServiceBlockView = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <BlockhubDetails
            asset={ServiceBlockAsset}
            versionInfo={VersionInfo}
            fetcher={assetFetcher}
            {...getRelated(ServiceBlockAsset)}
            tabId={currentTab}
            onTabChange={(tabId) => setCurrentTab(tabId)}
        />
    );
};
