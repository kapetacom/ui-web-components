import React from 'react';
import './FormInput.less';
import { observable, action, makeObservable } from 'mobx';
import { toClass } from '@blockware/ui-web-utils';
import { observer } from 'mobx-react';
import { FormRow } from '../FormRow';

export enum Type {
    DATE = 'date',
    EMAIL = 'email',
    NUMBER = 'number',
    PASSWORD = 'password',
    TEXT = 'text',
    CHECKBOX = 'checkbox',
}

const NON_TEXT_TYPES = [Type.DATE, Type.CHECKBOX];

interface Props {
    name?: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
    type?: Type;
}
@observer
export class FormInput extends React.Component<Props> {
    @observable
    private inputFocused: boolean = false;

    private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    private formRowRef: React.RefObject<FormRow> = React.createRef();

    constructor(props: Props) {
        super(props);
        makeObservable(this);
    }

    public setError(errorMessage?: string) {
        if (!this.formRowRef.current) {
            return;
        }

        this.formRowRef.current.setError(errorMessage);
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
        if (this.props.type === Type.CHECKBOX) {
            this.emitChange(evt.target.checked);
            return;
        }
        this.emitChange(evt.target.value);
    };

    private toValueType(value: any) {
        if (!value) {
            return value;
        }

        if (typeof value !== 'string') {
            return value;
        }

        switch (this.props.type) {
            case Type.NUMBER:
                return parseFloat(value);
            case Type.CHECKBOX:
                return value.toLowerCase() === 'true';
        }

        return value;
    }

    private emitChange(value: any) {
        const typedValue = this.toValueType(value);
        if (this.props.onChange) {
            this.props.onChange(this.props.name, typedValue);
        }

        this.formRowRef.current?.updateReadyState(typedValue);
    }

    private upperArrowHandler = () => {
        if (this.inputRef.current) {
            this.inputRef.current.stepUp();
            this.emitChange(this.inputRef.current.value);
        }
    };

    private lowerArrowHandler = () => {
        if (this.inputRef.current) {
            this.inputRef.current.stepDown();
            this.emitChange(this.inputRef.current.value);
        }
    };

    private eventPreventDefault(evt: React.MouseEvent) {
        evt.nativeEvent.stopImmediatePropagation();
        evt.preventDefault();
    }

