/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ThumbsUpEmoji } from './ThumbsUpEmoji';
import { WaveEmoji } from './WaveEmoji';

export const KapEmoji = {
    ThumbsUp: ThumbsUpEmoji,
    Wave: WaveEmoji,
};

export type KapEmojiName = keyof typeof KapEmoji;
