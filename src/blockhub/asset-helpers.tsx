import {
    AssetCoreDisplay,
    AssetArtifactInfo,
    AssetRepositoryInfo,
    CoreTypes,
    DockerDetails,
    NPMDetails,
    MavenDetails,
    YAMLDetails,
} from './types';
import { DateTime } from 'luxon';
import React from 'react';
import { SchemaKind } from '@kapeta/ui-web-types';

export const CORE_PREFIX = 'core/';

export function isExtensionKind(kind: string) {
    return (
        [
            CoreTypes.BLOCK_TYPE,
            CoreTypes.LANGUAGE_TARGET,
            CoreTypes.DEPLOYMENT_TARGET,
            CoreTypes.PROVIDER_INTERNAL,
            CoreTypes.PROVIDER_OPERATOR,
        ]
            .map((k) => k.toLowerCase())
            .indexOf(kind.toLowerCase()) > -1
    );
}

export function getIdentifier(asset: AssetCoreDisplay) {
    return asset.content.metadata.name;
}

export function getShortKind(asset: AssetCoreDisplay) {
    let kind = asset.content.kind;
    if (kind.startsWith(CORE_PREFIX)) {
        kind = kind.substring(CORE_PREFIX.length);
    }

    return kind;
}

export function renderRepository(repository: AssetRepositoryInfo) {
    if (repository.type === 'none') {
        return <div className={'repository none'}>Not version controlled</div>;
    }

    const isGithubUrl = repository.details.url.startsWith('git@github.com:');

    const provider = isGithubUrl ? 'github' : 'other';

    const iconClass = provider === 'github' ? `fab fa-github` : 'fa fa-code-branch';

    let shortUrl = repository.details.url;
    let url = repository.details.url;
    if (isGithubUrl) {
        shortUrl = url.substring('git@github.com:'.length);
        shortUrl = shortUrl.substring(0, shortUrl.length - 4);
        url = 'https://github.com/' + shortUrl;
    }

    return (
        <div className={'repository'}>
            <a href={url} target={'_blank'}>
                <i className={iconClass} />
                {shortUrl}
            </a>
            <div className={'commit'}>
                <span className={'name'}>commit</span>
                {repository.commit.substring(0, 6)}
            </div>
            {repository.branch && (
                <div className={'branch'}>
                    <span className={'name'}>branch</span>
                    {repository.branch}
                </div>
            )}
        </div>
    );
}

export function renderArtifact(artifact: AssetArtifactInfo<any>) {
    switch (artifact.type) {
        case 'docker':
            const dockerDetails = artifact.details as DockerDetails;
            return (
                <span className={'artifact'}>
                    <i className="fab fa-docker"></i>
                    {dockerDetails.primary}
                </span>
            );
        case 'npm':
            const npmDetails = artifact.details as NPMDetails;
            return (
                <span className={'artifact'}>
                    <i className="fab fa-npm"></i>
                    {npmDetails.name}:{npmDetails.version}
                </span>
            );
        case 'maven':
            const mavenDetails = artifact.details as MavenDetails;
            return (
                <span className={'artifact'}>
                    <i className="fab fa-java"></i>
                    {mavenDetails.groupId}:{mavenDetails.artifactId}:{mavenDetails.version}
                </span>
            );
        case 'yaml':
            const yamlDetails = artifact.details as YAMLDetails;
            return (
                <span className={'artifact'}>
                    <i className="fab fa-file-alt"></i>
                    {yamlDetails.name}:{yamlDetails.version}
                </span>
            );
    }

    return <></>;
}

export function isPublic(content: SchemaKind) {
    return content.metadata.visibility === 'public';
}

export function renderDatetime(date: Date | number) {
    const dt = typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromJSDate(date);
    return dt.toFormat('yyyy-MM-dd HH:mm:ss');
}
