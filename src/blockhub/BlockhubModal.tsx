/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { Plan } from '@kapeta/schemas';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';

import { AsyncState } from 'react-use/lib/useAsync';
import { AssetDisplay, AssetFetcher } from './types';
import { Blockhub, BlockhubCategory, BlockhubMode } from './Blockhub';
import { InstallerService } from './AssetInstallButton';
import { BlockhubDetails, BlockHubDetailsPreviewer } from './BlockhubDetails';
import Close from '@mui/icons-material/Close';
import { Asset } from '@kapeta/ui-web-types';
import { AssetType } from './AssetTypeFilter';

interface Props {
    open: boolean;
    plan?: Asset<Plan>;
    installerService: InstallerService;
    fetcher: AssetFetcher;
    assets: AsyncState<AssetDisplay[]>;
    previewRenderer?: BlockHubDetailsPreviewer;
    category?: BlockhubCategory;
    onCategoryChange?: (category: BlockhubCategory) => void;
    onSelect?: (selection: AssetDisplay[]) => void;
    onClose: () => void;
    filter?: AssetType;
    onFilterChange: (filter: AssetType) => void;
}

export const BlockhubModal = (props: Props) => {
    const [selection, setSelection] = useState<AssetDisplay[]>([]);
    const [currentAsset, setCurrentAsset] = useState<AssetDisplay | null>(null);
    const [currentAssetTab, setCurrentAssetTab] = useState<string>('general');

    const resetState = () => {
        setCurrentAsset(null);
        setCurrentAssetTab('general');
    };

    useEffect(() => {
        if (props.open) {
            resetState();
        }
    }, [props.open]);

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            className="blockhub-dialog"
            sx={{
                '*': {
                    boxSizing: 'border-box',
                },
                '& > .MuiDialog-container > .MuiPaper-root': {
                    maxWidth: 'none',
                },
            }}
        >
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    zIndex: 2,
                }}
                onClick={props.onClose}
            >
                <Close />
            </IconButton>

            <DialogContent
                sx={{
                    height: 'calc(100vh - 64px)',
                    padding: 0,
                }}
            >
                {currentAsset ? (
                    <BlockhubDetails
                        asset={currentAsset}
                        disableNavigation={true}
                        onAssetClick={setCurrentAsset}
                        fetcher={props.fetcher}
                        service={props.installerService}
                        onBackAction={resetState}
                        tabId={currentAssetTab}
                        onTabChange={setCurrentAssetTab}
                        previewRenderer={props.previewRenderer}
                    />
                ) : (
                    <Blockhub
                        {...props}
                        disableNavigation={true}
                        selection={selection}
                        onAssetClick={setCurrentAsset}
                        onSelectionChange={setSelection}
                        mode={props.plan ? BlockhubMode.MODAL_SELECTION : BlockhubMode.MODAL_STANDALONE}
                    />
                )}
            </DialogContent>
            {props.plan && (
                <DialogActions
                    sx={{
                        padding: '23px 45px',
                        boxShadow: '0px 0px 20px 0px rgba(5, 9, 13, 0.16)',
                        zIndex: 1,
                        position: 'relative',
                    }}
                >
                    <Stack gap={5} direction={'row'}>
                        <Typography lineHeight={'36px'} color={selection.length === 0 ? 'text.disabled' : 'inherit'}>
                            {selection.length > 0
                                ? selection.length === 1
                                    ? `Selected ${selection.length} asset`
                                    : `Selected ${selection.length} assets`
                                : 'No assets selected'}
                        </Typography>
                        <Button
                            variant={'contained'}
                            disabled={selection.length === 0}
                            onClick={() => {
                                props.onSelect?.(selection);
                                props.onClose();
                                setSelection([]);
                            }}
                        >
                            Add to plan
                        </Button>
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    );
};
