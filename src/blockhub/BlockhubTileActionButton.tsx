/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { ReactElement, SyntheticEvent, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';
import { Box, Chip, CircularProgress, Menu, MenuItem } from '@mui/material';
import { showToasty, ToastType } from '../toast/ToastComponent';

export interface BlockhubTileActionButtonProps {
    label: string;
    onClick: (evt: SyntheticEvent) => void | Promise<void>;
    icon?: ReactElement;
    disabled?: boolean;
    menuItems?: {
        label: string;
        onClick: (evt: SyntheticEvent) => void;
    }[];
    color?: 'primary' | 'secondary' | 'default';
}

export function BlockhubTileActionButton(props: BlockhubTileActionButtonProps) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleClose = () => setAnchorEl(null);
    const openMenu = props.menuItems
        ? (e: SyntheticEvent) => props.menuItems && setAnchorEl(e.currentTarget)
        : undefined;

    const icon = props.menuItems ? props.icon || <MoreVert /> : undefined;

    const color = props.color || 'default';

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-block',
            }}
        >
            <Chip
                label={props.label}
                onClick={async (evt) => {
                    setProcessing(true);
                    try {
                        await props.onClick(evt);
                    } catch (e) {
                        showToasty({
                            type: ToastType.ALERT,
                            message: (e as Error).message,
                            title: 'Error',
                        });
                    } finally {
                        setProcessing(false);
                    }
                }}
                disabled={props.disabled ?? processing}
                color={color}
                onDelete={openMenu}
                deleteIcon={icon}
            />
            {processing && (
                <CircularProgress
                    size={20}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-10px',
                        marginLeft: '-10px',
                    }}
                />
            )}

            {props.menuItems ? (
                <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
                    {props.menuItems.map((item) => (
                        <MenuItem
                            onClick={(e) => {
                                item.onClick(e);
                                handleClose();
                            }}
                            key={item.label}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            ) : null}
        </Box>
    );
}
