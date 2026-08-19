import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import OrbitGlyph, { type GlyphVariant } from '../components/OrbitGlyph'
import { ContactButton } from '../components/Buttons'
import { ABOUT_PARAGRAPH, STATS } from '../content/profile'

const CORNERS: Array<{
  variant: GlyphVariant
  position: string
  size: string
  delay: number
  x: number
}> = [
  {
    variant: 'gyro',
    position: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    size: 'w-[92px] sm:w-[130px] md:w-[180px]',
    delay: 0.1,
    x: -80,
  },
  {
    variant: 'lattice',
    position: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    size: 'w-[92px] sm:w-[130px] md:w-[180px]',
    delay: 0.15,
    x: 80,
  },
  {
    variant: 'helix',
    position: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    size: 'w-[78px] sm:w-[112px] md:w-[152px]',
    delay: 0.25,
    x: -80,
  },
  {
    variant: 'graph',
    position: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    size: 'w-[86px] sm:w-[122px] md:w-[164px]',
    delay: 0.3,
    x: 80,
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10"
      style={{ overflowX: 'clip' }}
    >
      {CORNERS.map((corner) => (
        <FadeIn
          key={corner.variant}
          delay={corner.delay}
          duration={0.9}
          x={corner.x}
          y={0}
          className={`pointer-events-none absolute z-0 opacity-70 ${corner.position} ${corner.size}`}
        >
          <OrbitGlyph variant={corner.variant} className="h-auto w-full" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex w-full flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <AnimatedText
          text={ABOUT_PARAGRAPH}
          className="max-w-[560px] text-center font-medium leading-relaxed text-bone"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />

        {/*
          Four bordered cards, not floating numerals: the value is the hook, the
          label names it, and `detail` is the sentence that makes it mean
          something. One column at 320, two at sm, four at lg.
        */}
        <FadeIn
          delay={0.2}
          y={24}
          className="grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-3xl sm:grid-cols-2 sm:gap-5 lg:max-w-5xl lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex h-full flex-col gap-3 rounded-[28px] border border-bone/12 bg-bone/[0.035] p-5 sm:rounded-[32px] sm:p-6"
            >
              <span
                className="hero-heading font-black leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(2.1rem, 4.2vw, 3rem)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stat.value}
              </span>
              <span aria-hidden className="h-[2px] w-8 bg-signal/80" />
              <span className="text-[0.68rem] font-light uppercase leading-tight tracking-[0.18em] text-bone/75 sm:text-xs">
                {stat.label}
              </span>
              <span className="text-[0.74rem] font-light leading-relaxed text-bone/55 sm:text-xs">
                {stat.detail}
              </span>
            </div>
          ))}
        </FadeIn>
      </div>

      <FadeIn delay={0.1} y={24} className="relative z-10 mt-16 sm:mt-20 md:mt-24">
        <ContactButton href="#contact" label="Let’s Talk" />
      </FadeIn>
    </section>
  )
}
