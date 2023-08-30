import React, { useContext, useMemo, useState } from 'react';
import { AsyncValidatorFunction, debouncedValidator, FormButtons, FormContainer } from '../src';
import { FormField, FormFieldType } from '../src/form/inputs/FormField';
import { FormContext, FormContextWatcher, useFormContextField } from '../src/form/FormContext';
import { Button } from '@mui/material';

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
                <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER} />
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

function failValidation(name, value) {
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
                <FormField name={'email'} label={'E-mail'} validation={['required', 'email']} />
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
            debouncedValidator(500, (name, value) => {
                console.log('Start async validation', value);
                let doResolve, timer;
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
                    <Button variant={'contained'} color={'error'}>
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
