/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo, useState } from 'react';
import {
    Entity,
    EntityType,
    EntityProperty,
    createDefaultValue,
    toRefValue,
    isNumber,
    toDefaultValue,
} from '@kapeta/schemas';
import './EntityEditor.less';
import _ from 'lodash';
import { useFormContextField } from '../form/FormContext';
import { TYPE_INSTANCE, TYPE_INSTANCE_PROVIDER } from '../dsl/ConfigurationEditor';

type Value = { [key: string]: any };

export interface EntityBlockInstanceResource {
    name: string;
    portType: string;
}
export interface EntityBlockInstance {
    id: string;
    name: string;
    providers: EntityBlockInstanceResource[];
}

interface FieldProps {
    entities: Entity[];
    instances?: EntityBlockInstance[];
    field: EntityProperty;
    value: any;
    onChange: (value: any) => void;
}

const FieldEditor = (props: FieldProps) => {
    if (props.field.ref) {
        const refEntity = props.entities.find((e) => e.name === props.field.ref);

        if (props.field.ref === TYPE_INSTANCE) {
            //Render instance selector
            return (
                <select
                    className={'value instance'}
                    value={props.value?.id}
                    disabled={!props.instances?.length}
                    onChange={(event) => {
                        props.onChange(event.currentTarget.value ? { id: event.currentTarget.value } : null);
                    }}
                >
                    <option value={''}>
                        {props.instances?.length ? 'Select instance...' : 'No instances available'}
                    </option>
                    {props.instances?.map((v) => {
                        return (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        );
                    })}
                </select>
            );
        }

        if (props.field.ref === TYPE_INSTANCE_PROVIDER) {
            //Render instance and provider selector
            const [currentInstanceId, setCurrentInstanceId] = useState(props.value?.id);
            const instance = props.instances?.find((v) => v.id === currentInstanceId);
            return (
                <div className={'instance-provider'}>
                    <label>
                        <select
                            className={'value instance'}
                            value={props.value?.id}
                            disabled={!props.instances?.length}
                            onChange={(event) => {
                                if (!event.currentTarget.value) {
                                    setCurrentInstanceId(undefined);
                                    props.onChange(null);
                                    return;
                                }

                                if (event.currentTarget.value !== props.value?.id) {
                                    setCurrentInstanceId(event.currentTarget.value);
                                    const instance = props.instances?.find((v) => v.id === event.currentTarget.value);
                                    if (instance && instance?.providers?.length > 0) {
                                        const resource = instance?.providers[0];
                                        props.onChange({
                                            resourceName: resource.name,
                                            portType: resource.portType,
                                            id: event.currentTarget.value,
                                        });
                                    }
                                }
                            }}
                        >
                            <option value={''}>
                                {props.instances?.length ? 'Select instance...' : 'No instances available'}
                            </option>
                            {props.instances?.map((v) => {
                                return (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label>
                        <span>Provider:</span>
                        <select
                            className={'value resource'}
                            disabled={!instance}
                            value={props.value?.resourceName}
                            onChange={(event) => {
                                const resourceName = event.currentTarget.value;
                                if (!resourceName || !instance) {
                                    props.onChange(null);
                                    return;
                                }

                                const provider = instance?.providers.find((v) => v.name === resourceName);
                                props.onChange({
                                    resourceName,
                                    portType: provider?.portType,
                                    id: currentInstanceId,
                                });
                            }}
                        >
                            {instance?.providers?.map((v) => {
                                return (
                                    <option key={v.name} value={v.name}>
                                        {v.name} ({v.portType})
                                    </option>
                                );
                            })}
                            {!instance && <option value={''}>Waiting...</option>}
                        </select>
                    </label>
                </div>
            );
        }

        let value = toRefValue(props.field.ref, props.value);
        return (
            <select
                className={'value'}
                value={value}
                onChange={(event) => {
                    props.onChange(event.currentTarget.value);
                }}
            >
                {refEntity?.values?.map((v) => {
                    return (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    );
                })}
            </select>
        );
    }

    if (props.field.type === 'boolean') {
        return (
            <input
                type={'checkbox'}
                checked={props.value}
                onChange={(evt) => props.onChange(evt.currentTarget.checked)}
            />
        );
    }

    if (isNumber(props.field.type)) {
        return (
            <input
                className={'value'}
                type={'number'}
                step={props.field.type === 'integer' ? 1 : 0.01}
                value={props.value}
                onChange={(evt) => props.onChange(parseFloat(evt.currentTarget.value))}
            />
        );
    }

    if (props.field.type === 'string') {
        if (props.field.secret) {
            return (
                <input
                    className={'value'}
                    type={'password'}
                    value={props.value}
                    onChange={(evt) => props.onChange(evt.currentTarget.value)}
                />
            );
        }
        return (
            <input
                className={'value'}
                type={'text'}
                value={props.value}
                onChange={(evt) => props.onChange(evt.currentTarget.value)}
            />
        );
    }

    return (
        <textarea
            className={'value'}
            value={props.value}
            onChange={(evt) => {
                const breaks = evt.currentTarget.value.split(/\n/g).length;
                const height = Math.max(1, breaks) * 18;
                evt.currentTarget.style.height = `${height}px`;
                props.onChange(evt.currentTarget.value);
            }}
        />
    );
};

interface Props {
    entities: Entity[];
    instances?: EntityBlockInstance[];
    value: Value;
    onChange: (value: Value) => void;
}

export const EntityEditor = (props: Props) => {
    const defaultValues = useMemo(() => {
        const out: Value = {};
        props.entities.forEach((entity) => {
            if (entity.type !== EntityType.Dto) {
                return;
            }

            Object.assign(out, createDefaultValue(entity));
        });
        return out;
    }, [props.entities]);

    return (
        <div className={'entity-editor'}>
            {props.entities
                .filter((e) => e.type === EntityType.Dto)
                .map((entity) => {
                    return (
                        <pre className={'entity'} key={entity.name}>
                            {entity.description && <span className={'comment'}>// {entity.description}</span>}
                            <span className={'field-name'}>{entity.name}:</span>
                            {Object.entries(entity.properties).map(([fieldId, field]: [string, EntityProperty]) => {
                                const fullId = `${entity.name}.${fieldId}`;
                                let value = _.get(props.value, fullId);
                                if (value === undefined) {
                                    if (field.defaultValue) {
                                        value = toDefaultValue(field);
                                    } else {
                                        if (field.type === 'boolean') {
                                            value = false;
                                        } else {
                                            value = '';
                                        }
                                    }
                                }

                                return (
                                    <div className={'field'} key={fieldId}>
                                        {field.description && <span className={'comment'}>// {field.description}</span>}
                                        <span className={'field-value'}>
                                            <span className={'field-name'}>
                                                {fieldId}
                                                {field.required ? '*' : ''}
                                            </span>
                                            <span>:</span>
                                            <FieldEditor
                                                entities={props.entities}
                                                instances={props.instances}
                                                field={field}
                                                value={value}
                                                onChange={(value) => {
                                                    const newValue = _.cloneDeep(props.value);
                                                    _.set(newValue, fullId, value);
                                                    Object.entries(defaultValues).forEach(([section, defaultValue]) => {
                                                        Object.entries(defaultValue).forEach(
                                                            ([fieldId, defaultValue]) => {
                                                                const fullId = `${section}.${fieldId}`;
                                                                if (!_.has(newValue, fullId)) {
                                                                    _.set(newValue, fullId, defaultValue);
                                                                }
                                                            }
                                                        );
                                                    });
                                                    props.onChange(newValue);
                                                }}
                                            />
                                        </span>
                                    </div>
                                );
                            })}
                        </pre>
                    );
                })}
        </div>
    );
};

interface FormProps {
    entities: Entity[];
    instances?: EntityBlockInstance[];
    name: string;
}

export const EntityEditorForm = (props: FormProps) => {
    const valueField = useFormContextField(props.name, (value) => {
        valueField.set(value);
    });

    return (
        <EntityEditor
            entities={props.entities}
            instances={props.instances}
            value={valueField.get({})}
            onChange={(value) => valueField.set(value)}
        />
    );
};
