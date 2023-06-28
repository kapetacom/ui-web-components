import * as React from 'react';
import useAutocomplete, { AutocompleteValue, UseAutocompleteProps } from '@mui/base/useAutocomplete';
import Popper from '@mui/base/Popper';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { toClass } from '@kapeta/ui-web-utils';

import './Autocomplete.less';

// Redeclare forwardRef (https://fettblog.eu/typescript-react-generic-forward-refs/#option-3%3A-augment-forwardref)
declare module 'react' {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const CustomPopper = React.forwardRef(function CustomPopper(
    props: React.HTMLAttributes<HTMLDivElement>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="autocomplete-popper-container">
            {props.children}
        </div>
    );
});

const ClearIcon = () => (
    <svg className="svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
);

const ArrowDropDownIcon = () => (
    <svg className="svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z"></path>
    </svg>
);

export type AutocompleteProps<Option, Multiple extends boolean = false> = Pick<
    UseAutocompleteProps<Option, boolean, boolean, boolean>,
    'multiple' | 'isOptionEqualToValue' | 'getOptionLabel'
> & {
    name: string;
    label?: string;
    options: Option[];
    onChange: (value: Option | NonNullable<string | Option> | (string | Option)[] | null) => void;
    // getOptionLabel?: (option: Option) => string;
    // isOptionEqualToValue?: (option: Option, value: Option) => boolean;
    value: AutocompleteValue<Option, Multiple, false, false> | null;
    showPopupIndicator?: boolean;
};

function Autocomplete<Option, Multiple extends boolean = false>(
    { showPopupIndicator = true, multiple = false, ...props }: AutocompleteProps<Option, Multiple>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const {
        getRootProps,
        getInputProps,
        getInputLabelProps,
        getClearProps,
        getPopupIndicatorProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        popupOpen,
        anchorEl,
        setAnchorEl,
        focused,
        expanded,
    } = useAutocomplete<Option, boolean, boolean, boolean>({
        componentName: 'Autocomplete',
        options: props.options,
        getOptionLabel: props.getOptionLabel,
        onChange: (_event, value, reason) => {
            switch (reason) {
                case 'selectOption':
                    props.onChange(value);
                    break;
                case 'clear':
                    props.onChange(null);
                    break;
                default:
                    throw new Error(`Unhandled onChangeAutocomplete reason: ${reason}`);
            }
        },
        value: props.value,
        isOptionEqualToValue: props.isOptionEqualToValue,
        multiple: multiple,
    });

    const rootRef = useForkRef(ref, setAnchorEl);

    return (
        <React.Fragment>
            <div {...getRootProps()} ref={rootRef} className={toClass({ 'autocomplete-container': true, focused })}>
                {/* Text input */}
                <input className="autocomplete-input" placeholder=" " {...getInputProps()} />

                {/* Label */}
                {props.label && (
                    <label className="autocomplete-label" {...getInputLabelProps()}>
                        {props.label}
                    </label>
                )}

                <div className="autocomplete-button-container">
                    {/* Clear button */}
                    {props.value && (
                        <button type="button" className="autocomplete-clear-button" {...getClearProps()}>
                            <ClearIcon />
                        </button>
                    )}

                    {/* Dropdown button */}
                    {showPopupIndicator && (
                        <button
                            type="button"
                            {...getPopupIndicatorProps()}
                            className={`autocomplete-dropdown-button ${expanded ? 'flip-dropdown-arrow' : ''}`}
                        >
                            <ArrowDropDownIcon />
                        </button>
                    )}
                </div>
            </div>

            {/* Popper (the dropdown) */}
            {anchorEl && (
                <Popper
                    open={popupOpen}
                    anchorEl={anchorEl}
                    slots={{
                        root: CustomPopper,
                    }}
                    modifiers={[
                        {
                            name: 'sameWidth',
                            enabled: true,
                            phase: 'beforeWrite',
                            requires: ['computeStyles'],
                            fn: ({ state }) => {
                                state.styles.popper.width = `${state.rects.reference.width}px`;
                            },
                            effect: ({ state }) => {
                                const refElement = state.elements.reference as HTMLElement;
                                state.elements.popper.style.width = `${refElement.offsetWidth}px`;
                            },
                        },
                    ]}
                >
                    {groupedOptions.length > 0 ? (
                        <ul {...getListboxProps()} className="autocomplete-listbox">
                            {(groupedOptions as Option[]).map((option, index) => (
                                <li {...getOptionProps({ option, index })} className="autocomplete-option">
                                    {props.getOptionLabel?.(option) ?? (option as { label: string }).label}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul>
                            <li className="autocomplete-no-option">No results</li>
                        </ul>
                    )}
                </Popper>
            )}
        </React.Fragment>
    );
}

export default React.forwardRef(Autocomplete);
