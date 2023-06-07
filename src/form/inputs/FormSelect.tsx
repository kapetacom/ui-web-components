import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toClass } from '@kapeta/ui-web-utils';
import * as _ from 'lodash';
import { FormRow } from '../FormRow';
import { RenderInBody } from '../../overlay/RenderInBody';

import './FormSelect.less';

interface Props {
    options: string[] | { [key: string]: string };
    name?: string;
    label?: string;
    value?: any;
    validation?: any[];
    help?: string;
    readOnly?: boolean;
    disabled?: boolean;
    multi?: boolean;
    enableDeselect?: boolean;
    noTransform?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
    optionProps?: React.HTMLProps<any>;
}

export const FormSelect = (props: Props) => {
    const [inputFocus, setInputFocus] = useState(false);

    return (
        <FormRow
            name={props.name}
            value={props.value}
            label={props.label}
            help={props.help}
            validation={props.validation}
            focused={inputFocus}
            disabled={props.disabled}
            readOnly={props.readOnly}
        >
            <FormSelectInput
                {...props}
                data-name={props.name}
                data-value={props.value}
                onFocusChange={setInputFocus}
                focused={inputFocus}
            />
        </FormRow>
    );
};

interface InputProps {
    options: string[] | { [key: string]: string };
    name?: string;
    value?: any;
    readOnly?: boolean;
    disabled?: boolean;
    multi?: boolean;
    enableDeselect?: boolean;
    noTransform?: boolean;
    onChange?: (inputName: string, userInput: any) => void;
    optionProps?: React.HTMLProps<any>;
    focused?: boolean;
    onFocusChange?: (focused: boolean) => void;
}

