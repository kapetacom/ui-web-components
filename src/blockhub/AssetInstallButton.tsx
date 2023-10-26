import { Box, Button, CircularProgress, Fab, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Tooltip } from '../tooltip/Tooltip';
import { showToasty, ToastType } from '../toast/ToastComponent';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TaskState, useDesktop } from '../utils/desktop';
import { TaskStatus } from '@kapeta/ui-web-context';
import { getNameForKind } from './BlockhubTile';
import DownloadingIcon from '@mui/icons-material/Downloading';

import { AssetDisplay } from './types';
import useSWR from 'swr';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Delete from '@mui/icons-material/Delete';
import DownloadDone from '@mui/icons-material/DownloadDone';
import InstallDesktop from '@mui/icons-material/InstallDesktop';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';

import { grey } from '@mui/material/colors';
import { useConfirm } from '../confirm';
import { parseKapetaUri } from '@kapeta/nodejs-utils';

export interface InstallerService {
    install(assetRef: string): Promise<void>;

    get(assetRef: string): Promise<boolean>;

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
    const submenuOpen = Boolean(submenuAnchorElm);
    const assetRef = `kapeta://${props.asset.content.metadata.name}:${props.asset.version}`;
    const assetUri = parseKapetaUri(assetRef);
    const closeSubmenu = () => {
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
        if (!props.service?.onChange) {
            return () => {};
        }

        return props.service?.onChange(assetRef, async () => {
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
                    message: task.errorMessage,
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
        props.forceLoading === true || !installTask.ready || installTask.active || installedAsset.isLoading;

    let icon = active ? (
        installedAsset.data ? (
            <DownloadDone />
        ) : (
            <ArrowDownward />
        )
    ) : props.subscriptions ? (
        <DownloadDone />
    ) : (
        <InstallDesktop />
    );

    let longText = active
        ? installedAsset.data
            ? props.subscriptions
                ? 'Added'
                : 'Installed'
            : props.subscriptions
            ? `Add ${kindNameLC}`
            : `Install ${kindNameLC}`
        : props.subscriptions
        ? `You own this ${kindNameLC}`
        : 'Open desktop app to install';

    let shortText: string | React.ReactNode | null = active
        ? installedAsset.data
            ? 'Open'
            : props.subscriptions
            ? `Add`
            : `Get`
        : '';

    let chipBgColor = active ? (installedAsset.data ? 'primary.main' : `tertiary.main`) : grey[500];

    let chipFgColor: string = active ? (installedAsset.data ? grey[100] : grey[100]) : grey[100];

    if (installedAsset.isLoading) {
        longText = 'Checking...';
        icon = <DownloadingIcon />;
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
        const canRemove = !!(props.service?.uninstall && active && installedAsset.data);
        if (canRemove) {
            return [
                {
                    label: 'Remove',
                    icon: <Delete />,
                    onClick: async () => {
                        const ok = await confirm({
                            title: props.subscriptions ? `Remove ${kindNameLC}` : `Uninstall ${kindNameLC}`,
                            content: `
                        Are you sure you want to remove ${props.asset.content.metadata.name}? 
                        This will not delete anything from your disk.
                        `,
                            confirmationText: props.subscriptions ? 'Remove' : 'Uninstall',
                        });

                        if (!ok) {
                            return;
                        }

                        await props.service?.uninstall(assetRef);
                        await installedAsset.mutate();
                    },
                },
            ];
        }
        return [];
    }, [props.service?.uninstall, active, installedAsset, installedAsset.data]);

    if (subMenu.length > 0) {
        icon = <MoreVertRounded />;
    }

    const installAction = useCallback(async () => {
        try {
            await props.service?.install(assetRef);
            if (props.subscriptions) {
                await installedAsset.mutate();
            }
        } catch (e) {
            showToasty({
                type: ToastType.ALERT,
                title: props.subscriptions ? `Failed to add ${kindNameLC}` : `Failed to install ${kindNameLC}`,
                message: e.message,
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

            if (!installedAsset.data) {
                evt.stopPropagation();
                evt.preventDefault();
                await installAction();
            }
        },
        [installAction, subMenu, active, installedAsset.data]
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
                            closeSubmenu();
                            await item.onClick();
                        }}
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
                            <Fab color={'primary'} onClick={onPrimaryClick} size={'small'} disabled={isDisabled}>
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
                                marginRight: '2px',
                            },
                            '.MuiSvgIcon-root': {
                                display: 'inline-block',
                                fontSize: active ? '24px' : '20px',
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
                            <a onClick={onSecondaryClick}>{icon}</a>
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
            <Button variant="contained" onClick={onPrimaryClick} endIcon={icon} disabled={isDisabled}>
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
