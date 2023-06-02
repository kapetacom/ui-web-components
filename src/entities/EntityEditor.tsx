import React, { useMemo } from 'react';
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

type Value = { [key: string]: any };

interface FieldProps {
    entities: Entity[];
    field: EntityProperty;
    value: any;
    onChange: (value: any) => void;
}

const FieldEditor = (props: FieldProps) => {
    if (props.field.ref) {
        const refEntity = props.entities.find((e) => e.name === props.field.ref);
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
    name: string;
}

export const EntityEditorForm = (props: FormProps) => {
    const valueField = useFormContextField(props.name, (value) => {
        valueField.set(value);
    });

    return (
        <EntityEditor
            entities={props.entities}
            value={valueField.get({})}
            onChange={(value) => valueField.set(value)}
        />
    );
};
