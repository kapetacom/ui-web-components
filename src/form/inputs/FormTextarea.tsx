import React, { RefObject, useState } from 'react';
import './FormTextarea.less';
import { FormRow } from '../FormRow';

interface Props {
    name: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
}

const MIN_HEIGHT: number = 22;
const MAX_HEIGHT: number = 200;

export const FormTextarea = (props: Props) => {
    const [inputFocused, setInputFocused] = useState(false);

    const textHeightElementRef: RefObject<HTMLDivElement> = React.createRef();

    const [userInput, setUserInput] = useState(props.value ?? '');

    const inputOnBlur = () => {
        setInputFocused(false);
    };

    const inputOnFocus = () => {
        setInputFocused(true);
    };

    function calculateHeight() {
        let currentHeight = MIN_HEIGHT;
        if (textHeightElementRef.current) {
            textHeightElementRef.current.innerHTML = userInput + 'X';
            currentHeight = textHeightElementRef.current.offsetHeight;
            if (MIN_HEIGHT > currentHeight) {
                currentHeight = MIN_HEIGHT;
            }

            if (MAX_HEIGHT < currentHeight) {
                currentHeight = MAX_HEIGHT;
            }
        }

        return currentHeight;
    }

    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = evt.target.value;
        setUserInput(val);
        if (props.onChange) {
            props.onChange(props.name, userInput);
        }
    };

    let currentHeight = calculateHeight();

    return (
        <FormRow
            name={props.name}
            value={userInput}
            label={props.label}
            help={props.help}
            validation={props.validation}
            focused={inputFocused}
            disabled={props.disabled}
            readOnly={props.readOnly}
        >
            <div className={'textarea-wrapper'} >
                <textarea
                    name={props.name}
                    onChange={onChange}
                    style={{ height: currentHeight + 'px' }}
                    onFocus={inputOnFocus}
                    onBlur={inputOnBlur}
                    className={'textarea'}
                    value={userInput}
                    readOnly={props.readOnly}
                    disabled={props.disabled}
                    autoComplete="off"
                ></textarea>
                <div ref={textHeightElementRef} className={'text-height'}></div>
            </div>
        </FormRow>
    );
};
