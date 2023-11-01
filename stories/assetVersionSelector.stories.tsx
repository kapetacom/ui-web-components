/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useContext } from 'react';
import { FormContainer, FormContext } from '../src';
import { AssetVersionSelector } from '../src/form/field-handlers/AssetVersionSelector';
import { IconType } from '@kapeta/schemas';

export default {
    title: 'Asset Version Selector',
};

const FormState = () => {
    const context = useContext(FormContext);
    return (
        <>
            <pre>{JSON.stringify(context.container?.context)}</pre>
            <pre>{JSON.stringify(context.container?.state, null, 4)}</pre>
        </>
    );
};

export const MultipleNamesAndVersions = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer
                initialValue={{
                    name: 'kapeta/block-type-frontend:20.2.1',
                }}
            >
                <AssetVersionSelector
                    validation={['required']}
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[
                        ...[
                            'kapeta/block-type-service:11.2.0',
                            'kapeta/block-type-service:11.1.0',
                            'kapeta/block-type-service:12.2.0',
                            'kapeta/block-type-service:10.2.1',
                            'kapeta/block-type-service:11.2.2',
                            'kapeta/block-type-service:11.2.6',
                        ].map((ref) => ({
                            ref,
                            title: 'Service',
                            kind: 'core/block-type',
                        })),

                        ...[
                            'kapeta/block-type-frontend:21.2.0',
                            'kapeta/block-type-frontend:21.1.0',
                            'kapeta/block-type-frontend:22.2.0',
                            'kapeta/block-type-frontend:20.2.1',
                            'kapeta/block-type-frontend:21.2.2',
                            'kapeta/block-type-frontend:21.2.6',
                        ].map((ref) => ({
                            ref,
                            title: 'Frontend',
                            kind: 'core/block-type',
                        })),

                        ...[
                            'kapeta/block-type-desktop:31.2.0',
                            'kapeta/block-type-desktop:31.1.0',
                            'kapeta/block-type-desktop:32.2.0',
                            'kapeta/block-type-desktop:30.2.1',
                            'kapeta/block-type-desktop:31.2.2',
                            'kapeta/block-type-desktop:31.2.6',
                        ].map((ref) => ({
                            ref,
                            title: 'Desktop',
                            kind: 'core/block-type',
                        })),
                    ]}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const SingleNameMultiVersions = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer initialValue={{}}>
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.1.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:2.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.4',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:5.2.0',
                            title: 'Service',
                        },
                    ]}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const SingleNameMultiVersionsWithValue = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer
                initialValue={{
                    name: 'kapeta/block-type-service:1.2.0',
                }}
            >
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.1.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:2.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.4',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:5.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:local',
                            title: 'Service',
                        },
                    ]}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const ValueWithUnknownVersion = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer
                initialValue={{
                    name: 'kapeta/block-type-service:9.2.3',
                }}
            >
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.1.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:2.2.0',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.2.4',
                            title: 'Service',
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:5.2.0',
                            title: 'Service',
                        },
                    ]}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const MultiNameSingleVersions = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer initialValue={{}}>
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-service:1.1.0',
                            title: 'Service',
                            icon: {
                                type: IconType.URL,
                                value: 'https://storage.googleapis.com/kapeta-public-cdn/icons/frontend.svg',
                            },
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-frontend:0.1.6',
                            title: 'Service',
                            icon: {
                                type: IconType.URL,
                                value: 'https://storage.googleapis.com/kapeta-public-cdn/icons/service.svg',
                            },
                        },
                        {
                            kind: 'core/block-type',
                            ref: 'kapeta/block-type-desktop:3.1.0',
                            title: 'Desktop',
                            icon: {
                                type: IconType.Fontawesome5,
                                value: 'fas fa-desktop',
                            },
                        },
                    ]}
                    validation={['required']}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const Empty = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer initialValue={{}}>
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[]}
                    validation={['required']}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};

export const EmptyButWithValue = () => {
    return (
        <div style={{ width: '350px' }}>
            <FormContainer
                initialValue={{
                    name: 'kapeta/block-type-frontend:1.2.2',
                }}
            >
                <AssetVersionSelector
                    label={'Name'}
                    name={'name'}
                    help={'Choose block type'}
                    assetTypes={[]}
                    validation={['required']}
                />
                <FormState />
            </FormContainer>
        </div>
    );
};
