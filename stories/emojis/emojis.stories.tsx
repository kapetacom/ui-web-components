/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Box, Paper, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { KapEmoji, KapEmojiName } from '../../src/emojis/KapEmoji';
import { WaveEmoji } from '../../src/emojis/WaveEmoji';
import { EmojiSize } from '../../src/emojis/EmojiWrapper';
import { Tooltip } from '../../src';

export default {
    title: 'KapEmojis',
};

export const All = () => (
    <>
        <Typography variant="h3">All KapEmojis</Typography>
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 132px)',
                gap: 2,
                pt: 4,
            }}
        >
            {(Object.keys(KapEmoji) as KapEmojiName[]).map((emojiName) => (
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={1}>
                    <Tooltip title={emojiName} placement="top">
                        {React.createElement(KapEmoji[emojiName], { size: 100 })}
                    </Tooltip>

                    <Box component="pre" sx={{ m: 0, fontWeight: 'bold' }}>
                        {emojiName}
                    </Box>
                </Paper>
            ))}
        </Box>
    </>
);

export const Sizes = () => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Size</TableCell>
                <TableCell>Emoji</TableCell>
            </TableRow>
        </TableHead>
        {(['small', 'medium', 'large', 50, 100] satisfies EmojiSize[]).map((size, idx) => (
            <TableRow key={idx}>
                <TableCell
                    sx={{
                        minWidth: 'fit-content',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    {size}
                </TableCell>
                <TableCell sx={{ width: '100%' }}>
                    <WaveEmoji size={size} />
                </TableCell>
            </TableRow>
        ))}
    </Table>
);
