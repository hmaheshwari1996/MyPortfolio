import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import HeroObject from '../components/HeroObject'
import { ContactButton } from '../components/Buttons'
import { NAV, PERSON } from '../content/profile'

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
        className="hero-gutter relative z-20 flex items-center justify-between pt-6 md:pt-8"
      >
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-medium uppercase tracking-wider text-bone transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {item.label}
          </a>
        ))}
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

        <div className="hero-gutter flex items-end justify-between gap-6 pb-7 sm:pb-8 md:pb-10">
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

          <FadeIn delay={0.5} y={20}>
            <ContactButton href="#contact" />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
