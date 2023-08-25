import { Box, Button, CircularProgress, Fab, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { showToasty, ToastType } from '../toast/ToastComponent';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDesktop, useDesktopTask } from '../utils/desktop';
import { AssetService, TaskStatus } from '@kapeta/ui-web-context';
import { coreNames } from './BlockhubTile';
import DownloadingIcon from '@mui/icons-material/Downloading';

import { AssetDisplay } from './types';
import { Asset } from '@kapeta/ui-web-types';
import useSWR from 'swr';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Delete from '@mui/icons-material/Delete';
import DownloadDone from '@mui/icons-material/DownloadDone';
import InstallDesktop from '@mui/icons-material/InstallDesktop';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';

import { grey } from '@mui/material/colors';
import { useConfirm } from '../confirm';

export interface InstallerService {
    install(assetRef: string): Promise<void>;

    get(assetRef: string): Promise<Asset>;

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
}

export const AssetInstallButton = (props: Props) => {
    const desktop = useDesktop();
    const confirm = useConfirm();
    const [submenuAnchorElm, setSubmenuAnchorElm] = useState<null | HTMLElement>(null);
    const submenuOpen = Boolean(submenuAnchorElm);
    const closeSubmenu = () => {
        setSubmenuAnchorElm(null);
    };

    const assetService: InstallerService = props.service || {
        install: async (assetRef: string): Promise<void> => {
            await AssetService.install(assetRef);
        },
        get: async (assetRef: string) => {
            return AssetService.get(assetRef, false);
        },
    };

    const assetRef = `kapeta://${props.asset.content.metadata.name}:${props.asset.version}`;
    const installedAsset = useSWR(assetRef, async (ref) => {
        if (!desktop) {
            return undefined;
        }
        return assetService.get(ref);
    });

    useEffect(() => {
        if (!assetService.onChange) {
            return () => {};
        }

        return assetService.onChange(assetRef, async () => {
            await installedAsset.mutate();
        });
    }, [assetService.onChange, installedAsset]);

    const installTask = useDesktopTask(`asset:install:${assetRef}`, async (task) => {
        if (task.status === TaskStatus.FAILED) {
            showToasty({
                type: ToastType.ALERT,
                title: 'Failed to install asset',
                message: task.errorMessage,
            });
        }

        if (task.status === TaskStatus.COMPLETED) {
            await installedAsset.mutate();
            showToasty({
                type: ToastType.SUCCESS,
                title: 'Asset installed',
                message: 'The asset has been installed successfully.',
            });
        }
    });

    const isDisabled = !installTask.ready || !desktop || installTask.active || installedAsset.isLoading;

    const isProcessing = !installTask.ready || installTask.active || installedAsset.isLoading;

    let icon = desktop ? installedAsset.data ? <DownloadDone /> : <ArrowDownward /> : <InstallDesktop />;

    let longText = desktop
        ? installedAsset.data
            ? 'Installed'
            : `Install ${coreNames[props.asset.content.kind] || 'asset'}`
        : 'Open desktop app to install';

    let shortText: string | React.ReactNode | null = desktop ? (installedAsset.data ? 'Open' : `Get`) : '';

    let chipBgColor = desktop ? (installedAsset.data ? 'primary.main' : `tertiary.main`) : grey[500];

    let chipFgColor = desktop ? (installedAsset.data ? grey[100] : grey[100]) : grey[100];

    if (installedAsset.isLoading) {
        longText = 'Checking...';
        icon = <DownloadingIcon />;
        shortText = '...';
    }

    if (isProcessing && props.type === 'chip') {
        chipBgColor = 'transparent';
        shortText = '';
    }

    const subMenu: SubMenuItem[] = useMemo(() => {
        const canRemove = !!(props.service?.uninstall && desktop && installedAsset.data);
        if (canRemove) {
            return [
                {
                    label: 'Remove',
                    icon: <Delete />,
                    onClick: async () => {
                        try {
                            await confirm({
                                title: 'Uninstall asset',
                                content: `
                            Are you sure you want to remove ${props.asset.content.metadata.name}? 
                            This will not delete anything from your disk.
                            `,
                                confirmationText: 'Uninstall',
                            });

                            await props.service?.uninstall(assetRef);
                            await installedAsset.mutate();
                        } catch (e: any) {
                            // User cancelled
                        }
                    },
                },
            ];
        }
        return [];
    }, [props.service?.uninstall, desktop, installedAsset, installedAsset.data]);

    if (subMenu.length > 0) {
        icon = <MoreVertRounded />;
    }

    const installAction = useCallback(async () => {
        try {
            await assetService.install(assetRef);
        } catch (e) {
            showToasty({
                type: ToastType.ALERT,
                title: 'Failed to install asset',
                message: e.message,
            });
        }
    }, [assetRef, assetService]);

    const onPrimaryClick = useCallback(
        async (evt: React.MouseEvent<any>) => {
            if (!desktop) {
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
        [installAction, subMenu]
    );

    const onSecondaryClick = useCallback(
        async (evt: React.MouseEvent<any>) => {
            if (!desktop) {
                return;
            }

            if (props.type === 'chip') {
                evt.stopPropagation();
                evt.preventDefault();
                setSubmenuAnchorElm(evt.currentTarget);
                return;
            }
        },
        [installAction, subMenu]
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
                            paddingLeft: desktop ? '6px' : '4px',
                            paddingRight: desktop ? '2px' : '4px',
                            textAlign: 'center',
                            fontSize: desktop ? '12px' : '10px',
                            gap: '0px',
                            bgcolor: chipBgColor,
                            color: chipFgColor,
                            fontWeight: 500,
                            lineHeight: '30px',
                            cursor: desktop ? 'pointer' : 'default',
                            span: {
                                display: 'block',
                            },
                            '.label': {
                                marginRight: '2px',
                            },
                            '.MuiSvgIcon-root': {
                                display: 'inline-block',
                                fontSize: desktop ? '24px' : '20px',
                            },
                            '&:hover': {
                                opacity: desktop ? 0.8 : 1,
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
