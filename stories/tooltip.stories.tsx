/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../src/tooltip/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Paper, Stack, TooltipProps } from '@mui/material';

const meta: Meta = {
    title: 'Tooltip',
    component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel leo nec nisi volutpat facilisis. ';

export const Default: Story = {
    args: {
        title: loremIpsum,
    },
    render: ({ title, maxWidth, placement }) => (
        <Stack sx={{ height: '300px' }} alignItems="center" justifyContent="center">
            <Tooltip title={title}>
                <InfoOutlinedIcon />
            </Tooltip>
        </Stack>
    ),
};

export const Arrow: Story = {
    args: {
        title: loremIpsum,
        arrow: true,
    },
    render: ({ title, arrow }) => (
        <Stack sx={{ height: '300px' }} alignItems="center" justifyContent="center">
            <Tooltip title={title} arrow={arrow}>
                <InfoOutlinedIcon />
            </Tooltip>
        </Stack>
    ),
};

export const MaxWidth: Story = {
    args: {
        title: loremIpsum,
        maxWidth: 400,
    },
    render: ({ title, maxWidth }) => (
        <Stack sx={{ height: '300px' }} alignItems="center" justifyContent="center">
            <Tooltip title={title} maxWidth={maxWidth}>
                <InfoOutlinedIcon />
            </Tooltip>
        </Stack>
    ),
};

export const Placement: Story = {
    render: () => {
        const MyTooltip = ({ placement }: Partial<TooltipProps>) => (
            <Tooltip title={`This tooltip has placement ${placement}`} placement={placement} arrow maxWidth={150}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>{placement}</Paper>
            </Tooltip>
        );

        return (
            <Grid container spacing={3} sx={{ p: '175px' }}>
                <Grid container item xs={12} spacing={1}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="top-start" />
                    </Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="top" />
                    </Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="top-end" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                    <Grid item xs={2}>
                        <MyTooltip placement="left-start" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="right-start" />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                    <Grid item xs={2}>
                        <MyTooltip placement="left" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="right" />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                    <Grid item xs={2}>
                        <MyTooltip placement="left-end" />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="right-end" />
                    </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="bottom-start" />
                    </Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="bottom" />
                    </Grid>
                    <Grid item xs={2}>
                        <MyTooltip placement="bottom-end" />
                    </Grid>
                </Grid>
            </Grid>
        );
    },
};

export const TooltipInSvg: Story = {
    render: () => {
        const title = 'Tooltip inside an SVG';

        const center = { x: 50, y: 50 };
        const circleSize = 8;
        const circleRadius = circleSize / 2;
        const tooltipHitSize = 3 * circleSize;

        return (
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle r={circleRadius} cx={center.x} cy={center.y} fill="blue"></circle>

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
                                border: '1px dotted #0000ff4d',
                            }}
                        ></span>
                    </Tooltip>
                </foreignObject>
            </svg>
        );
    },
};

export const CustomColor: Story = {
    args: {
        title: loremIpsum,
        backgroundColor: 'green',
        color: 'white',
    },
    render: ({ title, backgroundColor, color }) => (
        <Stack sx={{ height: '300px' }} alignItems="center" justifyContent="center">
            <Tooltip title={title} backgroundColor={backgroundColor} color={color}>
                <InfoOutlinedIcon />
            </Tooltip>
        </Stack>
    ),
};
