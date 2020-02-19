import React from 'react';
import {observable} from "mobx";
import { storiesOf } from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {EntityMapper, EntityPicker, EntityForm, EntityFormModel} from "../src";

import { EntityList } from "../src/entities/EntityList";
import { FormElementContainer, InputStatusTypes, InputTypes } from "../src/form/inputs/FormElementContainer";
import { SingleLineInput, } from "../src/form/inputs/SingleLineInput";
import { MultiLineInput, MultiLineInputProps } from "../src/form/inputs/MultiLineInput";
import { DropdownInput, DropdownInputProps } from "../src/form/inputs/DropdownInput";
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
                        inputId ="test1"
                        label={"Multiple selection and required"}
                        optionList={countryList}
                        multiSelection={true}
                        required={true} 
                        inputCallback={inputCallback}
                        message={"this is just a message."}
                        />
                        <br></br>
                        <DropdownInput
                        inputId="test2"
                        label={"Single Selection and required"}
                        optionList={countryList}
                        multiSelection={false}
                        required={true}
                        inputCallback={inputCallback}
                        message={"this is another message"} />
                         <br></br>
                        <DropdownInput
                        inputId="test3"
                        label={"Single selection & not required"}
                        optionList={countryList}
                        multiSelection={false}
                        required={false}
                        inputCallback={inputCallback}
                        message={"this is one more message"} />
                        <br></br>
                        <DropdownInput
                        inputId="test3"
                        label={"Single selection not required (warning)"}
                        optionList={countryList}
                        multiSelection={false}
                        required={false}
                        inputCallback={inputCallback}
                        statusMessage={"Block name already in use. Block name already in use."}
                        inputStatus={InputStatusTypes.WARNING}
                        message={"this is one more message"} />
                        <br></br>

                        <DropdownInput
                        inputId="test3"
                        label={"Single selection not required (warning)"}
                        optionList={countryList}
                        multiSelection={false}
                        required={false}
                        inputCallback={inputCallback}
                        statusMessage={"Block name already in use. "}
                        inputStatus={InputStatusTypes.ERROR}
                        message={"this is one more message"} />
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

            <div style={{ width: "600px", padding: '10px', backgroundColor: '#e0ecff' }}>
                <form style={{ backgroundColor: 'inherit' }} onSubmit={handleSubmit}>


                    <MultiLineInput
                        inputId={"MultiLineInput1"}
                        label={"Required Multi line Input"}
                        required={true}
                        message={"Provide a description to your block."}
                        statusMessage={"Block name already in use. Block name already in use. Block name already in use. Block name already in use. Block name already in use. Block name already in use."}
                        inputStatus={InputStatusTypes.ERROR}
                        inputCallback={inputReturnCallback}>
                    </MultiLineInput>

                    <MultiLineInput
                        inputId={"MultiLineInput2"}
                        label={"Required Multi line Input"}
                        required={true}
                        message={"Provide a description to your block."}
                        inputCallback={inputReturnCallback}>
                    </MultiLineInput>


                    <SingleLineInput
                        inputId={"SingleInput1"}
                        label={"Required Text Input"}
                        required={true}
                        message={"Specify the name of your block."}
                        statusMessage={""}
                        inputStatus={""}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}>
                    </SingleLineInput>

                    <SingleLineInput
                        inputId={"SingleInput2"}
                        label={"Just a test Label"}
                        required={false}
                        message={"Specify the name of your block."}
                        statusMessage={"Block name already in use. Block name already in use. Block name already in use. Block name already in use. Block name already in use. Block name already in use."}
                        inputStatus={InputStatusTypes.WARNING}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}>
                    </SingleLineInput>

                    <SingleLineInput
                        inputId={"SingleInput3"}
                        label={"Number Input"}
                        required={false}
                        message={"Specify the number of your block."}
                        statusMessage={""}
                        inputStatus={""}
                        inputType={InputTypes.NUMBER}
                        inputCallback={inputReturnCallback}>
                    </SingleLineInput>

                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    })