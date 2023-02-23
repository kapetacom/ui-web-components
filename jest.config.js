/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styles.js',
    },
    transform: {
        '^.+\\.pegjs?$': 'pegjs-jest-transformer',
    },
};
