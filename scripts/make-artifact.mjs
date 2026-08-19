/**
 * Turns the single-file Vite build into an Artifact-ready page fragment.
 *
 * The Artifact host wraps whatever it is given in its own
 * <!doctype html><head></head><body> skeleton, so a complete HTML document
 * would end up nested inside another one. This lifts the parts that matter —
 * title, the Google Fonts link, the inlined stylesheet and the inlined bundle —
 * into a flat fragment, with <title> first so the host's 8KB title scan finds it.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const SRC = 'dist-single/index.html'
const OUT = 'dist-single/artifact.html'
const TITLE = 'Harshit Maheshwari'

const html = readFileSync(SRC, 'utf8')

const pick = (re) => [...html.matchAll(re)].map((m) => m[0])

const fontLinks = pick(/<link\b[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g)
const styles = pick(/<style\b[\s\S]*?<\/style>/g)
const scripts = pick(/<script\b[\s\S]*?<\/script>/g)

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)
if (!bodyMatch) throw new Error(`No <body> found in ${SRC}`)

// Everything from <body> except the scripts we re-emit at the end.
const bodyInner = bodyMatch[1].replace(/<script\b[\s\S]*?<\/script>/g, '').trim()

const external = [...html.matchAll(/\b(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !/fonts\.(googleapis|gstatic)\.com/.test(u))
if (external.length) {
  throw new Error(
    `Artifact CSP would block these external references:\n  ${external.join('\n  ')}`,
  )
}

// Escape every non-ASCII character inside the inlined bundle as \uXXXX. The page
// is read straight off disk and out of hosts that may serve it with no charset at
// all, and an undeclared document falls back to windows-1252 — which renders the
// typographic apostrophe as "Â€™". \uXXXX in a JS string literal is encoding-proof.
const asciiScripts = scripts.map((block) =>
  block.replace(/[^\x00-\x7F]/g, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')),
)

const fragment = [
  // First line, so it lands inside the parser's 1024-byte sniffing window.
  '<meta charset="utf-8" />',
  `<title>${TITLE}</title>`,
  ...fontLinks,
  // The host paints its own ground behind the page; this design commits to one
  // dark world, so it states the background explicitly rather than inheriting.
  `<style>html,body{background:#0C0C0C;margin:0}</style>`,
  ...styles,
  bodyInner,
  ...asciiScripts,
].join('\n')

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, fragment)

const nonAscii = [...new Set([...fragment].filter((ch) => ch.charCodeAt(0) > 127))]

const kb = (Buffer.byteLength(fragment) / 1024).toFixed(0)
console.log(
  `artifact.html written (${kb} KB) — ${styles.length} style block(s), ` +
    `${scripts.length} script block(s), ${nonAscii.length} distinct non-ASCII char(s): ${nonAscii.join('')}`,
)
