/** @type {import('ts-jest').JestConfigWithTsJest} **/
const config = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest/presets/default-esm',
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    verbose: true,
    transform: {
        "^.+.tsx?$": ["ts-jest", { useESM: true }],
    },
};
export default config;