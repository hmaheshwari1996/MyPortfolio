/**
 * profile.ts — the single source of copy for the landing page.
 *
 * Every string the page renders lives here. Nothing is fetched, imported from a
 * network host, or hard-coded in a component. Every factual claim below is
 * traceable to the source CV: roles, dates, team size, companies, technologies
 * and shipped products are stated, not inferred. The single exception is
 * PERSON.location, which the CV does not state — see the note on that field.
 */

/* ------------------------------------------------------------------ person */

export interface Person {
  firstName: string;
  fullName: string;
  role: string;
  tagline: string;
  /** Short micro-copy under the hero. Rendered uppercase by CSS. */
  heroLine: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  location: string;
  /** Served from public/. Nav download link. */
  resumeUrl: string;
  resumeLabel: string;
}

export const PERSON: Person = {
  firstName: 'Harshit',
  fullName: 'Harshit Maheshwari',
  role: 'Technical Product Architect',
  tagline:
    'I own products from planning to production, and the AI-first delivery that gets them there.',
  heroLine: 'Product intent in. Shipped, maintained software out.',
  email: 'hmaheshwari1996@gmail.com',
  linkedin: 'linkedin.com/in/hmaheshwari96',
  linkedinUrl: 'https://www.linkedin.com/in/hmaheshwari96',
  github: 'github.com/hmaheshwari1996',
  githubUrl: 'https://github.com/hmaheshwari1996',
  location: 'Delhi NCR, India',
  resumeUrl: '/Harshit-Maheshwari-Resume.pdf',
  resumeLabel: 'resume.pdf',
};

/* --------------------------------------------------------------- navigation */

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'about', href: '#about' },
  { label: 'practice', href: '#practice' },
  { label: 'products', href: '#products' },
  { label: 'contact', href: '#contact' },
];

/* ------------------------------------------------------------------- about */

/**
 * Animated character-by-character on scroll. Keep between 300 and 420
 * characters; the reveal timing is tuned to that length.
 */
export const ABOUT_PARAGRAPH =
  'I decide what gets built, why it earns its place, and what it costs to keep running. The building itself is AI-first now, so my days are scope, architecture and review rather than typing every line. I lead a ten-person team, own platforms for four companies, and stay close enough to the code to be useful. If that is the shape of your problem, talk to me.';

/* ------------------------------------------------------------------- stats */

export interface Stat {
  value: string;
  /** Short noun phrase. 34 characters or fewer. */
  label: string;
  /** One line explaining why the number matters. 90 characters or fewer. */
  detail: string;
}

/**
 * Scope and reach, not tenure. Every value below is a count the CV states
 * outright — four group companies, a ten-person team, three Easyfix surfaces,
 * seven AI tools evaluated. The CV contains no outcome metrics (no users,
 * revenue, uptime, latency or percentages) and none are invented here.
 */
export const STATS: Stat[] = [
  {
    value: '4',
    label: 'Companies on my platforms',
    detail: 'Channelplay, Easyfix, Audecy and Fidelity, in service every working day.',
  },
  {
    value: '10',
    label: 'Engineers and QA I lead',
    detail: 'Eight engineers and two QA, from scoping through release and review.',
  },
  {
    value: '3',
    label: 'Surfaces off the monolith',
    detail: 'Website, technician app and client portal, migrating off legacy Struts2.',
  },
  {
    value: '7',
    label: 'AI tools evaluated in practice',
    detail: 'Devin, Windsurf, Claude Code, Gemini CLI, Jules, Tabnine, Replit — then standardised.',
  },
];

/* ---------------------------------------------------------------------------
 * REAL METRICS — HARSHIT, FILL THESE IN.
 *
 * The four cards above are counts, not outcomes, because the CV states no
 * outcome numbers. Three numbers would hit far harder and only you can supply
 * them. When you have one, paste the object into STATS above and delete the
 * weakest card (start with "7 / AI tools evaluated in practice").
 *
 *   1. People actually using the Easyfix platforms:
 *      { value: '__', label: 'People on the platforms', detail: 'Technicians, clients and staff working in Easyfix every day.' },
 *
 *   2. Jobs or support tickets processed per month:
 *      { value: '__', label: 'Jobs processed a month', detail: 'Booked, assigned and closed through the platforms I own.' },
 *
 *   3. The Azure log-ingestion saving, as a percentage or a rupee figure:
 *      { value: '__%', label: 'Cut from log-ingestion spend', detail: 'Found by reading the Log Analytics bill, not by guessing.' },
 *
 * Rules if you edit these: value stays short (4 characters or so), label is a
 * noun phrase of 34 characters or fewer, detail is one line of 90 or fewer.
 * Do not put a number here you cannot defend in an interview.
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------- practice */

export type PracticeId = '01' | '02' | '03' | '04' | '05';

export interface PracticeStep {
  id: PracticeId;
  name: string;
  description: string;
}

