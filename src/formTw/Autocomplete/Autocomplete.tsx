import * as React from 'react';
import useAutocomplete from '@mui/base/useAutocomplete';
import Popper from '@mui/base/Popper';
import { unstable_useForkRef as useForkRef } from '@mui/utils';

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
        <div ref={ref} className="w-80 overflow-auto rounded-md bg-white text-sm font-light shadow-lg">
            {props.children}
        </div>
    );
});

const ClearIcon = () => (
    <svg
        className="inline-block h-4 w-4 select-none fill-current"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
    >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
);

const ArrowDropDownIcon = () => (
    <svg
        className="inline-block h-4 w-4 select-none fill-current"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
    >
        <path d="M7 10l5 5 5-5z"></path>
    </svg>
);

export type AutocompleteProps<Option> = {
    name: string;
    label?: string;
    options: Option[];
    onChange: (value: null | Option) => void;
    getOptionLabel?: (option: Option) => string;
    isOptionEqualToValue?: (option: Option, value: Option) => boolean;
    value?: Option;
};

function Autocomplete<Option>(props: AutocompleteProps<Option>, ref: React.ForwardedRef<HTMLDivElement>) {
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
    } = useAutocomplete({
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
    });

    const rootRef = useForkRef(ref, setAnchorEl);

    return (
        <React.Fragment>
            <div
                {...getRootProps()}
                ref={rootRef}
                className={`before:ease-[cubic-bezier(0.4, 0, 0.2, 1)]] relative z-0 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:right-0 before:border-b before:border-gray-300 before:transition-all before:duration-200 hover:before:border-b-2  ${
                    focused ? 'before:border-b-2 before:border-blue-500' : ''
                }`}
            >
                {/* Text input */}
                <input
                    className="peer mb-[1px] block w-full appearance-none bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:mb-0 focus:outline-none dark:text-white "
                    placeholder=" "
                    {...getInputProps()}
                />

                {/* Label */}
                {props.label && (
                    <label
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm font-normal text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 "
                        {...getInputLabelProps()}
                    >
                        {props.label}
                    </label>
                )}

                <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center">
                    {/* Clear button */}
                    <button
                        type="button"
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-gray-300 ${
                            props.value ? '' : 'hidden'
                        }`}
                        {...getClearProps()}
                    >
                        <ClearIcon />
                    </button>

                    {/* Dropdown button */}
                    <button
                        type="button"
                        {...getPopupIndicatorProps()}
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-gray-300 ${
                            expanded ? 'rotate-180' : ''
                        }`}
                    >
                        <ArrowDropDownIcon />
                    </button>
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
                        <ul {...getListboxProps()} className="max-h-[40vh] space-y-1 pt-2">
                            {(groupedOptions as Option[]).map((option, index) => (
                                <li
                                    {...getOptionProps({ option, index })}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-200 aria-selected:bg-blue-300 Mui-focusVisible:bg-blue-200"
                                >
                                    {props.getOptionLabel?.(option) ?? (option as { label: string }).label}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul>
                            <li className="px-3 py-2">No results</li>
                        </ul>
                    )}
                </Popper>
            )}
        </React.Fragment>
    );
}

export default React.forwardRef(Autocomplete);
