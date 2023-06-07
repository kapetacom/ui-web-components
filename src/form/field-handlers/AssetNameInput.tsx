import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormSelectInput } from '../inputs/FormSelect';
import { Type } from '../inputs/FormInput';
import { FormContext, useFormContextField } from '../FormContext';
import { normaliseValidators, ValidatorListUnresolved } from '../../validation/Validators';
import { FormRow } from '../FormRow';

interface SharedProps {
    name?: string;
    label?: string;
    help?: string;
    disabled?: boolean;
    readOnly?: boolean;
    validation?: ValidatorListUnresolved;
}

interface Props extends SharedProps {
    namespaces: string[];
}

import './AssetNameInput.less';

export const AssetNameInput = (props: Props) => {
    const formContext = useContext(FormContext);
    const formField = useFormContextField<string>(props.name);

    const [focusName, setFocusName] = useState(false);
    const [focusNamespace, setFocusNamespace] = useState(false);
    const [namespace, setNamespace] = useState('');
    const [assetName, setAssetName] = useState('');

    // Reset state when value changes:
    const value = formField.get('/');
    useEffect(() => {
        const [newNamespace, newAssetName] = value.split('/') || [];
        const defaultNamespace = props.namespaces?.[0] || '';
        setNamespace(newNamespace || defaultNamespace);
        setAssetName(newAssetName || '');
    }, [value, props.namespaces]);

    // Report back to the form context for validation
    useEffect(() => {
        const ready = !!(namespace && assetName);
        formContext.onReadyStateChanged(props.name, ready);
    }, [props.name, namespace, assetName]);

    const callback = useCallback(
        (namespace: string, assetName: string) => {
            const value =
                namespace || assetName
                    ? [
                          namespace.toLowerCase(),
                          assetName
                              .toLowerCase()
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
        [props.name, formField]
    );

    // Add a fake option for unknown namespaces (e.g. loading an asset that you can no longer access)
    const validateNamespace = useMemo(
        () => (name, value) => {
            const [namespace] = value.split('/');
            if (!(props.namespaces || []).includes(namespace)) {
                throw 'Namespace not available';
            }
        },
        [props.namespaces]
    );

    let namespaces = [...(props.namespaces || [])];
    if (!namespaces.includes(namespace)) {
        namespaces.push(namespace);
    }

    const validators = useMemo(() => {
        const validators = normaliseValidators(props.validation);
        validators.push(validateNamespace);
        return validators;
    }, [props.validation, validateNamespace]);

    return (
        <FormRow
            label={props.label}
            help={props.help}
            focused={focusNamespace || focusName}
            disabled={props.disabled}
            readOnly={props.readOnly}
            validation={validators}
            name={props.name}
            value={value}
            type={Type.TEXT}
        >
            <div className="form-input asset-name-input">
                <FormSelectInput
                    name="asset-namespace"
                    value={namespace}
                    readOnly={props.readOnly}
                    onChange={(_name, value) => callback(value, assetName)}
                    disabled={props.namespaces?.length < 2 || props.disabled}
                    options={namespaces}
                    onFocusChange={setFocusNamespace}
                    focused={focusNamespace}
                    noTransform
                />
                <span className={'separator'}>/</span>
                <input
                    type={Type.TEXT}
                    name={'asset-name'}
                    value={assetName}
                    onBlur={() => setFocusName(false)}
                    onFocus={() => setFocusName(true)}
                    onChange={(evt) => callback(namespace, evt.target.value)}
                    readOnly={props.readOnly}
                    disabled={props.disabled}
                />
            </div>
        </FormRow>
    );
};
