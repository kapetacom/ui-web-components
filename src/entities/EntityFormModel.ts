import { makeObservable, observable } from 'mobx';
import { Guid } from 'guid-typescript';
import { EntityDTO, EntityProperties, EntityProperty, EntityType } from '@kapeta/schemas';

export interface SchemaEntryEdit {
    uid: string;
    error?: string;
    id: string;
    type: EntityProperty;
    items?: SchemaEntryEdit;
    properties?: SchemaEntryEdit[];
    required?: string[];
    enum?: string[];
}

export interface SchemaEntityEdit {
    name: string;
    properties: SchemaEntryEdit[];
}

function toEditEntry(fieldId: string, original: EntityProperty): SchemaEntryEdit {
    const newEntry = { ...original };
    delete newEntry.items;
    delete newEntry.properties;
    const items = original.items ? toEditEntry(fieldId + '[]', original.items) : undefined;
    const props = original.properties ? toEditProperties(original.properties) : undefined;
    return {
        uid: Guid.create().toString(),
        type: original,
        id: fieldId,
        items: items,
        properties: props,
    };
}

function toEditProperties(original: EntityProperties): SchemaEntryEdit[] {
    return Object.entries(original).map(([fieldId, field]) => {
        return toEditEntry(fieldId, field);
    });
}

function fromEditProperties(original: SchemaEntryEdit[]): EntityProperties {
    const properties: { [key: string]: any } = {};

    original.forEach((field) => {
        const copiedField: any = { ...field };
        const id = copiedField.id;
        delete copiedField.id;
        delete copiedField.uid;
        delete copiedField.error;
        properties[id] = copiedField;
    });

    return properties;
}

export class EntityFormModel {
    @observable
    name: string;

    @observable
    properties: SchemaEntryEdit[];

    @observable
    private original: EntityDTO;

    constructor(entry?: EntityDTO) {
        if (!entry) {
            entry = { type: EntityType.Dto, name: '', properties: {} };
        }
        this.name = entry.name;
        this.properties = toEditProperties(entry.properties);
        if (!this.properties) {
            this.properties = [];
        }
        this.original = entry;
        makeObservable(this);
    }

    public getData(): EntityDTO {
        return {
            type: EntityType.Dto,
            name: this.name,
            properties: fromEditProperties(this.properties),
        };
    }
}
