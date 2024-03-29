/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { EntityDTO, EntityProperties, EntityProperty } from '@kapeta/schemas';
import React from 'react';

import { FormSelect } from '../form/inputs/FormSelect';
import { EntityHelpers } from '@kapeta/kaplang-core';

interface IDEntry {
    id: string;
    type: EntityProperty;
}

type IDList = IDEntry[];

type EntityMap = { [from: string]: MappedEntity };

interface EntityMapperProps {
    from: EntityProperties;
    fromEntities: EntityDTO[];
    to: EntityProperties;
    toEntities: EntityDTO[];
    onChange: (entityMap: EntityMap) => void;
}

enum MappedEntityType {
    AUTO = 'AUTO',
}

interface MappedEntity {
    to: string;
    type?: MappedEntityType;
}

interface EntityMapperState {
    mapping: EntityMap;
}

function getItems(entry: any) {
    let items = entry.items;
    if (items) {
        return items;
    }
    return { type: 'string' };
}

export class EntityMapper extends React.Component<EntityMapperProps, EntityMapperState> {
    constructor(props: EntityMapperProps) {
        super(props);

        this.state = {
            mapping: {},
        };
    }

    toTargetFlatList(properties: EntityProperties, parentId?: string) {
        let flatList: IDList = [];
        Object.entries(properties).forEach(([id, entry]) => {
            flatList = flatList.concat(this.toTargetLastListEntry(id, entry, parentId));
        });

        return flatList;
    }

    toTargetLastListEntry(id: string, entry: EntityProperty, parentId?: string): IDList {
        let entryId = parentId ? parentId + '.' + id : id;
        switch (entry.type) {
            case 'object':
                if (!entry.properties) {
                    return [];
                }

                return this.toTargetFlatList(entry.properties, entryId);
            case 'array':
                const items = getItems(entry);
                return this.toTargetLastListEntry(id + '[]', items, parentId);
        }

        return [
            {
                id: entryId,
                type: entry,
            },
        ];
    }

    renderObject(properties: EntityProperties, parentId?: string) {
        return (
            <div className={'entity-mapper-properties'}>
                {Object.entries(properties).map(([id, entry], ix) => {
                    let entryId = parentId ? parentId + '.' + id : id;
                    return (
                        <div key={ix} className={'entity-mapper-entry'}>
                            {this.renderEntry(entryId, entry)}
                        </div>
                    );
                })}
            </div>
        );
    }

    renderEntry(id: string, entry: EntityProperty): React.ReactNode {
        switch (entry.type) {
            case 'object':
                if (entry.properties) {
                    return this.renderObject(entry.properties, id);
                }

                return <></>;

            case 'array':
                const items = getItems(entry);

                return this.renderEntry(id + '[]', items);
        }
        const targetFields = this.toTargetFlatList(this.props.from).filter((targetField) => {
            return EntityHelpers.isCompatibleTypes(
                targetField.type,
                entry,
                this.props.fromEntities,
                this.props.toEntities
            );
        });
        let targetFieldsList: string[] = targetFields.map(
            (target) => `${target.id}:${EntityHelpers.typeName(target.type)}`
        );
        return (
            <FormSelect
                name={id}
                label={`${id}:${entry.type}`}
                value={this.getMapping(id)}
                options={targetFieldsList}
                validation={['required']}
                onChange={(userInput: string) => this.updateMapping(id, userInput)}
                help={'Choose source value to map from'}
            />
        );
    }

    getMapping(id: string) {
        if (!this.state.mapping[id]) {
            return '';
        }

        return this.state.mapping[id].to;
    }

    updateMapping(id: string, value: string): void {
        const mapping = this.state.mapping;
        mapping[id] = {
            to: value,
            type: MappedEntityType.AUTO,
        };

        this.setState({ mapping }, () => {
            this.props.onChange(this.state.mapping);
        });
    }

    render() {
        return <div className={'entity-mapper'}>{this.renderObject(this.props.to)}</div>;
    }
}
