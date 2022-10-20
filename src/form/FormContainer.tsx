import React from "react";
import _ from 'lodash';
import "./FormContainer.less";

import {FormContext, FormContextType, ResetListener} from './FormContext';
import {toClass} from "@blockware/ui-web-utils";

export type FormChangeHandler = (formState: FormStateChangeEvent) => void;

export interface FormStateChangeEvent {
    type: string
    value: any
}

export type FormData = { [key: string]: any };

interface Props {
    onSubmit?: () => void
    onReset?: () => void
    initialValue?: FormData,
    onSubmitData?: (data: FormData) => void
    onChange?: (data: FormData) => void
    children: any
}

interface State {
    readyStates: { [key: string]: boolean }
    valid: boolean
    processing: boolean
}

export class FormContainer extends React.Component<Props, State> {

    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    container: HTMLDivElement | null = null;

    private readonly submitClickHandler: EventListenerObject;

    private readonly resetClickHandler: EventListenerObject;

    private readonly changeHandlers: FormChangeHandler[] = [];

    private readonly resetListeners: { [key: string]: ResetListener[] } = {};

    private formData: FormData = {};


    constructor(props: any) {
        super(props);

        this.formData = props.initialValue ? {...props.initialValue} : {};

        this.state = {
            readyStates: {},
            processing: false,
            valid: true
        };

        this.submitClickHandler = {
            handleEvent: (evt: MouseEvent) => {
                this.handleSubmitClick(evt);
            }
        };

        this.resetClickHandler = {
            handleEvent: (evt: MouseEvent) => {
                this.handleResetClick(evt);
            }
        };
    }

    public getValue(name: string): any {
        if (name in this.formData) {
            return this.formData[name];
        }
        return '';
    }

    private onValueChanged(name: string, value: any) {
        this.formData[name] = value;
        this.emitChange();
    }

    private onReadyStateChanged(fieldName: string, ready: boolean) {
        this.setState((state: State) => {
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
        const evt: FormStateChangeEvent = {
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
            const ix = this.changeHandlers.indexOf(handler);
            if (ix > -1) {
                this.changeHandlers.splice(ix, 1);
            }
        };
    }

    private addResetListener(name: string, callback: ResetListener): () => void {
        if (!this.resetListeners[name]) {
            this.resetListeners[name] = [];
        }

        this.resetListeners[name].push(callback);

        return () => {
            if (!this.resetListeners[name]) {
                return;
            }
            const ix = this.resetListeners[name].indexOf(callback);
            if (ix > -1) {
                this.resetListeners[name].splice(ix, 1);
            }
        }
    }

    private renderFormContainer() {
        const className = toClass({
            'form-container': true,
            'valid':this.state.valid,
            'invalid':!this.state.valid,
            'processing':this.state.processing
        });

        return (
            <div className={className}
                 form-container="true"
                 ref={(container) => this.container = container}
                 onKeyPress={(evt) => this.handleKeyPress(evt)}>
                {this.props.children}
            </div>
        )
    }

    private async processingWhile(callback) {
        this.setState({processing: true});
        try {
            await callback();
        } finally {
            this.setState({processing: false});
        }
    }

    private shouldSubmitForm() {
        if (!this.props.onSubmit &&
            !this.props.onSubmitData) {
            return true;
        }

        return false;
    }

    public async submit() {

        if (!this.state.valid) {
            this.emitFormStateChange('submit', false);
            return;
        }

        if (this.shouldSubmitForm()) {
            this.emitFormStateChange('submit', true);
            const formElm = this.container.closest('form');
            if (formElm) {
                formElm.submit()
            }
            return;
        }

        try {
            await this.processingWhile(async () => {
                if (this.props.onSubmit) {
                    await this.props.onSubmit();
                }

                if (this.props.onSubmitData) {
                    await this.props.onSubmitData({...this.formData});
                }

                this.emitFormStateChange('submit', true);
            })

        } catch (e) {
            this.emitFormStateChange('submit_failed', e);
        }
    }

    private emitChange() {
        if (this.props.onChange) {
            this.props.onChange({...this.formData});
        }
    }

    public reset() {
        const originalData = this.props.initialValue || {};
        Object.entries(this.resetListeners).forEach(([name, listeners]) => {
            listeners.forEach(listener => {
                listener(originalData[name] || '');
            });
        })

        this.formData = {...originalData};
        this.emitChange();

        if (this.props.onReset) {
            this.props.onReset();
        }

        this.emitFormStateChange('reset', true);
    }

    private handleResetClick(evt: MouseEvent): void {
        if (this.props.onSubmit ||
            this.props.onSubmitData) {
            //Otherwise let the native form handle this
            evt.stopPropagation();
            evt.preventDefault();
        }

        this.reset();
    }

    private async handleSubmitClick(evt: MouseEvent): Promise<void> {
        if (this.props.onSubmit ||
            this.props.onSubmitData ||
            !this.state.valid) {
            //Otherwise let the native form handle this
            evt.stopPropagation();
            evt.preventDefault();
        }

        if (!(evt.target instanceof HTMLElement)) {
            return;
        }

        await this.submit();
    }

    private async handleKeyPress(evt: React.KeyboardEvent<HTMLElement>): Promise<void> {
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

        await this.submit();
    }

    private bindButtons() {
        if (!this.container) {
            return;
        }

        const buttonSelector = [
            'button:not([type=button]):not([form-bound])',
            'input[type=submit]:not([form-bound])',
            'input[type=image]:not([form-bound])',
            '.blockware-button.submit:not([form-bound])'
        ];

        const buttons = this.container.querySelectorAll(buttonSelector.join(','));

        if (buttons.length < 1) {
            return;
        }

        const subContainers = this.container.querySelectorAll('div.form-container[form-container]');

        buttons.forEach((btn) => {
            for (let i = 0; i < subContainers.length; i++) {
                if (subContainers[i].contains(btn)) {
                    return;
                }
            }

            const isReset = btn.matches('[type=reset],.blockware-button.reset')

            btn.setAttribute('form-bound', 'true');
            btn.addEventListener('click', isReset ? this.resetClickHandler : this.submitClickHandler);
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

        const firstUnready: HTMLInputElement | null = this.container.querySelector('.form-row.unready input[type=text]');
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
                    processing: this.state.processing,
                    container: this,
                    onReadyStateChanged: (fieldName: string, ready: boolean) => this.onReadyStateChanged(fieldName, ready),
                    onValueChanged: (name, value) => this.onValueChanged(name, value),
                    onReset: (name: string, callback: (value) => void) => this.addResetListener(name, callback)
                }}>
                    {this.renderFormContainer()}
                </FormContext.Provider>
            </>
        )
    }
}