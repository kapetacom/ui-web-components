/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Markdown } from '../src/markdown/Markdown';

export default {
    title: 'Markdown',
};

export const HasTableSupport = () => {
    return (
        <Markdown
            content={`
## Configuration

There are a couple of configuration values that can be set via environment variables.

| Name | Description | Default |
|------|-------------|---------|
| \`PORT\` | Port to listen on | \`8080\` |
| \`LOCAL\` | If set the server runs on local mode, where is reads the local keystore file etc.. | \`\` |
| \`BILLING_ACCOUNT\` | Set the main billing account | \`\` |
| \`ORGANISATION\` | Id of the main GCP organization | \`\` |
| \`CLUSTER_TYPE\` | What mode should the server be started in (local, kind, gke)| \`local\` |`.trim()}
        />
    );
};
