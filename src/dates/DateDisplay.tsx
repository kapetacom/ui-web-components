import React from 'react';
import { DateTime, ToRelativeOptions, DateTimeFormatOptions } from 'luxon';
import { Tooltip } from '../tooltip/Tooltip';

export const KapDateTime = DateTime;
export type KapDateTimeFormatOptions = DateTimeFormatOptions;

const DEFAULT_TIME_DIFF_RELATIVE = 1000 * 60 * 60 * 24;
interface Props {
    date?: Date | number | string;
    format?: DateTimeFormatOptions;
    timeDiffRelative?: number;
    relativeOptions?: ToRelativeOptions;
    allowRelative?: boolean;
}

export const toDateText = (props: Props | Date | number): string | null => {
    let innerProps = {};
    if (props instanceof Date || typeof props === 'number') {
        innerProps = { date: props };
    } else {
        innerProps = props;
    }
    return toDateTextInner(innerProps)?.text ?? null;
};

export const toDateTextInner = (props: Props) => {
    let date: number = -1;
    if (props.date instanceof Date) {
        date = props.date.getTime();
    } else if (typeof props.date === 'string') {
        date = new Date(props.date).getTime();
    } else if (props.date && props.date > 0) {
        date = props.date;
    }

    if (date < 0) {
        return null;
    }
    const dt = DateTime.fromMillis(date);

    if (props.allowRelative !== false) {
        const timeDiffRelative = props.timeDiffRelative ?? DEFAULT_TIME_DIFF_RELATIVE;
        const timeDiff = Math.abs(Date.now() - date);

        if (timeDiff < 5000) {
            return {
                relative: true,
                text: 'now',
            };
        }

        if (timeDiff < timeDiffRelative) {
            return {
                relative: true,
                text: dt.toRelative(props.relativeOptions),
            };
        }
    }

    return {
        relative: false,
        text: dt.toLocaleString(props.format ?? DateTime.DATETIME_SHORT),
    };
};

export const DateDisplay = (props: Props) => {
    const dateText = toDateTextInner(props);

    if (dateText === null) {
        return null;
    }

    if (dateText.relative) {
        // If date is relative - show full date on hover
        const fullDate = toDateTextInner({ ...props, allowRelative: false });
        return (
            <Tooltip title={fullDate.text}>
                <span className={'date-display'}>{dateText.text}</span>
            </Tooltip>
        );
    }

    return <span className={'date-display'}>{dateText.text}</span>;
};
