/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import * as UAParser from 'ua-parser-js';

interface UseUserAgentReturn {
    ua: string;
    os: UAParser.IOS;
    browser: UAParser.IBrowser;
    cpu: UAParser.ICPU;
    device: UAParser.IDevice;
    engine: UAParser.IEngine;
}

/**
 * Generates a user agent object based on the provided user agent string or the user agent string of
 * the current window.
 *
 * @param {string} uastring - The user agent string to parse. If not provided, the user agent string
 * of the current window will be used.
 * @return {UseUserAgentReturn | null} The user agent object containing information about the user
 * agent, or null if an error occurred during parsing.
 */
export const useUserAgent = (uastring: string = window.navigator.userAgent): UseUserAgentReturn | null => {
    const uaDetails = React.useMemo(() => {
        try {
            const uaParser = new UAParser.UAParser();
            uaParser.setUA(uastring);
            const payload: UseUserAgentReturn = {
                ua: uastring,
                os: uaParser.getOS(),
                browser: uaParser.getBrowser(),
                cpu: uaParser.getCPU(),
                device: uaParser.getDevice(),
                engine: uaParser.getEngine(),
            };
            return payload;
        } catch (err) {
            console.error(`Could not parse user agent string "${uastring}"`, err);
            return null;
        }
    }, [uastring]);

    return uaDetails;
};
