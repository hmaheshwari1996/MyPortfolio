import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Magnetic hover. While the pointer is within `padding` px of the element's
 * bounding box, the element leans toward it by (distance / strength) px.
 *
 * Two different transitions on purpose: a quick ease-out while engaged so it
 * tracks the cursor, and a slower ease-in-out on release so it drifts home
 * instead of snapping. Transform is written directly rather than through React
 * state per frame — the state here only flips the transition string.
 */
export type MagnetProps = {
  children: ReactNode
  className?: string
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
}

export default function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const frame = useRef<number | null>(null)
  const [active, setActive] = useState(false)
  const reduced = useReducedMotion()

  const apply = useCallback((x: number, y: number) => {
    const node = ref.current
    if (node) node.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [])

  useEffect(() => {
    if (reduced) {
      apply(0, 0)
      return
    }

    let latest: PointerEvent | null = null

    const process = () => {
      frame.current = null
      const node = ref.current
      const event = latest
      if (!node || !event) return

      const box = node.getBoundingClientRect()
      const centreX = box.left + box.width / 2
      const centreY = box.top + box.height / 2
      const withinX = Math.abs(event.clientX - centreX) < box.width / 2 + padding
      const withinY = Math.abs(event.clientY - centreY) < box.height / 2 + padding

      if (withinX && withinY) {
        setActive(true)
        apply((event.clientX - centreX) / strength, (event.clientY - centreY) / strength)
      } else {
        setActive(false)
        apply(0, 0)
      }
    }

    const onMove = (event: PointerEvent) => {
      latest = event
      if (frame.current === null) frame.current = requestAnimationFrame(process)
    }

    const onLeave = () => {
      setActive(false)
      apply(0, 0)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [apply, padding, reduced, strength])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform',
        transition: reduced ? undefined : active ? activeTransition : inactiveTransition,
      }}
    >
      {children}
    </div>
  )
}
