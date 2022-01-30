module.exports = {
  testPathIgnorePatterns: ['/nomde_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx',
    '!src/tests',
    '!src/api',
  ],
  coverageReporters: ['lcov', 'json'],
};
