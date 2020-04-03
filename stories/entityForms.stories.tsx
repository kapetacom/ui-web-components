import React from 'react';
import {observable} from "mobx";
import { storiesOf } from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {EntityMapper, EntityPicker, EntityForm, EntityFormModel, FormContainer, FormButtons, Button, ButtonType} from "../src";

import { EntityList } from "../src/entities/EntityList";
import { SingleLineInput, Type } from "../src/form/inputs/SingleLineInput";
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

let dropdowns: { [key:string]: string| string[]} = observable({
    test1: [""],
    test2: [""],
    test3: ["DK", "RO"],
    test4: ["DK", "RO"]
});

let dropdownState = new Store({
dropdowns: dropdowns,
    handleValueUpdate: (name: string ,valueIn:string | string[]) => {
        dropdowns[name]=valueIn
        
        dropdownState.set({dropdowns: dropdowns});
        console.log("dropdownState.state",dropdownState.state.dropdowns[name]);
    }
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
    .addDecorator(StateDecorator(dropdownState))
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

        let countryCodeList2 ={
            "DK": "Denmark",
            "RO": "Romania",
            "GR": "Greece"
        }

        let userSelection= [];
        const inputCallback= (userInput) => {
            userSelection = userInput;
            console.log()
        };

        
        return (
                
             
            <div style={{ width: "600px", padding: '10px', backgroundColor: '#e0ecff' }}>
                <form onSubmit={() => console.log("submited")} style={{ backgroundColor: 'inherit' }}>
                <State store={dropdownState} >
                     <DropdownInput
                        name="test1"
                        value={dropdownState.state.dropdowns.test1}
                        label={"Single Selection "}
                        validation={["required"]}
                        help={"this is another message"}
                        options={countryList}
                        onChange={(name: string ,valueIn:string | string[])=>dropdownState.state.handleValueUpdate(name, valueIn)}/>

                    <br></br>

                    <DropdownInput
                        name="test2"
                        value={dropdownState.state.dropdowns.test2}
                        label={"Multi Selection "}
                        validation={["required"]}
                        help={"this is another message"}
                        options={countryList}
                        onChange={(name: string ,valueIn:string | string[])=>dropdownState.state.handleValueUpdate(name, valueIn)}
                        multi={true}/>

                    <br></br>

                    <DropdownInput
                        name="test3"
                        value={dropdownState.state.dropdowns.test3}
                        label={"Multi Selection "}
                        validation={["required"]}
                        help={"this is another message"}
                        options={countryCodeList2}
                        onChange={(name: string ,valueIn:string | string[])=>dropdownState.state.handleValueUpdate(name, valueIn)}
                        multi={true}/>

                    <br></br>

                    <DropdownInput
                        name="test4"
                        value={dropdownState.state.dropdowns.test4}
                        label={"Single Selection "}
                        validation={["required"]}
                        help={"this is another message"}
                        options={countryCodeList2}
                        onChange={(name: string ,valueIn:string | string[])=>dropdownState.state.handleValueUpdate(name, valueIn)}/>

                    <br></br>

                    <DropdownInput
                        name="test5"
                        value={""}
                        label={"Single Selection disabled"}
                        validation={["required"]}
                        help={"this is another message"}
                        disabled={true}
                        options={countryList}
                        onChange={(name, input)=>console.log("name:",name, "input:",input)}/>
                    <br></br>
                    <br></br> 
                </State>

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
                        type={Type.NUMBER}
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
    }).add("Form Row Button",()=>{

       return (
       <div style={{width:500}}>
            <FormContainer onSubmit={()=>{
            console.log("Submitted the form");
        }}>
            <SingleLineInput 
            onChange={()=>{console.log("lalalala")}} 
            label="Test" name="" value="" validation={["required"]} type={Type.TEXT}/>

            <FormButtons>
                <Button type="submit" width={100}
                buttonType={ButtonType.PROCEED} 
                text="Test" />
                <Button width={100}
                buttonType={ButtonType.CANCEL}
                onClick={()=>{console.log("Clicked cancel!");
                }} 
                text="Test" />
            </FormButtons>
        </FormContainer>
       </div>
       )
    })