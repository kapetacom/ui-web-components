import React from 'react';
import { storiesOf } from '@storybook/react';
import {Button, ButtonSize, ButtonStyle, ButtonType, LogoButton} from '../src';

storiesOf('Buttons', module)
    .add("Buttons", () => (
        <div style={{ padding: '20px'}}>

            <Button style={ButtonStyle.PRIMARY_SHINE} width={ButtonSize.MEDIUM} text={'Sign up'}/>

            <Button style={ButtonStyle.PRIMARY} width={ButtonSize.LARGE} text={'Sign up'}/>

            <Button style={ButtonStyle.SECONDARY} width={ButtonSize.SMALL} text={'Log in'}/>

            <br/><br/>

            <Button style={ButtonStyle.DEFAULT} width={ButtonSize.HUGE} text={'Huge big button with lots of text'}/>

            <Button text={'Default'}/>

            <br/><br/>

            <Button style={ButtonStyle.DANGER} width={ButtonSize.MEDIUM} text={'Dont do this!'} />

            <Button style={ButtonStyle.DANGER} disabled={true} width={ButtonSize.MEDIUM} text={'Disabled!'} />

            <br/><br/>

            <LogoButton logo={"/google.svg"} width={ButtonSize.MEDIUM} text={'Google'} href={'#'} />

            <LogoButton logo={"/github.svg"} width={ButtonSize.MEDIUM} text={'Github'} href={'#'} />

            <LogoButton logo={"/microsoft.svg"} width={ButtonSize.MEDIUM} text={'Microsoft'} href={'#'} />
        </div>
    ));

