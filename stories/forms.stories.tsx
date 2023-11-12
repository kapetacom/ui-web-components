/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useContext, useMemo, useState } from 'react';
import { AsyncValidatorFunction, debouncedValidator, FormButtons, FormContainer, FormInput, Type } from '../src';
import { FormField, FormFieldType } from '../src/form/inputs/FormField';
import { FormContext, FormContextWatcher, useFormContextField } from '../src/form/FormContext';
import { Box, Button, Divider, Typography } from '@mui/material';

function minMaxAgeCheck(name: string, value: number) {
    if (value < 1) {
        throw 'Age can not be less than 1';
    }
    if (value > 120) {
        throw 'Age can not be higher than 120';
    }
}

const InitialFormValue = {
    name: 'Henrik',
    age: 39,
    select_one: 'two',
    select_multi: ['two', 'three'],
};

const AltFormValue = {
    name: 'John',
    age: 32,
    select_one: 'three',
    select_multi: ['one'],
};

export default {
    title: 'Forms',
};

export const DebugFormContext = () => {
    const { valid, processing, isDirty } = useContext(FormContext);

    return (
        <>
            <b>Form context:</b>
            <pre>{JSON.stringify({ valid, processing, isDirty }, null, 2)}</pre>
        </>
    );
};

export const SimpleForm = () => {
    const [formData, setFormData] = useState({});

    const formValueA = {
        name: 'Henrik',
        age: 39,
        enabled: false,
        radios: 'One',
        select_multi: ['two', 'three'],
        select_one: 'two',
        select_empty: '',
    };

    const formValueB = {
        name: 'John',
        age: 32,
        enabled: true,
        radios: 'Two',
        select_multi: ['one'],
        select_one: 'three',
        select_empty: '',
    };

    const [initialValue, setInitialValue] = useState(formValueA);

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={initialValue}
                onSubmitData={(data) => {
                    console.log('Data', data);
                    setFormData(data);
                }}
            >
                <FormContextWatcher onChange={(context) => console.log('Form context changed to:', context)} />

                <FormField name={'name'} label={'Name'} validation={['required']} />
                <FormField name={'age'} autoFocus={true} label={'Age'} type={FormFieldType.NUMBER} />
                <FormField
                    name={'enabled'}
                    label={'Enable?'}
                    type={FormFieldType.CHECKBOX}
                    help={'Should this be enabled?'}
                />

                <FormField
                    name={'radios'}
                    label={'Radios'}
                    type={FormFieldType.RADIO}
                    help={'Pick one of these'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormField
                    name={'select_multi'}
                    label={'Select Multi'}
                    type={FormFieldType.ENUM_MULTI}
                    help={'You can choose multiple'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormField
                    name={'select_one'}
                    label={'Select One'}
                    type={FormFieldType.ENUM}
                    help={'Just one please'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormField
                    name={'select_empty'}
                    label={'Select Empty'}
                    type={FormFieldType.ENUM}
                    help={'Just one please'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormButtons>
                    <Button variant={'contained'} onClick={() => setInitialValue(formValueA)}>
                        Load A
                    </Button>
                    <Button variant={'contained'} onClick={() => setInitialValue(formValueB)}>
                        Load B
                    </Button>
                    <Button variant={'contained'} type={'reset'} color={'error'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>

                <DebugFormContext />
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export const NestedDataForm = () => {
    const [formData, setFormData] = useState({});

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={InitialFormValue}
                onSubmitData={(data) => {
                    console.log('Data', data);
                    setFormData(data);
                }}
            >
                <FormField name={'author.name'} label={'Name'} />
                <FormField name={'author.age'} label={'Age'} type={FormFieldType.NUMBER} />
                <FormField
                    name={'enabled'}
                    label={'Enable?'}
                    type={FormFieldType.CHECKBOX}
                    help={'Should this be enabled?'}
                />

                <FormField
                    name={'radios'}
                    label={'Radios'}
                    type={FormFieldType.RADIO}
                    help={'Pick one of these'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormField
                    name={'options.select_multi'}
                    label={'Select Multi'}
                    type={FormFieldType.ENUM_MULTI}
                    help={'You can choose multiple'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormField
                    name={'options.select_one'}
                    label={'Select One'}
                    type={FormFieldType.ENUM}
                    help={'Just one please'}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormButtons>
                    <Button variant={'contained'} color={'error'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export const FormWithConditionals = () => {
    const [formData, setFormData] = useState<any>({});

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={InitialFormValue}
                onSubmitData={(data) => {
                    setFormData(data);
                }}
                onChange={(data) => {
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'} />
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER} />
                <FormField
                    name={'enabled'}
                    label={'Enable?'}
                    type={FormFieldType.CHECKBOX}
                    help={'Should this be enabled?'}
                />

                {formData.enabled && (
                    <div>
                        <FormField
                            name={'radios'}
                            label={'Radios'}
                            type={FormFieldType.RADIO}
                            help={'Pick one of these'}
                            options={{ one: 'One', two: 'Two', three: 'Three' }}
                        />

                        <FormField
                            name={'select_multi'}
                            label={'Select Multi'}
                            type={FormFieldType.ENUM_MULTI}
                            help={'You can choose multiple'}
                            options={{ one: 'One', two: 'Two', three: 'Three' }}
                        />

                        <FormField
                            name={'select_one'}
                            label={'Select One'}
                            type={FormFieldType.ENUM}
                            help={'Just one please'}
                            options={{ one: 'One', two: 'Two', three: 'Three' }}
                        />
                    </div>
                )}

                <FormButtons>
                    <Button variant={'contained'} color={'error'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

function failValidation(_name: string, value: string) {
    if (value === 'fail') throw new Error('Cannot be "fail"');
}

const CustomFormComponent = () => {
    const simpleHook = useFormContextField('simplehook');

    return <FormField name={'simple'} label={'Simple'} validation={['required', failValidation]} />;
};

export const FormWithValidation = () => {
    const [formData, setFormData] = useState({});

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={InitialFormValue}
                onSubmitData={(data) => {
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'} validation={['required', failValidation]} />
                <FormField autoFocus={true} name={'email'} label={'E-mail'} validation={['required', 'email']} />
                <FormField name={'enabled'} label={'Enable?'} type={FormFieldType.CHECKBOX} />
                <CustomFormComponent />

                <FormField
                    name={'age'}
                    label={'Age'}
                    validation={['required', minMaxAgeCheck]}
                    type={FormFieldType.NUMBER}
                />

                <FormField
                    name={'select_one'}
                    label={'Select'}
                    type={FormFieldType.RADIO}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormButtons>
                    <Button variant={'contained'} color={'error'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export const FormWithAsyncValidation = () => {
    const [formData, setFormData] = useState({});

    const asyncValidation: AsyncValidatorFunction = useMemo(
        () =>
            debouncedValidator(500, (_name, value) => {
                console.log('Start async validation', value);
                let doResolve: (value?: null) => void, timer: NodeJS.Timeout;
                const promise = new Promise((resolve, reject) => {
                    doResolve = resolve;
                    timer = setTimeout(() => {
                        console.log('Do async validation', value);
                        if (value === 'fail') {
                            reject('This is not a valid value');
                        } else {
                            resolve(null);
                        }
                    }, 1000);
                });

                return {
                    promise,
                    cancel: () => {
                        clearTimeout(timer);
                        doResolve && doResolve();
                    },
                };
            }),
        []
    );

    const validation = useMemo(() => [asyncValidation], [asyncValidation]);

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={InitialFormValue}
                onSubmitData={(data) => {
                    setFormData(data);
                }}
            >
                <FormField
                    name={'name'}
                    label={'Name'}
                    help={'This will fail if you type "fail"'}
                    validation={validation}
                />
                <FormField name={'email'} label={'E-mail'} validation={['required', 'email']} />
                <FormField name={'enabled'} label={'Enable?'} type={FormFieldType.CHECKBOX} />

                <FormField
                    name={'age'}
                    label={'Age'}
                    validation={['required', minMaxAgeCheck]}
                    type={FormFieldType.NUMBER}
                />

                <FormField
                    name={'select_one'}
                    label={'Select'}
                    type={FormFieldType.RADIO}
                    options={{ one: 'One', two: 'Two', three: 'Three' }}
                />

                <FormButtons>
                    <Button variant={'contained'} color={'error'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export const FormWithActiveAsyncValidation = () => {
    const asyncValidation: AsyncValidatorFunction = useMemo(
        () =>
            debouncedValidator(500, () => {
                let doResolve: (value?: null) => void;

                const promise = new Promise((resolve) => {
                    doResolve = resolve;
                });

                return {
                    promise,
                    cancel: () => {
                        doResolve && doResolve();
                    },
                };
            }),
        []
    );

    const validation = useMemo(() => [asyncValidation], [asyncValidation]);

    return (
        <Box sx={{ width: '550px' }}>
            <Typography variant="body1">
                While validation is processing spinners are shown in input and textarea elements
            </Typography>

            <FormContainer>
                <Typography variant="body2" sx={{ mt: 4 }}>
                    input type="text"
                </Typography>
                <FormField name={'email'} label={'E-mail'} validation={validation} help={'Some help here'} />
                <FormField name={'email'} label={'E-mail'} validation={validation} variant="outlined" />
                <FormField name={'email'} label={'E-mail'} validation={validation} variant="filled" />

                <Typography variant="body2" sx={{ mt: 4 }}>
                    input type="password"
                </Typography>
                <FormField name="password" label="Password" validation={validation} type={FormFieldType.PASSWORD} />
                <FormField
                    name="password"
                    label="Password"
                    validation={validation}
                    variant="outlined"
                    help={'Some help here'}
                    type={FormFieldType.PASSWORD}
                />
                <FormField
                    name="password"
                    label="Password"
                    validation={validation}
                    variant="filled"
                    type={FormFieldType.PASSWORD}
                />

                <Typography variant="body2" sx={{ mt: 4 }}>
                    textarea
                </Typography>
                <FormField
                    name={'description1'}
                    label={'Description 1'}
                    validation={validation}
                    variant="standard"
                    type={FormFieldType.TEXT}
                />
                <FormField
                    name={'description2'}
                    label={'Description 2'}
                    validation={validation}
                    variant="outlined"
                    type={FormFieldType.TEXT}
                />
                <FormField
                    name={'description3'}
                    label={'Description 3'}
                    validation={validation}
                    variant="filled"
                    help={'Some help here'}
                    type={FormFieldType.TEXT}
                />
            </FormContainer>
        </Box>
    );
};

export const AsyncForm = () => {
    const [formData, setFormData] = useState({});

    return (
        <div style={{ width: '550px' }}>
            <FormContainer
                initialValue={InitialFormValue}
                onSubmitData={async (data) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setFormData(data);
                }}
            >
                <FormField name={'name'} label={'Name'} />
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER} />
                <FormField
                    name={'enabled'}
                    label={'Enable?'}
                    type={FormFieldType.CHECKBOX}
                    help={'Should this be enabled?'}
                />

                <FormButtons>
                    <Button variant={'text'} type="reset" color={'inherit'}>
                        Reset
                    </Button>
                    <Button variant={'contained'} type={'submit'} color={'primary'}>
                        Save
                    </Button>
                </FormButtons>

                <DebugFormContext />
            </FormContainer>
            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export const FormNavigationOnSubmit = () => {
    return (
        <div style={{ width: '550px' }}>
            <form method={'GET'}>
                <FormContainer initialValue={InitialFormValue}>
                    <FormField name={'name'} label={'Name'} />
                    <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER} />
                    <FormField
                        name={'enabled'}
                        label={'Enable?'}
                        type={FormFieldType.CHECKBOX}
                        help={'Should this be enabled?'}
                    />

                    <FormButtons>
                        <Button variant={'contained'} color={'error'}>
                            Reset
                        </Button>
                        <Button variant={'contained'} type={'submit'} color={'primary'}>
                            Save
                        </Button>
                    </FormButtons>
                </FormContainer>
            </form>
        </div>
    );
};

export const CustomFormValidation = () => {
    return (
        <FormContainer
            initialValue={{}}
            onSubmitData={(data) => {
                console.log(data);
            }}
            validators={[
                (fieldName: string, value: string) => {
                    if (fieldName === 'fail') {
                        throw new Error('This field will never pass');
                    }
                },
            ]}
        >
            <FormField name={'ok'} label={'Something'} validation={['required']} />
            <FormField name={'fail'} label={'Fails'} validation={['required']} />
            <FormButtons>
                <Button variant={'contained'} color={'error'}>
                    Reset
                </Button>
                <Button variant={'contained'} type={'submit'} color={'primary'}>
                    Save
                </Button>
            </FormButtons>
        </FormContainer>
    );
};

export const LoginAutocomplete = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * This story test that the autoComplete props gets passed to the input and show up in the DOM.
     */

    return (
        <FormContainer>
            <FormInput
                name={'email'}
                label={'E-mail'}
                validation={['required', 'email']}
                onChange={(fieldName: string, userInput: string) => setEmail(userInput)}
                value={email}
                variant="outlined"
                autoComplete="email"
            />
            <FormInput
                name={'password'}
                label={'Password'}
                type={Type.PASSWORD}
                validation={['required']}
                onChange={(fieldName: string, userInput: string) => setPassword(userInput)}
                value={password}
                variant="outlined"
                autoComplete="current-password"
            />
            <FormButtons>
                <Button variant={'text'} type="reset" color={'inherit'}>
                    Reset
                </Button>
                <Button variant={'contained'} type={'submit'} color={'primary'}>
                    Save
                </Button>
            </FormButtons>
        </FormContainer>
    );
};
