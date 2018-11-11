module.exports = {
  setupTestFrameworkScriptFile: require.resolve('./setup-tests.js'),
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/'
  ],
  modulePaths: [
    '<rootDir>/'
  ]
}
