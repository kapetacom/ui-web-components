import React from "react";
import {action, observable } from "mobx";
import {observer} from "mobx-react";

import {toClass} from '@blockware/ui-web-utils';
import {SchemaEntity, SchemaEntryType} from "@blockware/ui-web-types";
import {Modal, ModalSize} from "../../modal/Modal";
import {EntityForm} from "../../entities/EntityForm";
import {FormContainer} from "../FormContainer";
import {FormButtons} from "../FormButtons";
import {EntityFormModel} from "../../entities/EntityFormModel";

import './EntityPicker.less';
import { DropdownInput } from "../inputs/DropdownInput";

const CREATE_VALUE = '__create__';

interface EntityPickerProps {
    name: string
    value: SchemaEntryType
    onChange: (a: SchemaEntryType) => void
    allowVoid?: boolean
    allowObject?: boolean
    entities?: string[]
    onEntityCreated?: (entity: SchemaEntity) => void
}

interface ParsedValue {
    list: boolean
    type: string
}

@observer
export class EntityPicker extends React.Component<EntityPickerProps> {

    @observable
    private newEntity:EntityFormModel = new EntityFormModel();

    private createEntityModal: Modal | null = null;

    private asValue = (): ParsedValue => {
        const value = this.props.value;
        let stringName = '';
        if (typeof value === 'string') {
            stringName = value;
        } else if (value) {
            stringName = value.$ref;
        }
        const isList = stringName.endsWith('[]');
        if (isList) {
            stringName = stringName.substr(0, stringName.length - 2);
        }
        return {
            list: isList,
            type: stringName
        };
    };

    private handleOnChange = (parsedValue: ParsedValue) => {
        let value = parsedValue.type;
        if (parsedValue.list) {
            value += '[]';
        }
        
        if (value.startsWith('$ref:')) {
            this.props.onChange({
                $ref: value.substr(5)
            });
        } else {
            this.props.onChange(value);
        }
    };

    @action
    private onSelectHandler = (value: string) => {
        
        if (value === CREATE_VALUE) {
            this.openModal();
            return;
        }

        const parsedValue = this.asValue();
        parsedValue.type = value;
        this.handleOnChange(parsedValue);
    };

    @action
    private toggleList = () => {
        const parsedValue = this.asValue();
        parsedValue.list = !parsedValue.list;
        this.handleOnChange(parsedValue);
    };

    @action
    private closeModal = () => {
        if (this.createEntityModal) {
            this.createEntityModal.close();
        }
    };

    @action
    private openModal = () => {
        if (!this.createEntityModal) {
            return;
        }

        this.createEntityModal.open();
        this.newEntity = new EntityFormModel({name:'NewEntity', properties:{}});
    };

    @action
    private saveEntity = () =>  {
        if (this.createEntityModal) {
            this.createEntityModal.close();
        }

        if (this.props.onEntityCreated && this.newEntity) {
            this.props.onEntityCreated(this.newEntity.getData());
        }

        const parsedValue = this.asValue();
        parsedValue.type = '$ref:' + this.newEntity.name;

        this.handleOnChange(parsedValue);
    };


    render() {
        const parsedValue = this.asValue();
        const isVoid = () => {
            return parsedValue.type === 'void';
        };

        let currentType = parsedValue.type;
        if (typeof this.props.value !== 'string' &&
            (this.props.value && this.props.value.$ref)) {
            currentType = '$ref:' + currentType;
        }

        const checkBoxCheckClassName =toClass( {
            "list-option-icon":true,
            "list-check":true,
            "checked":parsedValue.list,
        })
        const checkBoxBoxClassName =toClass( {
            "list-option-icon":true,
            "check-box":true,
            "checked":parsedValue.list,
        })

        let options:{[key:string]:string} ={
            "string":"string",
            "integer":"integer",
            "double":"double",
            "float":"float",
            "long":"long",
            "short":"short",
            "boolean":"boolean",
            "char":"char",
            "byte":"byte",
             };
              
        if(this.props.allowObject){
            options["object"]="object";                
        }
        if(this.props.allowVoid){
            options["void"]="void";                
            
        }
        if(this.props.entities){
            this.props.entities.forEach((item, ix) => {
                options[item]="$ref:" + item;
            })
        }
        return (
            <>
                <div className={"entity-picker"}>
                    <DropdownInput value={parsedValue.type} validation={["required"]} label="" name="" 
                        onChange={(_,value)=>{
                            
                            this.onSelectHandler(value)
                        }} 
                        options={options}  />
                    {!isVoid() &&
                        <div className={"picker-list-section"} onClick={this.toggleList} >
                            <input className={"picker-list-checkbox"} type="checkbox"
                                defaultChecked={parsedValue.list}
                                disabled={this.props.value === ""} />

                            <div className={checkBoxCheckClassName}>
                                <svg width="20" height="20" viewBox="0 -2 14 12" fill="none" >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5 10L0 5.19231L1.4 3.84615L5 7.30769L12.6 0L14 1.34615L5 10Z" fill="#009AA9"/>
                                </svg>
                            </div>    
                            <div className={checkBoxBoxClassName}>
                                <svg width="20" height="20" viewBox="0 -2 20 20" fill="none" >
                                    <path d="M1 3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V3Z" stroke="#908988" strokeWidth="2" strokeLinejoin="round"/>
                                </svg>
                            </div>                 
                        </div>
                    }

                    <Modal ref={(ref) => this.createEntityModal = ref}
                           size={ModalSize.medium}
                           onClose={this.closeModal}
                           title={'Create entity'}>
                        <FormContainer onSubmit={this.saveEntity}>
                            <EntityForm name={'new-entity'} entity={this.newEntity}/>

                            <FormButtons>
                                <button type={'button'} onClick={this.closeModal}>Cancel</button>
                                <button type={'submit'}>Create</button>
                            </FormButtons>
                        </FormContainer>

                    </Modal>
                </div>
            </>
        );
    }
};