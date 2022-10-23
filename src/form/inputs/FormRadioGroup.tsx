import React from "react";
import "./FormRadioGroup.less";
import {observable, action, makeObservable} from "mobx";
import {toClass} from "@blockware/ui-web-utils";
import {observer} from "mobx-react";
import {FormRow} from "../FormRow";
import _ from "lodash";

interface Props {
    name: string,
    label?: string,
    value?: any,
    validation?: any[],
    help?: string,
    options: string[] | { [key: string]: string },
    disabled?: boolean,
    onChange?: (inputName: string, userInput: any) => void
}

@observer
export class FormRadioGroup extends React.Component<Props> {

    @observable
    private inputFocused: boolean = false;

    private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    private formRowRef: React.RefObject<FormRow> = React.createRef();

    constructor(props: Props) {
        super(props);
        makeObservable(this);
    }

    @action
    private inputOnBlur = () => {
        this.inputFocused = false;
    };

    @action
    private inputOnFocus = () => {
        this.inputFocused = true;
    };

    @action
    private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.emitChange(evt.target.value);
    };


    private emitChange(value: any) {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }

        this.formRowRef.current?.updateReadyState(value);
    }

    componentDidMount() {
        const value = this.getCurrentValue();
        if (this.props.value !== value) {
            this.emitChange(value);
        } else {
            this.formRowRef.current?.updateReadyState(value);
        }
    }

    private getOptions() {

        let options: { [key: string]: string } = {};

        if (Array.isArray(this.props.options)) {
            this.props.options.forEach(val => {
                options[val] = val;
            })
        } else {
            options = this.props.options;
        }

        if (_.isEmpty(options)) {
            throw new Error('Received empty options for radio group');
        }

        return options;
    }

    getCurrentValue() {
        let options = this.getOptions();

        return this.props.value || Object.keys(options)[0];
    }

    render() {

        let className = toClass({
            "form-radiogroup": true
        });

        const options = this.getOptions();
        const currentValue = this.getCurrentValue();

        return (

            <FormRow
                ref={this.formRowRef}
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                type={'radiogroup'}
                disableZoom={true}
                focused={this.inputFocused}
                disabled={this.props.disabled}
            >
                <div className={className} data-name={this.props.name} data-value={this.props.value}>
                    {Object.entries(options).map(([value, label], ix) => {

                        return (
                            <label key={`radio_${ix}`}>
                                <input
                                    type={"radio"}
                                    name={this.props.name}
                                    onChange={this.onChange}
                                    onFocus={this.inputOnFocus}
                                    onBlur={this.inputOnBlur}
                                    value={value}
                                    checked={value === currentValue}
                                    disabled={this.props.disabled}
                                    ref={this.inputRef}/>
                                <span className={'name'}>{label}</span>
                            </label>
                        )
                    })}
                </div>

            </FormRow>
        )
    }
}



