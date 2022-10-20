import {observable, action, computed, makeObservable} from 'mobx';
import {DialogTypes} from "./DialogTypes";
import {Type as PromptDialogInputType} from '../form/inputs/FormInput';

export {PromptDialogInputType as PromptInputType};
export class DialogControlImpl {

  private static instance: DialogControlImpl;

  @observable
  type: DialogTypes | null;

  @observable
  promptInputType : PromptDialogInputType;

  @observable
  text: string;

  @observable
  title: string;

  @observable
  ok: () => void;

  @observable
  private _open: boolean;

  @observable
  promptInputValue: string | null =null;

  constructor() {
    this.type = null;
    this.promptInputType= PromptDialogInputType.TEXT;
    this.title = "";

    this.ok = () => { console.log("no Accept functionality was given") };
    this.text = "";
    this._open = false;
    makeObservable(this);
  }

  public static fetchInstance(): DialogControlImpl {
    if (!DialogControlImpl.instance) {
      DialogControlImpl.instance = new DialogControlImpl();
    }
    return DialogControlImpl.instance;
  }


  @action
  close = () => {
    this.hide()
  };

  @action
  setAcceptAction = (success: (promptInputValue?: any ) => void) => {
    this.ok = () => {
      if(DialogControl.type && DialogControl.type === DialogTypes.PROMPT){
        success(this.promptInputValue)
      } else {
        success();
      }
      this.hide();
    };
  };

  @action
  setPromptInputValue = ( newValue: any) =>{
    this.promptInputValue = newValue;
  }
  @action
  setType = (newType: DialogTypes | null)=> {
    this.type = newType;
  }
  @action
  setTitle = (newTitle: string) => {
    this.title = newTitle;
  };

  @action
  setText = (newText: string) => {
    this.text = newText;
  };


  @action
  show = ( title?: string, text?: string, callback?: (promptInputValue?: string | null) => void, type?: DialogTypes, promptInputType?: PromptDialogInputType) => {
    if(type){
      this.type= type;
    }
    if(promptInputType){
      this.promptInputType = promptInputType;
    }
    if (title) {
      this.title = title;
    }
    if (text) {
      this.text = text;
    }
    if (callback) {
      this.setAcceptAction(callback);
    }
    this._open = true;
  };

  @action
  hide = () => {// clean the dialog on close
    this.setType(null);
    this.setPromptInputValue(null);
    this.setText("");
    this.setTitle("");
    this.setAcceptAction(()=>{});
      this._open = false;
  };

  @computed
  get open() {
    return this._open;
  }
}

export const DialogControl = DialogControlImpl.fetchInstance();