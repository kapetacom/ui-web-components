import React, { useState } from "react";
import "./dropdownInput.less";


interface DropdownInputProps {
    placeholder: string,
    optionList: string[],
    required: boolean
}


const ArrowIcon: React.FC = () => (
    <svg width="13" height="5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 5L0.870835 0.5L12.1292 0.5L6.5 5Z" fill="#908988" />
    </svg>
)


export const DropdownInput = (props: DropdownInputProps) => {


    const [inputFocus, setInputFocus] = useState(true);
    const [listClass, setListClass] = useState('list');
    const [userInput, setUserInput] = useState('');

    const filter: string = userInput.toUpperCase();

    const optionList: string[] = props.optionList;

    const toggleInputFocus = () => {
        setInputFocus(!inputFocus);
        setListClass(inputFocus ? 'list show-list' : 'list');
    };


    const options = optionList.map((option: string) => {
        if (!userInput) {
            return (<li className="option"> {option} </li>)
        }
        else if (option.toUpperCase().indexOf(filter) > -1) {
            return (<li className="option"> {option} </li>)
        }
    }
    );


    return (
        <div className="dropdown">
            <input onChange={(event) => { setUserInput(event.target.value) }} onFocus={toggleInputFocus} onBlur={toggleInputFocus} className="input" list="datalist-input" placeholder={props.placeholder} required={props.required} autoComplete="off"></input>
            <div className="arrow-icon">
                <ArrowIcon />
            </div>
            <ul id="datalist-input" className={listClass}>
                {options}
            </ul>
        </div>
    )
}
