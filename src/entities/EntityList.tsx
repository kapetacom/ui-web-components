import React from "react";
import { SchemaEntity } from "@blockware/ui-web-types";
import {  toClass } from "@blockware/ui-web-utils";
import "./EntityList.less"



interface EntityListProps {
    entities: SchemaEntity[]
}

const EditIcon:React.FC = ()=> (
    <svg width="20" height="20" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0267 1.68511C10.5163 1.09062 11.3951 1.00557 11.9896 1.49513C12.584 1.98469 12.6691 2.86348 12.1795 3.45796L5.12465 12.0248L2.97185 10.252L10.0267 1.68511Z" fill="white"/>
<path d="M2.25052 11.1285L4.40333 12.9014L1.28112 14.4992L2.25052 11.1285Z" fill="white"/>
</svg>
);

const DeleteIcon:React.FC = ()=> (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M13.3317 5.38893H4.66504V14.0556C4.66504 14.8529 5.31216 15.5 6.11021 15.5H11.8873C12.686 15.5 13.3317 14.8529 13.3317 14.0556V5.38893ZM10.8054 2.49924H7.19427L6.47277 3.22218H4.66649C4.26855 3.22218 3.94499 3.54574 3.94499 3.94368V4.66663H14.0561V3.94368C14.0561 3.54574 13.7325 3.22218 13.3332 3.22218H11.5283L10.8054 2.49924Z" fill="white"/>
</svg>

);

export const EntityList = (props: EntityListProps) => {

    const entityList: SchemaEntity[] = props.entities;
    console.log(props);



    const listItems = entityList.map((entity: SchemaEntity) => {

        let entityStatusClass = toClass({
            'entity-status': true,
            'status-green': !!entity.status,
            'status-gray': !entity.status
        });
        
        return (
            <div className={'entity-row'} key={entity.name}>
                <div className={'entity-name'}> {entity.name}</div>
                <div className={'entity-status ' + entityStatusClass}>
                    {entity.status ? "In use" : "Unused"}
                </div>
                <div className={'entity-icons'}>
                    <div className="edit-icon">
                        <EditIcon />
                    </div>
                    <div className="delete-icon">
                        <DeleteIcon />
                    </div>
                </div>
            </div>
        );

    });
    return (
        <div className="entity-list">
            <div className="add-entity-box">
                <span className="add-entity-text">+ Add New Entity</span>
            </div>
            <div className="entities-items">{listItems}</div>
        </div>
    ) 
}