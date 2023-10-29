/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { FormContext, FormContextType } from './FormContext';

interface FormReadyHandlerProps {
    name: string;
    ready: boolean;
    children: any;
}

/**
 * For sending a custom ready state to a form container.
 * Ready state means whether parts of a form is valid or not.
 */
export class FormReadyHandler extends React.Component<FormReadyHandlerProps> {
    static contextType = FormContext;
    context!: React.ContextType<FormContextType>;

    private readyState?: boolean;

    private updateReadyState() {
        if (this.readyState !== this.props.ready) {
            this.readyState = this.props.ready;
            this.context.onReadyStateChanged(this.props.name, this.props.ready);
        }
    }

    componentDidMount() {
        this.updateReadyState();
    }

    componentDidUpdate() {
        this.updateReadyState();
    }

    componentWillUnmount() {
        this.context.onReadyStateChanged(this.props.name, true);
    }

    render() {
        return <>{this.props.children}</>;
    }
}
