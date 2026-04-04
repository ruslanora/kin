/** @type {import("jest").Config} */
export default {
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
        },
        diagnostics: {
          ignoreCodes: ['TS151001'],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@kin/desktop/(.*)$': '<rootDir>/../../apps/desktop/src/$1',
    '^@kin/extension/(.*)$': '<rootDir>/../../apps/extension/src/$1',
    '^@kin/ui/(.*)$': '<rootDir>/../../libs/ui/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/../../jest.style-mock.js',
  },
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
};
