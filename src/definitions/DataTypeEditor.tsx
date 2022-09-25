import React, {useState} from "react"

import './DataTypeEditor.less';
import {DataTypeParser, Field} from "./DataTypeParser";

export interface DataTypeEditorProps {
    value?: string
}

export const DataTypeEditor = (props: DataTypeEditorProps) => {

    const [current, setCurrent] = useState(props.value);

    const parser = new DataTypeParser(current);

    const results = parser.parse();

    const renderFields = (fields: Field[]) => {
        return fields.map((field, ix) => {
            let type;
            if (typeof field.type === 'string') {
                type = <span className={'field-type'}>{field.type}{field.list ? '[]' : ''}</span>;
            } else {
                type = (
                    <>
                        <span className={'divider'}>{field.list ? '[{' : '{'}</span>
                        {renderFields(field.type.fields)}
                        <span className={'divider'}>{field.list ? '}]' : '}'}</span>
                    </>
                )
            }
            return (
                <div className={'field'} key={`field_${ix}`}>
                    <span className={'field-name'}>{field.name}</span>
                    <span>:</span>
                    {type}
                </div>
            )
        })
    }

    return (
        <div className={'data-type-editor'}>
                <textarea className={'definition'} value={current} name={'definition'} onChange={(evt) => {
                    let value = evt.target.value;
                    setCurrent(value);

                }}/>

            <div className={'types'}>
                {results.types.map((type, ix) => (
                        <div className={'type'} key={`key_${ix}`} >
                            <span className={'name'}>{type.name}</span>
                            <span className={'divider'}>{'{'}</span>
                            {renderFields(type.fields)}
                            <span className={'divider'}>{'}'}</span>
                        </div>
                    )
                )}
            </div>
            <pre className={'parsed'}>{results.definition}</pre>
            {results.error &&
                <div className={'error'}>{results.error}</div>
            }

        </div>
    )
}