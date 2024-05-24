/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { SvgIcon, SvgIconProps } from '@mui/material';
import React, { ForwardedRef, forwardRef, useId, useState } from 'react';

export interface StormIconProps extends SvgIconProps {
    animateOnHover?: boolean;
}

export const StormIcon = forwardRef((props: StormIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    const { animateOnHover, ...rest } = props;

    const [deg, setDeg] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const animDuration = 1000;
    const spin = () => {
        if (animateOnHover && !isSpinning) {
            setIsSpinning(true);
            setDeg((prevDeg) => prevDeg - 360);
            setTimeout(() => {
                setIsSpinning(false);
            }, animDuration);
        }
    };

    return (
        <SvgIcon {...rest} ref={ref} onMouseEnter={spin}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.46455 14.4001C8.82218 14.5362 9.07105 14.0832 8.83594 13.7813C8.0917 12.8256 7.57879 11.6688 7.39443 10.3839C6.82948 6.44658 9.5633 2.79679 13.5006 2.23184C13.6159 2.2153 13.6437 2.05968 13.5372 2.01267C12.4295 1.52383 11.1758 1.3294 9.8891 1.51403C6.22949 2.03913 3.68852 5.43149 4.21359 9.09107C4.57175 11.5871 6.26372 13.5627 8.46455 14.4001ZM13.899 12.0781C13.899 13.0852 13.0826 13.9016 12.0755 13.9016C11.0683 13.9016 10.2519 13.0852 10.2519 12.0781C10.2519 11.071 11.0683 10.2546 12.0755 10.2546C13.0826 10.2546 13.899 11.071 13.899 12.0781ZM10.3618 8.8368C10.0599 9.07189 9.60688 8.82304 9.74298 8.4654C10.5804 6.26466 12.556 4.57278 15.052 4.21465C18.7116 3.68955 22.1039 6.23056 22.629 9.89014C22.8136 11.1768 22.6192 12.4305 22.1304 13.5381C22.0834 13.6447 21.9278 13.6168 21.9112 13.5015C21.3462 9.56424 17.6964 6.8304 13.7591 7.39535C12.4743 7.57971 11.3175 8.0926 10.3618 8.8368ZM15.6909 9.74472C15.3333 9.60864 15.0845 10.0616 15.3196 10.3635C16.0638 11.3193 16.5767 12.476 16.7611 13.761C17.326 17.6983 14.5922 21.3481 10.6549 21.913C10.5396 21.9296 10.5118 22.0852 10.6183 22.1322C11.726 22.621 12.9797 22.8155 14.2664 22.6308C17.926 22.1057 20.467 18.7134 19.9419 15.0538C19.5838 12.5578 17.8918 10.5821 15.6909 9.74472ZM13.7796 15.3063C14.0815 15.0712 14.5345 15.32 14.3985 15.6776C13.5613 17.8789 11.5854 19.5712 9.08912 19.9294C5.42951 20.4544 2.03715 17.9134 1.51209 14.2539C1.32742 12.9669 1.52193 11.713 2.01093 10.6052C2.05794 10.4988 2.21345 10.5266 2.22997 10.6417C2.79492 14.5791 6.44469 17.3129 10.382 16.7479C11.667 16.5636 12.8238 16.0506 13.7796 15.3063Z"
                    style={{
                        transformOrigin: '50% 50%',
                        transform: `rotate(${deg}deg)`,
                        transition: `transform ${animDuration}ms cubic-bezier(.18,.67,.46,1)`,
                    }}
                />
                <circle cx="12.0861" cy="12.0919" r="2.11538" />
            </svg>
        </SvgIcon>
    );
});
