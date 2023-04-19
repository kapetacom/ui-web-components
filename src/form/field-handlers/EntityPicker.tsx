import React from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { Modal, ModalSize } from '../../modal/Modal';
import { EntityForm } from '../../entities/EntityForm';
import { FormContainer } from '../FormContainer';
import { FormButtons } from '../FormButtons';
import { EntityFormModel } from '../../entities/EntityFormModel';

import './EntityPicker.less';
import { FormSelect } from '../inputs/FormSelect';
import { Checkbox } from '../Checkbox';
import { Entity, EntityType, EntityProperty } from '@kapeta/schemas';

const CREATE_VALUE = '__create__';

interface EntityPickerProps {
    name: string;
    value: EntityProperty;
    onChange: (a: EntityProperty) => void;
    allowVoid?: boolean;
    allowObject?: boolean;
    entities?: string[];
    onEntityCreated?: (entity: Entity) => void;
    label?: string;
    help?: string;
}

interface ParsedValue {
    list: boolean;
    type: string;
}

@observer
export class EntityPicker extends React.Component<EntityPickerProps> {
    @observable
    private newEntity: EntityFormModel = new EntityFormModel();

    private createEntityModal: Modal | null = null;

    constructor(props: EntityPickerProps) {
        super(props);
        makeObservable(this);
    }

    private asValue = (): ParsedValue => {
        const value = this.props.value;
        let stringName = '';
        if (value.type) {
            stringName = value.type;
        } else if (value) {
            stringName = value.ref;
        }
        const isList = stringName.endsWith('[]');
        if (isList) {
            stringName = stringName.substring(0, stringName.length - 2);
        }
        return {
            list: isList,
            type: stringName,
        };
    };

    private handleOnChange = (parsedValue: ParsedValue) => {
        let value = parsedValue.type;
        if (parsedValue.list) {
            value += '[]';
        }

        if (value.startsWith('ref:')) {
            this.props.onChange({
                ref: value.substring(5),
            });
        } else {
            this.props.onChange({ type: value });
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
    private closeModal = () => {
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
        this.newEntity = new EntityFormModel({
            type: EntityType.Dto,
            name: 'NewEntity',
            properties: {},
        });
    };

    @action
    private saveEntity = () => {
        if (this.createEntityModal) {
            this.createEntityModal.close();
        }

        if (this.props.onEntityCreated && this.newEntity) {
            this.props.onEntityCreated(this.newEntity.getData());
        }

        const parsedValue = this.asValue();
        parsedValue.type = 'ref:' + this.newEntity.name;

        this.handleOnChange(parsedValue);
    };

    render() {
        const parsedValue = this.asValue();
        const isVoid = () => {
            return parsedValue.type === 'void';
        };

        let currentType = parsedValue.type;
        if (typeof this.props.value !== 'string' && this.props.value && this.props.value.ref) {
            currentType = 'ref:' + currentType;
        }

        let options: { [key: string]: string } = {
            string: 'string',
            integer: 'integer',
            double: 'double',
            float: 'float',
            long: 'long',
            short: 'short',
            boolean: 'boolean',
            char: 'char',
            byte: 'byte',
        };

        if (this.props.allowObject) {
            options['object'] = 'object';
        }
        if (this.props.allowVoid) {
            options['void'] = 'void';
        }
        if (this.props.entities) {
            this.props.entities.forEach((item, ix) => {
                options[item] = 'ref:' + item;
            });
        }
        return (
            <>
                <div className={'entity-picker'}>
                    <FormSelect
                        value={parsedValue.type}
                        validation={['required']}
                        label={this.props.label ? this.props.label : ''}
                        name={''}
                        help={this.props.help ? this.props.help : ''}
                        onChange={(_, value) => {
                            this.onSelectHandler(value);
                        }}
                        options={options}
                    />
                    {!isVoid() && (
                        <Checkbox
                            onClick={this.toggleList}
                            value={parsedValue.list}
                            disabled={this.props.value.type === ''}
                        />
                    )}

                    <Modal
                        ref={(ref) => (this.createEntityModal = ref)}
                        size={ModalSize.medium}
                        onClose={this.closeModal}
                        title={'Create entity'}
                    >
                        <FormContainer onSubmit={this.saveEntity}>
                            <EntityForm name={'new-entity'} entity={this.newEntity} />

                            <FormButtons>
                                <button type={'button'} onClick={this.closeModal}>
                                    Cancel
                                </button>
                                <button type={'submit'}>Create</button>
                            </FormButtons>
                        </FormContainer>
                    </Modal>
                </div>
            </>
        );
    }
}
