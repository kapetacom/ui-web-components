/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { Fragment } from 'react';

import { AuthScope } from './scopes';
import { Checkbox, Divider, FormControlLabel, List, ListItem } from '@mui/material';

/**
 * Determines if a scope is enabled due to a wildcard scope.
 *
 * Examples:
 * - `'*'` enables all scopes.
 * - `'identity:*'` enables all identity scopes.
 * - `'identity:read'` enables only the 'identity:read' scope.
 *
 * @param {string} scope The scope to check.
 * @returns {boolean} Whether the scope is enabled
 */
function isScopeEnabledDueToWildcard(scope: AuthScope, scopes: AuthScope[]): boolean {
    // Ignore the '*' scope itself, as it is not enabled due to a wildcard.
    if (scope.id === '*') {
        return false;
    }

    // If the '*' scope is enabled, all scopes are enabled.
    if (scopes.some((s) => s.id === '*')) {
        return true;
    }

    // Check if any of the scopes ends with '*' and if so, whether the scope starts with the same prefix.
    return scopes.some((s) => {
        if (s.id.endsWith('*')) {
            const prefix = s.id.slice(0, -1); // Remove the '*' at the end.
            return s.id.startsWith(prefix);
        }
        return false;
    });
}

type AuthScopesListProps = {
    scopes: AuthScope[];
    editable?: boolean;
    onChange?: (scopes: AuthScope[]) => void;
    onHoverScope?: (scope: AuthScope) => void;
};

export const AuthScopesList = ({ scopes, editable, onChange, onHoverScope }: AuthScopesListProps) => {
    const enabledScopes = scopes.filter((s) => s.enabled);
    const theAllScopeIsEnabled = enabledScopes.some((s) => s.id === '*');

    return (
        <List disablePadding sx={{ display: 'inline-block' }}>
            {scopes.map((scope, ix) => {
                const isEnabled = scope.enabled || isScopeEnabledDueToWildcard(scope, enabledScopes);
                const isAllScope = scope.id === '*';
                const enabledBecauseAllScopeIsEnabled = theAllScopeIsEnabled && !isAllScope;

                return (
                    <Fragment key={`scope_${ix}`}>
                        <ListItem
                            disablePadding
                            onMouseEnter={() => onHoverScope(scope)}
                            onMouseLeave={() => onHoverScope(null)}
                            sx={{
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'primary.states.hover',
                                },
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={({ target: { checked } }) => {
                                            if (!onChange) {
                                                return;
                                            }
                                            onChange([
                                                ...scopes.filter((s) => s.id !== scope.id),
                                                { ...scope, enabled: checked },
                                            ]);
                                        }}
                                        sx={{
                                            ml: 1,
                                            '&:hover': {
                                                bgcolor: 'transparent',
                                            },
                                        }}
                                    />
                                }
                                checked={isEnabled}
                                label={scope.name}
                                disabled={!editable || enabledBecauseAllScopeIsEnabled}
                            />
                        </ListItem>
                        {isAllScope && <Divider sx={{ my: 1.5, mr: 2 }} />}
                    </Fragment>
                );
            })}
        </List>
    );
};
