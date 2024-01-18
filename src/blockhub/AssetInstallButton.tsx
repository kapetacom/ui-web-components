/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Box, Button, CircularProgress, Fab, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Tooltip } from '../tooltip/Tooltip';
import { showToasty, ToastType } from '../toast/ToastComponent';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { TaskState, useDesktop } from '../utils/desktop';
import { TaskStatus } from '@kapeta/ui-web-context';
import { getNameForKind } from './BlockhubTile';
import { Downloading } from '@mui/icons-material';

import { AssetDisplay } from './types';
import useSWR from 'swr';
import { ArrowDownward, Delete, DownloadDone, InstallDesktop, MoreVertRounded, ArrowUpward } from '@mui/icons-material';

import { grey } from '@mui/material/colors';
import { useConfirm } from '../confirm';
import { parseKapetaUri } from '@kapeta/nodejs-utils';

export enum AssetInstallStatus {
    NOT_INSTALLED = 1,
    UPGRADABLE = 2,
    INSTALLED = 3,
}

export interface InstallerService {
    install(assetRef: string): Promise<void>;

    get(assetRef: string): Promise<AssetInstallStatus>;

    uninstall?: (assetRef: string) => Promise<void>;
    onChange?: (assetRef: string, cb: () => void | Promise<void>) => () => void;
}

interface SubMenuItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => Promise<void>;
}

interface Props {
    asset: AssetDisplay;
    type: 'icon' | 'button' | 'chip';
    service?: InstallerService;
    subscriptions?: boolean;
    contextHandle?: string;
    forceLoading?: boolean; //Used for testing
}

