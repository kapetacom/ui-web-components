/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import {
    Activity,
    ActivityType,
    AssetDisplay,
    AssetFetcher,
    AssetStats,
    AssetVersionInfo,
    Branch,
    CoreTypes,
    Version,
} from '../src/blockhub/types';

export const Stats: AssetStats = {
    deployed: 3,
    downloads: 92211,
    stars: 3,
};

// Defining new kinds
export const FrontendBlockTypeAsset: AssetDisplay = {
    version: '1.0.1',
    created: new Date(),
    lastModified: new Date(),
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [{ name: 'kapeta/language-target-react-ts:1.0.1', type: 'Language target' }],
    dependants: [{ name: 'kapeta/user-admin', type: 'Blocks' }],
    content: {
        kind: CoreTypes.BLOCK_TYPE,
        metadata: {
            title: 'Frontend',
            version: '1.0.1',
            name: 'kapeta/frontend',
            visibility: 'public',
            description: 'Provides frontend blocks to system',
        },
        spec: {},
    },

    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const ServiceBlockTypeAsset: AssetDisplay = {
    version: '1.0.1',
    created: new Date(),
    lastModified: new Date(),

    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [],
    dependants: [
        { name: 'kapeta/user-admin:1.3.4', type: 'Blocks' },
        { name: 'kapeta/user-service:1.0.1', type: 'Blocks' },
    ],
    content: {
        kind: CoreTypes.BLOCK_TYPE,
        metadata: {
            title: 'Service',
            name: 'kapeta/service',
            visibility: 'public',
            description: 'Provides frontend blocks to system',
        },
        spec: {},
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const LanguageTargetAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    artifact: {
        type: 'npm',
        details: {
            name: '@kapeta/provider-block-service',
            version: '0.0.24',
            registry: 'http://npm.localhost:9800/',
        },
    },
    version: '1.0.1',
    dependencies: [],
    dependants: [],
    content: {
        kind: CoreTypes.LANGUAGE_TARGET,
        metadata: {
            title: 'React / Typescript',
            version: '1.0.1',
            name: 'kapeta/language-target-react-ts',
            visibility: 'public',
            description:
                'Generate block frontend code in ReactJS using Typescript. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc.',
        },
        spec: {},
    },
    readme: {
        type: 'text',
        content: `# Simple text
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const DeploymentTargetAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    dependencies: [],
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    content: {
        kind: CoreTypes.DEPLOYMENT_TARGET,
        metadata: {
            title: 'Google Cloud Platform',
            version: '1.0.1',
            name: 'kapeta/deployment-target-gcp',
            visibility: 'private',
            description: 'Deploy to Google Cloud Platform on Kubernetes (GKE)',
        },
        spec: {},
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const ProviderOperatorAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    dependencies: [],
    dependants: [{ name: 'kapeta/user-service:1.0.1', type: 'Blocks' }],
    version: '4.0.1',
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    content: {
        kind: CoreTypes.PROVIDER_OPERATOR,
        metadata: {
            title: 'User',
            version: '4.0.1',
            name: 'kapeta/mongodb',
            visibility: 'private',
            description: 'Use MongoDB in your plans',
        },
        spec: {},
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const ProviderInternalAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [],
    dependants: [{ name: 'kapeta/user-service:1.0.1', type: 'Blocks' }],
    content: {
        kind: CoreTypes.PROVIDER_INTERNAL,
        metadata: {
            title: 'REST API',
            version: '1.0.1',
            name: 'kapeta/rest-api',
            visibility: 'private',
            description: 'Provides REST API in your plans',
        },
        spec: {},
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

// Using core types

export const BlockGroupAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [
        { name: 'kapeta/user-service:1.0.1', type: 'Blocks' },
        { name: 'kapeta/user-admin:1.3.4', type: 'Blocks' },
    ],
    dependants: [{ name: 'hofmeister/todo:1.0.1', type: 'Blocks' }],
    content: {
        kind: CoreTypes.BLOCK_GROUP,
        metadata: {
            title: 'User Admin System',
            version: '1.0.1',
            name: 'kapeta/user-admin-system',
            visibility: 'private',
            description: 'A simple todo system',
        },
        spec: {
            blocks: [
                {
                    block: {
                        ref: 'blockhub://kapeta/user-service:1.0.1',
                    },
                    title: 'User Service',
                },
                {
                    block: {
                        ref: 'blockhub://kapeta/user-admin:1.3.4',
                    },
                    title: 'User Admin',
                },
            ],
        },
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const PlanAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [
        { name: 'kapeta/user-admin-system:1.0.1', type: 'Plan' },
        { name: 'kapeta/user-admin:1.3.4', type: 'Blocks' },
    ],
    content: {
        kind: CoreTypes.PLAN,
        metadata: {
            title: 'My Todo System',
            version: '1.0.1',
            name: 'hofmeister/todo',
            visibility: 'private',
            description: 'A simple todo system',
        },
        spec: {
            blocks: [
                {
                    block: {
                        ref: 'blockhub://kapeta/user-admin-system:1.0.1',
                    },
                    title: 'User Admin system',
                },
                {
                    block: {
                        ref: 'blockhub://kapeta/user-admin:1.3.4',
                    },
                    title: 'User Admin',
                },
            ],
        },
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const DeploymentAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/todo',
            remote: 'origin',
            path: '.',
        },
    },
    dependencies: [{ name: 'hofmeister/todo:1.0.1', type: 'Blocks' }],
    content: {
        kind: CoreTypes.DEPLOYMENT,
        metadata: {
            title: 'Staging for Todo',
            version: '1.0.1',
            name: 'kapeta/todo-staging',
            visibility: 'private',
            description: 'Staging system for my todo plan',
        },
        spec: {
            target: {
                kind: 'kapeta/deployment-target-gcp',
                options: {
                    scale: 'development',
                },
            },
            plan: {
                name: 'kapeta://hofmeister/todo',
                version: '1.0.0',
            },
        },
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

// Custom types

export const FrontendBlockAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.3.4',
    dependencies: [{ name: 'kapeta/frontend:1.0.1', type: 'Blocks' }],
    dependants: [
        { name: 'kapeta/user-admin-system:1.0.1', type: 'Plan' },
        { name: 'hofmeister/todo:1.0.1', type: 'Blocks' },
    ],
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/provider-block-frontend',
            remote: 'origin',
            path: '.',
        },
    },
    artifact: {
        type: 'docker',
        details: {
            name: 'kapeta/user-admin',
            primary: 'kapeta/user-admin:1.3.4',
            tags: ['1.3.4'],
        },
    },
    content: {
        kind: 'kapeta/frontend',
        metadata: {
            title: 'User Admin',
            name: 'kapeta/user-admin',
            visibility: 'private',
            description: 'Contains user admin UI functionality',
        },
        spec: {
            target: {
                kind: 'kapeta/language-target-react-ts',
                options: {
                    react_version: '18',
                    typescript: '4',
                },
            },
        },
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const ServiceBlockAsset: AssetDisplay = {
    created: new Date(),
    lastModified: new Date(),
    version: '1.0.1',
    dependencies: [
        { name: 'kapeta/service:1.0.1', type: 'Kind' },
        { name: 'kapeta/rest-api:1.0.1', type: 'Providers' },
        { name: 'kapeta/mongodb:4.0.1', type: 'Providers' },
    ],
    dependants: [{ name: 'kapeta/user-admin-system:1.0.1', type: 'Plan' }],
    repository: {
        type: 'git',
        branch: 'master',
        main: true,
        commit: '8bc48d4f4407abb10fbc687600ed528f99f72cbc',
        details: {
            url: 'https://github.com/kapetacom/provider-block-service',
            remote: 'origin',
            path: '.',
        },
    },
    artifact: {
        type: 'docker',
        details: {
            name: 'kapeta/user-service',
            primary: 'kapeta/user-service:1.0.1',
            tags: ['1.0.1'],
        },
    },
    content: {
        kind: 'kapeta/service',
        metadata: {
            title: 'User',
            version: '1.0.1',
            name: 'kapeta/user-service',
            visibility: 'private',
            description: 'Provides basic user functionality',
        },
        spec: {
            target: {
                kind: 'kapeta/language-target-react-ts',
                options: {
                    react_version: '18',
                    typescript: '4',
                },
            },
        },
    },
    readme: {
        type: 'markdown',
        content: `# Markdown
Goes here
    
* Test1
* Test2
* Test3
    `,
    },
    downloadCount: 92211,
    rating: 3,
};

export const Assets: AssetDisplay[] = [
    FrontendBlockTypeAsset,
    ServiceBlockTypeAsset,
    LanguageTargetAsset,
    DeploymentTargetAsset,
    ProviderOperatorAsset,
    ProviderInternalAsset,
    BlockGroupAsset,
    PlanAsset,
    DeploymentAsset,
    FrontendBlockAsset,
    ServiceBlockAsset,
];

export const assetFetcher: AssetFetcher = async (name: string, version: string) => {
    return Assets.find((a) => a.version === version && a.content.metadata.name === name);
};

export const AssetAuthor = {
    name: 'Henrik Hofmeister',
    handle: 'hofmeister',
};
const commit = '85bb1e19d6e87c59e6bd864ebda5b1f04bc01937';

export const PrimaryVersions: Version[] = [
    {
        author: AssetAuthor,
        created: new Date(),
        id: '2.0.1',
        current: true,
        commit,
    },
    {
        author: AssetAuthor,
        created: new Date(),
        id: '1.7.0',
        commit,
    },
    {
        author: AssetAuthor,
        created: new Date(),
        id: '1.5.6',
        commit,
    },
    {
        author: AssetAuthor,
        created: new Date(),
        id: '1.5.5',
        commit,
    },
];

export const VersionBranches: Branch[] = [
    {
        id: 'fix-1234',
        version: {
            author: AssetAuthor,
            created: new Date(),
            id: '2.0.1',
            commit,
        },
    },
    {
        id: 'issue-33',
        version: {
            author: AssetAuthor,
            created: new Date(),
            id: '1.7.0',
            commit,
        },
    },
];

export const VersionInfo: AssetVersionInfo = {
    branches: VersionBranches,
    primary: PrimaryVersions,
};

export const ActivityData: Activity[] = [
    {
        author: AssetAuthor,
        type: 'asset_deployed',
        created: new Date(),
        message: 'deployed **kapeta/user-service** to deployment **acne/staging**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_UPDATED,
        created: new Date(),
        message: 'updated **kapeta/user-service** to version **2.1.0**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_UPDATED,
        created: new Date(),
        message: 'updated **kapeta/user-service** to version **2.0.0**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_CREATED,
        created: new Date(),
        message: 'created **kapeta/user-service**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_DELETED,
        created: new Date(),
        message: 'deleted **kapeta/user-service**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_UPDATED,
        created: new Date(),
        message: 'updated **kapeta/user-service** to version **1.2.3**',
    },
    {
        author: AssetAuthor,
        type: ActivityType.ASSET_CREATED,
        created: new Date(),
        message: 'created **kapeta/user-service**',
    },
];
