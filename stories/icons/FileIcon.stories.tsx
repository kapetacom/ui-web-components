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

export const AllFileIcons: Story = {
    render: () => (
        <Box>
            {getAllIcons().map(({ files }) => {
                // files is a list of complete filenames this icon should be applied to.
                return files?.map((file) => (
                    <Box
                        key={file}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <FileIcon filename={file} fontSize="small" />
                        <Typography variant="caption">{file}</Typography>
                    </Box>
                ));
            })}
        </Box>
    ),
};

export const TestFileIcons: Story = {
    render: () => {
        const [filename, setFilename] = React.useState('src');

        return (
            <Box>
                <TextField
                    label="Filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    variant="filled"
                    size="small"
                    sx={{ mb: 4 }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <FileIcon filename={filename} fontSize="small" />
                    <Typography variant="caption">{filename}</Typography>
                </Box>
            </Box>
        );
    },
};
