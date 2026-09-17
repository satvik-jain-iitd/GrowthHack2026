// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createDefaultPreset } = require('ts-jest')

/** @type {import("jest").Config} **/
module.exports = {
    ...createDefaultPreset(),
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
            'babel-jest',
            {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-typescript',
                    ['@babel/preset-react', { runtime: 'automatic' }]
                ]
            }
        ]
    },
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/src/test/mocks/styleMock.js',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
    coveragePathIgnorePatterns: [
        'types',
        'mocks',
        'test-ids',
        'test-data',
        'index'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.test.{js,jsx,ts,tsx}', // Exclude test files from coverage
        '!src/**/*.d.ts', // Exclude declaration files
        '!src/constants/**/*.{js,jsx,ts,tsx}', //exclude constants
        '!src/components/icons/**/*.{js,jsx,ts,tsx}' //exclude icons
    ],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: [
        ['text'],
        ['text-summary'],
        ['html'],
        ['json-summary'],
        ['lcov']
    ],
    verbose: true
}
