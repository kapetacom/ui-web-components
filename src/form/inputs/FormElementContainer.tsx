import React from 'react';
import './FormElementContainer.less';
import { toClass } from '@kapeta/ui-web-utils';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import { makeObservable } from 'mobx';

enum StatusType {
    WARNING = 'warning',
    ERROR = 'error',
    OK = 'ok',
}
interface Props {
    required?: boolean;
    processing?: boolean;
    hasValue: boolean;
    touched: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    help?: string;
    errorMessage: string;
    label?: string;
    type?: string;
    focused: boolean;
    status?: string;
    infoBox?: string;
    disableZoom?: boolean;
    children: any;
}

const renderStatusIcon = (status: string): JSX.Element => {
    return (
        <svg className={'status-icon'} width="22" height="19" viewBox="0 0 22 19" fill="none">
            <path
                d="M0.676375 10.5692C0.263313 9.91625 0.263313 9.08376 0.676374 8.43079L5.42082 0.930792C5.7874 0.351295 6.42531 1.62649e-06 7.11102 1.59652e-06L14.889 1.25653e-06C15.5747 1.22656e-06 16.2126 0.351295 16.5792 0.930789L21.3236 8.43079C21.7367 9.08375 21.7367 9.91624 21.3236 10.5692L16.5792 18.0692C16.2126 18.6487 15.5747 19 14.889 19L7.11102 19C6.42531 19 5.7874 18.6487 5.42082 18.0692L0.676375 10.5692Z"
                fill={status === StatusType.WARNING ? '#FCC024' : '#E35A4C'}
            />
            <path
                d="M11.9613 11.448H10.0413V3.672H11.9613V11.448ZM9.72125 13.88C9.72125 13.5387 9.84392 13.2453 10.0893 13C10.3453 12.7547 10.6493 12.632 11.0013 12.632C11.3426 12.632 11.6413 12.7493 11.8973 12.984C12.1533 13.2187 12.2812 13.5067 12.2812 13.848C12.2812 14.1893 12.1533 14.4827 11.8973 14.728C11.6519 14.9733 11.3533 15.096 11.0013 15.096C10.8306 15.096 10.6653 15.064 10.5053 15C10.3559 14.936 10.2226 14.8507 10.1053 14.744C9.98792 14.6373 9.89192 14.5093 9.81725 14.36C9.75325 14.2107 9.72125 14.0507 9.72125 13.88Z"
                fill="white"
            />
        </svg>
    );
};

export const FormElementContainer = (props: Props) => {
    const inputType = props.type || 'text';

    let classFormElemContainer = toClass({
        'form-element-container': true,
        focused: props.focused,
        disabled: props.disabled,
        'read-only': props.readOnly,
        required: !!props.required && !props.hasValue && props.touched,
        'warning-status': !props.focused && props.status === StatusType.WARNING,
        'error-status': !props.focused && props.status === StatusType.ERROR,
        ['type-' + inputType]: true,
    });

    let classNameLabel = toClass({
        label: true,
        'zoom-out': props.hasValue || props.focused || props.disableZoom,
    });

    let classNameMessage = toClass({
        message: true,
    });

    let helpMessage = props.errorMessage && props.touched ? props.errorMessage : props.help;
    if (!helpMessage && props.required) {
        helpMessage = 'This value is required';
    }

    const showStatusIcon = props.touched && props.status !== StatusType.OK;

    return (
        <div className={classFormElemContainer}>
            <div className={'input-container'}>
                <span className={classNameLabel}>
                    {props.label}
                </span>

                {props.children}
            </div>

            {helpMessage && (
                <span className={classNameMessage}>
                    {props.required ? <sup>*</sup> : null}
                    {helpMessage}
                </span>
            )}

            {!props.focused && showStatusIcon && renderStatusIcon(props.status)}

            {props.touched && props.processing && <i className={'processing fa fa-spin fa-spinner'} />}

            {(props.status === StatusType.WARNING || props.status === StatusType.ERROR) && props.infoBox && (
                <span className="tooltip">
                    <div className="right">
                        <p>{props.infoBox}</p>
                        <i></i>
                    </div>
                </span>
            )}
        </div>
    );
};
