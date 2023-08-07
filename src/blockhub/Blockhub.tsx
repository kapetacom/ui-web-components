import React, { forwardRef, useState } from 'react';
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
import { Apartment, DownloadDone, GroupWorkOutlined } from '@mui/icons-material';
import { AssetDisplay, AssetFetcher } from './types';
import { Plan } from '@kapeta/schemas';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { Asset } from '@kapeta/ui-web-types';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';

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
    const asset = useAsync(async () => {
        return await props.service.get(props.assetRef);
    }, [props.assetRef, props.service]);

    if (asset.loading) {
        return <CircularProgress size={20} />;
    }

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
}

interface Props {
    installerService?: InstallerService;
    plan?: Asset<Plan>;
    fetcher: AssetFetcher;
    assets: AsyncState<AssetDisplay[]>;
    mode: BlockhubMode;
    onFilterChange?: (category: BlockhubCategory) => void;
    selection?: AssetDisplay[];
    onSelectionChange?: (selection: AssetDisplay[]) => void;
    onAssetClick?: (asset: AssetDisplay) => void;
}

export const Blockhub = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
    const [tab, setTab] = useState(0);

    const tabs = [
        ...(props.mode !== BlockhubMode.PAGE
            ? [
                  {
                      title: 'Installed assets',
                      icon: <DownloadDone />,
                      type: BlockhubCategory.INSTALLED,
                      tooltip: (
                          <>
                              <b>Assets that are installed on your computer</b>
                              <p>These are the assets currently downloaded to your local machine. </p>
                          </>
                      ),
                  },
              ]
            : []),
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
                    <p>Find new free or paid assets to add new capabilities to your software</p>
                </>
            ),
        },
    ];

    const currentTab = tabs[tab];
    const currentSelection = props.selection || [];

    const isForPlan = !!props.plan;
    const selectBlocksForPlan = props.mode === BlockhubMode.MODAL_SELECTION && isForPlan;

    return (
        <div
            ref={ref}
            className={'blockhub-container'}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
            }}
        >
            <Stack
                direction={'row'}
                sx={{
                    width: '100%',
                    height: '100%',
                    '& > .blockhub-main': {
                        boxSizing: 'content-box',
                        flex: 1,
                        bgcolor: '#EFEFEF',
                        padding: '29px 44px 0px 44px',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 256,
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
                                    selected={tab === index}
                                    onClick={() => {
                                        setTab(index);
                                        props.onFilterChange?.(tabInfo.type);
                                    }}
                                >
                                    <ListItemIcon>{tabInfo.icon}</ListItemIcon>
                                    <ListItemText>{tabInfo.title}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box className={'blockhub-main'}>
                    <BlockhubGridContainer
                        assets={props.assets}
                        initialAssetTypeFilter={selectBlocksForPlan ? 'BLOCK' : undefined}
                        title={currentTab.title}
                        tooltip={currentTab.tooltip}
                        renderAsset={(asset) => {
                            const url = `/${asset.content.metadata.name}/${asset.version}`;
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
                                            props.onSelectionChange(
                                                currentSelection.filter((item) => toId(item) !== id)
                                            );
                                        }
                                    }}
                                />
                            ) : (
                                <AssetInstallButton service={props.installerService} asset={asset} type={'chip'} />
                            );

                            return (
                                <BlockhubTile
                                    title={title}
                                    onClick={() => {
                                        props.onAssetClick?.(asset);
                                    }}
                                    subtitle={`By ${uri.handle}`}
                                    description={asset.content.metadata.description!}
                                    icon={<AssetKindIcon size={64} asset={asset.content} />}
                                    version={asset.version}
                                    // AssetStats
                                    stats={{
                                        downloads: asset.downloadCount,
                                        rating: asset.rating,
                                    }}
                                    href={url}
                                    actionButton={actionButton}
                                    labels={[
                                        <DependencyKindLabel
                                            fetcher={props.fetcher}
                                            key={'kind'}
                                            dependency={{ name: asset.content.kind }}
                                        />,
                                        ...(asset.dependencies?.map((dep) =>
                                            dep.type === 'Language target' ? (
                                                <DependencyKindLabel
                                                    fetcher={props.fetcher}
                                                    key={'language-target'}
                                                    dependency={{ name: dep.name }}
                                                />
                                            ) : null
                                        ) || []),
                                    ]}
                                />
                            );
                        }}
                    />
                </Box>
            </Stack>
        </div>
    );
});
