import React, { useEffect, useState } from 'react';
import { DateTime, ToRelativeOptions, DateTimeFormatOptions } from 'luxon';
import { Tooltip, TooltipProps } from '../tooltip/Tooltip';

export const KapDateTime = DateTime;
export type KapDateTimeFormatOptions = DateTimeFormatOptions;

const DEFAULT_TIME_DIFF_RELATIVE = 1000 * 60 * 60 * 24; // 1 day
const DEFAULT_NOW_RELATIVE = 1000 * 5; // 5 seconds

export interface DateDisplayProps {
    date?: Date | number | string;
    format?: DateTimeFormatOptions;
    /**
     * If timeDiffRelative is set, it controls when the date is displayed as relative. Defaults to 1
     * day.
     */
    timeDiffRelative?: number;
    /**
     * Options that is passed to `luxon/toRelative`
     * (https://moment.github.io/luxon/api-docs/index.html#datetimetorelative)
     * Note: These options are not used if `increaseRelativePrecision` is set to true.
     */
    relativeOptions?: ToRelativeOptions;
    /**
     * If true, the date will be displayed as relative. Defaults to true.
     */
    allowRelative?: boolean;
    /**
     * Increase the precision of relative dates. If true, the relative date will be displayed as
     * e.g. "in 1 hour, 15 minutes" instead of "in 1 hour".
     */
    increaseRelativePrecision?: boolean;
    /**
     * A tooltip is shown as default when hovering over a relative date. By setting this to true you
     * get a tooltip regardless if the date is relative or not.
     */
    showTooltip?: boolean;
    /**
     * Tooltip placement. Defaults to "top".
     */
    tooltipPlacement?: TooltipProps['placement'];
    /**
     * The date format used in the tooltip. Defaults to `DateTime.DATETIME_SHORT`
     */
    tooltipDateFormat?: DateTimeFormatOptions;
}

export const toDateText = (props: DateDisplayProps | Date | number): string | null => {
    let innerProps = {};
    if (props instanceof Date || typeof props === 'number') {
        innerProps = { date: props };
    } else {
        innerProps = props;
    }
    return toDateTextInner(innerProps)?.text ?? null;
};

const pluralize = (count: number, singular: string, plural: string) => {
    return count === 1 ? singular : plural;
};

export const toDateTextInner = (props: DateDisplayProps) => {
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

    // Set default values
    const {
        timeDiffRelative = DEFAULT_TIME_DIFF_RELATIVE,
        allowRelative = true,
        increaseRelativePrecision = false,
        relativeOptions,
        format = DateTime.DATETIME_SHORT,
    } = props;

    const dt = DateTime.fromMillis(date);

    if (allowRelative !== false) {
        const timeDiff = Math.abs(Date.now() - date);

        if (timeDiff < DEFAULT_NOW_RELATIVE) {
            return {
                relative: true,
                text: 'now',
            };
        }

        if (increaseRelativePrecision && timeDiff < timeDiffRelative) {
            const duration = dt.diffNow(['days', 'hours', 'minutes', 'seconds', 'milliseconds']);

            let durationString = '';

            const days = Math.round(Math.abs(duration.days));
            const hours = Math.round(Math.abs(duration.hours));
            const minutes = Math.round(Math.abs(duration.minutes));
            const seconds = Math.round(Math.abs(duration.seconds));

            const dayLabel = pluralize(days, 'day', 'days');
            const hourLabel = pluralize(hours, 'hour', 'hours');
            const minuteLabel = pluralize(minutes, 'minute', 'minutes');
            const secondLabel = pluralize(seconds, 'second', 'seconds');

            if (days) {
                durationString = `${days} ${dayLabel}, ${hours} ${hourLabel}`; // 1 day, 2 hours
            } else if (hours) {
                durationString = `${hours} ${hourLabel}, ${minutes} ${minuteLabel}`; // 1 hour, 2 minutes
            } else if (minutes) {
                durationString = `${minutes} ${minuteLabel}, ${seconds} ${secondLabel}`; // 1 minute, 2 seconds
            } else {
                durationString = `${seconds} ${secondLabel}`; // 15 seconds
            }

            return {
                relative: true,
                text: dt > DateTime.now() ? `in ${durationString}` : `${durationString} ago`,
            };
        }

        if (timeDiff < timeDiffRelative) {
            return {
                relative: true,
                text: dt.toRelative({ locale: 'en-US', ...relativeOptions }),
            };
        }
    }

    return {
        relative: false,
        text: dt.toLocaleString(format),
    };
};

export const DateDisplay = (props: DateDisplayProps) => {
    const [dateText, setDateText] = useState(toDateTextInner(props));

    useEffect(() => {
        let interval: NodeJS.Timer;
        if (props.allowRelative !== false) {
            interval = setInterval(() => {
                setDateText(toDateTextInner(props));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [props]);

    if (dateText === null) {
        return null;
    }

    if (dateText.relative || props.showTooltip) {
        const fullDate = toDateTextInner({
            ...props,
            allowRelative: false,
            format: props.tooltipDateFormat ?? DateTime.DATETIME_SHORT,
        });
        return (
            <Tooltip title={fullDate.text} placement={props.tooltipPlacement || 'top'} arrow>
                <span className={'date-display'}>{dateText.text}</span>
            </Tooltip>
        );
    }

    return <span className={'date-display'}>{dateText.text}</span>;
};
