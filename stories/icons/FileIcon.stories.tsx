import React from 'react';
import { FileIcon } from '../../src/icons/FileIcon';
import { StoryObj } from '@storybook/react';
import { Tooltip } from '../../src';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { getAllIcons } from 'material-file-icons';

const meta = {
    title: 'Icons/FileIcon',
    component: FileIcon,
};

export default meta;

type Story = StoryObj<typeof FileIcon>;

export const AllFileIcons: Story = {
    render: () => (
        <div>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 2,
                }}
            >
                {getAllIcons().map((icon) => {
                    const { files, name } = icon;
                    const firstFile = files?.[0];

                    return firstFile ? (
                        <Tooltip title={JSON.stringify(files, null, 2)} key={name} followCursor>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}
                            >
                                <FileIcon filename={firstFile} fontSize="large" />
                                <Typography variant="caption">{name}</Typography>
                            </Box>
                        </Tooltip>
                    ) : null;
                })}
            </Box>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <Stack direction="column">
            <FileIcon filename="example.js" fontSize="inherit" />
            <FileIcon filename="example.js" fontSize="small" />
            <FileIcon filename="example.js" fontSize="medium" />
            <FileIcon filename="example.js" fontSize="large" />
        </Stack>
    ),
};

export const TooltipExample: Story = {
    render: () => (
        <Box>
            <Tooltip title="example.js" placement="right">
                <FileIcon filename="example.js" fontSize="medium" />
            </Tooltip>
        </Box>
    ),
};

export const TestFileIcons: Story = {
    render: () => {
        const [filename, setFilename] = React.useState('src');

        return (
            <Box>
                <Typography variant="body1">Test different filenames to see what icon is displayed</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        label="Filename"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        variant="filled"
                        size="small"
                        sx={{ my: 3, mr: 3 }}
                    />
                    <FileIcon filename={filename} fontSize="large" />
                </Box>
            </Box>
        );
    },
};
