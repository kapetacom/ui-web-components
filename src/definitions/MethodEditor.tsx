import React, {useState} from "react"

import './MethodEditor.less';
import {MethodParser} from "./MethodParser";

export interface MethodEditorProps {
    value?: string
    restMethods?: boolean
}

export const MethodEditor = (props: MethodEditorProps) => {

    const [current, setCurrent] = useState(props.value);

    const parser = new MethodParser(current, props.restMethods);
    const parsed = parser.parse();

    if (!parsed.error) {
        try {
            parser.validate();
        } catch (err) {
            parsed.error = err.message;
        }
    }
    const error = parsed.error ? parsed.error + ' at offset ' + parsed.offset : '';

    return (
        <div className={'rest-method-editor'}>
            <textarea className={'definition'}
                      value={current}
                      name={'definition'}
                      onChange={(evt) => setCurrent(evt.target.value)} />
            {parsed.methods.map((method, ix) => {
                return (
                    <div className={'method'} key={`method_${ix}`}>
                        <div className={'code'}>
                            <span className={'method-name'}>{method.name}</span>
                            <span className={'argument-start'}>(</span>

                            {method.arguments.map((arg, ix) => {
                                return (
                                    <span className={'argument'} key={`arg_${ix}`}>
                                        {props.restMethods && <>
                                            <span className={'transport-type'}>@{arg.transportType}</span>
                                            {arg.transportName && <>
                                                <span className={'argument-split'}>[</span>
                                                <span className={'transport-name'}>{arg.transportName}</span>
                                                <span className={'argument-split'}>]</span>
                                            </>}
                                            <span className={'argument-split'}>&nbsp;</span>
                                        </>}
                                        <span className={'argument-name variable-name'}>{arg.name}</span>
                                        <span className={'argument-split'}>:</span>
                                        <span className={'argument-type type'}>{arg.type}</span>
                                        {method.arguments.length > (ix + 1) &&
                                            <span className={'argument-divider'}>,</span>
                                        }
                                    </span>
                                )
                            })}

                            <span className={'argument-end'}>)</span>
                            <span className={'method-end'}>:</span>
                            <span className={'return-type type'}>{method.returnType}</span>
                        </div>
                        {props.restMethods &&
                            <div className={'http'}>
                                <span className={'rest-method type'}>{method.restMethod}</span>
                                <span className={'rest-path variable-name'}>{method.restPath}</span>
                            </div>}
                    </div>);
            })}
            <pre className={'parsed'}>{parsed.definition}</pre>
            {error &&
                <div className={'error'}>{error}</div>
            }
        </div>
    )
}