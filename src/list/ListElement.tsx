import React from 'react';

import './ListElement.less';
import { toClass } from '@blockware/ui-web-utils';
import { Actions, Button, ButtonShape, ButtonStyle } from '../button/buttons';

export interface ActionType {
    icon: string;
    style: ButtonStyle;
    on: (entry: any) => any;
}

interface Props {
    entry: any;
    title: string;
    actions?: ActionType[];
    properties: { [key: string]: { type: string; label: string } };
}

export const ListElement = (props: Props) => {
    const hasAnyAction = props.actions && props.actions.length > 0;

    const classNames = toClass({
        'component-list-element': true,
        'has-actions': hasAnyAction,
    });

    return (
        <div className={classNames}>
            <div className={'header'}>
                <span className={'title'}>{props.entry[props.title]}</span>

                {hasAnyAction && (
                    <Actions>
                        {props.actions.map((a, ix) => (
                            <Button
                                key={`action_${ix}`}
                                text={a.icon}
                                shape={ButtonShape.ICON}
                                style={a.style}
                                onClick={() => a.on(props.entry)}
                            />
                        ))}
                    </Actions>
                )}
            </div>
            <div className={'properties'}>
                {Object.entries(props.properties).map(([key, info]) => {
                    return (
                        <div className={'property'} key={`property_${key}`}>
                            <div className={'name'}>{info.label}</div>
                            <div className={`value ${info.type}`}>
                                {props.entry[key]}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
