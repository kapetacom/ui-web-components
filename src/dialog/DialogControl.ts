import { action, computed, makeObservable, observable } from 'mobx';
import { DialogTypes } from './DialogTypes';
import { Type } from '../form/inputs/FormInput';

export class DialogControlImpl {
    private static instance: DialogControlImpl;

    @observable
    type: DialogTypes | null;

    @observable
    promptInputType: Type;

    @observable
    promptInputValue: string | null = null;

    @observable
    text: string;

    @observable
    title: string;

    @observable
    accept: () => void;

    @observable
    private reject: () => void;

    @observable
    private _open: boolean;

    constructor() {
        this.type = null;
        this.promptInputType = Type.TEXT;
        this.title = '';

        this.accept = () => {
            console.log('no accept functionality was given');
        };
        this.reject = () => {
            this.close();
        };
        this.text = '';
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
        this.reject();
        this.hide();
    };

    @action
    setCallback = (callback: (result?: any) => void) => {
        this.accept = () => {
            if (DialogControl.type && DialogControl.type === DialogTypes.PROMPT) {
                callback(this.promptInputValue);
            } else if (DialogControl.type && DialogControl.type === DialogTypes.DELETE) {
                callback(true);
            } else if (DialogControl.type && DialogControl.type === DialogTypes.CONFIRMATION) {
                callback(true);
            } else {
                callback();
            }
            this.hide();
        };

        this.reject = () => {
            if (DialogControl.type && DialogControl.type === DialogTypes.CONFIRMATION) {
                callback(false);
            } else if (DialogControl.type && DialogControl.type === DialogTypes.DELETE) {
                callback(false);
            }
        };
    };

    @action
    setPromptInputValue = (newValue: any) => {
        this.promptInputValue = newValue;
    };
    @action
    setType = (newType: DialogTypes | null) => {
        this.type = newType;
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
    show = (
        title?: string,
        text?: string,
        callback?: (result?: string | boolean | null) => void,
        type?: DialogTypes,
        promptInputType?: Type
    ) => {
        if (type) {
            this.type = type;
        }
        if (promptInputType) {
            this.promptInputType = promptInputType;
        }
        if (title) {
            this.title = title;
        }
        if (text) {
            this.text = text;
        }
        if (callback) {
            this.setCallback(callback);
        }
        this._open = true;
    };

    @action
    confirm(title: string, text: string, callback: (result: boolean) => void) {
        this.show(title, text, callback, DialogTypes.CONFIRMATION);
    }

    @action
    delete(title: string, text: string, callback: (result: boolean) => void) {
        this.show(title, text, callback, DialogTypes.DELETE);
    }

    @action
    prompt(title: string, text: string, callback: (result: any) => void, fieldType: Type = Type.TEXT) {
        this.show(title, text, callback, DialogTypes.PROMPT, fieldType);
    }

    @action
    private hide = () => {
        // clean the dialog on close
        this.setType(null);
        this.setPromptInputValue(null);
        this.setText('');
        this.setTitle('');
        this.setCallback(() => {});
        this._open = false;
    };

    @computed
    get open() {
        return this._open;
    }
}

export const DialogControl = DialogControlImpl.fetchInstance();

export const showPrompt = (title: string, text: string, fieldType: Type = Type.TEXT): Promise<any> => {
    return new Promise((resolve) => {
        DialogControl.prompt(title, text, resolve, fieldType);
    });
};

export const showConfirm = (title: string, text: string): Promise<boolean> => {
    return new Promise((resolve) => {
        DialogControl.confirm(title, text, resolve);
    });
};

export const showDelete = (title: string, text: string): Promise<boolean> => {
    return new Promise((resolve) => {
        DialogControl.delete(title, text, resolve);
    });
};
