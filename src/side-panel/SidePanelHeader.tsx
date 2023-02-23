import React from 'react';
import './SidePanelHeader.less';

interface SidePanelHeaderProps {
    title: string;
    className?: string;
    icon?: JSX.Element;
    onIconPress?: () => void;
}

export function SidePanelHeader(props: SidePanelHeaderProps) {
    return (
        <div
            className={props.className ? props.className : 'side-panel-header'}
        >
            {props.icon && (
                <div
                    className="side-panel-header-icon"
                    onClick={props.onIconPress}
                >
                    {props.icon}
                </div>
            )}
            <p>{props.title}</p>
        </div>
    );
}
