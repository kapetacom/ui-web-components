/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, Fab, FormControl, FormHelperText, InputLabel, Zoom } from '@mui/material';
import { FormFieldControllerProps, useFormFieldController } from '../form/formFieldController';
import { IconType, IconValue } from '@kapeta/schemas';
import { ValidatorListUnresolved } from '../validation/Validators';
import { useFormContextField } from '../form/FormContext';
import { showToasty, ToastType } from '../toast/ToastComponent';

export enum AvatarResultType {
    RAW,
    DATA_URL,
}

interface Props {
    url: string;
    onSave: (file: AvatarFileInfo) => Promise<void> | void;
    fallbackIcon?: string;
    size?: number;
    resultType?: AvatarResultType;
    sync?: boolean;
    maxFileSize?: number;
    readOnly?: boolean;
    disabled?: boolean;
}

enum UploadStatus {
    IDLE,
    PREPARING,
    UPLOADING,
    DONE,
    ERROR,
}

async function readFile(file: File, type: AvatarResultType): Promise<AvatarFileInfo> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = type === AvatarResultType.DATA_URL ? (e.target.result as string) : URL.createObjectURL(file);
            const fileInfo: AvatarFileInfo = {
                name: file.name,
                size: file.size,
                mimeType: file.type,
                url,
                data: e.target.result,
            };
            resolve(fileInfo);
        };

        switch (type) {
            case AvatarResultType.DATA_URL:
                reader.readAsDataURL(file);
                break;
            case AvatarResultType.RAW:
                reader.readAsArrayBuffer(file);
                break;
        }
    });
}

export interface AvatarFileInfo {
    name: string;
    url: string;
    size: number;
    mimeType: string;
    data: string | ArrayBuffer;
}

