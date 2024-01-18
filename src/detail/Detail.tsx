/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { Context, createContext, useContext, useState } from 'react';
import _ from 'lodash';
import './Detail.less';
import { toClass } from '@kapeta/ui-web-utils';
import { useValidation } from '../validation/Validators';
import { showToasty, ToastType } from '../toast/ToastComponent';
import { IconButton, Stack } from '@mui/material';
import { CloseRounded, DeleteRounded, Edit, Save } from '@mui/icons-material';
import { useConfirmDelete } from '../confirm/useConfirm';

interface DetailContextData {
    onValueChanged: (name: string, value: any) => void;
    data: { [key: string]: any };
    editable: boolean;
    isEditing: (field: string) => boolean;
    setEditing: (fieldId: string) => void;
    isProcessing: (field: string) => boolean;
}

const DetailContext = createContext<DetailContextData>({
    onValueChanged: () => {},
    isEditing: () => false,
    setEditing: () => {},
    isProcessing: () => false,
    data: {},
    editable: false,
});

export enum DetailSize {
    SMALL = 'small',
    FULL = 'full',
}

const IconButtonSX = {
    fontSize: 'inherit',
    '.MuiSvgIcon-root': {
        fontSize: 'inherit',
    },
};

type Data = { [key: string]: any };

interface DetailProps {
    children: any;
    size?: DetailSize;
    editable?: boolean;
    data: Data;
    onChange?: (name: string, value: any, data: Data) => any;
}

export const Detail = (props: DetailProps) => {
    const size = props.size ? props.size : DetailSize.FULL;
    const [processingFieldId, setProcessingFieldId] = useState('');
    const [editingFieldId, setEditingFieldId] = useState('');

    const onValueChanged = async (name: string, value: any) => {
        const newData = _.cloneDeep(props.data);
        _.set(newData, name, value);

        if (props.onChange) {
            try {
                setProcessingFieldId(name);
                await props.onChange(name, value, newData);

                setEditingFieldId('');
            } catch (err) {
                let message;
                if (typeof err === 'string') {
                    message = err;
                } else {
                    message = (err as Error).message;
                }

                showToasty({
                    type: ToastType.DANGER,
                    message,
                    title: 'Failed to update field',
                });
            } finally {
                setProcessingFieldId('');
            }
        }
    };

    const isEditing = (name: string) => {
        return editingFieldId === name;
    };

    const isProcessing = (name: string) => {
        return processingFieldId === name;
    };

    const setEditing = (name: string) => {
        if (processingFieldId) {
            return; //Wait...
        }

        setEditingFieldId(name);
    };

    const classNames = toClass({
        detail: true,
        processing: !!processingFieldId,
        [size]: true,
    });

    return (
        <div className={classNames}>
            <DetailContext.Provider
                value={{
                    onValueChanged,
                    isProcessing,
                    isEditing,
                    setEditing,
                    data: props.data,
                    editable: !!props.editable,
                }}
            >
                {props.children}
            </DetailContext.Provider>
        </div>
    );
};

enum RowType {
    CUSTOM = 'custom',
    SIMPLE = 'simple',
    LIST = 'list',
}

interface DetailRowProps {
    label: string;
    name?: string;
    children: any;
    rowType?: RowType;
}

export const DetailRow = (props: DetailRowProps) => {
    let context = useContext(DetailContext);

    const rowType = props.rowType || RowType.CUSTOM;

    const isEditing = !!props.name && context.isEditing(props.name);
    const isProcessing = !!props.name && context.isProcessing(props.name);

    const classNames = toClass({
        'detail-row': true,
        [rowType]: true,
        editing: isEditing,
        processing: isProcessing,
    });

    return (
        <div className={classNames}>
            <div className={'name'}>{props.label}</div>
            <div className={'value'}>{props.children}</div>
        </div>
    );
};

