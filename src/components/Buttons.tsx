import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

const CTA_GRADIENT =
  'linear-gradient(123deg, #04201F 7%, #12A594 37%, #0E8F94 72%, #16BFC4 100%)'

export type ContactButtonProps = {
  href?: string
  label?: string
  className?: string
}

/**
 * The one saturated object on the page. Everything else is graphite and bone,
 * so this reads as the only thing you are meant to press.
 */
export function ContactButton({
  href = '#contact',
  label = 'Contact Me',
  className = '',
}: ContactButtonProps) {
  return (
    <a
      href={href}
      className={`cta-pill group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      style={{
        background: CTA_GRADIENT,
        boxShadow:
          '0px 4px 4px rgba(18, 165, 148, 0.25), 4px 4px 12px #0E8F94 inset',
      }}
    >
      {label}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={2}
        aria-hidden="true"
      />
    </a>
  )
}

export type GhostButtonProps = {
  href?: string
  children?: ReactNode
  className?: string
  onLight?: boolean
  /**
   * `md` is the product-card geometry and stays the default, so adding this
   * prop cannot move any existing call site. `sm` is the lighter pill used
   * beside the hero CTA, where three controls have to share one line.
   */
  size?: 'sm' | 'md'
  target?: string
  rel?: string
}

/**
 * Outline pill used for secondary actions: live-project links on the product
 * cards, and the profile links beside the hero CTA.
 *
 * Focus is deliberately left to the global `:focus-visible` rule in index.css —
 * no inline outline here, or it would outrank the stylesheet and kill the ring.
 */
export function GhostButton({
  href = '#contact',
  children = 'Live Project',
  className = '',
  onLight = false,
  size = 'md',
  target,
  rel,
}: GhostButtonProps) {
  const tone = onLight
    ? 'border-ink text-ink hover:bg-ink/10'
    : 'border-bone text-bone hover:bg-bone/10'
  const geometry =
    size === 'sm'
      ? // Holds the compact geometry all the way to lg on purpose: at 768–1023px
        // the hero row is CTA + two of these on one line, and stepping up at sm
        // pushed the third pill onto a second line, over the wordmark.
        'border px-4 py-2.5 text-xs lg:px-5 lg:py-3 lg:text-sm'
      : 'border-2 px-6 py-3 text-sm sm:px-10 sm:py-3.5 sm:text-base'
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full font-medium uppercase tracking-widest transition-colors duration-300 ${geometry} ${tone} ${className}`}
    >
      {children}
    </a>
  )
}
