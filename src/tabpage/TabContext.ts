import React, {Context} from "react";
import exp from "constants";

interface TabContextData  {
    currentTabId?:string
    onTabAdded:(id:string,title:string) => void
    onTabUpdated:(id:string, title:string) => void
    onTabRemoved:(id:string) => void
}

export interface TabContextType extends Context<TabContextData> {

}

const defaultValue:TabContextData  = {
    currentTabId:'',
    onTabAdded: () => { },
    onTabUpdated: () => { },
    onTabRemoved: () => { }
};

export default React.createContext(defaultValue);