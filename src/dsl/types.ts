/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */
import { DSLResult } from '@kapeta/kaplang-core';
export const DSL_LANGUAGE_ID = 'kapeta-dsl';
export type DSLFormEditorProps<T> = Omit<T, 'value' | 'onChange'> & { name: string; defaultValue?: DSLResult };
