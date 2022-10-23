import React from "react";
import "./FormCheckbox.less";
import {observable, action, makeObservable} from "mobx";
import {toClass} from "@blockware/ui-web-utils";
import {observer} from "mobx-react";
import {FormRow} from "../FormRow";
import {Checkbox} from "../Checkbox";

interface Props {
    name: string,
    label?: string,
    value?: any,
    validation?: any[],
    help?: string,
    disabled?: boolean,
    onChange?: (inputName: string, userInput: any) => void
}

@observer
export class FormCheckbox extends React.Component<Props> {

    @observable
    private inputFocused: boolean = false;

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
    private onChange = (value:boolean) => {
        this.emitChange(value);
    };

    private emitChange(value: boolean) {
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }

        this.formRowRef.current?.updateReadyState(value);
    }

    componentDidMount() {
        this.formRowRef.current?.updateReadyState();
    }

    render() {

        let className = toClass({
            "form-checkbox": true
        });

        let checked = (this.props.value === true);

        return (

            <FormRow
                ref={this.formRowRef}
                help={this.props.help}
                label={''}
                validation={this.props.validation}
                type={'checkbox'}
                disableZoom={true}
                focused={this.inputFocused}
                disabled={this.props.disabled}
            >
                <div className={className} data-name={this.props.name} data-value={this.props.value}>
                    <label>
                        <Checkbox value={checked}
                                  onChange={this.onChange}
                                  disabled={this.props.disabled}
                        />

                        <span className={'name'}>{this.props.label}</span>
                    </label>
                </div>

            </FormRow>
        )
    }
}



