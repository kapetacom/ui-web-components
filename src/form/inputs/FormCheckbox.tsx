import React from 'react';
import { toClass } from '@kapeta/ui-web-utils';
import { FormRow } from '../FormRow';
import { Checkbox } from '../Checkbox';

import './FormCheckbox.less';

interface Props {
    name: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    disabled?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

interface State {
    inputFocused: boolean;
}

export class FormCheckbox extends React.Component<Props, State> {
    private formRowRef: React.RefObject<FormRow> = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            inputFocused: false,
        };
    }

    private inputOnBlur = () => {
        this.setState({ inputFocused: false });
    };

    private inputOnFocus = () => {
        this.setState({ inputFocused: true });
    };

    private onChange = (value: boolean) => {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }

        this.formRowRef.current?.updateReadyState(value);
    };

    componentDidMount() {
        this.formRowRef.current?.updateReadyState();
    }

    componentDidUpdate() {
        this.formRowRef.current?.updateReadyState();
    }

    render() {
        let className = toClass({
            'form-checkbox': true,
        });

        let checked = this.props.value === true;

        return (
            <FormRow
                ref={this.formRowRef}
                help={this.props.help}
                label={''}
                validation={this.props.validation}
                type={'checkbox'}
                disableZoom={true}
                focused={this.state.inputFocused}
                disabled={this.props.disabled}
            >
                <div className={className} data-name={this.props.name} data-value={this.props.value}>
                    <label>
                        <Checkbox value={checked} onChange={this.onChange} disabled={this.props.disabled} />

                        <span className={'name'}>{this.props.label}</span>
                    </label>
                </div>
            </FormRow>
        );
    }
}
