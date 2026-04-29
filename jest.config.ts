import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).ts'],
  roots: ['<rootDir>/src'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;

