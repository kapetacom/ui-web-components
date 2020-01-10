import {observable, action, computed} from 'mobx';


export class DialogControlImpl {

  private static instance: DialogControlImpl;

  @observable
  text: string;

  @observable
  title: string;

  @observable
  ok: () => void;

  @observable
  private _open: boolean;

  constructor() {
    this.title = "";

    this.ok = () => { console.log("no Accept functionality was given") };
    this.text = "";
    this._open = false;
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
  setAcceptAction = (success: () => void) => {
    this.ok = () => {
      success();
      this.hide();
    };
  };

  @action
  setTitle = (newTitle: string) => {
    this.title = newTitle;
  };

  @action
  setText = (newText: string) => {
    this.text = newText;
  };


  @action
  show = (title?: string, text?: string, callback?: () => void) => {
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