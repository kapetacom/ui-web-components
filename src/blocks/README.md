# Kapeta block utils

Helpers for defining blocks and resources for Kapeta.

## Creating a new block shape

Basic example using the same dimensions as the built-in blocks.

```tsx
import { ShapeComponentProps, Derp } from '@kapeta/ui-web-components';

export const MyBlock: React.FC<ShapeComponent> = (props) => {
    return (
        <g>
            <svg width={props.width} height={props.height}>
                {/* Render a nice background SVG and scale it to the width/height */}
            </svg>
            <svg width={props.width} height={props.height}>
                <g transform="translate(10, 100)">
                    <BlockStatus />
                </g>
                {/* Position the pieces to match the  */}
                <BlockTitle />

                <BlockInstanceName />
                <BlockName />
                <BlockHandle />
                <BlockVersion />
            </svg>
        </g>
    );
};
```

If the block needs to have different dimensions, it needs to define `shapeWidth` and `getShapeHeight`. Those values will be reflected in the width and height passed to the `shapeComponent` function.

```tsx
import { IBlockTypeProvider } from '@kapeta/ui-web-types'; // re-export this from block-utils?
import { MyBlock } from './MyBlockShape';

export const MyBlockDefinition: IBlockTypeProvider = {
    kind: 'kapeta/sample-block-type',
    version: '1.0.0',
    getShapeHeight: (resourceHeight: number) => {
        // Scale the height based on number of defined resources
        // Recommend setting a minimum height of at least 150
        const padding = 100;
        return Math.max(150, resourceHeight + padding);
    },
    // default size: 150, this one is a bit narrower
    shapeWidth: 120,
    shapeComponent: MyBlock,
};
```

### Accessing block data w/ useBlock

```tsx
import { useBlock } from '@kapeta/ui-web-components';

export const MyBlock: React.FC<ShapeComponent> = (props) => {
    const { status } = useBlock();
    return (
        <svg width={props.width} height={props.height}>
            <g transform="translate(10, 100)">{status === BlockStatus.SUCCESS ? '👍' : '🤷‍♂️'}</g>
        </svg>
    );
};
```
