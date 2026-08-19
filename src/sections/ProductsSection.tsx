import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { GhostButton } from '../components/Buttons'
import { PRODUCTS, SHIPPED, type Product } from '../content/profile'

/**
 * Cards stack rather than scroll past: each one pins under the last and shrinks
 * a little as the next arrives, so by the end of the section all three are still
 * on screen as a deck. Depth is doing the work that a horizontal carousel would
 * otherwise do, without taking the scroll away from the reader.
 */
type CardProps = {
  product: Product
  index: number
  total: number
  progress: MotionValue<number>
  reduced: boolean
}

function ProductCard({ product, index, total, progress, reduced }: CardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  return (
    <div className="flex min-h-[85vh] items-start justify-center pb-10 md:pb-14">
      <motion.article
        className="w-full origin-top overflow-hidden rounded-[40px] border-2 border-bone bg-ink p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{
          scale: reduced ? 1 : scale,
          position: 'sticky',
          top: `calc(var(--stack-top) + ${index * 28}px)`,
        }}
      >
        <header className="flex flex-col gap-4 px-2 pb-6 sm:px-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <span
              className="hero-heading shrink-0 font-black leading-[0.78] tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 120px)', fontVariantNumeric: 'tabular-nums' }}
            >
              {product.id}
            </span>
            <div className="flex flex-col gap-1.5 pt-1 md:pt-3">
              <span className="text-[0.62rem] font-light uppercase tracking-[0.22em] text-bone/55 sm:text-[0.7rem]">
                {product.kind} · {product.year}
              </span>
              <h3
                className="font-medium uppercase leading-tight tracking-wide text-bone"
                style={{ fontSize: 'clamp(1.05rem, 2.4vw, 2.1rem)' }}
              >
                {product.name}
              </h3>
              <span className="text-xs font-light leading-snug text-bone/55 sm:text-sm">
                {product.role}
              </span>
            </div>
          </div>
          <GhostButton href="#contact" className="self-start">
            Ask Me About It
          </GhostButton>
        </header>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-col gap-3 md:w-[40%]">
            <div className="flex flex-1 flex-col justify-start gap-4 rounded-[40px] border border-bone/12 bg-bone/[0.04] p-5 sm:rounded-[50px] sm:p-7 md:rounded-[60px]">
              <span className="text-[0.62rem] font-light uppercase tracking-[0.22em] text-bone/55">
                Built with
              </span>
              <ul className="flex flex-wrap gap-1.5">
                {product.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-bone/15 px-3 py-1 text-[0.68rem] font-light text-bone/70 sm:text-xs"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-1 flex-col justify-start gap-4 rounded-[40px] border border-bone/12 bg-bone/[0.04] p-5 sm:rounded-[50px] sm:p-7 md:rounded-[60px]">
              {product.highlights.map((line, i) => (
                <div key={line} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="w-5 shrink-0 pt-0.5 text-[0.62rem] font-light tracking-widest text-bone/55"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-light leading-relaxed text-bone/75 sm:text-sm">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative flex flex-col overflow-hidden rounded-[40px] border border-bone/12 p-6 sm:rounded-[50px] sm:p-9 md:w-[60%] md:rounded-[60px]"
            style={{
              background:
                'radial-gradient(120% 90% at 82% 6%, rgba(18, 165, 148,0.20) 0%, rgba(14, 143, 148,0.11) 34%, rgba(12,12,12,0) 68%), radial-gradient(90% 70% at 10% 100%, rgba(22, 191, 196,0.16) 0%, rgba(12,12,12,0) 62%)',
              minHeight: 'clamp(220px, 30vw, 420px)',
            }}
          >
            <p
              className="my-auto max-w-[36ch] font-light leading-snug text-bone"
              style={{ fontSize: 'clamp(1rem, 2.1vw, 1.65rem)' }}
            >
              {product.summary}
            </p>
            <span className="mt-6 self-end text-[0.62rem] font-light uppercase tracking-[0.22em] text-bone/55">
              {product.kind}
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ProductsSection() {
  const container = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="products"
      className="relative z-30 -mt-10 rounded-t-[40px] bg-ink px-5 pb-24 pt-20 [--stack-top:1.5rem] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:[--stack-top:6rem]"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-4 text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Products
        </h2>
      </FadeIn>

      <FadeIn delay={0.08} y={20}>
        <p className="mx-auto mb-14 max-w-xl text-center text-sm font-light leading-relaxed text-bone/55 sm:mb-20 sm:text-base">
          Three things I own end to end — what they are, what I did, what changed.
        </p>
      </FadeIn>

      <div ref={container} className="mx-auto max-w-6xl">
        {PRODUCTS.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            total={PRODUCTS.length}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
        <FadeIn delay={0} y={24}>
          <h3 className="mb-8 text-center text-[0.68rem] font-light uppercase tracking-[0.28em] text-bone/55 sm:text-xs">
            Also shipped
          </h3>
        </FadeIn>
        <ul className="grid gap-px overflow-hidden rounded-3xl bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
          {SHIPPED.map((item, i) => (
            <FadeIn
              as="li"
              key={item.name}
              delay={i * 0.06}
              y={20}
              className="flex flex-col gap-2 bg-ink p-6 sm:p-7"
            >
              <span className="text-[0.6rem] font-light uppercase tracking-[0.22em] text-bone/55">
                {item.tag}
              </span>
              <span className="text-base font-medium leading-snug text-bone sm:text-lg">
                {item.name}
              </span>
              <span className="text-xs font-light leading-relaxed text-bone/55 sm:text-sm">
                {item.blurb}
              </span>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  )
}
