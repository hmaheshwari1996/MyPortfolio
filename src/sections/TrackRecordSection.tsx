import FadeIn from '../components/FadeIn'
import { CAPABILITIES, TIMELINE } from '../content/profile'

/**
 * The receipts. Roles are listed newest-first inside each company so the shape
 * of the progression is the first thing you read, not the earliest job title.
 */
export default function TrackRecordSection() {
  return (
    <section id="track-record" className="relative bg-ink px-5 py-24 sm:px-8 sm:py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading mb-16 font-black uppercase leading-none tracking-tight sm:mb-20"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
          >
            Track record
          </h2>
        </FadeIn>

        <div className="flex flex-col">
          {TIMELINE.map((entry, i) => (
            <FadeIn
              key={entry.company}
              delay={i * 0.1}
              y={24}
              className="grid gap-6 border-t border-bone/12 py-10 first:border-t-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12 md:py-14"
            >
              <div className="flex flex-col gap-2">
                <h3
                  className="font-medium uppercase leading-tight tracking-wide text-bone"
                  style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)' }}
                >
                  {entry.company}
                </h3>
                <span
                  className="text-[0.68rem] font-light uppercase tracking-[0.22em] text-bone/55 sm:text-xs"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {entry.companyPeriod}
                </span>
                <p className="mt-3 max-w-sm text-xs font-light leading-relaxed text-bone/55 sm:text-sm">
                  {entry.note}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <ol className="flex flex-col">
                  {entry.roles.map((role) => (
                    <li
                      key={role.title + role.period}
                      className="flex flex-col gap-1 border-b border-bone/8 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span className="text-sm font-light leading-snug text-bone/85 sm:text-base">
                        {role.title}
                      </span>
                      <span
                        className="shrink-0 text-[0.68rem] font-light uppercase tracking-[0.16em] text-bone/55 sm:text-xs"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {role.period}
                      </span>
                    </li>
                  ))}
                </ol>

                {/*
                  The evidence under the progression. Sits in the right column,
                  directly beneath the roles it substantiates, so the claim in
                  the left rail is never left unbacked.
                */}
                <ul className="flex flex-col gap-2.5">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-signal"
                      />
                      <span className="text-xs font-light leading-relaxed text-bone/65 sm:text-sm">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/*
          Capability groups as objects rather than a flat chip wall. `h-full` on
          both the FadeIn wrapper and the card keeps a row level even when one
          group carries fewer chips than its neighbour.
        */}
        <div className="mt-20 grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {CAPABILITIES.map((group, i) => (
            <FadeIn key={group.group} delay={i * 0.07} y={20} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-[28px] border border-bone/12 bg-bone/[0.035] p-5 sm:rounded-[32px] sm:p-6">
                <h3 className="flex items-center gap-2.5 text-[0.62rem] font-light uppercase tracking-[0.26em] text-bone/75">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-signal" />
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-bone/12 px-3 py-1 text-[0.7rem] font-light text-bone/65 sm:text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
