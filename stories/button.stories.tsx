import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, ButtonType } from '../src';

storiesOf('Buttons', module)
    .add("Simple hexagon button", () => (
        <div style={{ width: window.innerWidth, height: window.innerHeight}}>
           <Button buttonType={ButtonType.PROCEED} disabled width={80}  text="Yes" />
           <Button buttonType={ButtonType.PROCEED} width={80}  text="Yes" />
           <Button buttonType={ButtonType.PROCEED_CYAN} width={80}  text="Yes" />
           <Button buttonType={ButtonType.CANCEL} text="Cancel" width={80} />
           <Button buttonType={ButtonType.CANCEL_TRANSPARENT} text="Cancel" width={80} />
           <Button buttonType={ButtonType.CANCEL} text="Text defined width that can be infinitely long " />
           <Button text="Text defined width but with even more text with 0 radius" onClick={()=>{alert("action mate")}} />
           <Button text="Width defined size but with even more text" onClick={()=>{alert("action mate")}} disabled width={300} />
        </div>
    ));

