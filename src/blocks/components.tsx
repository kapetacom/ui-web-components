import React, { useMemo } from 'react';
import { useBlock } from './hooks';
import { SVGAutoSizeText } from '../svg/SVGAutoSizeText';
import { BlockContextProvider } from './context';
import { BlockDefinition, BlockInstance } from '@kapeta/schemas';
import { parseKapetaUri } from '@kapeta/nodejs-utils';
import { InstanceStatus } from '@kapeta/ui-web-context';
import { Tooltip } from '../tooltip/Tooltip';

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
            value={block.instance?.name}
        />
    );
};

export const BlockStatus = () => {
    const block = useBlock();

    const titleMapping = {
        [InstanceStatus.STARTING]: 'Block is starting',
        [InstanceStatus.READY]: 'Block is ready',
        [InstanceStatus.UNHEALTHY]: 'Block is unhealthy',
        [InstanceStatus.FAILED]: 'Block failed to start',
        [InstanceStatus.STOPPED]: 'Block has stopped',
        [InstanceStatus.STOPPING]: 'Block is stopping',
        [InstanceStatus.BUSY]: 'Block is unresponsive',
    };

    const title = titleMapping[block.status] || '';

    const center = { x: 10, y: 40 };
    const circleSize = 8;
    const tooltipHitSize = 3 * circleSize; // The size of the hitbox for the tooltip
    const circleRadius = circleSize / 2;

    return block.status ? (
        <>
            <circle
                className={`instance_${block.status || InstanceStatus.STOPPED}`}
                r={circleRadius}
                cx={center.x}
                cy={center.y}
            ></circle>

            {/* Position on top of the circle */}
            <foreignObject
                x={center.x - tooltipHitSize / 2}
                y={center.y - tooltipHitSize / 2}
                width={tooltipHitSize}
                height={tooltipHitSize}
            >
                <Tooltip title={title} arrow placement="top">
                    <span
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                        }}
                    ></span>
                </Tooltip>
            </foreignObject>
        </>
    ) : (
        <></>
    );
};

export const BlockName = () => {
    const block = useBlock();
    const name = block.definition?.metadata.name ? parseKapetaUri(block.definition?.metadata.name).name : '';
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
            value={name}
        />
    );
};

export const BlockHandle = () => {
    const block = useBlock();
    const handle = block.definition?.metadata.name ? parseKapetaUri(block.definition?.metadata.name).handle : '';
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
            value={handle}
        />
    );
};

export const BlockVersion = () => {
    const block = useBlock();
    const version = block.instance?.block?.ref ? parseKapetaUri(block.instance?.block?.ref).version : '';
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
            value={version}
        />
    );
};

export const BlockLayout = (props: {
    status?: InstanceStatus;
    readOnly?: boolean;
    instance: BlockInstance;
    definition: BlockDefinition;
    children: React.ReactNode;
    onInstanceNameChange?: (instanceName: string) => void;
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
