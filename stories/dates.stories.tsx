import React from 'react';

import './styles.less';
import { DateDisplay, DateDisplayProps } from '../src/dates/DateDisplay';
import { DateTime } from 'luxon';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default {
    title: 'Dates',
};

const CodeCell = (props: DateDisplayProps) => (
    <TableCell>
        <pre>{JSON.stringify(props, null, 2)}</pre>
    </TableCell>
);

export const Dates = () => {
    const rows: {
        title: string;
        props: DateDisplayProps;
    }[] = [
        {
            title: 'Future Relative',
            props: { date: Date.now() + 1000 * 60 * 35 },
        },
        {
            title: 'Future Fixed',
            props: { allowRelative: false, date: Date.now() + 1000 * 60 * 35 },
        },
        {
            title: 'Past Relative',
            props: { date: Date.now() - 1000 * 60 * 35 },
        },
        {
            title: 'Past Fixed',
            props: { allowRelative: false, date: Date.now() - 1000 * 60 * 35 },
        },
        {
            title: 'Date Only',
            props: { date: Date.now() - 1000 * 60 * 35, format: DateTime.DATE_SHORT, allowRelative: false },
        },
        {
            title: 'Time Only',
            props: { date: Date.now() - 1000 * 60 * 35, format: DateTime.TIME_24_SIMPLE, allowRelative: false },
        },
        {
            title: 'Seconds ago',
            props: { date: Date.now(), allowRelative: true },
        },
        {
            title: 'Tooltip below',
            props: { date: Date.now(), allowRelative: true, tooltipPlacement: 'bottom' },
        },
    ];

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Props</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(({ title, props }) => (
                    <TableRow>
                        <TableCell>{title}</TableCell>
                        <TableCell>
                            <DateDisplay {...props} />
                        </TableCell>
                        <CodeCell {...props} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
