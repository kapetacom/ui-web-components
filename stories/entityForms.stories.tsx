import React from 'react';
import {observable} from "mobx";
import { storiesOf } from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {EntityMapper, EntityPicker, EntityForm, EntityFormModel} from "../src";
import { EntityList} from "../src/entities/EntityList";
import { SchemaEntryType, SchemaEntity } from '@blockware/ui-web-types';

const EntityFrom = {
    name: {
        type: 'string'
    },
    age: {
        type: 'number'
    },
    tags: {
        type: 'array' //Defaults to string
    },
    connections: {
        type: 'object',
        properties: {
            google: {
                type: 'boolean'
            },
            github: {
                type: 'boolean'
            }
        }
    }
};

const EntityTo = {
    fullName: {
        type: 'string'
    },
    currentAge: {
        type: 'number'
    },
    properties: {
        type: 'object',
        properties: {
            tagList: {
                type: 'array' //Defaults to string
            },
            oauth: {
                type: 'object',
                properties: {
                    googleOAuth: {
                        type: 'boolean'
                    },
                    githubOAuth: {
                        type: 'boolean'
                    }
                }
            }
        }
    }
};

const entityList:string[] = observable(["User", "Ingredients", "Student", "PizzaTopping"]);
let pickerState = new Store({
    entities: entityList,
    value: "",
    handleValueUpdate: (valueIn:string) => {
        pickerState.set({ value: valueIn });
    }
});

const entity = {name:'MyType', properties:EntityFrom};
let entityFormState = new Store({
    entity: new EntityFormModel(entity)
});





storiesOf('Entity Forms', module)

    // @ts-ignore
    .addDecorator(StateDecorator(pickerState))

    .add("Entity Mapper", () => (
        <div style={{ width: "700px", padding: '10px' }}>
            <EntityMapper fromEntities={[]} toEntities={[]} from={EntityFrom} to={EntityTo} onChange={(mapping) => console.log('mapping', mapping)} />
        </div>
    ))


    .add("Entity Picker ", (props:any) => {
        return (
            <State store={pickerState} >
                <EntityPicker
                    name={'test'}
                    value={props.value}
                    onChange={(eventValue:SchemaEntryType) => {
                        pickerState.state.handleValueUpdate(eventValue.toString());
                    }}

                    onEntityCreated={(newEntity) => {
                        let entities:string[] = [...pickerState.state.entities, newEntity.name];

                        pickerState.set({
                            entities
                        });
                    }}

                    entities={pickerState.state.entities}
                />
            </State>
        )
    })
    .addDecorator(StateDecorator(entityFormState))
    .add("Entity Form ", () => {
        return (
            <div style={{ width: "700px", padding: '10px' }}>
                <State store={entityFormState} >
                    <EntityForm
                        name={'test'}
                        entity={entityFormState.state.entity}
                        onChange={(entity) => {
                            console.log('Entity changed', entity);
                            entityFormState.set({entity});
                        }}
                    />
                </State>
            </div>
        )
    })
    .add("Entity List", () => {
        const demoEntities: SchemaEntity[] = [
            {
                name: "Entity 1",
                properties: {},
                status: true
            },
            {
                name: "Entity 2",
                properties: {},
                status: true
            },
            {
                name: "Entity 3",
                properties: {},
                status: false
            },
            {
                name: "Entity 4",
                properties: {},
                status: false
            },
            {
                name: "Entity 5",
                properties: {},
                status: true
            },
            {
                name: "Entity 6",
                properties: {},
                status: false
            },
            {
                name: "Entity 1",
                properties: {},
                status: true
            },
            {
                name: "Entity 2",
                properties: {},
                status: true
            },
            {
                name: "Entity 3",
                properties: {},
                status: false
            },
            {
                name: "Entity 4",
                properties: {},
                status: false
            },
            {
                name: "Entity 5",
                properties: {},
                status: true
            },
            {
                name: "Entity 6",
                properties: {},
                status: false
            },
            {
                name: "Entity 1",
                properties: {},
                status: true
            },
            {
                name: "Entity 2",
                properties: {},
                status: true
            },
            {
                name: "Entity 3",
                properties: {},
                status: false
            },
            {
                name: "Entity 4",
                properties: {},
                status: false
            },
            {
                name: "Entity 5",
                properties: {},
                status: true
            },
            {
                name: "Entity 6",
                properties: {},
                status: false
            }
        ];

        return (
            <div style={{ width: "400px", height:"600px" }}>
                <EntityList  entities={demoEntities} />
            </div>
        )
    }

    );
