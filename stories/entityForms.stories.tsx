import React from 'react';
import { observable } from 'mobx';
import { storiesOf } from '@storybook/react';
import { Store, withState, State } from '@sambego/storybook-state';
import { EntityMapper, EntityPicker, EntityForm, EntityFormModel, SchemaEntityEdit } from '../src';
import { EntityList } from '../src/entities/EntityList';
import { EntityProperty, EntityType, toDTO } from '@kapeta/schemas';

const EntityFrom = {
    name: {
        type: 'string',
    },
    age: {
        type: 'number',
    },
    tags: {
        type: 'array', //Defaults to string
    },
    connections: {
        type: 'object',
        properties: {
            google: {
                type: 'boolean',
            },
            github: {
                type: 'boolean',
            },
        },
    },
};

const EntityTo = {
    fullName: {
        type: 'string',
    },
    currentAge: {
        type: 'number',
    },
    properties: {
        type: 'object',
        properties: {
            tagList: {
                type: 'array', //Defaults to string
            },
            oauth: {
                type: 'object',
                properties: {
                    googleOAuth: {
                        type: 'boolean',
                    },
                    githubOAuth: {
                        type: 'boolean',
                    },
                },
            },
        },
    },
};

const entityList: string[] = observable(['User', 'Ingredients', 'Student', 'PizzaTopping']);
let pickerState = new Store({
    entities: entityList,
    value: '',
    handleValueUpdate: (valueIn: string) => {
        pickerState.set({ value: valueIn });
    },
});

const entity = { name: 'MyType', properties: EntityFrom, type: EntityType.Dto };
let entityFormState = new Store({
    entity: new EntityFormModel(toDTO(entity)),
});

storiesOf('Entity Forms', module)
    // @ts-ignore
    .addDecorator(withState(pickerState))
    .addDecorator(withState(entityFormState))

    .add('Entity Mapper', () => (
        <div
            style={{
                width: '700px',
                padding: '10px',
                backgroundColor: '#e0ecff',
            }}
        >
            <EntityMapper
                fromEntities={[]}
                toEntities={[]}
                from={EntityFrom}
                to={EntityTo}
                onChange={(mapping) => console.log('mapping', mapping)}
            />
        </div>
    ))

    .add('Entity Picker ', (props: any) => {
        return (
            <State store={pickerState}>
                <EntityPicker
                    name={'test'}
                    value={props.value}
                    onChange={(eventValue: EntityProperty) => {
                        pickerState.state.handleValueUpdate(eventValue.type);
                    }}
                    onEntityCreated={(newEntity) => {
                        let entities: string[] = [...pickerState.state.entities, newEntity.name];

                        pickerState.set({
                            entities,
                        });
                    }}
                    entities={pickerState.state.entities}
                />
            </State>
        );
    })

    .add('Entity Form ', () => {
        return (
            <div
                style={{
                    width: '700px',
                    padding: '10px',
                    backgroundColor: '#e0ecff',
                }}
            >
                <State store={entityFormState}>
                    <EntityForm
                        name={'test'}
                        entity={entityFormState.state.entity}
                        onChange={(entity) => {
                            entityFormState.set({ entity });
                        }}
                    />
                </State>
            </div>
        );
    })
    .add('Entity List', () => {
        const demoEntities: any[] = [
            {
                name: 'Entity 1',
                properties: {},
                status: true,
            },
            {
                name: 'Entity 2',
                properties: {},
                status: true,
            },
            {
                name: 'Entity 3',
                properties: {},
                status: false,
            },
            {
                name: 'Entity 4',
                properties: {},
                status: false,
            },
            {
                name: 'Entity 5',
                properties: {},
                status: true,
            },
            {
                name: 'Entity 6',
                properties: {},
                status: false,
            },
        ];

        return (
            <div style={{ width: '400px', height: '600px' }}>
                <EntityList
                    entities={demoEntities}
                    handleEditEntity={() => {}}
                    handleRemoveEntity={() => {}}
                    handleCreateEntity={() => {}}
                />
            </div>
        );
    });
