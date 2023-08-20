import React, { useState } from 'react';

import './styles.less';
import { AvatarEditor, AvatarResultType } from '../src/avatars/AvatarEditor';
import { ToastContainer } from '../src';
import { UserAvatar } from '../src/avatars/UserAvatar';
import { DateDisplay } from '../src/dates/DateDisplay';
import { DateTime } from 'luxon';

export default {
    title: 'Dates',
};

export const Dates = () => {
    return (
        <>
            <div>
                <p>Future Relative</p>
                <DateDisplay date={Date.now() + 1000 * 60 * 35} />
            </div>
            <div>
                <p>Future Fixed</p>
                <DateDisplay allowRelative={false} date={Date.now() + 1000 * 60 * 35} />
            </div>
            <div>
                <p>Past Relative</p>
                <DateDisplay date={Date.now() - 1000 * 60 * 35} />
            </div>
            <div>
                <p>Past Fixed</p>
                <DateDisplay allowRelative={false} date={Date.now() - 1000 * 60 * 35} />
            </div>
            <div>
                <p>Date Only</p>
                <DateDisplay format={DateTime.DATE_SHORT} allowRelative={false} date={Date.now() - 1000 * 60 * 35} />
            </div>
            <div>
                <p>Time Only</p>
                <DateDisplay
                    format={DateTime.TIME_24_SIMPLE}
                    allowRelative={false}
                    date={Date.now() - 1000 * 60 * 35}
                />
            </div>
        </>
    );
};
