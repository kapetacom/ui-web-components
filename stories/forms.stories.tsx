import React, {useState} from 'react';
import {Button, ButtonStyle, ButtonType, FormButtons, FormContainer} from "../src";
import {FormField, FormFieldType} from "../src/form/inputs/FormField";

function minMaxAgeCheck(name: string, value: number) {
    if (value < 1) {
        throw 'Age can not be less than 1';
    }
    if (value > 120) {
        throw 'Age can not be higher than 120';
    }
}

export default {
    title: 'Forms'
}


export const SimpleForm = () => {

    const [formData, setFormData] = useState({})

    return (
        <div style={{width: '550px'}}>
            <FormContainer
                initialValue={{name: 'Henrik', age: 39, select_one: 'two', select_multi: ['two', 'three']}}
                onSubmitData={(data) => {
                    console.log('Data', data);
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'}/>
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER}/>
                <FormField name={'enabled'} label={'Enable?'}
                           type={FormFieldType.CHECKBOX} help={'Should this be enabled?'}/>

                <FormField name={'radios'} label={'Radios'}
                           type={FormFieldType.RADIO}
                           help={'Pick one of these'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />

                <FormField name={'select_multi'} label={'Select Multi'}
                           type={FormFieldType.ENUM_MULTI}
                           help={'You can choose multiple'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />

                <FormField name={'select_one'} label={'Select One'}
                           type={FormFieldType.ENUM}
                           help={'Just one please'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />


                <FormButtons>
                    <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                    <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    )
}

export const NestedDataForm = () => {

    const [formData, setFormData] = useState({})

    return (
        <div style={{width: '550px'}}>
            <FormContainer
                initialValue={{author: {name: 'Henrik', age: 39}, options: {select_one: 'two', select_multi: ['two', 'three']}}}
                onSubmitData={(data) => {
                    console.log('Data', data);
                    setFormData(data);
                }}
            >
                <FormField name={'author.name'} label={'Name'}/>
                <FormField name={'author.age'} label={'Age'} type={FormFieldType.NUMBER}/>
                <FormField name={'enabled'} label={'Enable?'}
                           type={FormFieldType.CHECKBOX} help={'Should this be enabled?'}/>

                <FormField name={'radios'} label={'Radios'}
                           type={FormFieldType.RADIO}
                           help={'Pick one of these'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />

                <FormField name={'options.select_multi'} label={'Select Multi'}
                           type={FormFieldType.ENUM_MULTI}
                           help={'You can choose multiple'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />

                <FormField name={'options.select_one'} label={'Select One'}
                           type={FormFieldType.ENUM}
                           help={'Just one please'}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />


                <FormButtons>
                    <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                    <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    )
}


export const FormWithConditionals = () => {

    const [formData, setFormData] = useState<any>({})

    return (
        <div style={{width: '550px'}}>
            <FormContainer
                initialValue={{name: 'Henrik', age: 39}}
                onSubmitData={(data) => {
                    setFormData(data);
                }}
                onChange={(data) => {
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'}/>
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER}/>
                <FormField name={'enabled'} label={'Enable?'}
                           type={FormFieldType.CHECKBOX} help={'Should this be enabled?'}/>

                {formData.enabled &&
                    <div>
                        <FormField name={'radios'} label={'Radios'}
                                   type={FormFieldType.RADIO}
                                   help={'Pick one of these'}
                                   options={{one: 'One', two: 'Two', three: 'Three'}}
                        />

                        <FormField name={'select_multi'} label={'Select Multi'}
                                   type={FormFieldType.ENUM_MULTI}
                                   help={'You can choose multiple'}
                                   options={{one: 'One', two: 'Two', three: 'Three'}}
                        />

                        <FormField name={'select_one'} label={'Select One'}
                                   type={FormFieldType.ENUM}
                                   help={'Just one please'}
                                   options={{one: 'One', two: 'Two', three: 'Three'}}
                        />
                    </div>
                }

                <FormButtons>
                    <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                    <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    )
}


export const FormWithValidation = () => {

    const [formData, setFormData] = useState({})

    return (
        <div style={{width: '550px'}}>
            <FormContainer
                initialValue={{name: 'Henrik', age: 39, enabled: true}}
                onSubmitData={(data) => {
                    setFormData(data);
                }}>
                <FormField name={'name'} label={'Name'} validation={['required']}/>
                <FormField name={'email'} label={'E-mail'} validation={['required', 'email']}/>
                <FormField name={'enabled'} label={'Enable?'}
                           type={FormFieldType.CHECKBOX}/>

                <FormField name={'age'} label={'Age'}
                           validation={['required', minMaxAgeCheck]}
                           type={FormFieldType.NUMBER}/>

                <FormField name={'select_one'} label={'Select'}
                           type={FormFieldType.RADIO}
                           options={{one: 'One', two: 'Two', three: 'Three'}}
                />

                <FormButtons>
                    <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                    <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    )
}

export const AsyncForm = () => {

    const [formData, setFormData] = useState({});

    return (
        <div style={{width: '550px'}}>
            <FormContainer
                initialValue={{name: 'Henrik', age: 39, select_one: 'two', select_multi: ['two', 'three']}}
                onSubmitData={async (data) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'}/>
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER}/>
                <FormField name={'enabled'} label={'Enable?'}
                           type={FormFieldType.CHECKBOX} help={'Should this be enabled?'}/>

                <FormButtons>
                    <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                    <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    )
}


export const FormNavigationOnSubmit = () => {

    return (
        <div style={{width: '550px'}}>
            <form method={'GET'}>
                <FormContainer
                    initialValue={{name: 'Henrik', age: 39, select_one: 'two', select_multi: ['two', 'three']}} >
                    <FormField name={'name'} label={'Name'}/>
                    <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER}/>
                    <FormField name={'enabled'} label={'Enable?'}
                               type={FormFieldType.CHECKBOX} help={'Should this be enabled?'}/>

                    <FormButtons>
                        <Button width={80} text={'Reset'} type={ButtonType.RESET} style={ButtonStyle.DANGER}/>
                        <Button width={80} text={'Save'} type={ButtonType.SUBMIT} style={ButtonStyle.PRIMARY}/>
                    </FormButtons>
                </FormContainer>
            </form>
        </div>
    )
}


