import { ArrowDown, ArrowUpRight } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import HeroObject from '../components/HeroObject'
import { ContactButton, GhostButton } from '../components/Buttons'
import { NAV, PERSON } from '../content/profile'

/**
 * The resume PDF is served out of public/, which only the multi-asset build
 * emits. `npm run build:single` inlines everything into one index.html and has
 * no public/ directory at all, so the link would 404 there — the pill is
 * omitted from that build rather than shipped broken.
 */
const HAS_RESUME_ASSET = import.meta.env.MODE !== 'single'

/**
 * Full-viewport opening. Three layers: the nav and wordmark on top, the
 * raymarched instrument floating in the middle, and the thesis line plus the
 * single call to action pinned to the bottom edge.
 */
export default function HeroSection() {
  return (
    <section
      className="hero-shell relative flex h-[100svh] min-h-[600px] flex-col justify-between"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="hero-gutter relative z-20 flex items-center justify-between gap-6 pt-6 md:gap-10 md:pt-8"
      >
        {/*
          The four section links keep their edge-to-edge spread — that spacing is
          the nav's whole character — so the group takes the remaining width and
          distributes them itself. The resume pill is a different kind of object
          and sits outside that rhythm, past the nav gap, at the right edge.
        */}
        <div className="flex flex-1 items-center justify-between gap-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wider text-bone transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {HAS_RESUME_ASSET && (
          /*
            Hidden below sm: at 375px the four links already fill the gutter to
            within a few pixels, so a fifth object there would force them to
            collide or wrap.
          */
          <a
            href={PERSON.resumeUrl}
            download
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-signal/45 bg-signal/[0.07] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-bone/85 transition-colors duration-200 hover:border-signal hover:bg-signal/15 hover:text-bone sm:inline-flex md:px-4 md:py-2 md:text-sm"
          >
            {PERSON.resumeLabel}
            <ArrowDown className="h-3.5 w-3.5 text-signal-bright" strokeWidth={2} aria-hidden="true" />
          </a>
        )}
      </FadeIn>

      {/*
        The instrument. Positioning lives on this outer wrapper on purpose:
        Framer Motion writes `transform` inline on the element it animates, which
        would silently overwrite Tailwind's -translate-x-1/2 centring.
      */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[340px] -translate-x-1/2 -translate-y-[58%] sm:bottom-[-4%] sm:top-auto sm:w-[440px] sm:translate-y-0 md:w-[560px] lg:w-[660px] xl:w-[720px] 2xl:w-[820px]">
        <FadeIn delay={0.6} y={30} duration={1.1}>
          <Magnet padding={150} strength={3} className="aspect-square w-full">
            <HeroObject className="h-full w-full" />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 flex flex-1 flex-col justify-end">
        <FadeIn delay={0.15} y={40} className="hero-gutter overflow-hidden">
          <h1 className="hero-heading wordmark w-full whitespace-nowrap font-black uppercase leading-none tracking-[-0.045em]">
            Hi, I&#8217;m {PERSON.firstName}
          </h1>
        </FadeIn>

        {/*
          Below md the three actions cannot share a line with the copy without
          crowding it, so the row becomes a stack and the actions wrap on their
          own full-width line; from md up it is the original copy-left /
          actions-right arrangement, with the actions held to one line.
        */}
        <div className="hero-gutter flex flex-col items-start gap-5 pb-7 sm:pb-8 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-10">
          <FadeIn delay={0.35} y={20} className="flex max-w-[160px] flex-col gap-2 sm:max-w-[210px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[380px]">
            <span
              className="font-medium uppercase leading-tight tracking-[0.16em] text-bone"
              style={{ fontSize: 'clamp(0.7rem, 1.05vw, 1.05rem)' }}
            >
              {PERSON.role}
            </span>
            <p
              className="font-light uppercase leading-snug tracking-wide text-bone/70"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              {PERSON.heroLine}
            </p>
          </FadeIn>

          <FadeIn
            delay={0.5}
            y={20}
            /*
              md:shrink-0 keeps the three actions on one line and lets the copy
              column absorb the shortfall instead; without it the 768–1023px
              range drops LinkedIn onto a second row that rides up into the
              wordmark.
            */
            className="flex flex-wrap items-center gap-2.5 md:shrink-0 md:justify-end md:gap-3"
          >
            <ContactButton href="#contact" />
            <GhostButton
              size="sm"
              href={PERSON.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              github
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </GhostButton>
            <GhostButton
              size="sm"
              href={PERSON.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              linkedin
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </GhostButton>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
