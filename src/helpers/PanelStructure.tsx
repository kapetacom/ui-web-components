import React from "react";

import './PanelStructure.less';

interface PanelStructureProps {
    title: string;
    closable?:boolean
    onClose: () => void;
    children: any
}

export function PanelStructure(props: PanelStructureProps) {

    const closable = props.closable === undefined ? true : props.closable;

    return (
        <div className={'panel-container'}>
            <div className={"panel-header"}>
                <div className={"text"}>
                    <h3>{props.title}</h3>
                </div>
                {closable &&
                    <div className={"close"}>
                        <svg width="16"
                             height="16"
                             viewBox="0 0 16 16"
                             fill="none"
                             onClick={props.onClose}
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.1426 15.1421L1.00044 1" />
                            <path d="M1 15.1421L15.1421 1" />
                        </svg>
                    </div>
                }
            </div>

            <div className={"panel-content"}>
                {props.children}
            </div>
        </div>

    );
}