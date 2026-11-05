// dev.js — Zero-dependency multi-process runner for 1startup (UniveBooster)
// Replaces heavy & fragile 'concurrently' / 'rxjs' dependency chains completely.
const { spawn } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting UniveBooster server & client in parallel...');

const opts = { stdio: 'inherit', shell: true };

// Spawn backend server
const server = spawn('npm', ['--workspace', 'server', 'run', 'dev'], opts);

// Spawn frontend client
const client = spawn('npm', ['--workspace', 'client', 'run', 'dev'], opts);

function shutdown() {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down server and client processes cleanly...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
