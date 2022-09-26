import React from 'react';
import {storiesOf} from '@storybook/react';
import {DataTypeEditor, MethodEditor} from "../src";

const REST_METHODS = `someMethod(@Path id:string, @Header[X-Request-ID] requestId:string):void
GET /some/method/{id}

otherMethod(@Query[full_name] fullName:string, @Cookie[myCookie] cookieId:string):void
GET /some/method/{id}

thirdOne():void
GET /some/method/{id}`;

const METHODS = `someMethod(id:string, requestId:string):void

otherMethod(fullName:string, cookieId:string):void

thirdOne():void`;

const DATA_TYPES = `myDataType {
    myId:string
    
    myOtherValue:number[]
    
    test:myDataType[]
    
    subType: {
        subId:string
        multiSub: [{
            entryId:string
        }]
        afterMultiSub:boolean
    }
    
    betweenTypes:string
    
    secondSubType: {
        otherId:number
    }
    
    lastFieldValue:Date
}

EmptyType {}

SimplerType {
    firstName:string
    lastName:string
    age:number
}`;

storiesOf('Definition Editors', module)

    .add("REST Method Editor", () => (
        <div>
            <MethodEditor value={REST_METHODS} restMethods={true} />
        </div>
    ))
    .add("Method Editor", () => (
        <div>
            <MethodEditor value={METHODS}  />
        </div>
    ))
    .add("Data Type Editor", () => (
        <div>
            <DataTypeEditor value={DATA_TYPES} />
        </div>
    ))


