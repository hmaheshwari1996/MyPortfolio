import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

const CTA_GRADIENT =
  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'

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
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
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
}

/** Outline pill used for secondary actions on the product cards. */
export function GhostButton({
  href = '#contact',
  children = 'Live Project',
  className = '',
  onLight = false,
}: GhostButtonProps) {
  const tone = onLight
    ? 'border-ink text-ink hover:bg-ink/10'
    : 'border-bone text-bone hover:bg-bone/10'
  return (
    <a
      href={href}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-300 sm:px-10 sm:py-3.5 sm:text-base ${tone} ${className}`}
    >
      {children}
    </a>
  )
}
