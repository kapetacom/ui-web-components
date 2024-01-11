/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */
import { DSLResult } from '@kapeta/kaplang-core';

export type DSLFormEditorProps<T> = Omit<T, 'value' | 'onChange'> & { name: string; defaultValue?: DSLResult };