    private renderNumberFeatures() {
        return (
            <>
                <svg
                    onMouseDown={(evt: React.MouseEvent) => {
                        this.eventPreventDefault(evt);
                        this.upperArrowHandler();
                    }}
                    className={`upper-arrow arrows `}
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                >
                    <rect width="15" height="14" rx="2" />
                    <path d="M7.5 5L13.1292 9.5L1.87083 9.5L7.5 5Z" />
                </svg>
                <svg
                    onMouseDown={(evt: React.MouseEvent) => {
                        this.eventPreventDefault(evt);
                        this.lowerArrowHandler();
                    }}
                    className={`lower-arrow arrows `}
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                >
                    <rect width="15" height="14" rx="2" />
                    <path d="M7.5 9L1.87084 4.5L13.1292 4.5L7.5 9Z" />
                </svg>
                <svg
                    className={'icon-numbers'}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <rect width="20" height="20" rx="3" fill="#716F6D" />
                    <path
                        d="M4.264 13V8.84L3.208 9.656L2.512 8.704L4.376 7.336H5.608V13H4.264ZM7.71588 13V11.88L9.92388 9.88C10.0625 9.74667 10.1745 9.61067 10.2599 9.472C10.3452 9.33333 10.3879 9.17867 10.3879 9.008C10.3879 8.80533 10.3239 8.64267 10.1959 8.52C10.0679 8.392 9.89721 8.328 9.68388 8.328C9.45988 8.328 9.27588 8.408 9.13188 8.568C8.99321 8.72267 8.91054 8.928 8.88388 9.184L7.59588 9.008C7.62788 8.72 7.70521 8.464 7.82788 8.24C7.95588 8.016 8.11588 7.82667 8.30788 7.672C8.49988 7.512 8.71854 7.392 8.96388 7.312C9.21454 7.22667 9.47854 7.184 9.75588 7.184C10.0172 7.184 10.2705 7.21867 10.5159 7.288C10.7612 7.35733 10.9799 7.464 11.1719 7.608C11.3639 7.752 11.5159 7.93333 11.6279 8.152C11.7452 8.37067 11.8039 8.62667 11.8039 8.92C11.8039 9.12267 11.7772 9.30667 11.7239 9.472C11.6705 9.632 11.5959 9.78133 11.4999 9.92C11.4092 10.0587 11.3025 10.1893 11.1799 10.312C11.0625 10.4293 10.9399 10.5467 10.8119 10.664L9.49988 11.832H11.8119V13H7.71588ZM17.0078 11.352C17.0078 11.6613 16.9438 11.9307 16.8158 12.16C16.6931 12.384 16.5304 12.5707 16.3278 12.72C16.1251 12.864 15.8958 12.9707 15.6398 13.04C15.3891 13.1147 15.1331 13.152 14.8718 13.152C14.6158 13.152 14.3651 13.1227 14.1198 13.064C13.8798 13.0053 13.6584 12.9173 13.4558 12.8C13.2584 12.6773 13.0851 12.5227 12.9358 12.336C12.7864 12.144 12.6744 11.9147 12.5998 11.648L13.8478 11.32C13.9011 11.5067 14.0104 11.672 14.1758 11.816C14.3411 11.9547 14.5518 12.024 14.8078 12.024C14.9038 12.024 14.9998 12.0107 15.0958 11.984C15.1971 11.9573 15.2851 11.9173 15.3598 11.864C15.4398 11.8053 15.5038 11.7307 15.5518 11.64C15.6051 11.5493 15.6318 11.4373 15.6318 11.304C15.6318 11.16 15.5971 11.04 15.5278 10.944C15.4638 10.848 15.3758 10.7733 15.2638 10.72C15.1571 10.6613 15.0344 10.6213 14.8958 10.6C14.7571 10.5733 14.6184 10.56 14.4798 10.56H14.1198V9.576H14.5118C14.6398 9.576 14.7624 9.568 14.8798 9.552C14.9971 9.53067 15.1011 9.496 15.1918 9.448C15.2878 9.39467 15.3624 9.32533 15.4158 9.24C15.4744 9.15467 15.5038 9.04267 15.5038 8.904C15.5038 8.70133 15.4318 8.54667 15.2878 8.44C15.1438 8.33333 14.9784 8.28 14.7918 8.28C14.5998 8.28 14.4318 8.33867 14.2878 8.456C14.1491 8.568 14.0584 8.72 14.0158 8.912L12.7678 8.624C12.8371 8.384 12.9411 8.176 13.0798 8C13.2184 7.81867 13.3811 7.66933 13.5678 7.552C13.7598 7.42933 13.9678 7.33867 14.1918 7.28C14.4158 7.216 14.6451 7.184 14.8798 7.184C15.1304 7.184 15.3731 7.216 15.6078 7.28C15.8478 7.344 16.0611 7.44267 16.2478 7.576C16.4344 7.70933 16.5838 7.87733 16.6958 8.08C16.8131 8.27733 16.8718 8.512 16.8718 8.784C16.8718 9.09867 16.7811 9.36533 16.5998 9.584C16.4238 9.79733 16.1971 9.94133 15.9198 10.016V10.04C16.0798 10.0773 16.2264 10.1387 16.3598 10.224C16.4931 10.304 16.6078 10.4027 16.7038 10.52C16.7998 10.632 16.8744 10.76 16.9278 10.904C16.9811 11.0427 17.0078 11.192 17.0078 11.352Z"
                        fill="#F5F1EE"
                    />
                </svg>
            </>
        );
    }

    componentDidMount() {
        this.formRowRef.current?.updateReadyState();
    }

    componentDidUpdate() {
        this.formRowRef.current?.updateReadyState();
    }

    render() {
        let className = toClass({
            'form-input': true,
        });

        const nonTextType =
            this.props.type && NON_TEXT_TYPES.indexOf(this.props.type) > -1;

        let value = this.props.value;
        let checked;

        if (this.props.type === Type.CHECKBOX) {
            checked = value === true;
        }

        return (
            <FormRow
                ref={this.formRowRef}
                label={this.props.label}
                help={this.props.help}
                validation={this.props.validation}
                type={this.props.type}
                disableZoom={nonTextType}
                focused={this.inputFocused}
                disabled={this.props.disabled}
                readOnly={this.props.readOnly}
            >
                <div
                    className={className}
                    data-name={this.props.name}
                    data-value={this.props.value}
                >
                    <input
                        type={this.props.type ? this.props.type : Type.TEXT}
                        name={this.props.name}
                        onChange={this.onChange}
                        onFocus={this.inputOnFocus}
                        onBlur={this.inputOnBlur}
                        value={value}
                        checked={checked}
                        readOnly={this.props.readOnly}
                        disabled={this.props.disabled}
                        ref={this.inputRef}
                    />

                    {this.props.type === Type.NUMBER &&
                        this.renderNumberFeatures()}
                </div>
            </FormRow>
        );
    }
}
