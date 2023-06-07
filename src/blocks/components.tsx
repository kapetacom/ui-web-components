import React, { useMemo } from 'react';
import { useBlock } from './hooks';
import { SVGAutoSizeText } from '../svg/SVGAutoSizeText';
import { BlockContextProvider } from './context';
import { BlockDefinition, BlockInstance } from '@kapeta/schemas';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { InstanceStatus } from '@kapeta/ui-web-context';

export const BlockInstanceName = (props: { onChange?: (instanceName: string) => void }) => {
    const block = useBlock();
    const onChange = props.onChange || block.callbacks.onInstanceNameChange;

    return (
        <SVGAutoSizeText
            className="block-body-text instance-name"
            y={0}
            x={0}
            lineHeight={24}
            maxHeight={36}
            maxWidth={150}
            maxChars={15}
            maxLines={2}
            onChange={block.readOnly && onChange ? undefined : (name) => onChange.call(null, name)}
            value={block.instance.name}
        />
    );
};

export const BlockStatus = () => {
    const block = useBlock();
    return block.status ? <circle className={`instance_${block.status}`} r={4} cx={10} cy={40} /> : <></>;
};

export const BlockName = () => {
    const block = useBlock();
    const kindUri = parseKapetaUri(block.definition.kind);
    return (
        <SVGAutoSizeText
            className="block-body-text block-name"
            y={0}
            x={0}
            lineHeight={12}
            maxHeight={20}
            maxChars={25}
            maxLines={1}
            maxWidth={150}
            value={kindUri.name}
        />
    );
};

export const BlockHandle = () => {
    const block = useBlock();
    const kindUri = parseKapetaUri(block.definition.kind);
    return (
        <SVGAutoSizeText
            className="block-body-text block-handle"
            y={0}
            x={0}
            lineHeight={12}
            maxHeight={20}
            maxChars={25}
            maxLines={1}
            maxWidth={150}
            value={kindUri.handle}
        />
    );
};

export const BlockVersion = () => {
    const block = useBlock();
    const kindUri = parseKapetaUri(block.instance.block.ref);
    return (
        <SVGAutoSizeText
            className="block-body-text block-version"
            y={0}
            x={0}
            lineHeight={12}
            maxHeight={20}
            maxChars={25}
            maxLines={1}
            maxWidth={150}
            value={kindUri.version}
        />
    );
};

export const BlockLayout = (props: {
    status: InstanceStatus;
    readOnly: boolean;
    instance: BlockInstance;
    definition: BlockDefinition;
    children: React.ReactNode;
    onInstanceNameChange: (instanceName: string) => void;
}) => {
    const { status, readOnly, instance, definition, onInstanceNameChange, children } = props;
    // Provider for block layout
    const callbacks = useMemo(
        () => ({
            onInstanceNameChange,
        }),
        [onInstanceNameChange]
    );
    const block = useMemo(
        () => ({
            instance,
            definition,
            status,
            readOnly,
            callbacks,
        }),
        [status, readOnly, instance]
    );

    return <BlockContextProvider value={block}>{children}</BlockContextProvider>;
};
