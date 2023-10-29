/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

type ColorRGB = [number, number, number];

export const createVerticalScrollShadow = (
    opacity: number = 0.2,
    backgroundColor: ColorRGB = [255, 255, 255],
    shadowColor: ColorRGB = [0, 0, 0]
) => {
    const stringShadow = `rgba(${shadowColor[0]},${shadowColor[1]},${shadowColor[2]},${opacity})`;
    const stringShadowTransparent = `rgba(${shadowColor[0]},${shadowColor[1]},${shadowColor[2]}, 0)`;

    const stringBG = `rgb(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]})`;
    const stringBGTransparent = `rgba(${backgroundColor[0]},${backgroundColor[1]},${backgroundColor[2]}, 0)`;

    return {
        overflowY: 'auto',
        overflowX: 'hidden',
        background: `
            linear-gradient(${stringBG} 30%, ${stringBGTransparent}),
            linear-gradient(${stringBGTransparent}, ${stringBG} 70%) 0 100%,
            radial-gradient(farthest-side at 50% 0, ${stringShadow}, ${stringShadowTransparent}),
            radial-gradient(farthest-side at 50% 100%, ${stringShadow}, ${stringShadowTransparent}) 0 100%`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: stringBG,
        backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
        backgroundAttachment: 'local, local, scroll, scroll',
    };
};
