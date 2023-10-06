import React from 'react';

import './styles.less';
import { DateDisplay, DateDisplayProps } from '../src/dates/DateDisplay';
import { DateTime } from 'luxon';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default {
    title: 'Dates/DateDisplay',
};

const seconds = (sec: number) => sec * 1000;
const minutes = (min: number) => min * seconds(60);
const hours = (hour: number) => hour * minutes(60);
const days = (day: number) => day * hours(24);
const future = (ms: number) => new Date().getTime() + ms;
const past = (ms: number) => new Date().getTime() - ms;

const CodeCell = (props: DateDisplayProps) => (
    <TableCell>
        <pre>{JSON.stringify(props, null, 2)}</pre>
    </TableCell>
);

const renderRows = (rows: { title: string; props: DateDisplayProps }[]) => {
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

export const Dates = () => {
    return renderRows([
        {
            title: 'Future Relative',
            props: { date: future(minutes(35)) },
        },
        {
            title: 'Future Fixed',
            props: { allowRelative: false, date: future(minutes(35)) },
        },
        {
            title: 'Past Relative',
            props: { date: past(minutes(35)) },
        },
        {
            title: 'Past Fixed',
            props: { allowRelative: false, date: past(minutes(35)) },
        },
        {
            title: 'Date Only',
            props: { date: past(minutes(35)), format: DateTime.DATE_SHORT, allowRelative: false },
        },
        {
            title: 'Time Only',
            props: { date: past(minutes(35)), format: DateTime.TIME_24_SIMPLE, allowRelative: false },
        },
        {
            title: 'Seconds ago',
            props: { date: Date.now(), allowRelative: true },
        },
    ]);
};

export const DatesWithIncreasedPrecision = () => {
    return renderRows([
        {
            title: 'Tomorrow',
            props: {
                date: future(days(1) + minutes(199)),
                increaseRelativePrecision: true,
                timeDiffRelative: days(2),
            },
        },
        {
            title: 'In 18 hours',
            props: {
                date: future(hours(18) + minutes(15)),
                increaseRelativePrecision: true,
            },
        },
        {
            title: 'In 50 minutes',
            props: {
                date: future(minutes(50) + seconds(30)),
                increaseRelativePrecision: true,
            },
        },
        {
            title: 'In 60 seconds',
            props: {
                date: future(seconds(60)),
                increaseRelativePrecision: true,
            },
        },
        {
            title: '5 hours ago',
            props: {
                date: past(hours(5.5)),
                increaseRelativePrecision: true,
            },
        },
    ]);
};

export const Tooltips = () => {
    return renderRows([
        {
            title: 'Tooltip above',
            props: { date: future(minutes(35)), allowRelative: true, tooltipPlacement: 'top' },
        },
        {
            title: 'Tooltip below',
            props: { date: future(minutes(35)), allowRelative: true, tooltipPlacement: 'bottom' },
        },
        {
            title: 'With different format',
            props: {
                date: future(days(14)),
                allowRelative: true,
                format: { year: 'numeric', month: 'numeric', day: 'numeric' },
                showTooltip: true,
            },
        },
        {
            title: 'Timestamp with date format in tooltip',
            props: {
                date: future(days(14)),
                allowRelative: true,
                showTooltip: true,
                format: DateTime.TIME_24_SIMPLE,
                tooltipDateFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
            },
        },
    ]);
};
