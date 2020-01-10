import React from "react";
import {
    isCompatibleTypes,
    SchemaEntity,
    SchemaEntry,
    SchemaEntryType,
    SchemaProperties,
    typeName
} from "@blockware/ui-web-types";

import {FormRow} from "..";

interface IDEntry {
    id: string
    type: SchemaEntryType
}

type IDList = IDEntry[];

type EntityMap = { [from: string]: MappedEntity };

interface EntityMapperProps {
    from: SchemaProperties
    fromEntities: SchemaEntity[]
    to: SchemaProperties
    toEntities: SchemaEntity[]
    onChange: (entityMap: EntityMap) => void
}

enum MappedEntityType {
    AUTO = 'AUTO'
}

interface MappedEntity {
    to: string
    type?: MappedEntityType
}

interface EntityMapperState {
    mapping: EntityMap
}

function getItems(entry: any) {
    let items = entry.items;
    if (items) {
        return items;
    }
    return {type: 'string'};
}

export class EntityMapper extends React.Component<EntityMapperProps, EntityMapperState> {


    constructor(props: EntityMapperProps) {
        super(props);

        this.state = {
            mapping: {}
        };

    }

    toTargetFlatList(properties: SchemaProperties, parentId?: string) {
        let flatList: IDList = [];
        Object.entries(properties).forEach(([id, entry]) => {
            flatList = flatList.concat(this.toTargetLastListEntry(id, entry, parentId));
        });

        return flatList;
    }

    toTargetLastListEntry(id: string, entry: SchemaEntry, parentId?: string): IDList {
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

        return [{
            id: entryId,
            type: entry.type
        }];
    }

    renderObject(properties: SchemaProperties, parentId?: string) {

        return (
            <div className={'entity-mapper-properties'}>
                {
                    Object.entries(properties).map(([id, entry], ix) => {

                        let entryId = parentId ? parentId + '.' + id : id;
                        return (
                            <div key={ix} className={"entity-mapper-entry"}>
                                {this.renderEntry(entryId, entry)}
                            </div>
                        );
                    })
                }

            </div>
        )
    }

    renderEntry(id: string, entry: SchemaEntry): React.ReactNode {

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
            return isCompatibleTypes(targetField.type, entry.type, this.props.fromEntities, this.props.toEntities);
        });

        return (
            <FormRow label={`${id}:${entry.type}`} help={'Choose source value to map from'}>
                <select value={this.getMapping(id)} name={id}
                        onChange={(evt) => this.updateMapping(id, evt.target.value)}>
                    <option value={''}>Skip</option>
                    {
                        targetFields.map((entry, ix) => {
                            return (
                                <option key={ix} value={entry.id}>{entry.id}:{typeName(entry.type)}</option>
                            );
                        })
                    }
                </select>
            </FormRow>
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
            type: MappedEntityType.AUTO
        };

        this.setState({mapping}, () => {
            this.props.onChange(this.state.mapping);
        });
    }

    render() {

        return (
            <div className={'entity-mapper'}>
                {this.renderObject(this.props.to)}
            </div>
        );
    }
}