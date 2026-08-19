import { useEffect, useMemo, useRef, useState } from 'react'
import ShowcaseTile from '../components/ShowcaseTile'
import { SHOWCASE_LABELS } from '../content/profile'

/**
 * Two counter-scrolling bands of the product surfaces behind the work. Offset is
 * driven by page scroll rather than a timer, so the rows only move while the
 * reader does — it reads as parallax depth, not as a carousel demanding attention.
 */
const SPLIT = 11
const REPEATS = 3

function useScrollOffset(ref: React.RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState(0)
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  /* Subscribed rather than sampled once: a reader who turns Reduce Motion off
     mid-session gets the parallax back, and one who turns it on loses it,
     because the state change re-runs the effect below. */
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    setReduced(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    /* 0 resolves shift to -200/+200 — exactly the resting frame a reduce-at-load
       reader already sees — so the rows settle rather than freezing mid-parallax. */
    if (reduced) {
      setOffset(0)
      return
    }

    let frame: number | null = null
    let visible = true

    const measure = () => {
      frame = null
      const node = ref.current
      if (!node || !visible) return
      const top = node.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    const node = ref.current
    const io = node
      ? new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true
            if (visible) onScroll()
          },
          { rootMargin: '200px' },
        )
      : null
    if (node && io) io.observe(node)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    measure()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
      io?.disconnect()
    }
  }, [ref, reduced])

  return offset
}

type RowProps = {
  labels: string[]
  indexBase: number
  translate: number
}

function Row({ labels, indexBase, translate }: RowProps) {
  /* Grouped by pass rather than flattened, so passes 1-2 — which exist purely to
     keep the band full while it slides — can be taken out of the accessibility
     tree. Each pass is its own flex box with the same gap as the parent, so the
     rendered spacing is byte-for-byte what the flat list produced. */
  const passes = useMemo(
    () =>
      Array.from({ length: REPEATS }, (_, pass) => ({
        key: `pass-${pass}`,
        hidden: pass > 0,
        tiles: labels.map((label, i) => ({
          key: `${pass}-${i}`,
          label,
          index: indexBase + i,
        })),
      })),
    [labels, indexBase],
  )

  return (
    <div className="flex w-max gap-3" style={{ transform: `translateX(${translate}px)`, willChange: 'transform' }}>
      {passes.map((pass) => (
        <div key={pass.key} className="flex shrink-0 gap-3" aria-hidden={pass.hidden || undefined}>
          {pass.tiles.map((tile) => (
            <ShowcaseTile key={tile.key} index={tile.index} label={tile.label} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement | null>(null)
  const offset = useScrollOffset(ref)
  const shift = offset - 200

  const rowOne = SHOWCASE_LABELS.slice(0, SPLIT)
  const rowTwo = SHOWCASE_LABELS.slice(SPLIT)

  return (
    <section
      ref={ref}
      /* No accessible name on purpose: naming it would map it to a `region`
         landmark, and a decorative band of vignettes is not a landmark. */
      className="flex flex-col gap-3 bg-ink pb-10 pt-24 sm:pt-32 md:pt-40"
      style={{ overflowX: 'clip' }}
    >
      <Row labels={rowOne} indexBase={0} translate={shift} />
      <Row labels={rowTwo} indexBase={SPLIT} translate={-shift} />
    </section>
  )
}
