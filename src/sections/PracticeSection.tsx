import FadeIn from '../components/FadeIn'
import { PRACTICE } from '../content/profile'

/**
 * The one light section on the page. It carries the lifecycle — planning through
 * enablement — and the numbering is load-bearing here: these run in order, and
 * the argument of the page is that one person owns all five.
 */
export default function PracticeSection() {
  return (
    <section
      id="practice"
      className="on-light relative z-20 rounded-t-[40px] bg-white px-5 py-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-4 text-center font-black uppercase leading-none tracking-tight text-ink"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Practice
        </h2>
      </FadeIn>

      <FadeIn delay={0.08} y={20}>
        <p className="mx-auto mb-16 max-w-xl text-center text-sm font-light leading-relaxed text-ink/60 sm:mb-20 sm:text-base md:mb-28">
          One product lifecycle, five stages, one owner. This is where the work
          actually happens.
        </p>
      </FadeIn>

      <ol className="mx-auto max-w-5xl">
        {PRACTICE.map((item, i) => (
          <FadeIn
            as="li"
            key={item.id}
            delay={i * 0.1}
            y={24}
            className="flex flex-col gap-3 border-t py-8 first:border-t-0 sm:flex-row sm:items-start sm:gap-8 sm:py-10 md:gap-12 md:py-12"
            style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
          >
            <span
              className="shrink-0 font-black leading-[0.8] tracking-tight text-ink"
              /* Kanit ships no tabular figures, so "01" measures narrower than
                 "04" and every row's text would start at a different x. A fixed
                 em-width box keeps the second column aligned. */
              style={{
                fontSize: 'clamp(3rem, 10vw, 140px)',
                width: '1.3em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.id}
            </span>
            <span className="flex flex-col gap-2 pt-1 sm:gap-3 md:pt-3">
              <span
                className="font-medium uppercase leading-tight tracking-wide text-ink"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {item.name}
              </span>
              <span
                className="max-w-2xl font-light leading-relaxed text-ink/60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {item.description}
              </span>
            </span>
          </FadeIn>
        ))}
      </ol>
    </section>
  )
}
