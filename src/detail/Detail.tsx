import React, { Context, createContext, useContext, useState } from 'react';
import _ from 'lodash';
import './Detail.less';
import { toClass } from '@blockware/ui-web-utils';
import {
    Button,
    ButtonShape,
    ButtonStyle,
    StandardIcons,
} from '../button/buttons';
import { applyValidation } from '../validation/Validators';
import { showToasty, ToastType } from '../toast/ToastComponent';
import { DialogControl } from '../dialog/DialogControl';

interface DetailContextData {
    onValueChanged: (name: string, value: any) => void;
    data: { [key: string]: any };
    editable: boolean;
    isEditing: (field: string) => boolean;
    setEditing: (fieldId: string) => void;
    isProcessing: (field: string) => boolean;
}

export interface DetailContextType extends Context<DetailContextData> {}

const DetailContext: DetailContextType = createContext({
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
                    message = err.message;
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

    const isEditing = props.name && context.isEditing(props.name);
    const isProcessing = props.name && context.isProcessing(props.name);

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

    let errors = [];
    if (isEditing) {
        errors = applyValidation(props.validation, props.name, value);
    }

    const invalid = errors.length > 0;
    const isEditable = context.editable && !props.fixed;

    return (
        <DetailRow
            label={props.label}
            name={props.name}
            rowType={RowType.SIMPLE}
        >
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
                        {errors.length > 0 && (
                            <div className={'error'}>{errors[0]}</div>
                        )}
                    </>
                )}

                {!isEditing && originalValue}
            </span>

            {isEditable && !isEditing && (
                <Button
                    text={StandardIcons.EDIT}
                    shape={ButtonShape.ICON}
                    style={ButtonStyle.PRIMARY}
                    onClick={() => {
                        setValue(originalValue);
                        context.setEditing(props.name);
                    }}
                />
            )}

            {isEditing && !isProcessing && (
                <SaveCancelButtons
                    invalid={invalid}
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

interface DetailRowListValueProps extends DetailRowValueProps {
    typeName: string;
}

export const DetailRowListValue = (props: DetailRowListValueProps) => {
    let context = useContext(DetailContext);

    const originalValue: any[] = _.has(context.data, props.name)
        ? _.get(context.data, props.name)
        : [];

    const isAdding = context.isEditing(props.name);
    const isProcessing = context.isProcessing(props.name);
    const [listEntryValue, setListEntryValue] = useState('');
    const [newListEntry, setNewListEntry] = useState('');
    const errors = isAdding
        ? applyValidation(props.validation, props.name, newListEntry)
        : [];
    const invalid = errors.length > 0;

    const doCancel = () => {
        context.setEditing('');
    };

    const isEditable = context.editable && !props.fixed;

    return (
        <DetailRow label={props.label} name={props.name} rowType={RowType.LIST}>
            <ul className={'detail-list-value'}>
                {originalValue.map((entryValue, ix) => {
                    const fieldId = `${props.name}[${ix}]`;
                    const isEditing = context.isEditing(fieldId);

                    const errors = isEditing
                        ? applyValidation(
                              props.validation,
                              props.name,
                              listEntryValue
                          )
                        : [];
                    const invalid = errors.length > 0;
                    return (
                        <li key={`elm_${ix}`}>
                            <span className={'name'}>
                                {!isEditing && entryValue}
                                {isEditing && (
                                    <>
                                        <input
                                            type={'text'}
                                            value={listEntryValue}
                                            readOnly={isProcessing}
                                            autoFocus={true}
                                            onChange={(evt) => {
                                                setListEntryValue(
                                                    evt.target.value
                                                );
                                            }}
                                        />
                                    </>
                                )}
                            </span>
                            {isEditing && errors.length > 0 && (
                                <div className={'error'}>{errors[0]}</div>
                            )}

                            {isEditable && (
                                <span className={'actions'}>
                                    {!isEditing && (
                                        <>
                                            <Button
                                                text={StandardIcons.EDIT}
                                                shape={ButtonShape.ICON}
                                                style={ButtonStyle.PRIMARY}
                                                onClick={() => {
                                                    setListEntryValue(
                                                        entryValue
                                                    );
                                                    context.setEditing(fieldId);
                                                }}
                                            />

                                            <Button
                                                text={StandardIcons.DELETE}
                                                shape={ButtonShape.ICON}
                                                style={ButtonStyle.DANGER}
                                                onClick={() => {
                                                    DialogControl.delete(
                                                        `Delete ${props.typeName}?`,
                                                        'This action can not be undone. Continue?',
                                                        async (ok) => {
                                                            if (!ok) {
                                                                return;
                                                            }
                                                            const newValue = [
                                                                ...originalValue,
                                                            ];
                                                            newValue.splice(
                                                                ix,
                                                                1
                                                            );
                                                            context.onValueChanged(
                                                                props.name,
                                                                newValue
                                                            );
                                                        }
                                                    );
                                                }}
                                            />
                                        </>
                                    )}
                                    {isEditing && !isProcessing && (
                                        <SaveCancelButtons
                                            invalid={invalid}
                                            onSave={async () => {
                                                const newValue = [
                                                    ...originalValue,
                                                ];
                                                newValue[ix] = listEntryValue;
                                                await context.onValueChanged(
                                                    props.name,
                                                    newValue
                                                );
                                            }}
                                            onCancel={doCancel}
                                        />
                                    )}
                                </span>
                            )}
                        </li>
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
                                {errors.length > 0 && (
                                    <div className={'error'}>{errors[0]}</div>
                                )}

                                {!isProcessing && (
                                    <SaveCancelButtons
                                        invalid={invalid}
                                        onSave={async () => {
                                            const newValue = [
                                                ...originalValue,
                                                newListEntry,
                                            ];
                                            await context.onValueChanged(
                                                props.name,
                                                newValue
                                            );
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

    return <div className={classNames}>{props.children}</div>;
};

const Spinner = () => (
    <div className={'spinner'}>
        <i className={'fad fa-cog fa-spin'} />
        <span className={'inner'}>Saving...</span>
    </div>
);

const SaveCancelButtons = (props: {
    invalid: boolean;
    onSave: () => any;
    onCancel: () => any;
}) => {
    return (
        <>
            <Button
                text={StandardIcons.SAVE}
                shape={ButtonShape.ICON}
                disabled={props.invalid}
                style={ButtonStyle.PRIMARY}
                onClick={props.onSave}
            />

            <Button
                text={StandardIcons.CANCEL}
                shape={ButtonShape.ICON}
                style={ButtonStyle.DANGER}
                onClick={props.onCancel}
            />
        </>
    );
};
