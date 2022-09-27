import React from 'react';
import {storiesOf} from '@storybook/react';
import {MethodEditor, DataTypeEditor} from "../src";

const REST_METHODS = `
#Do something with the token
#and describe on multiple lines
@GET('/some/{token_path}')
@More
@Annotations ( "TEST" )
test(@Path("test") @More(castle) @third(123.321) token_id:string,@Path('token_id') other:number ):void

//More things related to token
@POST('/some/{else}')
test2(@Path token_id:string, @Path(more) other:number ):void`;

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


