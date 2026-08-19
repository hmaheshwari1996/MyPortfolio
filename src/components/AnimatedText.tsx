import { useMemo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * Reading-speed reveal: each character lifts from 20% to full opacity as the
 * paragraph crosses the viewport, so the eye is pulled left-to-right at roughly
 * the pace you'd read it anyway.
 *
 * Characters are grouped into non-breaking word spans so the wipe never splits
 * a word across lines, and the whole run is hidden from assistive tech, with a
 * visually-hidden copy of the text alongside it — 350 individually-wrapped
 * glyphs are unreadable otherwise, and role=paragraph is name-prohibited so
 * aria-label cannot carry it.
 */
/*
  The whole per-glyph schedule is compressed into the first SPAN of the scroll
  range, so the last character reaches full opacity while the paragraph is still
  well inside the viewport rather than as it leaves the bottom of it.
*/
const SPAN = 0.7

type CharProps = {
  char: string
  progress: MotionValue<number>
  start: number
  end: number
}

function Char({ char, progress, start, end }: CharProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

export type AnimatedTextProps = {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  // Pre-compute each glyph's slice of the scroll range once; the windows overlap
  // slightly so the leading edge reads as a soft sweep rather than a hard cursor.
  // The whole schedule is compressed into the first SPAN of the range so the last
  // glyph is fully lit while the paragraph is still comfortably on screen —
  // useTransform clamps, so every glyph holds at opacity 1 through the remainder.
  const words = useMemo(() => {
    const total = text.length
    // Each glyph's slice of the scroll range is a pure function of how many
    // characters precede it, so derive that offset rather than carrying a
    // counter that outlives the map.
    let offset = 0
    const built = []
    for (const [wordIndex, word] of text.split(' ').entries()) {
      const base = offset
      const chars = Array.from(word).map((char, i) => ({
        char,
        start: ((base + i) / total) * SPAN,
        end: Math.min(SPAN, ((base + i + 14) / total) * SPAN),
      }))
      offset = base + word.length + 1 // + the space that follows this word
      built.push({ key: `${wordIndex}-${word}`, chars })
    }
    return built
  }, [text])

  if (reduced) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map(({ key, chars }, wordIndex) => (
          <span key={key} className="inline-block whitespace-nowrap">
            {chars.map((c, i) => (
              <Char
                key={`${key}-${i}`}
                char={c.char}
                progress={scrollYProgress}
                start={c.start}
                end={c.end}
              />
            ))}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </p>
  )
}