export const FormSelectInput = (props: InputProps) => {
    const inputElement = useRef<HTMLInputElement>();
    const dropDownList = useRef<HTMLUListElement>();
    const [userInputDisplay, setUserInputDisplay] = useState('');
    const [inputSuggestion, setInputSuggestion] = useState('');
    const [inputFocus, setInputFocus] = useState(false);

    function isFocusControlled() {
        return props.onFocusChange !== undefined;
    }
    function isFocused() {
        return isFocusControlled() ? props.focused : inputFocus;
    }

    function setFocus(focus: boolean) {
        return isFocusControlled() ? props.onFocusChange(focus) : setInputFocus(focus);
    }

    function calculateInputSuggestion() {
        let inputSuggestion = '';
        if (userInputDisplay && userInputDisplay.length > 0) {
            const filteredOptions = optionListFiltered();
            if (_.isObject(filteredOptions)) {
                inputSuggestion = Object.values(filteredOptions)[0];
            } else if (_.isString(filteredOptions)) {
                inputSuggestion = filteredOptions;
            }
        }
        setInputSuggestion(inputSuggestion);
    }

    const optionListFiltered = () => {
        return _.pickBy(getOptions(), (value) => {
            return value.toUpperCase().startsWith(userInputDisplay.toUpperCase());
        });
    };

    const getOptions = (): { [key: string]: string } => {
        if (props.options === null || props.options === undefined) {
            throw new Error('Provide an array of strings or an object of options.');
        }

        let options: { [key: string]: string } = {};
        if (_.isArray(props.options)) {
            props.options.forEach((item) => (options[item] = item));
            return options;
        }

        if (_.isObject(props.options)) {
            return props.options;
        }
        return options;
    };

    useEffect(() => {
        calculateInputSuggestion();
    }, [userInputDisplay]);

    useEffect(() => {
        if (!dropDownList.current || !inputElement.current) {
            return;
        }

        const position = inputElement.current.getBoundingClientRect();

        if (isFocused()) {
            dropDownList.current.style.top = position.bottom + 'px';
            dropDownList.current.style.left = position.left + 'px';
            dropDownList.current.style.width = position.width + 'px';
        }
    }, [inputElement.current, dropDownList.current, isFocused()]);

    const userSelection = (): string[] => {
        let keys = props.value;
        if (!Array.isArray(keys)) {
            keys = keys ? [keys] : [];
        }
        return [].concat(keys);
    };

    function isEnabled() {
        return !props.disabled && !props.readOnly;
    }

    function emitChange(value) {
        if (props.onChange) {
            props.onChange(props.name, value);
        }
    }

    const onInputFocus = () => {
        if (!isEnabled()) {
            return;
        }
        setFocus(true);
        setUserInputDisplay('');
    };

    const onInputBlur = () => {
        if (!isEnabled()) {
            return;
        }

        // Select value if it is equal to suggestion
        if (userInputDisplay && inputSuggestion && inputSuggestion.toUpperCase() === userInputDisplay.toUpperCase()) {
            emitChange(_.invert(optionListFiltered())[inputSuggestion]);
        }

        if (inputElement.current) {
            setUserInputDisplay('');
            inputElement.current.blur();
        }
        setFocus(false);
    };
    const renderKeysAsValues = (keys: string | string[]) => {
        const options = getOptions();
        if (!Array.isArray(keys)) {
            keys = keys ? [keys] : [];
        }
        return keys.map((key) => options[key]).join(', ');
    };

    const onInputToggle = () => {
        if (isEnabled()) {
            if (isFocused()) {
                onInputBlur();
            } else {
                onInputFocus();
            }
        }
    };

    function selectHandler(selection: string) {
        if (inputElement.current) {
            inputElement.current.focus();
        }

        let tempUserSelection: string[] = userSelection();
        const isSelected: number = tempUserSelection.indexOf(selection);
        // For multi-select, allow full deselection unless explicitly disabled:
        const allowDeselect = props.multi ? props.enableDeselect !== false : props.enableDeselect;

        if (tempUserSelection.length > 0) {
            if (isSelected > -1) {
                // Toggle a selected item if its allowed (not last item, or we allow deselect)
                if (allowDeselect || tempUserSelection.length > 1) {
                    tempUserSelection.splice(isSelected, 1);
                    emitChange(props.multi ? tempUserSelection : tempUserSelection[0]);
                    return;
                }
            }
        }

        if (!props.multi && tempUserSelection.length > 0) {
            tempUserSelection = [];
        }

        tempUserSelection.push(selection);
        setUserInputDisplay('');

        emitChange(props.multi ? tempUserSelection : tempUserSelection[0]);

        if (!props.multi) {
            onInputBlur();
        }
    }
    const boldQuery = (str: string, query: string) => {
        let optionString = str.toUpperCase();
        let userInput = query.toUpperCase();
        const queryIndex = optionString.indexOf(userInput);
        if (!userInput || queryIndex === -1) {
            return str;
        }
        const queryLength = query.length;
        return (
            <span>
                {str.substr(0, queryIndex)}
                <b>{str.substr(queryIndex, queryLength)}</b>
                {str.substr(queryIndex + queryLength)}
            </span>
        );
    };

    const renderOptions = () => {
        let filteredList = optionListFiltered();

        return _.map(filteredList, (value, key) => {
            //   Allow overriding classNames and adding props
            const optionProps = {
                ...(props.optionProps || {}),
                className: [
                    props.optionProps?.className || '',
                    `option ${userSelection().indexOf(key) > -1 ? ' selected' : ''}`,
                    props.noTransform ? 'no-transform' : '',
                ].join(' '),
            };

            return (
                <li
                    {...optionProps}
                    key={key}
                    onMouseDown={(evt: React.MouseEvent) => {
                        evt.nativeEvent.stopImmediatePropagation();
                        evt.preventDefault();

                        selectHandler(key);
                    }}
                >
                    {boldQuery(value, userInputDisplay)}

                    {userSelection().indexOf(key) < 0 ? null : (
                        <span className={'selected-icon'}>
                            <svg width="14" height="10" fill="none">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5 9.61957L0 4.99477L1.4 3.69983L5 7.02968L12.6 0L14 1.29494L5 9.61957Z"
                                    fill="#686868"
                                />
                            </svg>
                        </span>
                    )}
                </li>
            );
        });
    };

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setUserInputDisplay(evt.target.value);
    };

    const showList = isFocused();
    let inputValue = userInputDisplay || isFocused() ? userInputDisplay : renderKeysAsValues(props.value);

    const inputClassName = [props.noTransform ? 'no-transform' : ''].filter(Boolean).join(' ');

    let classNameList = toClass({
        'form-select-list': true,
        visible: showList,
    });

    let classNameArrowIcon = toClass({
        'arrow-icon': true,
        'focus-icon': !!isFocused(),
    });

    return (
        <div className={`form-select`}>
            {isFocused() && userInputDisplay.length > 0 && <span className={'user-suggestion'}>{inputSuggestion}</span>}

            <input
                className={inputClassName}
                name={props.name}
                type={'text'}
                onChange={onChange}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                ref={inputElement}
                value={inputValue}
                autoComplete="off"
                readOnly={props.readOnly}
                disabled={props.disabled}
            />
            <div className={classNameArrowIcon}>
                <svg width="13" height="5" fill="none" onClick={onInputToggle}>
                    <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
                </svg>
            </div>
            {props.value
                ? props.value.length > 0 &&
                  props.multi && <span className="selected-number">({props.value.length})</span>
                : null}
            <RenderInBody>
                <ul ref={dropDownList} className={classNameList}>
                    {renderOptions()}
                </ul>
            </RenderInBody>
        </div>
    );
};
