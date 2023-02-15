import React, { ChangeEvent } from "react";
import "./FormSelect.less";
import { action, makeObservable, observable } from "mobx";
import { toClass } from "@blockware/ui-web-utils";
import * as _ from "lodash";
import { observer } from "mobx-react";
import { FormRow } from "../FormRow";
import { RenderInBody } from "../../overlay/RenderInBody";

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

@observer
export class FormSelect extends React.Component<Props> {
  @observable
  private inputFocus: boolean = false;

  @observable
  private userInputDisplay: string = "";

  @observable
  private inputSuggestion: string = "";

  private inputElement = React.createRef<HTMLInputElement>();
  private dropDownList = React.createRef<HTMLUListElement>();

  private formRowRef: React.RefObject<FormRow> = React.createRef();

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  private userSelection = (): string[] => {
    let keys = this.props.value;
    if (!Array.isArray(keys)) {
      keys = keys ? [keys] : [];
    }
    return [].concat(keys);
  };

  private isEnabled() {
    return !this.props.disabled && !this.props.readOnly;
  }

  @action
  private onInputFocus = () => {
    if (!this.isEnabled()) {
      return;
    }
    this.inputFocus = true;
    this.userInputDisplay = "";
  };

  @action
  private onInputBlur = () => {
    if (!this.isEnabled()) {
      return;
    }

    // Select value if it is equal to suggestion
    if (
      this.userInputDisplay &&
      this.inputSuggestion &&
      this.inputSuggestion.toUpperCase() === this.userInputDisplay.toUpperCase()
    ) {
      this.emitChange(
        _.invert(this.optionListFiltered())[this.inputSuggestion]
      );
    }
    this.inputFocus = false;
    if (this.inputElement.current) {
      this.userInputDisplay = "";
      this.inputElement.current.blur();
    }
  };

  private emitChange(value) {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
    this.formRowRef.current?.updateReadyState(value);
  }

  private renderKeysAsValues = (keys: string | string[]) => {
    const options = this.getOptions();
    if (!Array.isArray(keys)) {
      keys = keys ? [keys] : [];
    }
    return keys.map((key) => options[key]).join(", ");
  };

  @action
  private onInputToggle = () => {
    if (this.isEnabled()) {
      if (this.inputFocus) {
        this.onInputBlur();
      } else {
        this.onInputFocus();
      }
    }
  };

  @action
  private setInputSuggestion() {
    if (this.userInputDisplay && this.userInputDisplay.length > 0) {
      const filteredOptions = this.optionListFiltered();
      if (_.isObject(filteredOptions)) {
        this.inputSuggestion = Object.values(filteredOptions)[0];
      } else if (_.isString(filteredOptions)) {
        this.inputSuggestion = filteredOptions;
      }
    } else {
      this.inputSuggestion = "";
    }
  }

  @action
  private selectHandler(selection: string) {
    if (this.inputElement.current) {
      this.inputElement.current.focus();
    }

    let tempUserSelection: string[] = this.userSelection();
    const isSelected: number = tempUserSelection.indexOf(selection);
    // For multi-select, allow full deselection unless explicitly disabled:
    const allowDeselect = this.props.multi
      ? this.props.enableDeselect !== false
      : this.props.enableDeselect;

    if (tempUserSelection.length > 0) {
      if (isSelected > -1) {
        // Toggle a selected item if its allowed (not last item, or we allow deselect)
        if (allowDeselect || tempUserSelection.length > 1) {
          tempUserSelection.splice(isSelected, 1);
          this.emitChange(
            this.props.multi ? tempUserSelection : tempUserSelection[0]
          );
        }
        return;
      }
    }

    if (!this.props.multi && tempUserSelection.length > 0) {
      tempUserSelection = [];
    }

    tempUserSelection.push(selection);
    this.userInputDisplay = "";
    this.setInputSuggestion();

    this.emitChange(
      this.props.multi ? tempUserSelection : tempUserSelection[0]
    );

    if (!this.props.multi) {
      this.onInputBlur();
    }
  }

