/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContextField } from '../FormContext';
import { FormFieldControllerProps, useFormFieldController } from '../formFieldController';
import {
    Box,
    Chip,
    FormControl,
    FormGroup,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Zoom,
} from '@mui/material';
import useId from '@mui/material/utils/useId';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import semverGt from 'semver/functions/gt';
import { KindIcon } from '../../icons/AssetIcon';
import { IconValue } from '@kapeta/schemas';
import { ArrowCircleUp, CheckCircle } from '@mui/icons-material';
import { Tooltip } from '../../tooltip/Tooltip';
import { Asset } from '@kapeta/ui-web-types';

const semverGtWithLocal = (a: string, b: string) => {
    if (a === b) {
        return false;
    }

    if (a === 'local') {
        return false;
    }

    if (b === 'local') {
        return true;
    }

    try {
        return semverGt(a, b);
    } catch (e) {
        return false;
    }
};

const versionSorter = (a: string, b: string) => {
    if (a === b) {
        return 0;
    }
    return semverGtWithLocal(a, b) ? -1 : 1;
};

export interface AssetVersionSelectorEntry {
    ref: string;
    kind: string;
    title?: string;
    icon?: IconValue;
}

export function fromAssetsToAssetVersionSelectorEntries(assets: Asset[]): AssetVersionSelectorEntry[] {
    return assets.map(fromAssetToAssetVersionSelectorEntry);
}

export function fromAssetToAssetVersionSelectorEntry(asset: Asset): AssetVersionSelectorEntry {
    return {
        ref: asset.ref,
        kind: asset.kind,
        title: asset.data.metadata.title,
        icon: asset.data.spec.icon,
    };
}

type UriType = {
    kind: string;
    title: string;
    handle: string;
    name: string;
    key: string;
    ref: string;
    icon?: IconValue;
};

interface Props extends FormFieldControllerProps<string> {
    assetTypes: AssetVersionSelectorEntry[];
}

