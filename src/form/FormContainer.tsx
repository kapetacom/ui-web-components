/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import _, { cloneDeep } from 'lodash';
import './FormContainer.less';

import { FormContext, FormContextType, ResetListener } from './FormContext';
import { toClass } from '@kapeta/ui-web-utils';
import { ValidatorList } from '../validation/Validators';

export type FormChangeHandler = (formState: FormStateChangeEvent) => void;

export interface FormStateChangeEvent {
    type: string;
    value: any;
}

export type FormData = { [key: string]: any };

export interface FormContainerProps<TData> {
    onSubmit?: () => void | Promise<void>;
    onReset?: () => void;
    validators?: ValidatorList;
    initialValue?: TData;
    onSubmitData?: (data: TData) => void | Promise<void>;
    onChange?: (data: TData) => void;
    children: any;
}

interface State<TData> {
    formData: TData;
    readyStates: { [key: string]: boolean };
    valid: boolean;
    processing: boolean;
    isDirty: boolean;
}

export class FormContainer<TData extends FormData = any> extends React.Component<
    FormContainerProps<TData>,
    State<TData>
> {
    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    container: HTMLDivElement | null = null;

    private readonly submitClickHandler: EventListenerObject;

    private readonly resetClickHandler: EventListenerObject;

    private readonly changeHandlers: FormChangeHandler[] = [];

    private readonly resetListeners: { [key: string]: ResetListener[] } = {};

    constructor(props: FormContainerProps<TData>) {
        super(props);

        this.submitClickHandler = {
            handleEvent: (evt: MouseEvent) => {
                this.handleSubmitClick(evt);
            },
        };

        this.resetClickHandler = {
            handleEvent: (evt: MouseEvent) => {
                this.handleResetClick(evt);
            },
        };

        this.state = {
            formData: props.initialValue ? cloneDeep(props.initialValue) : ({} as TData),
            readyStates: {},
            processing: false,
            valid: true,
            // In order to know if a form is dirty we compare initialValue with formData. If the
            // initialValue is not set then we consider the form dirty by default.
            isDirty: props.initialValue ? false : true,
        };
    }

    public getValue(name: string): any {
        if (_.has(this.state.formData, name)) {
            return _.get(this.state.formData, name);
        }

        return '';
    }

    private onValueChanged(name: string, value: any) {
        this.setState(
            (state) => {
                const nextState: State<TData> = {
                    ...state,
                    formData: _.set({ ...state.formData }, name, value),
                };
                if (this.props.initialValue) {
                    const equals = _.isEqual(this.props.initialValue, nextState.formData);
                    nextState.isDirty = !equals;
                }
                return nextState;
            },
            () => this.emitChange()
        );
    }

    private onReadyStateChanged(fieldName: string, ready: boolean) {
        if (this.state.readyStates[fieldName] === ready) {
            //If state didnt change - do nothing
            return;
        }

        this.setState((state: State<TData>) => {
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
            if (readyStates.hasOwnProperty(propertyId) && readyStates[propertyId] === false) {
                return false;
            }
        }

        return true;
    }

    private emitFormStateChange(type: string, value: any) {
        const evt: FormStateChangeEvent = {
            type,
            value,
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
        };
    }

    private renderFormContainer() {
        const className = toClass({
            'form-container': true,
            valid: this.state.valid,
            invalid: !this.state.valid,
            processing: this.state.processing,
        });

        return (
            <div
                className={className}
                form-container="true"
                ref={(container) => (this.container = container)}
                onKeyPress={(evt) => this.handleKeyPress(evt)}
            >
                {this.props.children}
            </div>
        );
    }

    private async processingWhile(callback: () => Promise<void>) {
        this.setState({ processing: true });
        try {
            await callback();
        } finally {
            this.setState({ processing: false });
        }
    }

    private shouldSubmitForm() {
        if (!this.props.onSubmit && !this.props.onSubmitData) {
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
            const formElm = this.container?.closest('form');
            if (formElm) {
                formElm.submit();
            }
            return;
        }

        try {
            await this.processingWhile(async () => {
                if (this.props.onSubmit) {
                    await this.props.onSubmit();
                }

                if (this.props.onSubmitData) {
                    await this.props.onSubmitData(cloneDeep(this.state.formData));
                }

                this.emitFormStateChange('submit', true);
            });
        } catch (e) {
            this.emitFormStateChange('submit_failed', e);
        }
    }

    private emitChange() {
        if (this.props.onChange) {
            //Emit a frozen copy of the form data to prevent consumers from mutating it
            this.props.onChange(Object.freeze({ ...this.state.formData }));
        }
    }

    public reset() {
        const originalData = this.props.initialValue ? cloneDeep(this.props.initialValue) : ({} as TData);
        Object.entries(this.resetListeners).forEach(([name, listeners]) => {
            listeners.forEach((listener) => {
                listener(_.has(originalData, name) ? _.get(originalData, name) : '');
            });
        });
        this.setState({ formData: originalData }, () => {
            this.emitChange();

            if (this.props.onReset) {
                this.props.onReset();
            }

            this.emitFormStateChange('reset', true);
        });
        if (this.props.initialValue) {
            this.setState({ isDirty: false });
        }
    }

    private handleResetClick(evt: MouseEvent): void {
        if (this.props.onSubmit || this.props.onSubmitData) {
            //Otherwise let the native form handle this
            evt.stopPropagation();
            evt.preventDefault();
        }

        this.reset();
    }

    private async handleSubmitClick(evt: MouseEvent): Promise<void> {
        if (this.props.onSubmit || this.props.onSubmitData || !this.state.valid) {
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

        if (evt.key !== 'Enter') {
            //Only handle enter press
            return;
        }

        if (!(evt.target instanceof HTMLElement)) {
            return;
        }

        if (!evt.target.matches('input,select,textarea')) {
            return;
        }

        if (evt.target.matches('textarea') && !evt.metaKey && !evt.ctrlKey) {
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
            '.kapeta-button.submit:not([form-bound])',
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

            const isReset = btn.matches('[type=reset],.kapeta-button.reset');

            btn.setAttribute('form-bound', 'true');
            btn.addEventListener('click', isReset ? this.resetClickHandler : this.submitClickHandler);
        });
    }

    private hasParentContainer(): boolean {
        return !!this.context.container && this.context.container !== this;
    }

    private focusFirstUnready() {
        if (!this.container) {
            return;
        }

        if (this.hasParentContainer()) {
            return;
        }

        const firstUnready: HTMLInputElement | null = this.container.querySelector(
            '.form-row.unready input[type=text]'
        );
        if (firstUnready) {
            firstUnready.focus();
        }
    }

    componentDidMount() {
        this.bindButtons();
        this.focusFirstUnready();
    }

    componentDidUpdate(prevProps: FormContainerProps<TData>) {
        this.bindButtons();

        if (this.props.initialValue !== prevProps.initialValue) {
            //Reset form whenever initialValue changes.
            this.reset();
        }
    }

    render() {
        return (
            <>
                <FormContext.Provider
                    value={{
                        valid: this.state.valid,
                        validators: this.props.validators,
                        processing: this.state.processing,
                        isDirty: this.state.isDirty,
                        container: this,
                        onReadyStateChanged: (fieldName: string, ready: boolean) =>
                            this.onReadyStateChanged(fieldName, ready),
                        onValueChanged: (name, value) => this.onValueChanged(name, value),
                        onReset: (name: string, callback: (value: any) => void) =>
                            this.addResetListener(name, callback),
                    }}
                >
                    {this.renderFormContainer()}
                </FormContext.Provider>
            </>
        );
    }
}
