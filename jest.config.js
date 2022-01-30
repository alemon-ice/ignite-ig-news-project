module.exports = {
  testIgnorePatterns: ['/nomde_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/src/setup/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testEnvironment: 'jsdom',
};
