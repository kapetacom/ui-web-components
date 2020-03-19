import React from 'react';
import {observable} from "mobx";
import { storiesOf } from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {EntityMapper, EntityPicker, EntityForm, EntityFormModel} from "../src";

import { EntityList } from "../src/entities/EntityList";
import { SingleLineInput, Types, } from "../src/form/inputs/SingleLineInput";
import { MultiLineInput,  } from "../src/form/inputs/MultiLineInput";
import { DropdownInput } from "../src/form/inputs/DropdownInput";
import { SchemaEntryType } from '@blockware/ui-web-types';

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
        <div style={{ width: "700px", padding: '10px', backgroundColor: '#e0ecff' }}>
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
            <div style={{ width: "700px", padding: '10px', backgroundColor: '#e0ecff'}}>
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
        const demoEntities: any[] = [
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

    )

    .add("Dropdown Input ", () => {
        const countryList = [
            "Algeria",
            "American Samoa",
            "Andorra",
            "Angola",
            "Anguilla",
            "antarctica",
            "Antigua and Barbuda",
            "argentina",
            "Armenia",
            "Aruba",
            "australia",
            "Austria",
            "Azerbaijan",
            "bahamas (the)",
            "bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium"
        ];

        let userSelection= [];
        const inputCallback= (userInput) => {
            userSelection = userInput;
        };

        
        return (
                
            <div style={{ width: "600px", padding: '10px', backgroundColor: '#e0ecff' }}>
                <form onSubmit={() => console.log("submited")} style={{ backgroundColor: 'inherit' }}>
                     <DropdownInput
                        name="test2"
                        value={""}
                        label={"Single Selection disabled"}
                        validation={["required"]}
                        help={"this is another message"}
                        multi={true}
                        options={countryList}
                        onChange={(name, input)=>console.log("name:",name, "input:",input)}/>

                    <br></br>

                    <DropdownInput
                        name="test2"
                        value={""}
                        label={"Single Selection disabled"}
                        validation={["required"]}
                        help={"this is another message"}
                        multi={false}
                        disabled={true}
                        options={countryList}
                        onChange={(name, input)=>console.log("name:",name, "input:",input)}/>
                    <br></br>
                    <br></br> 

                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    })
    .add("Single & Multi line Input", () => {

        let inputReturnCallback = (inputReturn) => { console.log("Input Returned : ", inputReturn) }

        let handleSubmit = (event) => { event.preventDefault(); console.log("event submitted") }
        return (

            <div style={{ width: "1200px", padding: '10px', backgroundColor: '#e0ecff' }}>
                <form style={{ backgroundColor: 'inherit' }} onSubmit={handleSubmit}>

                      <SingleLineInput
                        name={"SingleInput1"}
                        value={'Test value'}
                        label={"Single line input"}
                        validation={['required']}
                        help={"Specify the name of your block."}
                        onChange={inputReturnCallback}>
                    </SingleLineInput>

                    <SingleLineInput
                        name={"SingleInput2"}
                        value={''}
                        label={"Single line input"}
                        validation={['required']}
                        help={"Specify the name of your block."}
                        onChange={inputReturnCallback}>
                    </SingleLineInput>

                    <SingleLineInput
                        name={"SingleInput3"}
                        value={''}
                        label={"Single line input type number"}
                        validation={['required']}
                        help={"Specify the ID of your block."}
                        type={Types.NUMBER}
                        onChange={inputReturnCallback}>
                    </SingleLineInput>


                    <MultiLineInput
                        name={"MultiLineInput1"}
                        value={''}
                        label={"Multiline line input disabled"}
                        validation={['required']}
                        help={"Specify the description of your block."}
                        onChange={inputReturnCallback}
                        disabled={true}>
                    </MultiLineInput>
                    <MultiLineInput
                        name={"MultiLineInput2"}
                        value={''}
                        label={"Multiline line input"}
                        validation={['required']}
                        help={"Specify the description of your block."}
                        onChange={inputReturnCallback}>
                    </MultiLineInput>


                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    })