/** The lifecycle, in the order I actually run it. */
export const PRACTICE: PracticeStep[] = [
  {
    id: '01',
    name: 'Product planning',
    description:
      'I sit between the business and the build. Requirements become scope, releases get sequenced, and sales, operations and engineering agree the tradeoffs before anyone opens an editor.',
  },
  {
    id: '02',
    name: 'AI-first build',
    description:
      'Delivery runs through the AI tooling I evaluated and standardised. I direct the implementation, set the architecture, and own correctness and code quality across everything that ships.',
  },
  {
    id: '03',
    name: 'Run and reliability',
    description:
      'Shipping is the easy half. I weigh architecture against what it will actually cost to run, and I read the bill — the two services driving our Azure log-ingestion spend were found by looking, not by guessing.',
  },
  {
    id: '04',
    name: 'Support',
    description:
      'Four companies run on these platforms every working day. Keeping them in service is part of owning them, and a question that keeps coming back is really a product gap.',
  },
  {
    id: '05',
    name: 'Team enablement',
    description:
      'I moved engineering onto the AI-first model rather than announcing it: review gates, a stated quality bar for generated code, and eight engineers and two QA mentored into working that way.',
  },
];

/* ---------------------------------------------------------------- products */

export type ProductId = '01' | '02' | '03';
export type ProductKind = 'Platform' | 'Operating Model' | 'Internal Product';

export interface Product {
  id: ProductId;
  name: string;
  kind: ProductKind;
  year: string;
  summary: string;
  role: string;
  stack: string[];
  /** Exactly three outcome lines. */
  highlights: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: '01',
    name: 'Easyfix ecosystem revamp',
    kind: 'Platform',
    year: '2025 — Present',
    summary:
      'A full revamp of the Easyfix ecosystem, moving the website, technician mobile app and client portal off a legacy Struts2 monolith and onto a modern React stack.',
    role: 'Lead architect and product owner',
    stack: ['React', 'React Native', 'Next.js', 'TypeScript', 'Java / Struts2', 'MySQL', 'Azure'],
    highlights: [
      'Rebuilding three surfaces: public website, technician app, client portal.',
      'Struts2 monolith still running the business while the migration proceeds.',
      'Delivered end to end through AI-first workflows, reviewed by me.',
    ],
  },
  {
    id: '02',
    name: 'Channelplay’s AI-first delivery model',
    kind: 'Operating Model',
    year: '2025 — Present',
    summary:
      'The organisation-wide move from manual development to an AI-first model, from tooling evaluation through to the workflows and review gates that keep the output honest.',
    role: 'Owned the evaluation and the rollout',
    stack: ['Claude Code', 'Gemini CLI', 'Devin', 'Windsurf', 'Google Jules', 'Vercel', 'Supabase'],
    highlights: [
      'Seven tools evaluated in practice before the stack was standardised.',
      'Review gates and a quality bar written for AI-generated code.',
      'Vercel and Supabase introduced as the platform foundation.',
    ],
  },
  {
    id: '03',
    name: 'Biometric attendance and payroll platform',
    kind: 'Internal Product',
    year: '2022 — Present',
    summary:
      'A biometric attendance platform with payroll synchronisation, running across Channelplay and its group companies.',
    role: 'Designed and built it',
    stack: ['Java', 'Hibernate', 'Matrix COSEC APIs', 'REST APIs', 'MySQL'],
    highlights: [
      'Matrix COSEC devices integrated for attendance capture at source.',
      'Attendance synchronised into payroll instead of handed over by file.',
      'Deployed across Channelplay, Audecy, Easyfix and Fidelity.',
    ],
  },
];

/* ----------------------------------------------------------------- shipped */

export interface ShippedItem {
  name: string;
  /** 90 characters or fewer. */
  blurb: string;
  tag: string;
}

export const SHIPPED: ShippedItem[] = [
  {
    name: 'EasyRank',
    blurb: 'Tracks keyword rankings through SERP APIs, weekly or on demand.',
    tag: 'Internal tool',
  },
  {
    name: 'Google Ads campaign skill',
    blurb: 'Full campaign lifecycle in plain language, with dry runs and recovery.',
    tag: 'Marketing',
  },
  {
    name: 'Interview calling system',
    blurb: 'Java and OpenAI generating questions and audio live over WebSocket.',
    tag: 'Recruitment',
  },
  {
    name: 'WhatsApp recruitment chatbot',
    blurb: 'Meta APIs and GPT for Apple iPro: conversation logic, webhooks, privacy.',
    tag: 'Client build',
  },
  {
    name: 'AWS support bot',
    blurb: 'Kendra, S3 and CodeCommit behind query analysis and tailored replies.',
    tag: 'Support',
  },
  {
    name: 'Payment gateway integration',
    blurb: 'Zaakpay, Paytm and ICICI on Yatra’s booking platform, to PCI requirements.',
    tag: 'Payments',
  },
];

/* ---------------------------------------------------------------- timeline */

export interface TimelineRole {
  title: string;
  period: string;
}

