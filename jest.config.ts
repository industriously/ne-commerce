import type { Config } from 'jest';

const config: Config = {
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  testEnvironmentOptions: { NODE_ENV: 'test' },
  testMatch: ['tbuild/__tests__/api.test.js'],
  bail: true,
  collectCoverageFrom: ['tbuild/api/**/*.usecase.js'],
  watchman: false,
};

export default config;
