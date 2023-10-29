/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

export function createHexagon(width: number, height: number, pointSize: number) {
    const points = [];

    if (width < pointSize * 2) {
        throw new Error('Width must be greater than twice the point size');
    }

    points.push({
        x: pointSize,
        y: 0,
    });

    points.push({
        x: width - pointSize,
        y: 0,
    });

    points.push({
        x: width,
        y: height / 2,
    });

    points.push({
        x: width - pointSize,
        y: height,
    });

    points.push({
        x: pointSize,
        y: height,
    });

    points.push({
        x: 0,
        y: height / 2,
    });

    const first = points.shift();

    //@ts-ignore
    return (
        `M ${first.x} ${first.y} ` +
        points
            .map((p) => {
                return `L ${Math.round(p.x)} ${Math.round(p.y)}`;
            })
            .join(' ') +
        ' Z'
    );
}
