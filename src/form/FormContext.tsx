import React, {Context} from "react";
import {FormContainer} from "./FormContainer";

export type ResetListener = (value: any) => void;

interface FormContextData {
    valid: boolean
    processing: boolean
    container?: FormContainer
    onReadyStateChanged: (childName: any, ready: boolean) => void;
    onValueChanged: (name: string, value: any) => void;
    onReset(name: string, callback: ResetListener): () => void;
}

export interface FormContextType extends Context<FormContextData> {

}

const defaultValue:FormContextData = {
    valid: false,
    processing: false,
    onReadyStateChanged: () => {},
    onValueChanged: () => {},
    onReset: () => { return () => {} }
};

export const FormContext:FormContextType = React.createContext(defaultValue);
