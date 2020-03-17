import React from 'react';
import {observable} from "mobx";
import { storiesOf } from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {EntityMapper, EntityPicker, EntityForm, EntityFormModel} from "../src";

import { EntityList } from "../src/entities/EntityList";
import { SingleLineInput, } from "../src/form/inputs/SingleLineInput";
import { MultiLineInput,  } from "../src/form/inputs/MultiLineInput";
import { DropdownInput } from "../src/form/inputs/DropdownInput";
import { SchemaEntryType } from '@blockware/ui-web-types';
import { InputModeTypes, InputStatusTypes, InputTypes } from "../src//form//inputs//InputBasePropsInterface"

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
                        inputName ="test1"
                        label={"Multiple selection and required"}
                        value={"test"}
                        optionList={countryList}
                        multiSelection={true}
                        required={true} 
                        inputType={InputTypes.TEXT}
                        inputCallback={inputCallback}
                        message={"this is just a message."}
                        />
                        <br></br>
                        <DropdownInput
                        inputName="test2"
                        value={""}
                        label={"Single Selection disabled"}
                        optionList={countryList}
                        multiSelection={false}
                        required={true}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputCallback}
                        message={"this is another message"}
                        disabled={true} />
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
                        inputName={"SingleInput1"}
                        value={'Test value'}
                        label={"Single line input"}
                        validation={'required'}
                        message={"Specify the name of your block."}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}>
                    </SingleLineInput>

                    <SingleLineInput
                        inputName={"SingleInput2"}
                        value={''}
                        label={"Single line input"}
                        validation={'required'}
                        message={"Specify the name of your block."}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}>
                    </SingleLineInput>


                    <MultiLineInput
                        inputName={"MultiLineInput1"}
                        value={''}
                        label={"Multiline line input disabled"}
                        validation={'required'}
                        message={"Specify the description of your block."}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}
                        disabled={true}>
                    </MultiLineInput>
                    <MultiLineInput
                        inputName={"MultiLineInput2"}
                        value={''}
                        label={"Multiline line input"}
                        validation={'required'}
                        message={"Specify the description of your block."}
                        inputType={InputTypes.TEXT}
                        inputCallback={inputReturnCallback}>
                    </MultiLineInput>


                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    })