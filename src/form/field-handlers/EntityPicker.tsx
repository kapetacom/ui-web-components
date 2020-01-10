import React from "react";
import {action, observable } from "mobx";
import {observer} from "mobx-react";

import {toggleClasses} from '@blockware/ui-web-utils';
import {SchemaEntity, SchemaEntryType} from "@blockware/ui-web-types";

import {Modal, ModalSize} from "../../modal/Modal";
import {EntityForm} from "../../entities/EntityForm";
import {FormContainer} from "../FormContainer";
import {FormButtons} from "../FormButtons";
import {EntityFormModel} from "../../entities/EntityFormModel";

import './EntityPicker.less';

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
        if (parsedValue.type.startsWith('$ref:')) {
            this.props.onChange({
                $ref: value.substr(5)
            });
        } else {
            this.props.onChange(value);
        }
    };

    @action
    private onSelectHandler = (event: any) => {

        if (event.target.value === CREATE_VALUE) {
            this.openModal();
            return;
        }
        const parsedValue = this.asValue();
        parsedValue.type = event.target.value;
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
    private updateEntity = (entity:SchemaEntity) => {
        this.newEntity = new EntityFormModel(entity);
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

        const typeName = (name:string) => {

            if (parsedValue.list) {
                return name + '[]';
            }

            return name;
        };

        const isVoid = () => {
            return parsedValue.type === 'void';
        };

        let currentType = parsedValue.type;
        if (typeof this.props.value !== 'string' &&
            this.props.value.$ref) {
            currentType = '$ref:' + currentType;
        }

        return (
            <>
                <div className={"entity-picker"}>
                    <select value={currentType} onChange={this.onSelectHandler} >
                        <optgroup label={"Built-in"} >
                            <option value={""} >Select...</option>
                            <option value={"string"} >{typeName('String')}</option>
                            <option value={"integer"} >{typeName('Integer')}</option>
                            <option value={"double"} >{typeName('Double')}</option>
                            <option value={"float"} >{typeName('Float')}</option>
                            <option value={"long"} >{typeName('Long')}</option>
                            <option value={"short"} >{typeName('Short')}</option>
                            <option value={"boolean"} >{typeName('Boolean')}</option>
                            <option value={"char"} >{typeName('Char')}</option>
                            <option value={"byte"} >{typeName('Byte')}</option>
                            {this.props.allowVoid &&
                            <option value={"void"} >Void</option>
                            }
                            {this.props.allowObject &&
                            <option value={"object"} >{typeName('Object')}</option>
                            }
                        </optgroup>
                        {this.props.entities &&
                        <optgroup label={"Entities"} >
                            {this.props.entities.map((item, ix) => {
                                return <option key={ix} value={"$ref:" + item}>{typeName(item)}</option>
                            })}
                            <option value={CREATE_VALUE} >Create...</option>
                        </optgroup>
                        }
                    </select>
                    {!isVoid() &&
                    <div className={"picker-list-section"}>
                        <input className={"picker-list-checkbox"} type="checkbox"
                               defaultChecked={parsedValue.list}
                               disabled={this.props.value === ""} />
                        <i onClick={this.toggleList} className={toggleClasses('fad fa-list', 'fas fa-list', parsedValue.list)} />
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