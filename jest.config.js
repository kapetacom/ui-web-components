/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styles.js',
    },
    transform: {
        '^.+\\.pegjs?$': 'pegjs-jest-transformer',
    },
};
