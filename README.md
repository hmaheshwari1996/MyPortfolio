# Harshit Maheshwari — portfolio landing page

A single-page, 3D portfolio landing page positioned for a **product** profile:
product planning → AI-first build → run and reliability → support → enablement.

Built to the design grammar of the "3D creator portfolio" reference (dark ground,
edge-to-edge display type, magnetic 3D centrepiece, counter-scrolling marquee,
sticky card stack), with every asset generated in code rather than fetched.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 8 |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Motion | Framer Motion 13 |
| Icons | lucide-react |
| 3D | Hand-written WebGL2 raymarcher — no Three.js, no model files |

## Commands

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
npm run build      # production build -> dist/   (deploy this to Vercel)
npm run artifact   # single self-contained page -> dist-single/artifact.html
```

### Screenshots

The in-app preview pane stops compositing between actions, which stalls
`requestAnimationFrame` and leaves WebGL frames undrawn — a page shot that way
looks broken when it is not. `scripts/capture.mjs` drives its own headless
Chrome over the DevTools Protocol instead, at real scroll positions:

```bash
node scripts/capture.mjs http://localhost:5273 ./shots 1440 900 "0,1500,4200"
node scripts/capture.mjs http://localhost:5273 ./shots 375 812 "0" "prefers-reduced-motion=reduce"
```

It reports console errors, failed subresources and unhandled rejections, so a
clean run means something.

## The one real asset

`public/Harshit-Maheshwari-Resume.pdf` is the only file the page does not generate. The nav's
`resume.pdf` pill links to it with a `download` attribute.

It is rendered **only in the multi-asset build**. The single-file build has no `public/`
directory, so the link would 404 there and the artifact host's sandbox blocks page-initiated
downloads anyway — the pill is therefore guarded on `import.meta.env.MODE === 'single'`. If you
ever see it missing, that is why, and it is deliberate.

## Why there are no other image files

The page ships zero external assets. The hero is a signed-distance-field scene
raymarched in a fragment shader; the marquee tiles, the corner glyphs and every
product vignette are generated SVG. The only network request the page makes is
the Google Fonts stylesheet for Kanit.

That is a deliberate constraint, not an aesthetic one: it makes the page publish
cleanly under a strict content-security policy, keeps the whole site inlinable
into one file, and means nothing 404s in two years when a CDN bucket is retired.

## Encoding

`scripts/make-artifact.mjs` escapes every non-ASCII character inside the inlined
bundle as `\uXXXX` and emits a `<meta charset>` first. The single file gets read
straight off disk and out of hosts that may serve it with no charset at all, and
an undeclared document falls back to windows-1252 — which turns every
typographic apostrophe into `Â€™`. The build prints the count of non-ASCII
characters that survived; it should be zero.

## Content

All copy lives in [`src/content/profile.ts`](src/content/profile.ts). Nothing is
hard-coded in a component, so editing the profile never means touching layout.
Every factual claim traces to the CV.

## Layout

```
src/
├── content/profile.ts        # every string on the page
├── components/
│   ├── HeroObject.tsx        # WebGL2 raymarched instrument
│   ├── ShowcaseTile.tsx      # 21 generated product-surface vignettes
│   ├── OrbitGlyph.tsx        # 4 decorative SVG studies
│   ├── Magnet.tsx            # magnetic pointer follow
│   ├── AnimatedText.tsx      # scroll-driven character reveal
│   ├── FadeIn.tsx            # scroll entrance wrapper
│   └── Buttons.tsx           # gradient CTA + ghost pill
└── sections/                 # hero, marquee, about, practice, products, track record, contact
```

## Accessibility and performance notes

- `prefers-reduced-motion` is honoured everywhere: the shader renders one static
  frame, the magnet disengages, the character reveal and card scaling are skipped.
- The WebGL loop stops when the canvas leaves the viewport or the tab is hidden,
  and device pixel ratio is capped.
- The character-by-character paragraph is exposed to assistive tech as one
  `aria-label`; the split glyphs are `aria-hidden`.
