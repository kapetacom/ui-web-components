/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { Checkbox, Stack } from '@mui/material';
import { BlockhubTile, DependencyKindLabel } from '../src/blockhub/BlockhubTile';
import { BlockhubDetails } from '../src/blockhub/BlockhubDetails';

import {
    assetFetcher,
    Assets,
    BlockGroupAsset,
    DeploymentAsset,
    DeploymentTargetAsset,
    FrontendBlockAsset,
    FrontendBlockTypeAsset,
    LanguageTargetAsset,
    PlanAsset,
    ProviderInternalAsset,
    ProviderOperatorAsset,
    ServiceBlockAsset,
    ServiceBlockTypeAsset,
    VersionInfo,
} from './blockhub.data';
import { AssetCoreDisplay, AssetDisplay, AssetSimpleDisplay, CoreTypes } from '../src/blockhub/types';
import { AssetInstallButton, AssetInstallStatus, InstallerService } from '../src/blockhub/AssetInstallButton';
import { BlockhubTileActionButton } from '../src/blockhub/BlockhubTileActionButton';
import { AssetType, DefaultContext, DesktopContainer } from '../src';
import { BlockhubModal } from '../src/blockhub/BlockhubModal';
import { Blockhub, BlockhubMode } from '../src/blockhub/Blockhub';

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

const createInstaller = (installStatus: AssetInstallStatus = AssetInstallStatus.NOT_INSTALLED) => {
    const asset = {
        path: '',
        kind: ServiceBlockTypeAsset.content.kind,
        data: ServiceBlockTypeAsset.content,
        exists: true,
        ymlPath: '',
        version: ServiceBlockTypeAsset.version,
        editable: false,
    };

    const installerService: InstallerService = {
        install: async (ref: string) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
        },
        get: async (ref: string) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return installStatus;
        },
        uninstall: async (ref: string) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
        },
    };

    const installerServiceExists: InstallerService = {
        install: async (ref: string) => {
            await new Promise((resolve, reject) =>
                setTimeout(() => {
                    reject(new Error('already installed'));
                }, 4000)
            );
        },
        get: async (ref: string) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return AssetInstallStatus.INSTALLED;
        },
        uninstall: async (ref: string) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
        },
    };
    return {
        asset,
        installerService,
        installerServiceExists,
    };
};

export default {
    title: 'Blockhub',
};

/** GRID VIEWS **/

export const PageView = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');

    return (
        <DefaultContext>
            <Blockhub
                mode={BlockhubMode.PAGE}
                filter={assetTypeFilter}
                onFilterChange={setAssetTypeFilter}
                fetcher={assetFetcher}
                installerService={installerService}
                onAssetImport={() => {
                    console.log('import');
                }}
                assets={{
                    loading: false,
                    value: Assets,
                }}
            />
        </DefaultContext>
    );
};

export const PageViewLoading = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
    return (
        <DefaultContext>
            <Blockhub
                filter={assetTypeFilter}
                onFilterChange={setAssetTypeFilter}
                mode={BlockhubMode.PAGE}
                fetcher={assetFetcher}
                installerService={installerService}
                assets={{
                    loading: true,
                }}
            />
        </DefaultContext>
    );
};

export const PageViewEmpty = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
    return (
        <Blockhub
            filter={assetTypeFilter}
            onFilterChange={setAssetTypeFilter}
            mode={BlockhubMode.PAGE}
            fetcher={assetFetcher}
            installerService={installerService}
            assets={{
                loading: false,
            }}
        />
    );
};

export const ModalStandalone = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
    return (
        <DefaultContext>
            <DesktopContainer version={'1.2.3'}>
                <BlockhubModal
                    filter={assetTypeFilter}
                    onFilterChange={setAssetTypeFilter}
                    fetcher={assetFetcher}
                    installerService={installerService}
                    assets={{
                        loading: false,
                        value: Assets,
                    }}
                    open={true}
                    onClose={() => {}}
                />
            </DesktopContainer>
        </DefaultContext>
    );
};

