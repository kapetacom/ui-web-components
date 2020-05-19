import React from 'react';
import {storiesOf} from '@storybook/react';
import { Store, StateDecorator, State } from "@sambego/storybook-state";

import {
    Button, ButtonSize, ButtonStyle,
    ButtonType,
    DropdownInput,
    FormButtons,
    FormContainer,
    MultiLineInput,
    SingleLineInput,
    Type
} from '../src';


let dropdownState = new Store({
    test1: [],
    test2: [],
    test3: ["DK", "RO"],
    test4: ["GR"]
});



storiesOf('Forms', module)
    .add("Single Line Inputs", () => {

        const helpText = 'This is some help text';

        return (
            <div style={{padding:'15px'}}>
                <FormContainer>
                    <SingleLineInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT}  />
                    <SingleLineInput help={helpText} name={'email'} label={'Email Value'} type={Type.EMAIL}  />
                    <SingleLineInput help={helpText} name={'num'} label={'Number Value'} type={Type.NUMBER}  />
                    <SingleLineInput help={helpText} name={'pw'} label={'Password Value'} type={Type.PASSWORD}  />
                    <SingleLineInput help={helpText} name={'date'} label={'Date Value'} type={Type.DATE}  />
                    <SingleLineInput help={helpText} name={'checker'} label={'Boolean Value'} type={Type.CHECKBOX}  />
                    <SingleLineInput help={helpText} name={'radio'} label={'Radio Value'} type={Type.RADIO}  />
                </FormContainer>

            </div>
        );
    })
    .add("Multi Line Inputs", () => {

        const helpText = 'This is some help text';

        return (
            <div style={{padding:'15px'}}>
                <FormContainer>
                    <SingleLineInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT}  />
                    <MultiLineInput help={helpText} name={'multi'} label={'Multi line'} />
                    <SingleLineInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT}  />
                </FormContainer>

            </div>
        );
    })

    .add("Dropdown Inputs", () => {

        const helpText = 'This is some help text';
        const options = {
            blue: 'Blue',
            red: 'Red',
            white: 'White',
            black: 'Black'
        };

        return (
            <div style={{padding:'15px'}}>
                <FormContainer>
                    <SingleLineInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT}  />
                    <DropdownInput help={helpText} name={'multi'} label={'Multi line'} options={options} />
                    <SingleLineInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT}  />
                </FormContainer>

            </div>
        );
    })


    .add("Single & Multi line Input", () => {

        let inputReturnCallback = (inputReturn) => {  }

        let handleSubmit = (event) => { event.preventDefault() }
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

    })
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


        return (


            <div style={{ width: "600px", padding: '10px', backgroundColor: '#e0ecff' }}>
                <form onSubmit={() => {}} style={{ backgroundColor: 'inherit' }}>
                    <State store={dropdownState} >
                        {state => [
                            <DropdownInput
                                name="test1"
                                value={dropdownState.get("test1")}
                                label={"Single Selection "}
                                validation={["required"]}
                                help={"this is another message"}
                                options={countryList}
                                onChange={(name: string ,valueIn:string | string[])=>dropdownState.set({[name] : valueIn})}/>,

                            <br></br>,

                            <DropdownInput
                                name="test2"
                                value={dropdownState.get("test2")}
                                label={"Multi Selection "}
                                validation={["required"]}
                                help={"this is another message"}
                                options={countryList}
                                onChange={
                                    (name: string ,valueIn:string | string[])=>dropdownState.set({[name] : valueIn})
                                }
                                multi={true}/>,

                            <br></br>,

                            <DropdownInput
                                name="test3"
                                value={dropdownState.get("test3")}
                                label={"Multi Selection "}
                                validation={["required"]}
                                help={"this is another message"}
                                options={countryCodeList2}
                                onChange={(name: string ,valueIn:string | string[])=>dropdownState.set({[name]: valueIn})}
                                multi={true}/>,

                            <br></br>,

                            <DropdownInput
                                name="test4"
                                value={dropdownState.get("test4")}
                                label={"Single Selection "}
                                validation={["required"]}
                                help={"this is another message"}
                                options={countryCodeList2}
                                onChange={(name: string ,valueIn:string | string[])=>dropdownState.set({[name]: valueIn})}/>,

                            <br></br>,

                            <DropdownInput
                                name="test5"
                                value={""}
                                label={"Single Selection disabled"}
                                validation={["required"]}
                                help={"this is another message"}
                                disabled={true}
                                options={countryList}
                                onChange={(name, input)=>{}}/>,
                            <br></br>,
                            <br></br>
                        ]}
                    </State>

                    <input type="submit" value="Submit" />
                </form>
            </div>


        )
    })
    .add("Form Row Button",()=>{

        return (
            <div style={{width:500}}>
                <FormContainer onSubmit={()=>{
                    console.log("Submitted the form");
                }}>
                    <SingleLineInput
                        onChange={()=>{console.log("lalalala")}}
                        label="Test" name="" value="" validation={["required"]} type={Type.TEXT}/>

                    <FormButtons>
                        <Button width={ButtonSize.MEDIUM}
                                style={ButtonStyle.DANGER}
                                onClick={()=>{
                                    console.log("Clicked cancel!");
                                }}
                                text="Test" />

                        <Button type="submit"
                                width={ButtonSize.MEDIUM}
                                style={ButtonStyle.PRIMARY}
                                text="Test" />

                    </FormButtons>
                </FormContainer>
            </div>
        )
    });


