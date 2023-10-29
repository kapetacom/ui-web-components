/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { Detail, DetailButtons, DetailRow, DetailRowListValue, DetailRowValue, DetailSize } from '../src/detail/Detail';
import { DefaultContext, ToastContainer } from '../src';
import { Button } from '@mui/material';

function minMaxAgeCheck(name: string, value: number) {
    if (value < 1) {
        throw 'Age can not be less than 1';
    }
    if (value > 120) {
        throw 'Age can not be higher than 120';
    }
}

export default {
    title: 'Details',
};

export const FullDetail = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        handle: 'myUsername',
        age: 39,
        embedded: {
            value: 'i am embedded',
            list: ['1'],
        },
        emails: ['myfirst@email.com', 'my-other@email.com'],
        phones: ['+1 (123) 12312-123', '+45 2123321'],
    });

    const onChange = async (name, value, data) => {
        console.log('Changed', name, value);

        await new Promise((resolve, reject) =>
            setTimeout(() => {
                resolve(true);
                //reject(new Error('Backend error happened!'));
            }, 1000)
        );

        setUser(data);
    };

    const editable = true;

    return (
        <DefaultContext>
            <div style={{ width: '550px', background: 'white' }}>
                <Detail data={user} editable={editable} onChange={onChange}>
                    <DetailRowValue fixed={true} label={'Full Name'} name={'name'} validation={['required']} />
                    <DetailRowValue label={'Handle'} name={'handle'} validation={['required']} />
                    <DetailRowValue label={'Age'} name={'age'} validation={['required', minMaxAgeCheck]} />
                    <DetailRowValue label={'Embedded'} name={'embedded.value'} />
                    <DetailRowListValue
                        label={'E-mails'}
                        typeName={'E-mail'}
                        validation={['required', 'email']}
                        name={'emails'}
                    />
                    <DetailRowListValue
                        fixed={true}
                        label={'Phone numbers'}
                        typeName={'Phone number'}
                        validation={['required']}
                        name={'phones'}
                    />

                    <DetailRowListValue
                        label={'Embedded list'}
                        typeName={'Embedded entry'}
                        validation={['required']}
                        name={'embedded.list'}
                    />
                    <DetailRow label={'Very long name that doesnt fit the normal size'}>
                        Very long value that doesnt fit the normal size
                    </DetailRow>

                    <DetailButtons>
                        <Button variant={'contained'}>Change password</Button>
                        <Button variant={'contained'} color="error">
                            Disable
                        </Button>
                    </DetailButtons>
                </Detail>
            </div>
        </DefaultContext>
    );
};

export const SmallDetail = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        handle: 'myUsername',
        age: 39,
        emails: ['myfirst@email.com', 'my-other@email.com'],
        phones: ['+1 (123) 12312-123', '+45 2123321'],
    });

    const onChange = async (name, value, data) => {
        console.log('Changed', name, value);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        setUser(data);
    };

    const editable = true;

    return (
        <DefaultContext>
            <div style={{ width: '250px', background: 'white' }}>
                <Detail data={user} editable={editable} onChange={onChange} size={DetailSize.SMALL}>
                    <DetailRowValue fixed={true} label={'Full Name'} name={'name'} validation={['required']} />
                    <DetailRowValue label={'Handle'} name={'handle'} validation={['required']} />
                    <DetailRowValue label={'Age'} name={'age'} validation={['required', minMaxAgeCheck]} />
                    <DetailRowListValue
                        label={'E-mails'}
                        typeName={'E-mail'}
                        validation={['required', 'email']}
                        name={'emails'}
                    />
                    <DetailRowListValue
                        fixed={true}
                        label={'Phone numbers'}
                        typeName={'Phone number'}
                        validation={['required']}
                        name={'phones'}
                    />
                    <DetailRow label={'Very long name that doesnt fit the normal size'}>
                        Very long value that doesnt fit the normal size
                    </DetailRow>

                    <DetailButtons>
                        <Button variant={'contained'}>Change password</Button>
                        <Button variant={'contained'} color="error">
                            Disable
                        </Button>
                    </DetailButtons>
                </Detail>
            </div>
        </DefaultContext>
    );
};
