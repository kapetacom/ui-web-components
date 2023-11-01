/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Drawer } from '@mui/material';

export function BlockhubSidebar(props: React.PropsWithChildren) {
    const drawerWidth = '256px';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="permanent"
            anchor="left"
        >
            {props.children}
        </Drawer>
    );
}
