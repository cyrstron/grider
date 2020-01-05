module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/**/*.test.ts',
  ],
  preset: 'ts-jest',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
