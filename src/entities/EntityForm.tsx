import React from "react";
import {action, observable} from "mobx";
import {observer} from "mobx-react";

import {SchemaEntryType, typeName} from "@blockware/ui-web-types";
import {toClass} from "@blockware/ui-web-utils";

import {EntityPicker} from "../form/field-handlers/EntityPicker";
import _ from "lodash";

import {Guid} from "guid-typescript";
import {SortableItem} from "../dnd/SortableItem";
import {SortableContainer} from "../dnd/SortableContainer";
import {EntityFormModel, SchemaEntryEdit} from "./EntityFormModel";

import './EntityForm.less';

import PlusHexagon from "../svg/SVGAddEntityButton";
import { SingleLineInput, Type } from "../form/inputs/SingleLineInput";
import SVGGrabber from "../svg/SVGGrabber";
import SVGDeleteHexagon from "../svg/SVGDeleteHexagon";
import { isArray } from "util";
import { FormContainer } from "../form/FormContainer";
import { FormButtons } from "../form/FormButtons";


function toTypeName(entry:SchemaEntryEdit):string {
    let type = typeName(entry.type);
    if (type === 'number') {
        type = 'double';
    }

    if (type === 'array') {
        if (entry.items) {
            type = toTypeName(entry.items);
        } else {
            type = 'string';
        }

        type += '[]';
    }

    return type;
}

function isObject(entry:SchemaEntryEdit):boolean {

    if (entry.type === 'object' ||
        entry.type === 'object[]') {
        return true;
    }

    if (entry.type === 'array' &&
        entry.items) {
        return isObject(entry.items);
    }

    return false;
}


interface EntityFormProps {
    name: string
    entity: EntityFormModel
    onChange?: (value:EntityFormModel) => void
}

@observer
export class EntityForm extends React.Component<EntityFormProps> {

    @observable
    private openedObjects:{[key:string]:boolean} = {};

    @observable
    private isHovered = "";

    @action
    private removeEntry(properties:SchemaEntryEdit[], field: SchemaEntryEdit) {
        _.pull(properties, field);
        this.handleChange();
    }

    @action
    private updateType(field: SchemaEntryEdit, type: SchemaEntryType) {
        field.type = type;
        this.handleChange();
    }

    @action
    private updateFieldId(properties:SchemaEntryEdit[], field: SchemaEntryEdit, newId: string) {
        this.validateField(properties, field, newId);

        field.id = newId;

        this.handleChange();
    }


    @action
    private addField(properties: SchemaEntryEdit[],index:number,isSubElement?:boolean): void {

        let tempTest = _.cloneDeep(this.props.entity)
        const field = {
            uid: Guid.create().toString(),
            id: 'field_' + (properties.length),
            type: 'string'
        };
        
        this.validateField(properties, field, field.id);
        
        if(!isSubElement){
            properties.splice(index, 0, field);
        }else{            
            if(!properties[index]){
                properties[index]=field;
            }
            
            properties[index].properties = [field];
        }

        
        this.handleChange();
    }

    @action
    private toggleOpen(key:string) {
        this.openedObjects[key] = !this.openedObjects[key];
    }

    private handleChange() {
        if (!this.props.onChange) {
            return;
        }

        this.props.onChange(this.props.entity);
    }

    private hasConflicts(properties:SchemaEntryEdit[], newId: string) {
        const conflicts = properties.filter((otherField) => otherField.id === newId);

        return conflicts.length > 0;
    }

    private validateField(properties:SchemaEntryEdit[], field: SchemaEntryEdit, newId: string) {
        if (this.hasConflicts(properties, newId)) {
            //ID already in use by sibling
            field.error = 'Field ID must be unique';
        } else if (!newId) {
            field.error = 'Field ID must not be empty';
        } else {
            delete field.error;
        }
    }

    private isOpen(key:string) {
        return this.openedObjects[key];
    }

    private renderAddFirstAddLine(field:SchemaEntryEdit[],depth:number,index:number){

        return (
            <div className={'field-row new'}  style={{marginLeft: depth * 24}}
                onClick={() => {
                    this.addField(field,index,true)
                }}>
                <div className="adder" >
                    <i className="fa fa-plus"/>
                </div>
                <div className={'field-name'}>
                    Add field
                </div>
            </div>
        )
    }

    private renderAddField(properties:SchemaEntryEdit[], depth:number,index:number) {
        return(
            <div className={'single-plus'} style={{ marginLeft: depth * 24 }}>
                <div className="single-plus"></div>
                <div onClick={() => this.addField(properties, index)}>
                    <PlusHexagon />
                </div>
            </div>
        )
    }
    
    private renderSubProperties(properties:SchemaEntryEdit[], depth:number, parentId?:string) {
        return (
            <> 
                {this.renderProperties(properties, depth, parentId)}
            </>
        );
    }

