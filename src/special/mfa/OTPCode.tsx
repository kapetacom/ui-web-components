/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import OtpInput from 'react18-input-otp';
import React from 'react';

interface OTPCodeProps {
    name?: string;
    value?: string | null;
    ['data-value']?: string;
    onChange?: (otp: string) => void;
}

import './OTPCode.less';

/**
 * @deprecated Use OTPInput instead
 */
export const OTPCode = (props: OTPCodeProps) => {
    const value = props.value ? props.value : '';

    return (
        <div className={'otp-code'}>
            <input type={'hidden'} name={props.name} value={value} />
            <OtpInput
                containerStyle={'otp-code-container'}
                className={'number'}
                isInputNum={true}
                numInputs={6}
                value={value}
                onChange={props.onChange}
            />
        </div>
    );
};
