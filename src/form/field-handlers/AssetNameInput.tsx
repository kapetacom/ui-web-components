import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Type } from '../inputs/FormInput';
import { useFormContextField } from '../FormContext';
import { normaliseValidators, ValidatorListUnresolved } from '../../validation/Validators';
import { FormFieldControllerProps, useFormFieldController } from '../formFieldController';
import {
    FormControl,
    FormGroup,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import useId from '@mui/material/utils/useId';

interface Props extends FormFieldControllerProps<string> {
    namespaces: string[];
}

export const AssetNameInput = (props: Props) => {
    const id = useId();
    const formField = useFormContextField<string>(props.name);
    const value = formField.get('/');

    // Add a fake option for unknown namespaces (e.g. loading an asset that you can no longer access)
    const validateNamespace = useCallback(
        (name, value) => {
            const [namespace] = value.split('/');
            if (!(props.namespaces || []).includes(namespace)) {
                throw 'Namespace not available';
            }
        },
        [props.namespaces]
    );

    const validators = useMemo(() => {
        const validators = normaliseValidators(props.validation);
        validators.push(validateNamespace);
        return validators;
    }, [props.validation, validateNamespace]);

    const controller = useFormFieldController({
        name: props.name,
        value: value,
        help: props.help,
        validation: validators,
        label: props.label,
        readOnly: props.readOnly,
        disabled: props.disabled,
        defaultValue: props.defaultValue,
        autoFocus: props.autoFocus,
    });

    const [namespace, assetName] = useMemo(() => {
        let [newNamespace, newAssetName] = value.split('/') || [];
        if (!newNamespace) {
            newNamespace = props.namespaces.length > 0 ? props.namespaces[0] : '';
        }
        return [newNamespace, newAssetName];
    }, [value, props.namespaces]);

    const namespaces = useMemo(() => {
        const out = [...(props.namespaces || [])];
        if (!out.includes(namespace)) {
            out.push(namespace);
        }
        return out;
    }, [props.namespaces, namespace]);

    // Report back to the form context for validation
    useEffect(() => {
        const ready = !!(namespace && assetName);
        if (ready) {
            formField.valid();
        } else {
            formField.invalid();
        }
    }, [controller.name, namespace, assetName]);

    const onChange = useCallback(
        (namespace: string, assetName: string) => {
            const value =
                namespace || assetName
                    ? [
                          namespace?.toLowerCase(),
                          assetName
                              ?.toLowerCase()
                              .replace(/[^a-z0-9_-]/g, '-')
                              .replace(/-{2,}/g, '-')
                              .replace(/_{2,}/g, '_')
                              .replace(/[_-]{2,}/g, '-')
                              .replace(/^[^a-z]+/, ''),
                      ].join('/')
                    : '';

            formField.set(
                // Ensure value is empty if neither part is filled out
                value
            );
        },
        [controller.name, formField]
    );

    const inputLabelId = `${id}-label`;
    const namespaceId = `${id}-namespace`;
    const nameId = `${id}-name`;

    return (
        <FormControl
            disabled={props.disabled}
            required={controller.required}
            error={controller.showError}
            autoFocus={controller.autoFocus}
            variant={'standard'}
            sx={{
                display: 'block',
                mb: 2,
                mt: 2,
                '.MuiFormHelperText-root': {
                    ml: 0,
                },
            }}
        >
            <FormGroup>
                <InputLabel htmlFor={namespaceId} shrink={true} id={inputLabelId} required={controller.required}>
                    {props.label}
                </InputLabel>
                <Stack
                    direction={'row'}
                    sx={{
                        pt: 2,
                    }}
                    justifyContent={'stretch'}
                    alignItems={'stretch'}
                >
                    <Select
                        variant={'standard'}
                        autoWidth={true}
                        defaultValue={namespaces.length > 0 ? namespaces[0] : undefined}
                        id={namespaceId}
                        value={namespace}
                        labelId={inputLabelId}
                        disabled={controller.disabled}
                        readOnly={controller.readOnly}
                        onChange={(evt) => onChange(evt.target.value, assetName)}
                        sx={{
                            flex: 1,
                            maxWidth: '200px',
                            minWidth: '60px',
                            '.MuiSelect-select': {
                                pr: 1,
                            },
                        }}
                    >
                        {namespaces.map((namespace) => (
                            <MenuItem key={namespace} value={namespace}>
                                {namespace}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography lineHeight={'32px'} color={grey[400]} fontSize={'24px'} sx={{ mr: 1, ml: 1 }}>
                        /
                    </Typography>
                    <Input
                        sx={{
                            flex: 2,
                        }}
                        id={nameId}
                        type={Type.TEXT}
                        disabled={controller.disabled}
                        readOnly={controller.readOnly}
                        name={'asset-name'}
                        value={assetName}
                        onChange={(evt) => onChange(namespace, evt.target.value)}
                    />
                </Stack>
                {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
            </FormGroup>
        </FormControl>
    );
};
