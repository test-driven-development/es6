module.exports = {
  verbose: true,
  setupFiles: ['<rootDir>/setup-jest.js'],
  testMatch: ['**/+(*.)+(spec|test).+(js)'],
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ['dist/'],
  transformIgnorePatterns: ['/node_modules/(?!@babel/runtime)'],
  restoreMocks: true,
  notify: true,
  notifyMode: 'always',
}