export const AvatarEditor = (props: Props) => {
    const [state, setState] = useState<UploadStatus>(UploadStatus.IDLE);
    const [currentUrl, setCurrentUrl] = useState(props.url);
    const [filePickerKey, setFilePickerKey] = useState(1);
    const [selectedValue, setSelectedValue] = useState<AvatarFileInfo>();

    const inputRef = useRef<HTMLInputElement>();

    const size = props.size ?? 100;

    const idleAfterTimeout = () =>
        setTimeout(() => {
            setState(UploadStatus.IDLE);
        }, 1000);

    const onFileChange = useCallback(
        async (evt) => {
            if (props.disabled || props.readOnly) {
                return;
            }

            const files = evt.target.files;
            if (files && files.length > 0) {
                const file = files[0];
                setState(UploadStatus.PREPARING);

                const fileInfo = await readFile(file, props.resultType ?? AvatarResultType.RAW);
                if (props.maxFileSize > 0 && fileInfo.size > props.maxFileSize) {
                    setState(UploadStatus.ERROR);

                    showToasty({
                        type: ToastType.DANGER,
                        message: `File size is too big. Max size is ${props.maxFileSize} bytes.`,
                        title: 'File too big',
                    });

                    idleAfterTimeout();
                    return;
                }
                setSelectedValue(fileInfo);
                setFilePickerKey(filePickerKey + 1);
                setCurrentUrl(fileInfo.url);
                if (props.sync) {
                    try {
                        setState(UploadStatus.UPLOADING);
                        await props.onSave(fileInfo);
                        setState(UploadStatus.IDLE);
                    } catch (e) {
                        console.log('Fails here?', e);
                        setSelectedValue(undefined);
                        setCurrentUrl(props.url);
                        setState(UploadStatus.ERROR);
                        idleAfterTimeout();
                    }
                }
            } else {
                setCurrentUrl(props.url);
                setState(UploadStatus.IDLE);
            }
        },
        [inputRef.current]
    );

    const showButtons = state !== UploadStatus.IDLE && !props.sync;

    const buttonSx = {
        ...(state === UploadStatus.DONE && {
            bgcolor: 'success.light',
            '&:hover': {
                bgcolor: 'success.light',
            },
        }),
        ...(state === UploadStatus.ERROR && {
            bgcolor: 'error.light',
            '&:hover': {
                bgcolor: 'error.light',
            },
        }),
    };

    return (
        <Box
            sx={{
                width: size,
                height: size,
                position: 'relative',
                display: 'inline-block',
                input: {
                    opacity: 0,
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    position: 'absolute',
                    zIndex: 1,
                    top: 0,
                    left: 0,
                },
            }}
        >
            <input
                type={'file'}
                key={'file_' + filePickerKey}
                ref={inputRef}
                accept={'image/*'}
                readOnly={props.readOnly}
                disabled={props.disabled}
                onChange={onFileChange}
            />

            {props.sync && state === UploadStatus.UPLOADING && (
                <CircularProgress
                    size={50}
                    sx={{
                        position: 'absolute',
                        top: size / 2 - 25,
                        left: size / 2 - 25,
                        zIndex: 1,
                    }}
                />
            )}

            <Avatar
                variant="rounded"
                sx={{
                    width: size,
                    height: size,
                    fontSize: size / 2,
                    backgroundColor: currentUrl ? 'transparent' : 'text.secondary',
                    opacity: props.sync && state === UploadStatus.UPLOADING ? 0.3 : 1,
                }}
                src={currentUrl}
            >
                <i className={props.fallbackIcon ?? 'fa fa-image'} />
            </Avatar>
            {showButtons && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        position: 'absolute',
                        paddingTop: '5px',
                        top: size,
                        left: 0,
                        width: size,
                    }}
                >
                    <Zoom in={true}>
                        <Box sx={{ m: 0, position: 'relative' }}>
                            {state === UploadStatus.UPLOADING && (
                                <CircularProgress
                                    size={46}
                                    sx={{
                                        position: 'absolute',
                                        top: -3,
                                        left: -3,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                            <Fab
                                size="small"
                                color="primary"
                                sx={buttonSx}
                                disabled={state === UploadStatus.UPLOADING}
                                aria-label="save"
                                onClick={async () => {
                                    if (!selectedValue) {
                                        setState(UploadStatus.IDLE);
                                        return;
                                    }
                                    setState(UploadStatus.UPLOADING);
                                    try {
                                        await props.onSave(selectedValue);
                                        setState(UploadStatus.DONE);
                                    } catch (e) {
                                        setSelectedValue(undefined);
                                        setCurrentUrl(props.url);
                                        setState(UploadStatus.ERROR);
                                        showToasty({
                                            type: ToastType.DANGER,
                                            message: e.message,
                                            title: 'Failed to upload file',
                                        });
                                    } finally {
                                        idleAfterTimeout();
                                    }
                                }}
                            >
                                {state === UploadStatus.DONE && <i className={'fas fa-check'} />}
                                {state === UploadStatus.ERROR && <i className="fas fa-exclamation"></i>}
                                {state === UploadStatus.PREPARING && <i className="fa fa-save"></i>}
                                {state === UploadStatus.UPLOADING && <i className="fa fa-save"></i>}
                            </Fab>
                        </Box>
                    </Zoom>
                    <Zoom in={true}>
                        <Fab
                            size="small"
                            disabled={state !== UploadStatus.PREPARING}
                            color="warning"
                            aria-label="cancel"
                            onClick={() => {
                                setCurrentUrl(props.url);
                                setSelectedValue(undefined);
                                setState(UploadStatus.IDLE);
                            }}
                        >
                            <i className={'fa fa-times'} />
                        </Fab>
                    </Zoom>
                </Box>
            )}
        </Box>
    );
};

interface FormProps extends FormFieldControllerProps<IconValue> {
    fallbackIcon?: string;
    onChange?: (inputName: string, userInput: IconValue) => void | Promise<void>;
    maxFileSize?: number;
}

export const FormAvatarEditor = (props: FormProps) => {
    const controller = useFormFieldController<IconValue>({
        name: props.name,
        value: props.value,
        help: props.help,
        validation: props.validation,
        defaultValue: {
            type: IconType.Fontawesome5,
            value: props.fallbackIcon,
        },
        label: props.label,
        disabled: props.disabled,
        readOnly: props.disabled,
        autoFocus: props.autoFocus,
    });

    return (
        <FormControl
            disabled={controller.disabled}
            required={controller.required}
            error={controller.showError}
            autoFocus={controller.autoFocus}
            variant={'standard'}
            sx={{
                bgcolor: 'inherit',
                '& .type-avatar .input-container': {
                    padding: '10px',
                    width: '122px',
                },
            }}
        >
            <InputLabel shrink={true} disabled={controller.disabled} required={controller.required}>
                {controller.label ?? 'Icon'}
            </InputLabel>
            <AvatarEditor
                url={controller.value?.type === IconType.URL ? controller.value.value : ''}
                resultType={AvatarResultType.DATA_URL}
                size={100}
                sync={true}
                disabled={controller.disabled}
                readOnly={controller.readOnly}
                maxFileSize={props.maxFileSize}
                fallbackIcon={
                    controller.value?.type === IconType.Fontawesome5 ? controller.value.value : props.fallbackIcon
                }
                onSave={async (file) => {
                    await props.onChange?.(props.name, {
                        type: IconType.URL,
                        value: file.url,
                    });
                }}
            />
            {controller.help && <FormHelperText>{controller.help}</FormHelperText>}
        </FormControl>
    );
};

interface FieldProps {
    name: string;
    label: string;
    help?: string;
    fallbackIcon?: string;
    validation?: ValidatorListUnresolved;
    disabled?: boolean;
    maxFileSize?: number;
}

export const FormAvatarEditorField = (props: FieldProps) => {
    const field = useFormContextField(props.name);

    return (
        <FormAvatarEditor
            {...props}
            value={field.get()}
            onChange={(name, value) => {
                field.set(value);
            }}
        />
    );
};
