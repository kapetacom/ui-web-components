import React, { useState } from 'react';
import { EntityEditor } from '../src/entities/EntityEditor';
import { Entity, EntityType } from '@kapeta/schemas';
import { TYPE_INSTANCE, TYPE_INSTANCE_PROVIDER } from '../src';

export default {
    title: 'Entity Editor',
};

const ENTITIES: Entity[] = [
    {
        name: 'CoreVersions',
        type: EntityType.Enum,
        values: ['V1_2', 'V1_3', 'V1_4'],
    },
    {
        name: 'Core',
        type: EntityType.Dto,
        description: 'Core configuration',
        properties: {
            apiKey: {
                type: 'string',
                description: 'API key for the core service',
                secret: true,
                required: true,
            },
            enabled: {
                type: 'boolean',
                description: 'Enable core service?',
                defaultValue: 'true',
            },
            version: {
                ref: 'CoreVersions',
                description: 'Core version',
                defaultValue: 'CoreVersions.V1_3',
            },
            gateway: {
                ref: TYPE_INSTANCE,
                description: 'Gateway',
            },
            gatewayResource: {
                ref: TYPE_INSTANCE_PROVIDER,
                description: 'Gateway resource',
                required: true,
            },
        },
    },
    {
        name: 'ExternalService',
        type: EntityType.Dto,
        description: 'Configuration for external service',
        properties: {
            apiKey: {
                type: 'string',
                description: 'API key for the core service',
                secret: true,
                required: true,
            },
            ttl: {
                type: 'integer',
                description: 'How long to live',
            },
            url: {
                type: 'string',
                description: 'Enable core service?',
                defaultValue: '"https://api.some-service.com/"',
                required: true,
            },
        },
    },
];

export const CreateMultipleEntities = () => {
    const [value, setValue] = useState({});

    return (
        <div style={{ width: '450px' }}>
            <EntityEditor
                entities={ENTITIES}
                value={value}
                onChange={(val) => {
                    setValue(val);
                    console.log(val);
                }}
            />
        </div>
    );
};

export const EditMultipleEntities = () => {
    const [value, setValue] = useState<any>({
        Core: {
            version: 'V1_4',
            enabled: false,
            apiKey: 'some-key',
        },
        ExternalService: {
            apiKey: 'other-key',
            ttl: 1000,
            url: 'https://api.other-service.com/',
        },
    });

    return (
        <div style={{ width: '450px' }}>
            <EntityEditor
                entities={ENTITIES}
                instances={[
                    {
                        name: 'Gateway',
                        id: 'gateway',
                        providers: [
                            {
                                name: 'users',
                                portType: 'web',
                            },
                            {
                                name: 'tasks',
                                portType: 'web',
                            },
                        ],
                    },
                    {
                        name: 'Users UI',
                        id: 'user-ui',
                        providers: [
                            {
                                name: 'users',
                                portType: 'web',
                            },
                        ],
                    },
                    {
                        name: 'User Service',
                        id: 'users',
                        providers: [
                            {
                                name: 'users',
                                portType: 'rest',
                            },
                        ],
                    },
                ]}
                value={value}
                onChange={(val) => {
                    setValue(val);
                    console.log(val);
                }}
            />
        </div>
    );
};