interface DetailRowValueProps {
    name: string;
    label: string;
    fixed?: boolean;
    validation?: any;
}

export const DetailRowValue = (props: DetailRowValueProps) => {
    let context = useContext(DetailContext);

    const originalValue = _.get(context.data, props.name);

    const [value, setValue] = useState(originalValue);

    const isEditing = context.isEditing(props.name);

    const isProcessing = context.isProcessing(props.name);

    const doCancel = () => {
        context.setEditing('');
    };

    const { errors } = useValidation(isEditing, props.validation, props.name, value);

    const invalid = !errors.loading && errors.value?.length && errors.value.length > 0;
    const isEditable = context.editable && !props.fixed;

    return (
        <DetailRow label={props.label} name={props.name} rowType={RowType.SIMPLE}>
            <span className={'inner'}>
                {isEditing && (
                    <>
                        <input
                            type={'text'}
                            value={value}
                            readOnly={isProcessing}
                            autoFocus={true}
                            onChange={(evt) => {
                                setValue(evt.target.value);
                            }}
                        />
                        {errors.value?.length && errors.value.length > 0 && (
                            <div className={'error'}>{errors.value[0]}</div>
                        )}
                    </>
                )}

                {!isEditing && originalValue}
            </span>

            {isEditable && !isEditing && (
                <IconButton
                    color={'primary'}
                    size={'small'}
                    sx={IconButtonSX}
                    onClick={() => {
                        setValue(originalValue);
                        context.setEditing(props.name);
                    }}
                >
                    <Edit />
                </IconButton>
            )}

            {isEditing && !isProcessing && (
                <SaveCancelButtons
                    invalid={!!invalid}
                    onSave={async () => {
                        await context.onValueChanged(props.name, value);
                    }}
                    onCancel={doCancel}
                />
            )}

            {isProcessing && <Spinner />}
        </DetailRow>
    );
};

interface DetailRowListValueEntryProps {
    name: string;
    typeName: string;
    validation?: any;
    originalValue: any;
    entryValue: any;
    index: number;
    processing: boolean;
    editable: boolean;
    onCancel: () => void;
}

export const DetailRowListValueEntry = (props: DetailRowListValueEntryProps) => {
    let context = useContext(DetailContext);
    const onDelete = useConfirmDelete();
    const [listEntryValue, setListEntryValue] = useState('');
    const fieldId = `${props.name}[${props.index}]`;
    const isEditing = context.isEditing(fieldId);
    const { errors } = useValidation(isEditing, props.validation, props.name, listEntryValue);

    const invalid = !errors.loading && errors.value?.length && errors.value.length > 0;
    return (
        <li>
            <span className={'name'}>
                {!isEditing && props.entryValue}
                {isEditing && (
                    <>
                        <input
                            type={'text'}
                            value={listEntryValue}
                            readOnly={props.processing}
                            autoFocus={true}
                            onChange={(evt) => {
                                setListEntryValue(evt.target.value);
                            }}
                        />
                    </>
                )}
            </span>
            {isEditing && errors.value?.length && errors.value.length > 0 && (
                <div className={'error'}>{errors.value[0]}</div>
            )}

            {props.editable && (
                <span className={'actions'}>
                    {!isEditing && (
                        <>
                            <IconButton
                                color={'primary'}
                                size={'small'}
                                sx={IconButtonSX}
                                onClick={() => {
                                    setListEntryValue(props.entryValue);
                                    context.setEditing(fieldId);
                                }}
                            >
                                <Edit />
                            </IconButton>

                            <IconButton
                                color={'error'}
                                size={'small'}
                                sx={IconButtonSX}
                                onClick={async () => {
                                    const ok = await onDelete(
                                        `Delete ${props.typeName}?`,
                                        'This action can not be undone. Continue?'
                                    );
                                    if (!ok) {
                                        return;
                                    }
                                    const newValue = [...props.originalValue];
                                    newValue.splice(props.index, 1);
                                    context.onValueChanged(props.name, newValue);
                                }}
                            >
                                <DeleteRounded />
                            </IconButton>
                        </>
                    )}
                    {isEditing && !props.processing && (
                        <SaveCancelButtons
                            invalid={!!invalid}
                            onSave={async () => {
                                const newValue = [...props.originalValue];
                                newValue[props.index] = listEntryValue;
                                await context.onValueChanged(props.name, newValue);
                            }}
                            onCancel={props.onCancel}
                        />
                    )}
                </span>
            )}
        </li>
    );
};

