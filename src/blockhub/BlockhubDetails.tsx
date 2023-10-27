import React from 'react';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/VerifiedOutlined';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBack from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';

import { AssetDisplay, AssetFetcher, AssetVersionInfo, CoreTypes, Dependency } from './types';
import { BlockhubStats, BlockhubTile, DependencyKindLabel } from './BlockhubTile';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { isPublic, renderArtifact, renderDatetime, renderRepository } from './asset-helpers';
import { KeyValue, KeyValueRow } from './KeyValue';
import { VersionGraph } from './Versions';
import { AssetKindIcon, AssetKindIconText } from '../icons/AssetIcon';
import useSWR from 'swr';
import { AssetInstallButton, InstallerService } from './AssetInstallButton';
import { Size } from '@kapeta/ui-web-types';
import { toDateText } from '../dates';
import { Tooltip } from '../tooltip/Tooltip';

export type BlockHubDetailsPreviewer = (asset: AssetDisplay, size: Size) => React.ReactNode;

const KapetaTab = styled(Tab)({
    maxWidth: '214px',
});

const TabContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>((props) => ({
    display: props.open ? 'block' : 'none',
    padding: '16px 0',
}));

const KindIcon = (props: { kind: CoreTypes; text: string }) => (
    // Hmm, this is a bit hacky to tweak the icon alignment
    <Box sx={{ '& .asset-icon': { verticalAlign: 'middle' } }}>
        <AssetKindIconText asset={{ kind: props.kind, metadata: { name: props.text }, spec: {} }} size={24} />
    </Box>
);

interface Props {
    disableNavigation?: boolean;
    onAssetClick?: (asset: AssetDisplay) => void;
    asset: Dependency;
    fetcher: AssetFetcher;
    linkMaker?: (fullName: string, version: string) => string;
}

const AutoLoadingTile = (props: Props) => {
    const { fullName, version } = parseKapetaUri(props.asset.name);
    const assetReq = useSWR([fullName, version], ([name, version]) => props.fetcher(name, version || 'current'), {
        revalidateOnFocus: false,
    });

    const stats = assetReq.data
        ? {
              rating: assetReq.data.rating,
              downloads: assetReq.data.downloadCount,
          }
        : undefined;
    const asset = assetReq.data;

    const url = props.linkMaker ? props.linkMaker(fullName, version) : `/${fullName}/${version}`;

    return (
        <BlockhubTile
            title={asset?.content.metadata.title || asset?.content.metadata.name || 'Loading...'}
            handle={parseKapetaUri(props.asset.name).handle}
            description={asset?.content.metadata.description!}
            icon={asset && <AssetKindIcon size={64} asset={asset.content} />}
            version={version}
            stats={stats}
            assetKindLabel={
                asset ? <DependencyKindLabel fetcher={props.fetcher} dependency={{ name: asset.content.kind }} /> : null
            }
            languageTargetLabel={
                asset.dependencies
                    ? asset.dependencies?.map((dep) =>
                          dep.type === 'Language target' ? (
                              <DependencyKindLabel fetcher={props.fetcher} key={dep.name} dependency={dep} />
                          ) : null
                      )
                    : []
            }
            onClick={
                props.onAssetClick
                    ? () => {
                          if (props.onAssetClick && asset) {
                              props.onAssetClick(asset);
                          }
                      }
                    : undefined
            }
            href={props.disableNavigation ? undefined : url}
        />
    );
};

export interface BlockhubDetailsProps {
    asset: AssetDisplay;
    service?: InstallerService;
    fetcher?: AssetFetcher;
    versionInfo?: AssetVersionInfo;
    tabId?: 'general' | 'dependencies' | 'versions' | string;
    onTabChange: (tabId: 'general' | 'dependencies' | 'versions') => void;
    onBackAction?: () => void;
    previewRenderer?: BlockHubDetailsPreviewer;
    disableNavigation?: boolean;
    onAssetClick?: (asset: AssetDisplay) => void;
    linkMaker?: (fullName: string, version: string) => string;
    subscriptions?: boolean;
    contextHandle?: string;
}

