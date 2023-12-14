/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Table, TableCell, TableHead, TableRow } from '@mui/material';
import { KapEmoji, KapEmojiName } from '../../src/emojis/KapEmoji';
import { WaveEmoji } from '../../src/emojis/WaveEmoji';
import { EmojiSize } from '../../src/emojis/EmojiWrapper';
import { Tooltip } from '../../src';

export default {
    title: 'Emojis',
};

export const All = () => (
    <>
        {(Object.keys(KapEmoji) as KapEmojiName[]).map((emojiName) => (
            <Tooltip title={emojiName} placement="bottom">
                {React.createElement(KapEmoji[emojiName], { size: 100 })}
            </Tooltip>
        ))}
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
