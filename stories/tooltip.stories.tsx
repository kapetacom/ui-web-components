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
