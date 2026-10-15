const { spawn } = require('child_process');
const path = require('path');

console.log("Starting server process for test verification...");
const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

setTimeout(async () => {
  const runTestSuite = require('./test-suite.js');
  try {
    await runTestSuite();
    server.kill();
    process.exit(0);
  } catch (err) {
    console.error("Test suite failed:", err);
    server.kill();
    process.exit(1);
  }
}, 1200);