interface DetailRowListValueProps extends DetailRowValueProps {
    typeName: string;
}

export const DetailRowListValue = (props: DetailRowListValueProps) => {
    let context = useContext(DetailContext);

    const originalValue: any[] = _.has(context.data, props.name) ? _.get(context.data, props.name) : [];

    const isAdding = context.isEditing(props.name);
    const isProcessing = context.isProcessing(props.name);

    const [newListEntry, setNewListEntry] = useState('');

    const { errors } = useValidation(isAdding, props.validation, props.name, newListEntry);

    const invalid = !errors.loading && errors.value?.length && errors.value.length > 0;

    const doCancel = () => {
        context.setEditing('');
    };

    const isEditable = context.editable && !props.fixed;

    return (
        <DetailRow label={props.label} name={props.name} rowType={RowType.LIST}>
            <ul className={'detail-list-value'}>
                {originalValue.map((entryValue, ix) => {
                    return (
                        <DetailRowListValueEntry
                            name={props.name}
                            validation={props.validation}
                            entryValue={entryValue}
                            originalValue={originalValue}
                            editable={isEditable}
                            typeName={props.typeName}
                            index={ix}
                            processing={isProcessing}
                            onCancel={doCancel}
                        />
                    );
                })}
                {isEditable && (
                    <li className={'adder'}>
                        {!isAdding && (
                            <a
                                onClick={() => {
                                    setNewListEntry('');
                                    context.setEditing(props.name);
                                }}
                            >
                                Add {props.typeName}
                            </a>
                        )}

                        {isAdding && (
                            <>
                                <input
                                    type={'text'}
                                    value={newListEntry}
                                    readOnly={isProcessing}
                                    autoFocus={true}
                                    onChange={(evt) => {
                                        setNewListEntry(evt.target.value);
                                    }}
                                />
                                {errors.value?.length && errors.value.length > 0 && (
                                    <div className={'error'}>{errors.value[0]}</div>
                                )}

                                {!isProcessing && (
                                    <SaveCancelButtons
                                        invalid={!!invalid}
                                        onSave={async () => {
                                            const newValue = [...originalValue, newListEntry];
                                            await context.onValueChanged(props.name, newValue);
                                        }}
                                        onCancel={doCancel}
                                    />
                                )}
                            </>
                        )}
                    </li>
                )}
            </ul>

            {isProcessing && <Spinner />}
        </DetailRow>
    );
};

interface DetailButtonsProps {
    children: any;
}

export const DetailButtons = (props: DetailButtonsProps) => {
    const classNames = toClass({
        'detail-buttons': true,
    });

    return (
        <Stack gap={2} direction={'row'} className={classNames}>
            {props.children}
        </Stack>
    );
};

const Spinner = () => (
    <div className={'spinner'}>
        <i className={'fad fa-cog fa-spin'} />
    </div>
);

const SaveCancelButtons = (props: { invalid: boolean; onSave: () => any; onCancel: () => any }) => {
    return (
        <>
            <IconButton
                size={'small'}
                sx={IconButtonSX}
                disabled={props.invalid}
                color={'primary'}
                onClick={props.onSave}
            >
                <Save />
            </IconButton>

            <IconButton size={'small'} sx={IconButtonSX} color={'error'} onClick={props.onCancel}>
                <CloseRounded />
            </IconButton>
        </>
    );
};
