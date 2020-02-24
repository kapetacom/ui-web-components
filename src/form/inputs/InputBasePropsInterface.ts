
export enum InputStatusTypes {
    WARNING = "warning",
    ERROR = "error"
}

export enum InputModeTypes {
    SINGLELINE = "singleline",
    MULTILINE = "multiline",
    DROPDOWN = "dropdown"
}

export enum InputTypes {
    DATE = "date",
    EMAIL = "email",
    NUMBER = "number",
    PASSWORD = "password",
    TEXT = "text",
    CHECKBOX = "checkbox",
    RADIO = "radio"
}

export interface InputBaseProps {

    label: string,
    required: boolean,
    message: string,
    statusMessage?: string | undefined,
    inputStatus?: InputStatusTypes,
    inputType?: InputTypes,
    inputMode?: InputModeTypes,

}

export interface InputAdvanceProps extends InputBaseProps {
    inputName: string;
    inputCallback: (inputName: string, userInput: string | string[]) => void

}
