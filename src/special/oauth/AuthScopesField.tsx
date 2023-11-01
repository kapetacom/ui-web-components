/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { AuthScopesList } from './AuthScopesList';

import React, { useState } from 'react';

import { FormFieldHandler } from '../../form/inputs/FormFieldHandler';
import { AuthScope } from './scopes';
import { Box, Divider, Typography } from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

type AuthScopesFieldProps = {
    name: string;
    scopes: AuthScope[];
};

type ScopeExplanation = {
    title: string;
    description: string;
};
function getScopeExplanation(scope: AuthScope | null): ScopeExplanation {
    if (scope === null) {
        return {
            title: 'What are permissions?',
            description:
                'A members access is controlled by permissions. A permission is the ability to perform a specific action. For example, the ability to delete an issue is a permission. With Full access the invited member will be able to perform all actions.',
        };
    }
    return {
        title: scope.name,
        description: scope.description || '',
    };
}

export const AuthScopesField = (props: AuthScopesFieldProps) => {
    const [hoveredScope, setHoveredScope] = useState<AuthScope | null>(null);
    const hoveredScopeExplanation = getScopeExplanation(hoveredScope);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box>
                <FormFieldHandler
                    name={props.name}
                    component={(fieldProps) => {
                        return (
                            <AuthScopesList
                                editable={true}
                                scopes={props.scopes.map((scope) => {
                                    return {
                                        enabled: fieldProps.value?.indexOf(scope.id) > -1,
                                        ...scope,
                                    };
                                })}
                                onChange={(scopes) => {
                                    fieldProps.onChange(
                                        fieldProps.name,
                                        scopes.filter((scope) => scope.enabled).map((scope) => scope.id)
                                    );
                                }}
                                onHoverScope={setHoveredScope}
                            />
                        );
                    }}
                />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        // Only show the icon when no scope is hovered
                        display: hoveredScope === null ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: 82,
                        height: 82,
                        borderRadius: '100%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        my: 1,
                    }}
                >
                    <BadgeOutlinedIcon fontSize="large" />
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                    {hoveredScopeExplanation.title}
                </Typography>
                <Typography variant="body2">{hoveredScopeExplanation.description}</Typography>
            </Box>
        </Box>
    );
};
