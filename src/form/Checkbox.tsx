import React from "react";
import {toClass} from "@blockware/ui-web-utils";

export interface CheckboxProps {
    value?: boolean,
    disabled?: boolean,
    onChange?: (userInput: boolean) => void,
    onClick?: () => void
}

import './Checkbox.less';

export const Checkbox = (props: CheckboxProps) => {

    const value = !!props.value;
    const checkBoxCheckClassName = toClass({
        'checkbox-icon': true,
        'check': true,
        "checked": value,
        disabled: props.disabled
    });

    const checkBoxBoxClassName = toClass({
        'checkbox-icon': true,
        "box": true,
        "checked": value,
        disabled: props.disabled
    });

    return (
        <div className={'checkbox-container'}
             onClick={(evt) => {
                 evt.preventDefault();
                 evt.stopPropagation();
                 if (props.disabled) {
                     return;
                 }
                 props.onClick && props.onClick();
                 props.onChange && props.onChange(!value);
             }}>
            <input type="checkbox"
                   checked={value}
                   readOnly={true}
                   disabled={props.disabled}/>

            <div className={checkBoxCheckClassName}>
                <svg width="20" height="20" viewBox="0 -2 14 12" fill="none">
                    <path className={'checker'}
                          d="M5 10L0 5.19231L1.4 3.84615L5 7.30769L12.6 0L14 1.34615L5 10Z" />
                </svg>
            </div>
            <div className={checkBoxBoxClassName}>
                <svg width="20" height="20" viewBox="0 -2 20 20" fill="none">
                    <path
                        className={'border'}
                        d="M1 3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V3Z"/>
                </svg>
            </div>
        </div>
    )
}