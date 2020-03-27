import React from "react";
import _ from 'lodash';
import "./FormContainer.less";

import {FormContext, FormContextType} from './FormContext';

export type FormChangeHandler = (formState: FormStateChangeEvent) => void;

export interface FormStateChangeEvent {
    type: string
    value: any
}


interface FormContainerProps {
    onSubmit?: () => void
    onReset?: () => void
    children: any[]
}

export class FormContainer extends React.Component<FormContainerProps, any> {

    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    container: HTMLDivElement | null = null;

    private readonly clickEventHandler: EventListenerObject;

    private readonly changeHandlers:FormChangeHandler[] = [];

    constructor(props: any) {
        super(props);

        this.state = {
            readyStates: {},
            valid: true
        };

        this.clickEventHandler = {
            handleEvent: (evt:MouseEvent) => {
                this.handleButtonClick(evt);
            }
        };
    }

    private onReadyStateChanged(fieldName: string, ready: boolean) {
        this.setState((state: any) => {
            state.readyStates[fieldName] = ready;
            state.valid = this.isValid(state.readyStates);
            return state;
        });
    }

    private isValid(readyStates: any) {
        if (_.isEmpty(readyStates)) {
            return false;
        }

        for (let propertyId in readyStates) {
            if (readyStates.hasOwnProperty(propertyId) &&
                readyStates[propertyId] === false) {
                return false;
            }
        }

        return true;
    }

    private emitFormStateChange(type: string, value: any) {
        const evt:FormStateChangeEvent = {
            type,
            value
        };

        this.changeHandlers.forEach((handler) => {
            handler(evt);
        });
    }

    public onFormStateChanged(handler: FormChangeHandler) {
        this.changeHandlers.push(handler);

        return () => {
            var ix = this.changeHandlers.indexOf(handler);
            if (ix > -1)  {
                this.changeHandlers.splice(ix, 1);
            }
        };
    }

    private renderFormContainer() {
        return (
            <div className={'form-container'}
                 form-container="true"
                 ref={(container) => this.container = container}
                 onKeyPress={(evt) => this.handleKeyPress(evt)}>
                {this.props.children}
            </div>
        )
    }

    public submit() {
        if (!this.state.valid) {
            this.emitFormStateChange('submit', false);
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }

        this.emitFormStateChange('submit', true);
    }

    public reset() {
        this.setState({valid:false});

        if (this.props.onReset) {
            this.props.onReset();
        }

        this.emitFormStateChange('reset', true);
    }

    private handleButtonClick(evt: MouseEvent): void {
        evt.stopPropagation();
        evt.preventDefault();

        this.submit();
    }

    private handleKeyPress(evt: React.KeyboardEvent<HTMLElement>): void {
        evt.stopPropagation();

        if (evt.which !== 13) {
            //Only handle enter press
            return;
        }

        if (!(evt.target instanceof HTMLElement)) {
            return;
        }

        if (!evt.target.matches('input,select,textarea')) {
            return;
        }

        if (evt.target.matches('textarea') &&
            !evt.metaKey &&
            !evt.ctrlKey) {
            //Only submit if meta or ctrl is pressed when pressing enter
            return;
        }

        this.submit();
    }

    private bindButtons() {
        if (!this.container) {
            return;
        }

        const buttonSelector = [
            'button:not([type=button]):not([form-bound])',
            'input[type=submit]:not([form-bound])',
            'input[type=image]:not([form-bound])',
            '.blockware-button.submit'
        ];

        const buttons = this.container.querySelectorAll(buttonSelector.join(','));

        if (buttons.length < 1) {
            return;
        }

        const subContainers = this.container.querySelectorAll('div.form-container[form-container]');

        buttons.forEach((btn) => {
            for(let i = 0; i < subContainers.length; i++) {
                if (subContainers[i].contains(btn)) {
                    return;
                }
            }

            btn.setAttribute('form-bound', 'true');
            btn.addEventListener('click', this.clickEventHandler);
        });
    }

    private hasParentContainer() {
        return (this.context.container && this.context.container !== this);
    }

    private focusFirstUnready() {
        if (!this.container) {
            return;
        }

        if (this.hasParentContainer()) {
            return;
        }

        const firstUnready:HTMLInputElement|null = this.container.querySelector('.form-row.unready input[type=text]');
         if (firstUnready) {
             firstUnready.focus();
        }
    }

    componentDidMount() {
        this.bindButtons();
        this.focusFirstUnready();
    }

    componentDidUpdate() {
        this.bindButtons();
    }

    render() {

        return (
            <>
                <FormContext.Provider value={{
                    valid: this.state.valid,
                    container: this,
                    onReadyStateChanged: (fieldName: string, ready: boolean) => this.onReadyStateChanged(fieldName, ready)
                }}>
                    {this.renderFormContainer()}
                </FormContext.Provider>
            </>
        )
    }
}