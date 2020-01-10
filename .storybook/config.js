import {configure} from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context(__dirname + '/../stories', true, /\.stories\.tsx?$/);

import '../styles/index.less';

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);