  private optionListFiltered = () => {
    return _.pickBy(this.getOptions(), (value) => {
      return value
        .toUpperCase()
        .startsWith(this.userInputDisplay.toUpperCase());
    });
  };

  private getOptions = (): { [key: string]: string } => {
    if (this.props.options === null || this.props.options === undefined) {
      throw new Error("Provide an array of strings or an object of options.");
    }

    let options: { [key: string]: string } = {};
    if (_.isArray(this.props.options)) {
      this.props.options.forEach((item) => (options[item] = item));
      return options;
    }

    if (_.isObject(this.props.options)) {
      return this.props.options;
    }
    return options;
  };

  private renderOptions = () => {
    let filteredList = this.optionListFiltered();

    return _.map(filteredList, (value, key) => {
      //   Allow overriding classNames and adding props
      const optionProps = {
        ...(this.props.optionProps || {}),
        className: [
          this.props.optionProps?.className || "",
          `option ${this.userSelection().indexOf(key) > -1 ? " selected" : ""}`,
          this.props.noTransform ? "no-transform" : "",
        ].join(" "),
      };

      return (
        <li
          {...optionProps}
          key={key}
          onMouseDown={(evt: React.MouseEvent) => {
            evt.nativeEvent.stopImmediatePropagation();
            evt.preventDefault();

            this.selectHandler(key);
          }}
        >
          {this.boldQuery(value, this.userInputDisplay)}

          {this.userSelection().indexOf(key) < 0 ? null : (
            <span className={"selected-icon"}>
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

  @action
  private setUserInputDisplay = (evt: ChangeEvent<HTMLInputElement>) => {
    this.userInputDisplay = evt.target.value;
    this.setInputSuggestion();
  };

  private boldQuery = (str: string, query: string) => {
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

  @action
  componentDidUpdate() {
    if (!this.dropDownList.current || !this.inputElement.current) {
      return;
    }

    const position = this.inputElement.current.getBoundingClientRect();

    if (this.inputFocus) {
      this.dropDownList.current.style.top = position.bottom + "px";
      this.dropDownList.current.style.left = position.left + "px";
      this.dropDownList.current.style.width = position.width + "px";
    }
  }

  render() {
    const showList = this.inputFocus;

    let classNameList = toClass({
      "form-select-list": true,
      visible: showList,
    });

    let classNameArrowIcon = toClass({
      "arrow-icon": true,
      "focus-icon": !!this.inputFocus,
    });

    let inputValue =
      this.userInputDisplay || this.inputFocus
        ? this.userInputDisplay
        : this.renderKeysAsValues(this.props.value);

    const inputClassName = [
        this.props.noTransform ? 'no-transform' : ''
    ].filter(Boolean).join(' ');

    return (
      <FormRow
        ref={this.formRowRef}
        label={this.props.label}
        help={this.props.help}
        validation={this.props.validation}
        focused={this.inputFocus}
        disabled={this.props.disabled}
        readOnly={this.props.readOnly}
      >
        <div
          className={`form-select`}
          data-name={this.props.name}
          data-value={inputValue}
        >
          {this.inputFocus && this.userInputDisplay.length > 0 && (
            <span className={"user-suggestion"}>{this.inputSuggestion}</span>
          )}

          <input
              className={inputClassName}
            name={this.props.name}
            type={"text"}
            onChange={(event) => {
              this.setUserInputDisplay(event);
            }}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            ref={this.inputElement}
            value={inputValue}
            autoComplete="off"
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
          />
          <div className={classNameArrowIcon}>
            <svg width="13" height="5" fill="none" onClick={this.onInputToggle}>
              <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
            </svg>
          </div>
          {this.props.value
            ? this.props.value.length > 0 &&
              this.props.multi && (
                <span className="selected-number">
                  ({this.props.value.length})
                </span>
              )
            : null}
          <RenderInBody>
            <ul ref={this.dropDownList} className={classNameList}>
              {this.renderOptions()}
            </ul>
          </RenderInBody>
        </div>
      </FormRow>
    );
  }
}
