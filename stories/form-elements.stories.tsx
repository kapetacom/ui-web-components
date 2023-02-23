import React, { useState } from 'react';
import { State, Store } from '@sambego/storybook-state';

import {
    Button,
    ButtonSize,
    ButtonStyle,
    ButtonType,
    FormSelect,
    FormButtons,
    FormContainer,
    FormTextarea,
    FormInput,
    Type,
    ModalSize,
    Modal,
    Dialog,
} from '../src';
import { Checkbox } from '../src/form/Checkbox';

let dropdownState = new Store({
    test1: [],
    test2: [],
    test3: ['DK', 'RO'],
    test4: ['GR'],
});

export default {
    title: 'Form Elements',
};

export const SimpleCheckbox = () => {
    const [value, setValue] = useState(false);

    return (
        <div>
            <div style={{ padding: '10px' }}>
                <Checkbox onChange={(value) => setValue(value)} value={value} />
            </div>
        </div>
    );
};

export const SelectInModal = () => {
    const helpText = 'This is some help text';

    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    return (
        <div style={{ padding: '15px' }}>
            <Modal open={true} title={'Test'} size={ModalSize.small}>
                <FormContainer>
                    <FormSelect
                        help={helpText}
                        name={'text'}
                        label={'Text Value'}
                        value={input1}
                        onChange={(inputName, userInput) =>
                            setInput1(userInput)
                        }
                        options={['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']}
                    />

                    <div style={{ width: '80%' }}>
                        <FormSelect
                            help={helpText}
                            name={'text'}
                            label={'Text Value (w/ deselect)'}
                            value={input2}
                            onChange={(inputName, userInput) =>
                                setInput2(userInput)
                            }
                            options={['ONE', 'TWO', 'THREE']}
                            enableDeselect
                        />
                    </div>
                </FormContainer>
            </Modal>
        </div>
    );
};

export const FormInputs = () => {
    const helpText = 'This is some help text';

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <FormInput
                    help={helpText}
                    name={'text'}
                    label={'Text Value'}
                    type={Type.TEXT}
                />
                <FormInput
                    help={helpText}
                    name={'email'}
                    label={'Email Value'}
                    type={Type.EMAIL}
                />
                <FormInput
                    help={helpText}
                    name={'num'}
                    label={'Number Value'}
                    type={Type.NUMBER}
                />
                <FormInput
                    help={helpText}
                    name={'pw'}
                    label={'Password Value'}
                    type={Type.PASSWORD}
                />
                <FormInput
                    help={helpText}
                    name={'date'}
                    label={'Date Value'}
                    type={Type.DATE}
                />
                <FormInput
                    help={helpText}
                    name={'checker'}
                    label={'Boolean Value'}
                    type={Type.CHECKBOX}
                />
            </FormContainer>
        </div>
    );
};

export const FormTextareas = () => {
    const helpText = 'This is some help text';

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <FormInput
                    help={helpText}
                    name={'text'}
                    label={'Text Value'}
                    type={Type.TEXT}
                />
                <FormTextarea
                    help={helpText}
                    name={'multi'}
                    label={'Multi line'}
                />
                <FormInput
                    help={helpText}
                    name={'text'}
                    label={'Text Value'}
                    type={Type.TEXT}
                />
            </FormContainer>
        </div>
    );
};

export const FormSelects = () => {
    const helpText = 'This is some help text';
    const options = {
        blue: 'Blue',
        red: 'Red',
        white: 'White',
        black: 'Black',
    };

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <FormInput
                    help={helpText}
                    name={'text'}
                    label={'Text Value'}
                    type={Type.TEXT}
                />
                <FormSelect
                    help={helpText}
                    name={'multi'}
                    label={'Multi line'}
                    options={options}
                />
                <FormInput
                    help={helpText}
                    name={'text'}
                    label={'Text Value'}
                    type={Type.TEXT}
                />
            </FormContainer>
        </div>
    );
};

