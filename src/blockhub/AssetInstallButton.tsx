import { Box, Button, CircularProgress, Fab, Tooltip } from '@mui/material';
import { showToasty, ToastType } from '../toast/ToastComponent';
import React from 'react';
import { useDesktop, useDesktopTask } from '../utils/desktop';
import { AssetService, TaskStatus } from '@kapeta/ui-web-context';
import { coreNames } from './BlockhubTile';
import DownloadingIcon from '@mui/icons-material/Downloading';

import { AssetDisplay } from './types';
import { Asset } from '@kapeta/ui-web-types';
import useSWR from 'swr';
import { ArrowDownward, DownloadDone, InstallDesktop } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

export interface InstallerService {
    install(assetRef: string): Promise<void>;
    get(assetRef: string): Promise<Asset>;
}

interface Props {
    asset: AssetDisplay;
    type: 'icon' | 'button' | 'chip';
    service?: InstallerService;
}

export const AssetInstallButton = (props: Props) => {
    const desktop = useDesktop();

    const assetService = props.service || {
        install: async (assetRef: string) => {
            return AssetService.install(assetRef);
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

    const isDisabled =
        !installTask.ready || !desktop || installTask.active || !!installedAsset.data || installedAsset.isLoading;

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

    const onClick = async (evt: React.MouseEvent<any>) => {
        if (desktop && installedAsset.data) {
            return;
        }

        console.log('Stopping propagation');
        evt.stopPropagation();
        evt.preventDefault();

        try {
            await assetService.install(assetRef);
        } catch (e) {
            showToasty({
                type: ToastType.ALERT,
                title: 'Failed to install asset',
                message: e.message,
            });
        }
    };

    if (props.type === 'icon') {
        return (
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
                        <Fab color={'primary'} onClick={onClick} size={'small'} disabled={isDisabled}>
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
        );
    }

    if (props.type === 'chip') {
        return (
            <Tooltip title={longText}>
                <Box
                    onClick={desktop ? onClick : null}
                    sx={{
                        display: 'inline-flex',
                        borderRadius: '16px',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        padding: desktop ? '0 12px' : '4px',
                        textAlign: 'center',
                        fontSize: desktop ? '12px' : '10px',
                        gap: '2px',
                        bgcolor: chipBgColor,
                        color: chipFgColor,
                        fontWeight: 500,
                        cursor: desktop ? 'pointer' : 'default',
                        span: {
                            display: 'block',
                        },
                        '.label': {
                            lineHeight: '26px',
                            marginRight: '2px',
                        },
                        '.MuiSvgIcon-root': {
                            display: 'inline-block',
                            fontSize: desktop ? '24px' : '20px',
                        },
                        '&:hover': {
                            opacity: desktop ? 0.8 : 1,
                        },
                    }}
                >
                    {shortText && <span className={'label'}>{shortText}</span>}
                    {isProcessing ? <CircularProgress size={18} /> : icon}
                </Box>
            </Tooltip>
        );
    }

    return (
        <Button variant="contained" disabled={isDisabled} onClick={onClick} endIcon={icon}>
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
    );
};
