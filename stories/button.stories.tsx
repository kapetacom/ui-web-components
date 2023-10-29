/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Actions, Button, ButtonShape, ButtonSize, ButtonStyle, LogoButton } from '../src';

export default {
    title: 'Buttons',
};

export const HexagonButtons = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Button style={ButtonStyle.PRIMARY_SHINE} width={ButtonSize.MEDIUM} text={'Sign up'} />

            <Button style={ButtonStyle.PRIMARY} width={ButtonSize.LARGE} text={'Sign up'} />

            <Button style={ButtonStyle.SECONDARY} width={ButtonSize.SMALL} text={'Log in'} />

            <br />
            <br />

            <Button style={ButtonStyle.DEFAULT} width={ButtonSize.HUGE} text={'Huge big button with lots of text'} />

            <Button text={'Default'} />

            <br />
            <br />

            <Button style={ButtonStyle.DANGER} width={ButtonSize.MEDIUM} text={'Dont do this!'} />

            <Button style={ButtonStyle.DANGER} disabled={true} width={ButtonSize.MEDIUM} text={'Disabled!'} />
        </div>
    );
};

export const LogoButtons = () => {
    return (
        <div style={{ padding: '20px' }}>
            <LogoButton logo={'/google.svg'} width={ButtonSize.MEDIUM} text={'Google'} href={'#'} />

            <LogoButton logo={'/github.svg'} width={ButtonSize.MEDIUM} text={'Github'} href={'#'} />

            <LogoButton logo={'/microsoft.svg'} width={ButtonSize.MEDIUM} text={'Microsoft'} href={'#'} />
        </div>
    );
};

export const IconButtons = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Button shape={ButtonShape.ICON} style={ButtonStyle.DEFAULT} width={ButtonSize.ICON} text={'fad fa-eye'} />
            <Button shape={ButtonShape.ICON} style={ButtonStyle.DANGER} width={ButtonSize.ICON} text={'fad fa-eye'} />
            <Button shape={ButtonShape.ICON} style={ButtonStyle.SECONDARY} width={ButtonSize.ICON} text={'fa fa-eye'} />
            <Button shape={ButtonShape.ICON} style={ButtonStyle.PRIMARY} width={ButtonSize.ICON} text={'fa fa-eye'} />
            <Button
                shape={ButtonShape.ICON}
                style={ButtonStyle.PRIMARY_SHINE}
                width={ButtonSize.ICON}
                text={'fad fa-eye'}
            />
            <br />
            <br />
            <Button shape={ButtonShape.ICON} width={ButtonSize.MEDIUM} text={'fad fa-eye'} />

            <br />
            <br />
            <Button shape={ButtonShape.ICON} width={ButtonSize.LARGE} text={'fad fa-eye'} />

            <br />
            <br />
            <Button shape={ButtonShape.ICON} width={ButtonSize.HUGE} text={'fad fa-eye'} />
        </div>
    );
};

export const SquareButtons = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Button shape={ButtonShape.SQUARE} style={ButtonStyle.DEFAULT} width={ButtonSize.SMALL} text={'Save'} />
            <Button shape={ButtonShape.SQUARE} style={ButtonStyle.DANGER} width={ButtonSize.SMALL} text={'Save'} />
            <Button shape={ButtonShape.SQUARE} style={ButtonStyle.SECONDARY} width={ButtonSize.SMALL} text={'Save'} />
            <Button shape={ButtonShape.SQUARE} style={ButtonStyle.PRIMARY} width={ButtonSize.SMALL} text={'Save'} />
            <Button
                shape={ButtonShape.SQUARE}
                style={ButtonStyle.PRIMARY_SHINE}
                width={ButtonSize.SMALL}
                text={'Save'}
            />
            <br />
            <br />
            <Button shape={ButtonShape.SQUARE} width={ButtonSize.MEDIUM} text={'Do something'} />

            <br />
            <br />
            <Button shape={ButtonShape.SQUARE} width={ButtonSize.LARGE} text={'Do something'} />

            <br />
            <br />
            <Button shape={ButtonShape.SQUARE} width={ButtonSize.HUGE} text={'Do something'} />
        </div>
    );
};

export const ActionsList = () => {
    return (
        <div style={{ width: '550px', border: '1px solid black' }}>
            <Actions>
                <Button
                    shape={ButtonShape.ICON}
                    style={ButtonStyle.DEFAULT}
                    width={ButtonSize.ICON}
                    text={'fad fa-eye'}
                />
                <Button
                    shape={ButtonShape.ICON}
                    style={ButtonStyle.DANGER}
                    width={ButtonSize.ICON}
                    text={'fad fa-eye'}
                />
                <Button
                    shape={ButtonShape.ICON}
                    style={ButtonStyle.SECONDARY}
                    width={ButtonSize.ICON}
                    text={'fa fa-eye'}
                />
                <Button
                    shape={ButtonShape.ICON}
                    style={ButtonStyle.PRIMARY}
                    width={ButtonSize.ICON}
                    text={'fa fa-eye'}
                />
            </Actions>
        </div>
    );
};