export const MixedInputs = () => {
    let inputReturnCallback = (inputReturn) => {};

    let handleSubmit = (event) => {
        event.preventDefault();
    };
    return (
        <div
            style={{
                width: '1200px',
                padding: '10px',
                backgroundColor: '#e0ecff',
            }}
        >
            <form onSubmit={handleSubmit}>
                <FormInput
                    name={'SingleInput1'}
                    value={'Test value'}
                    label={'Single line input'}
                    validation={['required']}
                    help={'Specify the name of your block.'}
                    onChange={inputReturnCallback}
                />

                <FormInput
                    name={'SingleInput2'}
                    value={''}
                    label={'Single line input'}
                    validation={['required']}
                    help={'Specify the name of your block.'}
                    onChange={inputReturnCallback}
                />

                <FormInput
                    name={'SingleInput3'}
                    value={''}
                    label={'Single line input type number'}
                    validation={['required']}
                    help={'Specify the ID of your block.'}
                    type={Type.NUMBER}
                    onChange={inputReturnCallback}
                />

                <FormTextarea
                    name={'MultiLineInput1'}
                    value={''}
                    label={'Multiline line input disabled'}
                    validation={['required']}
                    help={'Specify the description of your block.'}
                    onChange={inputReturnCallback}
                    disabled={true}
                />
                <FormTextarea
                    name={'MultiLineInput2'}
                    value={''}
                    label={'Multiline line input'}
                    validation={['required']}
                    help={'Specify the description of your block.'}
                    onChange={inputReturnCallback}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export const CountrySelects = () => {
    const countryList = [
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'antarctica',
        'Antigua and Barbuda',
        'argentina',
        'Armenia',
        'Aruba',
        'australia',
        'Austria',
        'Azerbaijan',
        'bahamas (the)',
        'bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
    ];

    let countryCodeList2 = {
        DK: 'Denmark',
        RO: 'Romania',
        GR: 'Greece',
    };

    return (
        <div
            style={{
                width: '600px',
                padding: '10px',
                backgroundColor: '#e0ecff',
            }}
        >
            <form onSubmit={() => {}}>
                <State store={dropdownState}>
                    {(state) => [
                        <FormSelect
                            name="test1"
                            value={dropdownState.get('test1')}
                            label={'Single Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryList}
                            onChange={(
                                name: string,
                                valueIn: string | string[]
                            ) => dropdownState.set({ [name]: valueIn })}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test2"
                            value={dropdownState.get('test2')}
                            label={'Multi Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryList}
                            onChange={(
                                name: string,
                                valueIn: string | string[]
                            ) => dropdownState.set({ [name]: valueIn })}
                            multi={true}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test3"
                            value={dropdownState.get('test3')}
                            label={'Multi Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryCodeList2}
                            onChange={(
                                name: string,
                                valueIn: string | string[]
                            ) => dropdownState.set({ [name]: valueIn })}
                            multi={true}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test4"
                            value={dropdownState.get('test4')}
                            label={'Single Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryCodeList2}
                            onChange={(
                                name: string,
                                valueIn: string | string[]
                            ) => dropdownState.set({ [name]: valueIn })}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test5"
                            value={''}
                            label={'Single Selection disabled'}
                            validation={['required']}
                            help={'this is another message'}
                            disabled={true}
                            options={countryList}
                            onChange={(name, input) => {}}
                        />,
                        <br></br>,
                        <br></br>,
                    ]}
                </State>

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export const FormButton = () => {
    return (
        <div style={{ width: 500 }}>
            <FormContainer
                onSubmit={() => {
                    console.log('Submitted the form');
                }}
            >
                <FormInput
                    onChange={() => {
                        console.log('lalalala');
                    }}
                    label="Test"
                    name=""
                    value=""
                    validation={['required']}
                    type={Type.TEXT}
                />

                <FormButtons>
                    <Button
                        width={ButtonSize.MEDIUM}
                        style={ButtonStyle.DANGER}
                        onClick={() => {
                            console.log('Clicked cancel!');
                        }}
                        text="Test"
                    />

                    <Button
                        type={ButtonType.SUBMIT}
                        width={ButtonSize.MEDIUM}
                        style={ButtonStyle.PRIMARY}
                        text="Test"
                    />
                </FormButtons>
            </FormContainer>
        </div>
    );
};