export const AssetVersionSelector = (props: Props) => {
    const id = useId();
    const formField = useFormContextField<string>(props.name);
    const rawValue = formField.get('');
    const value = rawValue ? parseKapetaUri(rawValue) : null;
    const [assetName, setAssetName] = useState(value?.fullName || '');
    useEffect(() => {
        if (value?.fullName && assetName !== value.fullName) {
            setAssetName(value.fullName);
        }
    }, [value?.id]);

    const controller = useFormFieldController({
        value: value ? value.id : null,
        ...props,
    });

    const onChange = useCallback(
        (fullName: string, version?: string) => {
            if (!fullName || !version) {
                formField.set('');
                return;
            }

            formField.set(parseKapetaUri(`${fullName}:${version}`).id);
        },
        [formField]
    );

    const assetUriTypes = useMemo(() => {
        return props.assetTypes.map((type) => {
            const uri = parseKapetaUri(type.ref);
            return {
                title: type.title || uri.name,
                uri: uri,
                kind: type.kind,
                icon: type.icon,
            };
        });
    }, [props.assetTypes]);

    const assetNames = useMemo(() => {
        const mappedValues: { [p: string]: UriType } = {};
        assetUriTypes.forEach((uriType) => {
            mappedValues[uriType.uri.fullName] = {
                title: uriType.title ?? uriType.uri.name,
                handle: uriType.uri.handle,
                name: uriType.uri.name,
                ref: uriType.uri.id,
                key: uriType.uri.fullName,
                kind: uriType.kind,
                icon: uriType.icon,
            };
        });

        const out = Object.values(mappedValues);
        out.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
        return out;
    }, [assetUriTypes]);

    const getVersionsForName = useCallback(
        (assetName?: string) => {
            if (!assetName) {
                return [];
            }

            const out = assetUriTypes
                .filter((assetUriType) => assetUriType.uri.fullName === assetName)
                .map((assetUriType) => assetUriType.uri.version)
                .filter((version) => !!version);

            out.sort(versionSorter);
            return out;
        },
        [assetUriTypes]
    );

    const initialVersion = useMemo(() => {
        return value?.version;
    }, [value?.fullName]);

    const versions = useMemo(() => {
        const allVersions = getVersionsForName(assetName);
        if (initialVersion && !allVersions.includes(initialVersion)) {
            allVersions.push(initialVersion);
        }
        const out = Array.from(new Set(allVersions));
        out.sort(versionSorter);
        return out;
    }, [assetName, getVersionsForName, initialVersion]);

    const inputLabelId = `${id}-label`;
    const versionId = `${id}-namespace`;
    const nameId = `${id}-name`;

    const defaultVersion = versions.length > 0 ? versions[0] : undefined;

    const hasNewerVersion = useMemo(() => {
        if (!value?.version) {
            return false;
        }
        if (versions.length < 2) {
            return false;
        }
        return semverGtWithLocal(versions[0], value.version);
    }, [value?.version, versions]);

    const sxMain = {
        mb: 2,
        mt: 2,
        display: 'block',
        '.MuiFormHelperText-root': {
            ml: 0,
        },
    };

    if (assetNames.length === 0) {
        return (
            <TextField
                required={controller.required}
                sx={{
                    ...sxMain,

                    '.MuiInput-root': {
                        pt: 2,
                        height: '60px',
                        display: 'flex',
                    },
                }}
                variant={'standard'}
                label={props.label}
                value={value ? value.id : 'No types available'}
                disabled={true}
                helperText={controller.help}
            />
        );
    }

    return (
        <FormControl
            disabled={props.disabled}
            required={controller.required}
            error={controller.showError}
            autoFocus={controller.autoFocus}
            variant={'standard'}
            sx={sxMain}
        >
            <FormGroup>
                <InputLabel htmlFor={versionId} shrink={true} id={inputLabelId} required={controller.required}>
                    {props.label}
                </InputLabel>
                <Stack
                    direction={'row'}
                    sx={{
                        pt: 2,
                        height: '60px',
                    }}
                    gap={1}
                    justifyContent={'stretch'}
                    alignItems={'stretch'}
                >
                    <Select
                        sx={{
                            flex: 1,
                        }}
                        variant={'standard'}
                        autoWidth={true}
                        id={nameId}
                        value={assetName ?? ''}
                        labelId={inputLabelId}
                        disabled={controller.disabled}
                        readOnly={controller.readOnly || !!(assetName && assetNames.length === 1)}
                        onChange={(evt) => {
                            setAssetName(evt.target.value);
                            const versions = getVersionsForName(evt.target.value);
                            if (versions.length > 0) {
                                onChange(evt.target.value, versions[0]);
                            } else {
                                onChange(evt.target.value);
                            }
                        }}
                    >
                        {assetNames.map((uriType) => (
                            <MenuItem
                                key={uriType.key}
                                value={uriType.key}
                                sx={{
                                    '& > .MuiStack-root': {
                                        pl: 0, // Remove padding from Stack when shown as a menu item
                                    },
                                }}
                            >
                                <Stack direction={'row'} gap={1} alignItems={'center'} pl={1}>
                                    <KindIcon kind={uriType.kind} icon={uriType.icon} size={24} title={uriType.title} />
                                    <Stack direction={'column'}>
                                        <Typography
                                            component={'p'}
                                            fontSize={'12px'}
                                            fontWeight={500}
                                            variant={'body2'}
                                        >
                                            {uriType.title}
                                        </Typography>
                                        <Typography component={'p'} fontSize={'10px'} variant={'caption'}>
                                            {uriType.key}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        variant={'standard'}
                        autoWidth={true}
                        defaultValue={defaultVersion}
                        id={versionId}
                        value={value?.version ?? ''}
                        labelId={inputLabelId}
                        disabled={controller.disabled || !assetName}
                        readOnly={controller.readOnly || versions.length < 2}
                        autoFocus={controller.autoFocus}
                        className={controller.className}
                        onBlur={controller.onBlur}
                        onFocus={controller.onFocus}
                        onChange={(evt) => onChange(assetName, evt.target.value)}
                        startAdornment={
                            controller.disabled || controller.readOnly || !value?.version ? null : hasNewerVersion ? (
                                <Tooltip title={'Upgrade to latest'}>
                                    <Zoom in={true}>
                                        <IconButton
                                            color={'primary'}
                                            size={'small'}
                                            sx={{
                                                mt: '6px',
                                            }}
                                            onClick={() => {
                                                onChange(assetName, versions[0]);
                                            }}
                                        >
                                            <ArrowCircleUp
                                                sx={{
                                                    fontSize: '14px',
                                                }}
                                            />
                                        </IconButton>
                                    </Zoom>
                                </Tooltip>
                            ) : (
                                <Tooltip title={'Latest version'}>
                                    <Typography
                                        p={'5px'}
                                        mt={'6px'}
                                        display={'inline-block'}
                                        color={'success.light'}
                                        textAlign={'center'}
                                        lineHeight={'14px'}
                                    >
                                        <CheckCircle
                                            sx={{
                                                fontSize: '14px',
                                            }}
                                        />
                                    </Typography>
                                </Tooltip>
                            )
                        }
                        sx={{
                            maxWidth: '120px',
                            minWidth: '80px',
                        }}
                    >
                        {versions.map((version, ix) => (
                            <MenuItem
                                key={version}
                                value={version}
                                sx={{
                                    '& > .MuiStack-root > .version-text': {
                                        fontSize: '16px',
                                    },
                                    '& > .MuiStack-root > .version-chip': {
                                        display: 'block',
                                    },
                                }}
                            >
                                <Stack direction={'row'} gap={1}>
                                    <Typography
                                        className={'version-text'}
                                        fontSize={version === 'local' ? '14px' : '20px'}
                                        pt={1}
                                        lineHeight={'20px'}
                                    >
                                        {version === 'local' ? 'Local Disk' : version}
                                    </Typography>
                                    {ix === 0 && version !== 'local' && (
                                        <Box className={'version-chip'} sx={{ display: 'none', pt: '4px' }}>
                                            <Chip
                                                variant={'outlined'}
                                                size={'small'}
                                                sx={{
                                                    '.MuiChip-label': {
                                                        fontSize: '12px',
                                                    },
                                                }}
                                                label={'Latest'}
                                            />
                                        </Box>
                                    )}
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
                {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
            </FormGroup>
        </FormControl>
    );
};
