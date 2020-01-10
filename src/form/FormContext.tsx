import React, {Context} from "react";
import {FormContainer} from "./FormContainer";

interface FormContextData {
    valid: boolean
    container?: FormContainer
    onReadyStateChanged: (childName: any, ready: boolean) => void;
}

interface FormContextData {
    valid: boolean
    container?: FormContainer
    onReadyStateChanged: (childName: any, ready: boolean) => void;
}

export interface FormContextType extends Context<FormContextData> {

}

const defaultValue:FormContextData = {
    valid: false,
    onReadyStateChanged: () => {}
};

export const FormContext:FormContextType = React.createContext(defaultValue);
