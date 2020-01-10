import React, {Context} from "react";

export interface StackContextData  {
    currentStackId?:string
    onStackAdded:(id:string, title:string) => void
    onStackUpdated:(id:string, title:string) => void
    onStackRemoved:(id:string) => void
}

export interface StackContextType extends Context<StackContextData> {

}

const defaultValue:StackContextData  = {
    currentStackId:'',
    onStackAdded: () => { },
    onStackUpdated: () => { },
    onStackRemoved: () => { }
};

export default React.createContext(defaultValue);
