/**
 * Scroll-accurate page capture over the Chrome DevTools Protocol.
 *
 * A plain `--screenshot` only ever grabs the top of the page, and this design is
 * mostly scroll-driven — marquee offset, the character reveal, the card stack.
 * So: launch headless Chrome with a debugging port, drive real scrolls, wait for
 * frames to settle, and shoot.
 *
 * usage: node scripts/capture.mjs <url> <outDir> <width> <height> <y1,y2,...> [name=value,...]
 * the last argument emulates CSS media features, e.g. prefers-reduced-motion=reduce
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const [url, outDir, wArg, hArg, yArg, mediaArg] = process.argv.slice(2)
const W = Number(wArg || 1440)
const H = Number(hArg || 900)
const stops = (yArg || '0').split(',').map(Number)

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9333 + (process.pid % 200)
const UD = `/private/tmp/claude-502/-Users-harshit-Documents-GitHub/b64f91a1-4b63-4ca0-b7b2-a963f3e14280/scratchpad/chrome-cdp-${PORT}`

mkdirSync(outDir, { recursive: true })

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${UD}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${W},${H}`,
  'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// The /json/version endpoint is the *browser* target and has no Page domain;
// the page target from /json/list is the one that can navigate and screenshot.
async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch { /* not up yet */ }
    await sleep(250)
  }
  throw new Error('Chrome never opened a page target on its debugging port')
}

const ws = new WebSocket(await wsUrl())
await new Promise((r) => { ws.onopen = r })

let seq = 0
const pending = new Map()
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: W, height: H, deviceScaleFactor: 1, mobile: W < 768,
})
if (mediaArg) {
  await send('Emulation.setEmulatedMedia', {
    features: mediaArg.split(',').map((pair) => {
      const [name, value] = pair.split('=')
      return { name, value }
    }),
  })
}
/* Error collector. Installed BEFORE navigation so it survives the document swap
   and is in place for the very first script the page runs. `capture: true` is
   load-bearing: resource-load failures do not bubble, so a bubbling-phase
   listener never sees them — and a failed external fetch is exactly what the
   zero-external-assets rule needs surfaced. console.error is not an error event,
   so it is wrapped separately. */
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `window.__errs=[];
    addEventListener('error', (e) => window.__errs.push(
      e.target && e.target !== window
        ? 'failed to load: ' + (e.target.src || e.target.href)
        : e.message), true);
    addEventListener('unhandledrejection', (e) => window.__errs.push('unhandledrejection: ' + String(e.reason)));
    { const ce = console.error; console.error = (...a) => { window.__errs.push('console.error: ' + a.join(' ')); ce(...a) } }`,
})
await send('Page.navigate', { url })
await sleep(2600) // fonts, first shader frames, entrance animations

const results = []
for (const y of stops) {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` })
  await sleep(1600) // scroll-linked transforms + whileInView + shader frames
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  const file = `${outDir}/y${y}.png`
  writeFileSync(file, Buffer.from(data, 'base64'))
  results.push(file)
}

const { result } = await send('Runtime.evaluate', {
  expression:
    'JSON.stringify({h: document.documentElement.scrollHeight, errors: (window.__errs||[]).length, list: (window.__errs||[])})',
  returnByValue: true,
})
const probe = JSON.parse(result.value)
console.log(
  'captured:',
  results.length,
  'page:',
  JSON.stringify({ h: probe.h, errors: probe.errors }),
)
for (const msg of probe.list) console.log('  !', msg)

ws.close()
chrome.kill()
process.exit(0)