export function BlockhubDetails(props: BlockhubDetailsProps) {
    const isPublicAsset = isPublic(props.asset.content);
    const currentTab = props.tabId || 'general';

    const handle = parseKapetaUri(props.asset.content.metadata.name).handle;

    return (
        <Stack
            direction={'row'}
            alignItems={'stretch'}
            sx={{
                minHeight: '100%',
                width: '100%',
                '*': {
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box p={3} position={'fixed'}>
                <Button color="inherit" onClick={props.onBackAction}>
                    <ArrowBack />
                    Back
                </Button>
            </Box>
            <Box flexBasis={120} p={3} />
            <Stack direction="row" sx={{ p: 2, pt: 8 }} gap={2}>
                {handle === 'kapeta' && (
                    <Tooltip title={'This asset is maintained by Kapeta'}>
                        <VerifiedIcon sx={{ width: '35px', height: '35px' }} color="secondary" />
                    </Tooltip>
                )}

                {handle !== 'kapeta' && (
                    <Tooltip title={'This asset is maintained by a member of the Kapeta community'}>
                        <PeopleIcon sx={{ width: '35px', height: '35px' }} color="inherit" />
                    </Tooltip>
                )}

                <Box width={'614px'}>
                    <Stack gap={2}>
                        <Typography variant="h4">
                            {props.asset.content.metadata.title || props.asset.content.metadata.name}
                        </Typography>

                        <Typography>By {handle}</Typography>

                        <Typography variant="body2">
                            {props.asset.content.metadata.description || 'No description provided.'}
                        </Typography>
                    </Stack>

                    <Box sx={{ mt: 3, mb: 4 }}>
                        <Typography variant="body2">
                            <span className="version" style={{ textDecoration: 'underline', fontWeight: 500 }}>
                                {props.asset.version}
                            </span>
                            &nbsp;
                            <span className="availability">{isPublicAsset ? 'Public' : 'Private'}</span>
                            &nbsp;&bull;&nbsp;
                            <span
                                className="last-updated"
                                title={props.asset.lastModified ? renderDatetime(props.asset.lastModified) : ''}
                            >
                                {props.asset.lastModified && (
                                    <span className={'value'}>Last updated {toDateText(props.asset.lastModified)}</span>
                                )}
                            </span>
                        </Typography>
                    </Box>

                    <Tabs
                        value={currentTab}
                        variant="fullWidth"
                        sx={(theme) => ({ borderBottom: '1px solid ' + theme.palette.divider })}
                        onChange={(_e, tabValue) => props.onTabChange(tabValue)}
                    >
                        <KapetaTab value={'general'} label={'General'} />
                        <KapetaTab
                            value={'dependencies'}
                            label={[props.asset.dependencies?.length || '', 'Dependencies'].filter(Boolean).join(' ')}
                        />
                        {props.versionInfo && <KapetaTab value={'versions'} label={'Versions'} />}
                    </Tabs>

                    <TabContainer open={currentTab === 'general'}>
                        {props.asset?.readme?.type === 'markdown' && (
                            <ReactMarkdown children={props.asset.readme?.content?.trim()} />
                        )}
                        {props.asset?.readme?.type === 'text' && <pre>{props.asset.readme?.content?.trim()}</pre>}

                        {!props.asset?.readme?.type && (
                            <p>
                                No readme file found.
                                <br />
                                <br />
                                Add a README.md, README.txt or README file in the root of your project to add
                                information here.
                            </p>
                        )}
                    </TabContainer>
                    {currentTab === 'dependencies' && (
                        <TabContainer open>
                            <Stack gap={2}>
                                {props.asset.dependencies?.length === 0 && 'No dependencies'}
                                {props.asset.dependencies?.map((asset) => (
                                    <AutoLoadingTile
                                        fetcher={props.fetcher}
                                        disableNavigation={props.disableNavigation}
                                        onAssetClick={props.onAssetClick}
                                        asset={asset}
                                        linkMaker={props.linkMaker}
                                        key={asset.name}
                                    />
                                ))}
                            </Stack>
                        </TabContainer>
                    )}
                    {props.versionInfo && (
                        <TabContainer open={currentTab === 'versions'}>
                            <VersionGraph {...props.versionInfo} />
                        </TabContainer>
                    )}
                </Box>
            </Stack>
            <Box flexBasis={40} flexGrow={1} flexShrink={0} />
            <Stack
                direction="column"
                sx={{
                    backgroundColor: '#F8F8F8',
                    width: '465px',
                    minWidth: '465px',
                    maxWidth: '465px',
                    minHeight: '100%',

                    p: 8,
                }}
                gap={2}
            >
                <Box
                    textAlign={'center'}
                    sx={{
                        background: '#F4EEEE',
                        padding: 2,
                        height: '192px',
                        minHeight: '192px',
                    }}
                >
                    {props.previewRenderer ? (
                        props.previewRenderer(props.asset, { width: 305, height: 160 })
                    ) : (
                        <AssetKindIcon size={152} asset={props.asset.content} />
                    )}
                </Box>

                <AssetInstallButton
                    subscriptions={props.subscriptions}
                    contextHandle={props.contextHandle}
                    service={props.service}
                    asset={props.asset}
                    type={'button'}
                />

                {/* Labels + stats */}
                <Stack
                    direction={'row'}
                    gap={2}
                    justifyContent="space-between"
                    alignItems={'flex-end'}
                    sx={{
                        // Align the labels with the stats
                        '& .metrics': {
                            gap: '5px',
                        },
                    }}
                >
                    {/* They look better stacked vertically here imo */}
                    <Stack className="labels" direction={'column'} gap="5px" alignItems={'start'}>
                        {[
                            { name: props.asset.content.kind },
                            props.asset.dependencies?.find((dep) => dep.type === 'Language target'),
                        ].map((dependency) =>
                            dependency ? (
                                <DependencyKindLabel
                                    fetcher={props.fetcher}
                                    key={dependency.name}
                                    dependency={dependency}
                                />
                            ) : null
                        )}
                    </Stack>
                    <BlockhubStats
                        stats={{
                            rating: props.asset.rating,
                            downloads: props.asset.downloadCount,
                        }}
                    />
                </Stack>

                <Box
                    sx={{
                        '.key-value .value': { fontSize: '12px' },
                        '.key-value .label': { fontSize: '12px', marginBottom: 0 },
                        '.repository': {
                            '.name': {
                                fontWeight: 600,
                                marginRight: '5px',
                            },
                            color: '#544b49',
                        },
                    }}
                >
                    <KeyValueRow>
                        <KeyValue label="Name" value={props.asset.content.metadata.name} />
                        <KeyValue label="Version" value={props.asset.version} />
                    </KeyValueRow>
                    <KeyValueRow>
                        <KeyValue label="Kind" value={props.asset.content.kind} />
                    </KeyValueRow>
                    {props.asset.repository && (
                        <KeyValueRow>
                            <KeyValue label={'Repository'} value={renderRepository(props.asset.repository)} />
                        </KeyValueRow>
                    )}
                    {props.asset.artifact && (
                        <KeyValueRow>
                            <KeyValue label={'Artifact'} value={renderArtifact(props.asset.artifact)} />
                        </KeyValueRow>
                    )}
                </Box>
            </Stack>
        </Stack>
    );
}
