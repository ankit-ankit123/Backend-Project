#!/usr/bin/env node
const { spawn } = require('child_process')

// usage: node ./scripts/vite-runner.js <dev|build|preview> [args...]
const sub = process.argv[2] || 'dev'
const args = process.argv.slice(3)

// Prefer the local vite CLI script when available
let viteCmd
try {
  // vite v5 exposes a node entry in dist/node/cli
  viteCmd = require.resolve('vite/dist/node/cli.js')
} catch (e1) {
  try { viteCmd = require.resolve('vite/bin/vite.js') } catch (e2) { viteCmd = null }
}

let child
if (viteCmd) {
  child = spawn(process.execPath, [viteCmd, sub, ...args], { stdio: ['inherit', 'pipe', 'pipe'] })
} else {
  // as a last resort try to run 'vite' directly; if not found this will error
  child = spawn('vite', [sub, ...args], { stdio: ['inherit', 'pipe', 'pipe'] })
}

const match = 'The CJS build of Vite\'s Node API is deprecated.'

function filterStream(stream, output) {
  let buf = ''
  stream.on('data', chunk => {
    buf += chunk.toString()
    const parts = buf.split(/\r?\n/)
    buf = parts.pop() // keep partial line
    for (const line of parts) {
      if (line.includes('The CJS build of Vite') && line.includes('deprecated')) continue
      output.write(line + '\n')
    }
  })
  stream.on('end', () => { if (buf) { if (!buf.includes('The CJS build of Vite')) output.write(buf + '\n') } })
}

filterStream(child.stdout, process.stdout)
filterStream(child.stderr, process.stderr)

child.on('close', code => process.exit(code))
