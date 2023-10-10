import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { PieChartIcon, PieChartIconProps } from '../../src/charts/PieChartIcon';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Tooltip } from '../../src';

const meta: Meta = {
    title: 'Charts/PieChartIcon',
    component: PieChartIcon,
};

export default meta;

type Story = StoryObj<typeof PieChartIcon>;

export const Basic: Story = {
    args: {
        value: 25,
        fontSize: 'large',
    },
};

export const Inverted: Story = {
    render: () => {
        return (
            <Box sx={{ pb: 4 }}>
                <Typography variant="body1">
                    The <code>inverted</code> property inverts the colors of the pie slice. Normally the pie slice has
                    the same color as the border of the pie chart. When inverted the pie slice has the same color as the
                    background.
                </Typography>
                <Typography variant="body1" sx={{ mt: 4, mb: 2 }}>
                    <code>inverted = false</code>
                </Typography>
                <Grid container spacing={1} sx={{ '.MuiGrid-item': { m: 0.5, p: 0.5 } }}>
                    {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                        <Grid item xs={1} container alignItems="center" justifyContent="center" key={value}>
                            <PieChartIcon value={value} fontSize="small" color="primary" />
                            <Typography sx={{ fontSize: '14px', textAlign: 'center', width: '100%' }}>
                                {value}%
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="body1" sx={{ mt: 4, mb: 2 }}>
                    <code>inverted = true</code>
                </Typography>
                <Grid container spacing={1} sx={{ '.MuiGrid-item': { m: 0.5, p: 0.5 } }}>
                    {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                        <Grid item xs={1} container alignItems="center" justifyContent="center" key={value}>
                            <PieChartIcon value={value} fontSize="small" color="primary" inverted />
                            <Typography sx={{ fontSize: '14px', textAlign: 'center', width: '100%' }}>
                                {value}%
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    },
};

export const Colors: Story = {
    render: () => {
        return (
            <Box display="flex" flexDirection="column" gap={1} sx={{ '.MuiSvgIcon-root': { mr: 1 } }}>
                {(
                    [
                        'inherit',
                        'action',
                        'disabled',
                        'primary',
                        'secondary',
                        'error',
                        'info',
                        'success',
                        'warning',
                    ] as PieChartIconProps['color'][]
                ).map((color) => (
                    <Box display="flex" key={color}>
                        <PieChartIcon value={25} color={color} fontSize="small" />
                        <Typography sx={{ fontSize: '12px' }}>{color}</Typography>
                    </Box>
                ))}
            </Box>
        );
    },
};

export const Pulsate: Story = {
    args: {
        pulsate: true,
        value: 90,
        color: 'warning',
        fontSize: 'large',
    },
};

export const OnButton: Story = {
    render: () => {
        return (
            <Button variant="contained" color="primary" endIcon={<PieChartIcon value={75} />}>
                Deploy
            </Button>
        );
    },
};

export const WithTooltip: Story = {
    args: {
        value: 25,
    },
    render: (args) => {
        return (
            <Tooltip title="This is a tooltip" placement="right">
                <PieChartIcon {...args} />
            </Tooltip>
        );
    },
};
