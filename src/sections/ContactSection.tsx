import { Mail, Link2 } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { ContactButton } from '../components/Buttons'
import { PERSON } from '../content/profile'

export default function ContactSection() {
  const links = [
    { icon: Mail, label: PERSON.email, href: `mailto:${PERSON.email}` },
    { icon: Link2, label: PERSON.linkedin, href: PERSON.linkedinUrl },
  ]

  return (
    <footer
      id="contact"
      className="relative flex flex-col items-center gap-12 bg-ink px-5 pb-14 pt-24 sm:px-8 sm:pt-32 md:px-10 md:pt-40"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 13vw, 190px)' }}
        >
          Let&#8217;s build
        </h2>
      </FadeIn>

      <FadeIn delay={0.12} y={20}>
        <p className="max-w-[46ch] text-center text-sm font-light leading-relaxed text-bone/65 sm:text-base">
          If you are looking for someone to own a product end to end — decide what
          gets built, ship it fast, and keep it running — I would like to hear about it.
        </p>
      </FadeIn>

      <FadeIn delay={0.24} y={20}>
        <ContactButton href={`mailto:${PERSON.email}`} label="Contact Me" />
      </FadeIn>

      <FadeIn delay={0.32} y={20} className="w-full max-w-4xl">
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-bone/10 sm:grid-cols-2">
          {links.map(({ icon: Icon, label, href }) => (
            <li key={href} className="bg-ink">
              <a
                href={href}
                className="flex items-center gap-3 px-5 py-5 text-xs font-light text-bone/70 transition-colors duration-200 hover:text-bone sm:text-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-bone/55" strokeWidth={1.6} aria-hidden="true" />
                <span className="truncate">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="mt-6 flex w-full max-w-6xl flex-col items-center gap-2 border-t border-bone/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="text-[0.66rem] font-light uppercase tracking-[0.22em] text-bone/55">
          {PERSON.fullName} · {PERSON.role}
        </span>
        <span className="text-[0.66rem] font-light uppercase tracking-[0.22em] text-bone/55">
          {PERSON.location}
        </span>
      </div>
    </footer>
  )
}
