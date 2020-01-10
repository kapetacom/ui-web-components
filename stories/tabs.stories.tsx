import React from 'react';
import { storiesOf } from '@storybook/react';
import {TabContainer, TabPage} from "../src";

storiesOf('Tab Pages', module)
    .add("Normal", () => (
        <div style={{ width: "700px", padding: '10px' }}>
            <TabContainer defaultTab={'second'}>
                <TabPage id={'first'} title={'First Tab'}>
                    First tab page
                </TabPage>
                <TabPage id={'second'} title={'Second Tab'}>
                    Second tab page
                </TabPage>
                <TabPage id={'third'} title={'Third Tab'}>
                    Third tab page
                </TabPage>
            </TabContainer>
        </div>
    ));

