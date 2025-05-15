import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testRegex: '.*\\.test\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    // Optional: if you want to clear mocks between tests
    clearMocks: true,
    // Optional: verbose output for test results
    verbose: true,
};

export default config;