export const AssetInstallButton = (props: Props) => {
    const desktop = useDesktop();
    const confirm = useConfirm();
    const [submenuAnchorElm, setSubmenuAnchorElm] = useState<null | HTMLElement>(null);

    // Loading indicator for install/uninstall calls
    const [isPreparing, setIsPreparing] = useState(false);
    const waitForInstall = useCallback(async (p: Promise<any> | undefined) => {
        try {
            setIsPreparing(true);
            await p;
        } finally {
            setIsPreparing(false);
        }
    }, []);

    const submenuOpen = Boolean(submenuAnchorElm);
    const assetRef = `kapeta://${props.asset.content.metadata.name}:${props.asset.version}`;
    const assetUri = parseKapetaUri(assetRef);
    const closeSubmenu = (e: SyntheticEvent) => {
        e.stopPropagation();
        setSubmenuAnchorElm(null);
    };
    const active = !!((props.subscriptions && props.contextHandle !== assetUri.handle) || desktop.version);
    const installedAsset = useSWR(assetRef, async (ref) => {
        if (!active) {
            return undefined;
        }
        return props.service?.get(ref);
    });

    useEffect(() => {
        console.log('service or active changed', active);
        installedAsset.mutate();
    }, [props.service?.get, active]);

    useEffect(() => {
        if (!props.service?.onChange) {
            return () => {};
        }

        return props.service?.onChange(assetRef, async () => {
            console.log('Asset changed', assetRef);
            await installedAsset.mutate();
        });
    }, [props.service?.onChange, installedAsset]);

    const kindName = getNameForKind(props.asset.content.kind);
    const kindNameLC = kindName.toLowerCase();

    let installTask: TaskState = {
        ready: true,
        active: false,
        task: null,
    };
    if (desktop.getTask) {
        installTask = desktop.getTask(`asset:install:${assetRef}`, async (task) => {
            if (task.status === TaskStatus.FAILED) {
                showToasty({
                    type: ToastType.ALERT,
                    title: props.subscriptions ? `Failed to add ${kindNameLC}` : `Failed to install ${kindNameLC}`,
                    message: task.errorMessage || 'Unknown error',
                });
            }

            if (task.status === TaskStatus.COMPLETED) {
                await installedAsset.mutate();
                showToasty({
                    type: ToastType.SUCCESS,
                    title: props.subscriptions ? `${kindName} added` : `${kindName} installed`,
                    message: props.subscriptions
                        ? `The ${kindNameLC} has been added successfully.`
                        : `The ${kindNameLC} has been installed successfully.`,
                });
            }
        });
    }

    const isDisabled =
        props.forceLoading === true || !installTask.ready || !active || installTask.active || installedAsset.isLoading;

    const isProcessing =
        props.forceLoading === true ||
        !installTask.ready ||
        installTask.active ||
        installedAsset.isLoading ||
        isPreparing;

    const isLatestVersion = installedAsset.data === AssetInstallStatus.INSTALLED;
    const canUpgrade = installedAsset.data === AssetInstallStatus.UPGRADABLE;
    const isInstalled = isLatestVersion || canUpgrade;

    let icon = active ? (
        isLatestVersion ? (
            <DownloadDone />
        ) : canUpgrade ? (
            <ArrowUpward />
        ) : (
            <ArrowDownward />
        )
    ) : props.subscriptions ? (
        <DownloadDone />
    ) : canUpgrade ? (
        <ArrowUpward />
    ) : (
        <InstallDesktop />
    );

    let longText = active
        ? isLatestVersion
            ? props.subscriptions
                ? 'Added'
                : 'Installed'
            : canUpgrade
            ? `Upgrade ${kindNameLC}`
            : props.subscriptions
            ? `Add ${kindNameLC}`
            : `Install ${kindNameLC}`
        : props.subscriptions
        ? `You own this ${kindNameLC}`
        : 'Open desktop app to install';

    let shortText: string | React.ReactNode | null = active
        ? isLatestVersion
            ? 'Open'
            : canUpgrade
            ? `Upgrade`
            : props.subscriptions
            ? `Add`
            : `Get`
        : '';

    let chipBgColor = active ? (isLatestVersion ? 'primary.main' : `tertiary.main`) : grey[500];

    let chipFgColor: string = active ? (isLatestVersion ? grey[100] : grey[100]) : grey[100];

    if (installedAsset.isLoading) {
        longText = 'Checking...';
        icon = <Downloading />;
        shortText = '...';
    }

    if (isProcessing && props.type === 'chip') {
        chipBgColor = 'transparent';
        chipFgColor = 'primary.main';
        shortText = '';
    }

    if (installTask.active) {
        longText = 'Installing...';
    }

    const subMenu: SubMenuItem[] = useMemo(() => {
        const canRemove = !!(props.service?.uninstall && active && isInstalled);
        const out: SubMenuItem[] = [];
        if (canRemove) {
            out.push({
                label: 'Remove',
                icon: <Delete />,
                onClick: async () => {
                    const ok = await confirm({
                        title: `Remove ${kindNameLC}`,
                        content: `
                        Are you sure you want to remove ${props.asset.content.metadata.name}? 
                        This will not delete anything from your disk.
                        `,
                        confirmationText: 'Remove',
                    });

                    if (!ok) {
                        return;
                    }

                    await waitForInstall(props.service?.uninstall?.(assetRef));
                    await installedAsset.mutate();
                },
            });
        }

        if (canUpgrade) {
            out.push({
                label: 'Upgrade',
                icon: <ArrowUpward />,
                onClick: async () => {
                    await installAction();
                },
            });
        }
        return out;
    }, [props.service?.uninstall, active, installedAsset, isInstalled, canUpgrade]);

    if (subMenu.length > 0) {
        icon = <MoreVertRounded />;
    }

    const installAction = useCallback(async () => {
        try {
            await waitForInstall(props.service?.install(assetRef));
            if (props.subscriptions) {
                await installedAsset.mutate();
            }
        } catch (e) {
            showToasty({
                type: ToastType.ALERT,
                title: props.subscriptions ? `Failed to add ${kindNameLC}` : `Failed to install ${kindNameLC}`,
                message: (e as Error).message || 'Unknown error',
            });
        }
    }, [assetRef, props.service, kindNameLC]);

    const onPrimaryClick = useCallback(
        async (evt: React.MouseEvent<any>) => {
            if (!active) {
                return;
            }

            if (props.type !== 'chip' && subMenu.length > 0) {
                evt.stopPropagation();
                evt.preventDefault();
                setSubmenuAnchorElm(evt.currentTarget);
                return;
            }

            if (!isLatestVersion) {
                evt.stopPropagation();
                evt.preventDefault();
                await installAction();
            }
        },
        [installAction, subMenu, active, isLatestVersion]
    );

    const onSecondaryClick = useCallback(
        async (evt: React.MouseEvent<any>) => {
            if (!active) {
                return;
            }

            if (props.type === 'chip') {
                evt.stopPropagation();
                evt.preventDefault();
                setSubmenuAnchorElm(evt.currentTarget);
                return;
            }
        },
        [installAction, subMenu, active]
    );

    const subMenuElement =
        !isDisabled && subMenu.length > 0 ? (
            <Menu
                anchorEl={submenuAnchorElm}
                anchorOrigin={{
                    horizontal: props.type === 'button' ? 'left' : 'right',
                    vertical: props.type === 'button' ? 'bottom' : 'top',
                }}
                open={submenuOpen}
                sx={{
                    p: 0,
                    left: props.type === 'button' ? 0 : -16,
                    top: props.type === 'button' ? 0 : -16,
                    '.MuiButtonBase-root': {
                        fontSize: '12px',
                    },
                }}
                MenuListProps={{
                    dense: true,
                }}
                onClose={closeSubmenu}
            >
                {subMenu.map((item, ix) => (
                    <MenuItem
                        key={`sub-menu-item-${ix}`}
                        onClick={async (evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            closeSubmenu(evt);
                            await item.onClick();
                        }}
                        data-kap-id={`asset-submenu-${item.label}`}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </MenuItem>
                ))}
            </Menu>
        ) : null;

    if (props.type === 'icon') {
        return (
            <>
                <Box
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '68px',
                        height: '68px',
                    }}
                >
                    <Tooltip title={longText}>
                        <span>
                            <Fab
                                color={'primary'}
                                onClick={onPrimaryClick}
                                size={'small'}
                                disabled={isDisabled}
                                data-kap-id={`asset-actionbutton-${shortText}`}
                            >
                                {icon}
                            </Fab>
                        </span>
                    </Tooltip>
                    {isProcessing && (
                        <CircularProgress
                            size={48}
                            color={'primary'}
                            sx={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                marginTop: '-4px',
                                marginLeft: '-4px',
                            }}
                        />
                    )}
                </Box>
                {subMenuElement}
            </>
        );
    }

    if (props.type === 'chip') {
        return (
            <>
                <Tooltip title={longText}>
                    <Box
                        data-kap-id={`asset-box-${shortText}`}
                        onClick={onPrimaryClick}
                        sx={{
                            display: 'inline-flex',
                            borderRadius: '36px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxSizing: 'border-box',
                            paddingLeft: active ? '6px' : '4px',
                            paddingRight: active ? '2px' : '4px',
                            textAlign: 'center',
                            fontSize: active ? '12px' : '10px',
                            gap: '0px',
                            bgcolor: chipBgColor,
                            color: chipFgColor,
                            fontWeight: 500,
                            lineHeight: '30px',
                            cursor: active ? 'pointer' : 'default',
                            span: {
                                display: 'block',
                            },
                            '.label': {
                                mr: '2px',
                                ml: 1,
                            },
                            '& > .MuiSvgIcon-root': {
                                display: 'inline-block',
                                fontSize: active ? '24px' : '20px',
                                mr: 1,
                            },
                            '&:hover': {
                                opacity: active ? 0.8 : 1,
                            },
                            'a,span': {
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                color: 'inherit',
                                lineHeight: 'inherit',
                            },
                            a: {
                                height: 24,
                            },
                        }}
                    >
                        {shortText && <span className={'label'}>{shortText}</span>}
                        {isProcessing ? (
                            <CircularProgress size={18} />
                        ) : subMenu.length > 0 ? (
                            <a onClick={onSecondaryClick} data-kap-id={`asset-box-icon-${shortText}`}>
                                {icon}
                            </a>
                        ) : (
                            icon
                        )}
                    </Box>
                </Tooltip>
                {subMenuElement}
            </>
        );
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={onPrimaryClick}
                endIcon={icon}
                disabled={isDisabled}
                data-kap-id={`asset-button-${shortText}`}
            >
                {longText}
                {isProcessing && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Button>
            {subMenuElement}
        </>
    );
};
