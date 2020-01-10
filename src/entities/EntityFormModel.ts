import {observable} from "mobx";
import {Guid} from "guid-typescript";

import {SchemaEntity, SchemaEntry, SchemaEntryType, SchemaProperties} from "@blockware/ui-web-types";

export interface SchemaEntryEdit {
    uid: string
    error?: string
    id: string
    type: SchemaEntryType
    items?: SchemaEntryEdit
    properties?: SchemaEntryEdit[]
    required?: string[]
    enum?: string[]
}

export interface SchemaEntityEdit {
    name: string
    properties: SchemaEntryEdit[]
}

function toEditEntry(fieldId:string, original:SchemaEntry):SchemaEntryEdit {

    return {
        uid: Guid.create().toString(),
        ...original,
        items: original.items ? toEditEntry(fieldId + '[]', original.items) : undefined,
        properties: original.properties ? toEditProperties(original.properties) : undefined,
        id: fieldId
    }
}

function toEditProperties(original:SchemaProperties):SchemaEntryEdit[] {
    return Object.entries(original).map(([fieldId, field]) => {
        return toEditEntry(fieldId, field);
    });
}

function fromEditProperties(original:SchemaEntryEdit[]):SchemaProperties {
    const properties = {};

    original.forEach((field) => {
        const copiedField:any = {...field};
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
    private original: SchemaEntity;

    constructor(entry?: SchemaEntity) {
        if (!entry) {
            entry = {name:'', properties: {}};
        }
        this.name = entry.name;
        this.properties = toEditProperties(entry.properties);
        this.original = entry;
    }

    public getData() {
        return {
            name: this.name,
            properties: fromEditProperties(this.properties)
        };
    }

}
