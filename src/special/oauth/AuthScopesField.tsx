import { AuthScopesList } from './AuthScopesList';

import React from 'react';

import { FormFieldHandler } from '../../form/inputs/FormFieldHandler';
import { AuthScope } from './scopes';
import { Box, Divider, Typography } from '@mui/material';

type AuthScopesFieldProps = {
    name: string;
    scopes: AuthScope[];
};

export const AuthScopesField = (props: AuthScopesFieldProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', py: 1, px: 3 }}>
            <Box sx={{ pr: 6 }}>
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
                            />
                        );
                    }}
                />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, pt: 3 }}>
                    Permissions
                </Typography>
                <Typography variant="body2">
                    A members access is controlled by permissions. A permission is the ability to perform a specific
                    action. For example, the ability to delete an issue is a permission. With Full access the invited
                    member will be able to perform all actions.
                </Typography>
            </Box>
        </Box>
    );
};