export const ModalPlan = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
    return (
        <DefaultContext>
            <DesktopContainer version={'1.2.3'}>
                <BlockhubModal
                    filter={assetTypeFilter}
                    onFilterChange={setAssetTypeFilter}
                    plan={{
                        kind: CoreTypes.PLAN,
                        ref: `${PlanAsset.content.metadata.name}:${PlanAsset.version}`,
                        data: PlanAsset.content,
                        exists: true,
                        ymlPath: '',
                        path: '',
                        version: PlanAsset.version,
                        editable: true,
                    }}
                    fetcher={assetFetcher}
                    installerService={installerService}
                    assets={{
                        loading: false,
                        value: Assets,
                    }}
                    open={true}
                    onClose={() => {}}
                />
            </DesktopContainer>
        </DefaultContext>
    );
};

export const ModalPlanUpgrade = () => {
    const { asset, installerService, installerServiceExists } = createInstaller(AssetInstallStatus.UPGRADABLE);
    const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType>('ALL');
    return (
        <DefaultContext>
            <DesktopContainer version={'1.2.3'}>
                <BlockhubModal
                    filter={assetTypeFilter}
                    onFilterChange={setAssetTypeFilter}
                    plan={{
                        kind: CoreTypes.PLAN,
                        ref: `${PlanAsset.content.metadata.name}:${PlanAsset.version}`,
                        data: PlanAsset.content,
                        exists: true,
                        ymlPath: '',
                        path: '',
                        version: PlanAsset.version,
                        editable: true,
                    }}
                    fetcher={assetFetcher}
                    installerService={installerService}
                    assets={{
                        loading: false,
                        value: Assets.map((a) => {
                            return {
                                ...a,
                                version: '2.0.1',
                            };
                        }),
                    }}
                    open={true}
                    onClose={() => {}}
                />
            </DesktopContainer>
        </DefaultContext>
    );
};

/** DETAIL VIEWS **/

