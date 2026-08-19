import type { ElementType, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/*
  One motion component per element type, cached for the life of the module.
  Calling motion.create() during render would hand React a brand-new component
  type on every pass and remount the subtree underneath it.
*/
const motionCache = new Map<ElementType, ElementType>()

// eslint-disable-next-line react/static-components -- the Map guarantees one
// stable component identity per element type, which is exactly what the rule wants;
// it just cannot see through the cache.
function motionFor(tag: ElementType): ElementType {
  const hit = motionCache.get(tag)
  if (hit) return hit
  const made = motion.create(tag) as ElementType
  motionCache.set(tag, made)
  return made
}

/**
 * Scroll-triggered entrance. Fires once, 50px before the element reaches the
 * viewport, so content is already settled by the time it is readable.
 *
 * `as` lets a caller keep semantic markup (section / h2 / li) while still
 * animating, backed by the module-level motion cache above.
 */
export type FadeInProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  x?: number
  y?: number
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function FadeIn({
  children,
  as = 'div',
  className,
  style,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: FadeInProps) {
  const reduced = useReducedMotion()
  const MotionTag = motionFor(as)

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}
