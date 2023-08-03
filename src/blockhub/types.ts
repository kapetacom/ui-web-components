import { Asset, SchemaKind } from '@kapeta/ui-web-types';

export type AssetFetcher = (name: string, version: string) => Promise<AssetDisplay>;

export enum CoreTypes {
    CORE = 'core/core',
    BLOCK_TYPE = 'core/block-type',
    BLOCK_TYPE_OPERATOR = 'core/block-type-operator',
    BLOCK_GROUP = 'core/block-type-group',
    PLAN = 'core/plan',
    LANGUAGE_TARGET = 'core/language-target',
    DEPLOYMENT_TARGET = 'core/deployment-target',
    DEPLOYMENT = 'core/deployment',
    PROVIDER_INTERNAL = 'core/resource-type-internal',
    PROVIDER_OPERATOR = 'core/resource-type-operator',
    PROVIDER_EXTENSION = 'core/resource-type-extension',
}

export enum ActivityType {
    ASSET_CREATED = 'asset_created',
    ASSET_DELETED = 'asset_deleted',
    ASSET_UPDATED = 'asset_updated',
}

export interface Activity {
    created: Date;
    message: string;
    type: string | ActivityType;
    author: Author;
}

export interface Author {
    name: string;
    handle: string;
}

export interface Version {
    id: string;
    current?: boolean;
    created: Date;
    commit: string;
    author: Author;
}

export interface Branch {
    id: string;
    version: Version;
}

export interface AssetVersionInfo {
    branches?: Branch[];
    primary: Version[];
}

export interface DockerDetails {
    name?: string;
    primary: string;
    tags: string[];
}

export interface NPMDetails {
    name: string;
    version: string;
    registry: string;
}

export interface MavenDetails {
    groupId: string;
    artifactId: string;
    version: string;
    registry: string;
}

export interface YAMLDetails {
    name: string;
    version: string;
}

export interface AssetStats {
    stars: number;
    deployed: number;
    downloads: number;
}

export interface AssetArtifactInfo<T> {
    type: string;
    details: T;
}

export interface AssetRepositoryInfo {
    type: 'git' | 'none';
    main: boolean;
    branch: string;
    commit: string;
    details: {
        url: string;
        remote: string;
        path: string;
    };
}

export interface AssetCoreDisplay {
    version: string;
    content: SchemaKind;
}

export interface AssetSimpleDisplay extends AssetCoreDisplay {
    checksum?: string;
    createdBy?: string;
    created?: Date;
    lastModifiedBy?: string;
    lastModified?: Date;
}

export interface Dependency {
    type: 'Kind' | 'Providers' | 'Consumers' | 'Language target' | 'Deployment target' | 'Blocks' | 'Plan';
    name: string;
}

export interface AssetDisplay<T = any> extends AssetSimpleDisplay {
    repository?: AssetRepositoryInfo;
    artifact?: AssetArtifactInfo<T>;
    readme: {
        type: string;
        content: string;
    };
    dependencies?: Dependency[];
    dependants?: Dependency[];
    downloadCount?: number;
    rating?: number;
}