export const DetailBlockType = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={FrontendBlockTypeAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(FrontendBlockTypeAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailBlockTypeNotKapeta = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={{
                    ...FrontendBlockTypeAsset,
                    content: {
                        ...FrontendBlockTypeAsset.content,
                        metadata: {
                            ...FrontendBlockTypeAsset.content.metadata,
                            name: 'not-kapeta/frontend',
                        },
                    },
                }}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(FrontendBlockTypeAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailLanguageTargetDesktop = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    const { installerService } = createInstaller();
    return (
        <DefaultContext>
            <DesktopContainer version={'1.2.3'}>
                <BlockhubDetails
                    asset={{ ...LanguageTargetAsset, version: '1.0.1' }}
                    versionInfo={VersionInfo}
                    service={installerService}
                    fetcher={assetFetcher}
                    {...getRelated(LanguageTargetAsset)}
                    tabId={currentTab}
                    onTabChange={(tabId) => setCurrentTab(tabId)}
                />
            </DesktopContainer>
        </DefaultContext>
    );
};

export const DetailLanguageTargetDesktopUpgrade = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    const { installerService } = createInstaller(AssetInstallStatus.UPGRADABLE);
    return (
        <DefaultContext>
            <DesktopContainer version={'1.2.3'}>
                <BlockhubDetails
                    asset={{ ...LanguageTargetAsset, version: '1.0.2' }}
                    versionInfo={VersionInfo}
                    service={installerService}
                    fetcher={assetFetcher}
                    {...getRelated(LanguageTargetAsset)}
                    tabId={currentTab}
                    onTabChange={(tabId) => setCurrentTab(tabId)}
                />
            </DesktopContainer>
        </DefaultContext>
    );
};

export const DetailDeploymentTarget = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={DeploymentTargetAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(DeploymentTargetAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailProviderOperator = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={ProviderOperatorAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(ProviderOperatorAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailProviderInternal = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={ProviderInternalAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(ProviderInternalAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailBlockGroup = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={BlockGroupAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(BlockGroupAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailPlan = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={PlanAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(PlanAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailDeployment = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={DeploymentAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(DeploymentAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailFrontendBlock = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={FrontendBlockAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(FrontendBlockAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

export const DetailServiceBlock = () => {
    const [currentTab, setCurrentTab] = React.useState('general');
    return (
        <DefaultContext>
            <BlockhubDetails
                asset={ServiceBlockAsset}
                versionInfo={VersionInfo}
                fetcher={assetFetcher}
                {...getRelated(ServiceBlockAsset)}
                tabId={currentTab}
                onTabChange={(tabId) => setCurrentTab(tabId)}
            />
        </DefaultContext>
    );
};

/** HELPERS **/
export const HelperTileButtons = () => {
    return (
        <>
            <div style={{ padding: '5px' }}>
                <BlockhubTileActionButton
                    label="Install"
                    onClick={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 4000));
                    }}
                />
            </div>
            <div style={{ padding: '5px' }}>
                <BlockhubTileActionButton
                    label="Navigate"
                    onClick={() => {
                        console.log('navigate');
                    }}
                />
            </div>
        </>
    );
};

export const HelperInstallButtons = () => {
    const { asset, installerService, installerServiceExists } = createInstaller();

    const { installerService: upgradeService } = createInstaller(AssetInstallStatus.UPGRADABLE);

    return (
        <DefaultContext>
            <div>
                <h3>Not Desktop</h3>
                <div style={{ padding: '5px' }}>
                    <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'icon'} />
                </div>
                <div style={{ padding: '5px' }}>
                    <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'chip'} />
                </div>
                <div style={{ padding: '5px' }}>
                    <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'button'} />
                </div>
            </div>
            <DesktopContainer version={'1.2.3'}>
                <div>
                    <h3>Desktop Not Installed</h3>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'icon'} />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'chip'} />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton service={installerService} asset={FrontendBlockTypeAsset} type={'button'} />
                    </div>
                </div>
                <div>
                    <h3>Desktop Loading</h3>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            forceLoading={true}
                            service={installerService}
                            asset={FrontendBlockTypeAsset}
                            type={'icon'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            forceLoading={true}
                            service={installerService}
                            asset={FrontendBlockTypeAsset}
                            type={'chip'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            forceLoading={true}
                            service={installerService}
                            asset={FrontendBlockTypeAsset}
                            type={'button'}
                        />
                    </div>
                </div>
                <div>
                    <h3>Desktop Upgrade</h3>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            service={upgradeService}
                            asset={{ ...ServiceBlockTypeAsset, version: '2.0.1' }}
                            type={'icon'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            asset={{ ...ServiceBlockTypeAsset, version: '2.0.1' }}
                            service={upgradeService}
                            type={'chip'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            service={upgradeService}
                            asset={{ ...ServiceBlockTypeAsset, version: '2.0.1' }}
                            type={'button'}
                        />
                    </div>
                </div>
                <div>
                    <h3>Desktop Installed</h3>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            service={installerServiceExists}
                            asset={{ ...ServiceBlockTypeAsset, version: '1.0.1' }}
                            type={'icon'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            service={installerServiceExists}
                            asset={{ ...ServiceBlockTypeAsset, version: '1.0.1' }}
                            type={'chip'}
                        />
                    </div>
                    <div style={{ padding: '5px' }}>
                        <AssetInstallButton
                            service={installerServiceExists}
                            asset={{ ...ServiceBlockTypeAsset, version: '1.0.1' }}
                            type={'button'}
                        />
                    </div>
                </div>
            </DesktopContainer>
        </DefaultContext>
    );
};

export const HelperTiles = () => {
    const props = {
        handle: 'openai',
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
                                {
                                    label: 'overflow',
                                    onClick() {},
                                },
                                {
                                    label: 'even more',
                                    onClick() {},
                                },
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
                                {
                                    label: 'overflow',
                                    onClick() {},
                                },
                                {
                                    label: 'even more',
                                    onClick() {},
                                },
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
                                {
                                    label: 'overflow',
                                    onClick() {},
                                },
                                {
                                    label: 'even more',
                                    onClick() {},
                                },
                            ]}
                        />
                    }
                />
            </Stack>
        </div>
    );
};