    private renderProperties(properties:SchemaEntryEdit[], depth:number, parentId?:string):JSX.Element {

        return (

            <SortableContainer list={properties} onChange={() => this.handleChange()} >
                <div className={'field-list-container'}>
             
                    {properties.map((field,index) => {

                            let type = toTypeName(field);
                            const objectType = isObject(field);
                            let key = parentId ? parentId + '.' + field.id : field.id;

                            const openerClass = toClass({
                                'fa fa-chevron-right':true,
                                'open': this.isOpen(key)
                            });

                            const fieldNameClass = toClass({
                                'field-name':true,
                                'error': !!field.error
                            });

                            const addClassNames=toClass({
                                "add-visible":this.isHovered===field.uid && !this.isOpen(key),
                                "add-hidden":this.isHovered!==field.uid
                            })

                            const isOpenable = (field.type === "object" && !isArray(field.properties));

                            return (
                                <div key={field.uid} 
                                     onMouseMove={(evt)=>{this.isHovered=field.uid; evt.stopPropagation() }} 
                                     onMouseLeave={(evt)=>{this.isHovered="";  evt.stopPropagation() }}>
                                
                                    <SortableItem item={field} handle={'.mover'}>
                                        <div className={'field-row data'} style={{marginLeft: depth * 24}}>
                                            <div className={'mover'}>
                                                <SVGGrabber />
                                            </div>
                                            <div className={'opener'}>
                                                {objectType &&
                                                <i className={openerClass} onClick={() => this.toggleOpen(key)} />
                                                }
                                            </div>
                                            <div className={fieldNameClass}>
                                                <SingleLineInput validation={["required"]} name="" label=""  type={Type.TEXT} value={field.id}
                                                       onChange={(_,value) => {this.updateFieldId(properties, field, value)}} />
                                            </div>
                                            <div className={'field-type'} onClick={(evt) => evt.stopPropagation()}>
                                                <EntityPicker name={'fieldType'}
                                                    value={type}
                                                    allowObject={true}
                                                    onChange={(type: SchemaEntryType) => { this.updateType(field, type) }} />

                                                <div className={"object-attribute-count"}>
                                                    {field.properties&& 
                                                    <>({field.properties.length})</>
                                                    }
                                                </div>
                                            </div>
                                            <div onClick={()=>{this.removeEntry(properties,field)}} className={'remover'}>
                                                <SVGDeleteHexagon/>
                                            </div>
                                   
                                        </div>
                                    </SortableItem>
                                    <div className={addClassNames}>
                                        {this.renderAddField(properties, depth,index)}
                                    </div>
                                    {objectType && this.isOpen(key) &&
                                        this.renderSubProperties(field.properties?field.properties:[], depth + 1, key)
                                    }
                                    { (this.isOpen(key) && isOpenable )
                                    && this.renderAddFirstAddLine(properties , depth+1,index)}
                                </div>
                            )
                        })
                    }
                </div>
            </SortableContainer>

        );
    }

    private isValidProperties(properties:SchemaEntryEdit[]) {
        for(let i = 0 ; i < properties.length; i++) {
            const entry = properties[i];

            if (!entry.id) {
                return false;
            }

            if (entry.error) {
                return false;
            }

            if (entry.items && entry.items.error) {
                return false;
            }

            if (entry.properties &&
                !this.isValidProperties(entry.properties)) {
                return false;
            }
        }

        return true;
    }

    private isValid() {
        if (!this.props.entity.name) {
            return false;
        }

        if (this.props.entity.properties.length < 1) {
            return false;
        }

        return this.isValidProperties(this.props.entity.properties);
    }

    render() {

        return (
            <FormContainer onSubmit={()=>{this.handleChange()}}>
                
            <div className={'entity-form'}> 

                <SingleLineInput
                    name={"name"}
                    value={this.props.entity.name}
                    label={"Entity name"}
                    validation={['required']}
                    onChange={(inputName, userInput)=>{this.props.entity.name = userInput.trim(); this.handleChange(); }} >                    
                </SingleLineInput>

                <div className={'field-rows'}>
                    <div className={'field-row header'}>
                        <div className={'mover'}/>
                        <div className={'opener'}/>
                        <div className={'field-name'}>
                            Field
                        </div>
                        <div className={'field-type'}>
                            Type
                        </div>
                        <div className={'field-sub-elements'}>
                            List
                        </div>
                        <div className={'remover'}/>
                    </div>
                    {this.renderSubProperties(this.props.entity.properties, 0)}
                </div>
            </div>
                <FormButtons>
                    <button type="button" onClick={() => {}}>Cancel</button>
                    <button type="submit">
                        {'Create' }
                    </button>
                </FormButtons>
            </FormContainer>
        );
    }
}