import React, { useState } from 'react';
import { MuiOtpInput, MuiOtpInputProps } from 'mui-one-time-password-input';

export type OTPInputProps = MuiOtpInputProps;

export const OTPInput = (props: OTPInputProps) => {
    const length = props.length || 6;
    const gap = props.gap || 1;

    const [value, setValue] = useState<string>('');

    return (
        <MuiOtpInput
            value={value}
            onChange={setValue}
            {...props}
            length={length}
            gap={gap}
            sx={{
                ...props.sx,
                maxWidth: `calc(${length} * 3em)`,
                '.MuiOtpInput-TextField input': {
                    p: 1,
                },
            }}
        />
    );
};
