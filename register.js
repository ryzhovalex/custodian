// Describe instructions for ts-node, from where to convert and run tests
// https://medium.com/swlh/how-to-setting-up-unit-tests-with-typescript-871c0f4f1609

const tsNode = require('ts-node');
const testTSConfig = require('./src/tests/tsconfig.json');

tsNode.register({
  files: true,
  transpileOnly: true,
  project: './src/tests/tsconfig.json'
});