export interface TimelineEntry {
  company: string;
  companyPeriod: string;
  roles: TimelineRole[];
  note: string;
  /**
   * Exactly three, 130 characters or fewer each. Deliberately company-level:
   * the CV describes achievements per company and per theme, never per job
   * title, so attributing a bullet to one role would be invention.
   */
  highlights: string[];
}

export const TIMELINE: TimelineEntry[] = [
  {
    company: 'Channelplay Ltd.',
    companyPeriod: 'May 2022 — Present',
    roles: [
      { title: 'Technical Product Architect', period: 'May 2026 — Present' },
      { title: 'Technical Architect', period: 'Apr 2025 — May 2026' },
      { title: 'Sr. Software Engineer', period: 'Apr 2023 — Apr 2025' },
      { title: 'Software Engineer', period: 'May 2022 — Apr 2023' },
    ],
    note: 'Product-to-production ownership across Channelplay and its group companies — Easyfix, Audecy and Fidelity.',
    highlights: [
      'Three promotions in four years, as ownership moved from feature delivery to the whole product-to-production lifecycle.',
      'Led the organisation-wide move to AI-first development: seven tools evaluated, then the workflows, review gates and quality bar.',
      'On the AWS-to-Azure migration team, and cut Container Apps log-ingestion cost by isolating the two services driving volume.',
    ],
  },
  {
    company: 'Yatra Online Pvt. Ltd.',
    companyPeriod: 'Feb 2020 — May 2022',
    roles: [
      { title: 'Software Development Engineer I', period: 'Nov 2021 — May 2022' },
      { title: 'Software Engineer — QA', period: 'Aug 2020 — Nov 2021' },
      { title: 'QA Intern', period: 'Feb 2020 — Aug 2020' },
    ],
    note: 'Started in QA and moved into development — where I learned to treat release quality as part of the product, not a stage after it.',
    highlights: [
      'Integrated the Zaakpay, Paytm and ICICI payment gateways into Yatra’s booking platform, meeting PCI compliance requirements.',
      'Automated daily payment reconciliation reporting on scheduled Cron jobs, replacing a manual process.',
      'Built Selenium regression suites across web and mobile booking flows, improving release reliability and cutting manual QA.',
    ],
  },
];

/* ------------------------------------------------------------ capabilities */

export interface CapabilityGroup {
  group: string;
  items: string[];
}

/**
 * Six groups, eight chips at most. Deliberately trimmed: generic engineering
 * tooling every engineer has (Git, Maven, Postman, Insomnia, IntelliJ) is out,
 * and the language list is cut to what a product architect is hired for.
 * Struts2 stays — it is the legacy the Easyfix migration is moving off, which
 * is the story, not a skill claim.
 */
export const CAPABILITIES: CapabilityGroup[] = [
  {
    group: 'Product & architecture',
    items: [
      'Requirements analysis',
      'Solution design',
      'Roadmap & scoping',
      'Stakeholder alignment',
      'Technical documentation',
    ],
  },
  {
    group: 'Leadership',
    items: [
      'Team leadership (10+)',
      'Engineering enablement',
      'Code review',
      'Technical mentorship',
      'Cross-functional delivery',
    ],
  },
  {
    group: 'AI-first delivery',
    items: [
      'Claude Code',
      'OpenAI API',
      'Gemini CLI',
      'Windsurf',
      'Devin',
      'Prompt engineering',
      'Agentic workflow design',
      'AI code review & quality gates',
    ],
  },
  {
    group: 'Cloud & infrastructure',
    items: [
      'Azure (Container Apps, Log Analytics, VM, Dev Pipeline)',
      'AWS (EC2, ECS, S3, Kendra, CodeCommit, CodePipeline)',
      'Vercel',
      'Supabase',
      'WireGuard',
      'nginx',
      'CI/CD',
    ],
  },
  {
    group: 'Engineering',
    items: [
      'Java',
      'Spring',
      'Struts2',
      'Microservices',
      'REST APIs',
      'TypeScript',
      'React / React Native',
      'Next.js',
    ],
  },
  {
    group: 'Data',
    items: ['MySQL', 'PostgreSQL / Redshift', 'Supabase', 'Hibernate'],
  },
];

/* ------------------------------------------------------------ showcase strip */

/** Exactly 21 product surfaces, captioning the scrolling marquee tiles. */
export const SHOWCASE_LABELS: string[] = [
  'Technician App',
  'Client Portal',
  'Easyfix Website',
  'Attendance',
  'Payroll Sync',
  'Biometric Devices',
  'SERP Tracker',
  'Rank Reports',
  'Campaign Console',
  'Ads Automation',
  'Review Gates',
  'Interview Calls',
  'Voice Pipeline',
  'WhatsApp Bot',
  'Support Bot',
  'Knowledge Search',
  'Edge Routing',
  'Log Analytics',
  'VPN Bridge',
  'Payment Gateways',
  'Regression Suites',
];
