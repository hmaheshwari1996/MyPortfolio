import { memo } from 'react'

/**
 * Four small instrument studies that sit in the corners of the About section.
 * The reference design used rendered 3D props here; these are drawn in code so
 * the page carries no external assets, and they keep the same optical language
 * as the hero — rings, lattices, nodes, all lit from the same gradient.
 */
export type GlyphVariant = 'gyro' | 'lattice' | 'helix' | 'graph'

const STROKE = 'rgba(215,226,234,0.45)'

function Gyro({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12A594" />
          <stop offset="60%" stopColor="#0E8F94" />
          <stop offset="100%" stopColor="#16BFC4" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="60" rx="46" ry="18" stroke={`url(#${id}-a)`} strokeWidth="2.5" fill="none" transform="rotate(-18 60 60)" />
      <ellipse cx="60" cy="60" rx="18" ry="46" stroke={STROKE} strokeWidth="1.6" fill="none" transform="rotate(14 60 60)" />
      <ellipse cx="60" cy="60" rx="40" ry="40" stroke="rgba(215,226,234,0.16)" strokeWidth="1.2" fill="none" />
      <circle cx="60" cy="60" r="9" fill={`url(#${id}-a)`} />
      <circle cx="60" cy="60" r="15" stroke={STROKE} strokeWidth="1.2" fill="none" />
    </>
  )
}

function Lattice({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0E8F94" />
          <stop offset="100%" stopColor="#16BFC4" />
        </linearGradient>
      </defs>
      <path d="M60 16 106 42v52L60 120 14 94V42Z" stroke={`url(#${id}-b)`} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M60 16v52m0 0L14 42m46 26 46-26m-46 26v52" stroke={STROKE} strokeWidth="1.4" fill="none" />
      <circle cx="60" cy="68" r="6" fill={`url(#${id}-b)`} />
      <circle cx="14" cy="42" r="3" fill={STROKE} />
      <circle cx="106" cy="42" r="3" fill={STROKE} />
      <circle cx="60" cy="120" r="3" fill={STROKE} />
    </>
  )
}

function Helix({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12A594" />
          <stop offset="100%" stopColor="#16BFC4" />
        </linearGradient>
      </defs>
      <path d="M34 14c0 24 52 24 52 48s-52 24-52 48" stroke={`url(#${id}-c)`} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M86 14c0 24-52 24-52 48s52 24 52 48" stroke={STROKE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {[26, 46, 62, 78, 98].map((y) => (
        <line key={y} x1="30" y1={y} x2="90" y2={y} stroke="rgba(215,226,234,0.18)" strokeWidth="1.1" />
      ))}
    </>
  )
}

function Graph({ id }: { id: string }) {
  const nodes: Array<[number, number, number]> = [
    [60, 22, 7],
    [26, 60, 5],
    [94, 58, 5],
    [42, 100, 4],
    [82, 102, 4],
  ]
  return (
    <>
      <defs>
        <linearGradient id={`${id}-d`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12A594" />
          <stop offset="100%" stopColor="#0E8F94" />
        </linearGradient>
      </defs>
      <path d="M60 22 26 60m34-38 34 36M26 60l16 40m52-42-12 44M42 100h40" stroke={STROKE} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="22" r="22" stroke="rgba(215,226,234,0.14)" strokeWidth="1.1" fill="none" />
      {nodes.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i === 0 ? `url(#${id}-d)` : 'rgba(215,226,234,0.55)'} />
      ))}
    </>
  )
}

const SHAPES = { gyro: Gyro, lattice: Lattice, helix: Helix, graph: Graph } as const

export type OrbitGlyphProps = {
  variant: GlyphVariant
  className?: string
}

function OrbitGlyph({ variant, className }: OrbitGlyphProps) {
  const Shape = SHAPES[variant]
  const id = `glyph-${variant}`
  return (
    <svg viewBox="0 0 120 136" className={className} role="presentation" aria-hidden="true" fill="none">
      <Shape id={id} />
    </svg>
  )
}

export default memo(OrbitGlyph)
