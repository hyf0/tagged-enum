module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc-node/jest',
      // configuration
      {
        parser: "typescript"
        // dynamicImport: true,
        // react: {
        //   pragma: 'h',
        // },
      },
    ],
  },
}