import { memo, type JSX } from 'react';

/**
 * ProductFrame — an app-window chrome wrapped around a hand-drawn product vignette.
 *
 * Harshit's products are internal enterprise systems: there are no public URLs and
 * no shareable screenshots. So this is deliberately an APP window, not a browser
 * window — a title bar with traffic lights and the product's own name, and no
 * address bar, because any URL rendered there would be invented.
 *
 * The vignette is pure inline SVG drawn from the palette: no images, no network,
 * no animation, no filters, no foreignObject, nothing random at render time.
 * Rounded rects stand in for text, so the drawing never states a fact. Nothing
 * animates, so prefers-reduced-motion is satisfied by construction.
 */

const GROUND = '#0C0C0C';
const S1 = '#121212';
const S2 = '#161616';
const S3 = '#1C1C1C';
const INK = '#D7E2EA';
const HAIR = 'rgba(215,226,234,0.10)';

/* accents from the CTA gradient plus the single warm counterpoint — used sparingly */
const A1 = '#12A594';
const A2 = '#0E8F94';
const A3 = '#16BFC4';
const WARM = '#E0A33E';

const seq = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/* ------------------------------------------------------------------ */
/* 0 — job / dispatch console                                          */
/* ------------------------------------------------------------------ */

const JOB_TITLE_W = [168, 196, 144, 180];
const JOB_SUB_W = [112, 96, 132, 104];

function vConsole(id: string): JSX.Element {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-route`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={A3} />
          <stop offset="100%" stopColor={A1} />
        </linearGradient>
      </defs>

      {/* filter rail */}
      {[
        [24, 96],
        [132, 72],
        [216, 84],
        [312, 64],
      ].map(([x, w], k) => (
        <rect key={k} x={x} y="16" width={w} height="26" rx="13" fill={S3} stroke={HAIR} />
      ))}
      <rect x="452" y="16" width="164" height="26" rx="13" fill={S1} stroke={HAIR} />

      {/* job list */}
      <rect x="24" y="56" width="592" height="314" rx="16" fill={S1} stroke={HAIR} />
      <rect x="48" y="76" width="96" height="8" rx="4" fill={INK} opacity={0.42} />
      <rect x="520" y="76" width="72" height="8" rx="4" fill={INK} opacity={0.16} />
      {seq(4).map((k) => {
        const y = 102 + k * 66;
        return (
          <g key={k}>
            <rect x="48" y={y + 10} width="30" height="30" rx="9" fill={S3} stroke={HAIR} />
            <rect x="94" y={y + 13} width={JOB_TITLE_W[k]} height="8" rx="4" fill={INK} opacity={0.5} />
            <rect x="94" y={y + 30} width={JOB_SUB_W[k]} height="6" rx="3" fill={INK} opacity={0.22} />
            <rect
              x="468"
              y={y + 12}
              width="124"
              height="22"
              rx="11"
              fill={k === 1 ? A1 : INK}
              opacity={k === 1 ? 0.28 : 0.09}
            />
            {k < 3 && <line x1="48" y1={y + 60} x2="592" y2={y + 60} stroke={HAIR} />}
          </g>
        );
      })}

      {/* map panel */}
      <rect x="24" y="386" width="592" height="228" rx="16" fill={GROUND} stroke={HAIR} />
      <path
        d="M24 462 H616 M24 538 H616 M190 386 V614 M370 386 V614 M500 386 V614"
        stroke={HAIR}
        fill="none"
      />
      <path d="M60 614 L190 502 L370 502 L470 414" stroke={HAIR} fill="none" />
      <rect x="60" y="482" width="96" height="46" rx="6" fill={INK} opacity={0.05} />
      <rect x="500" y="548" width="88" height="44" rx="6" fill={INK} opacity={0.05} />
      <rect x="212" y="402" width="64" height="46" rx="6" fill={INK} opacity={0.05} />
      <rect x="394" y="470" width="76" height="42" rx="6" fill={INK} opacity={0.04} />
      <rect x="248" y="562" width="94" height="38" rx="6" fill={INK} opacity={0.04} />
      <path
        d="M120 452 C 200 470, 220 534, 320 546 S 470 506, 520 444"
        fill="none"
        stroke={`url(#${id}-route)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="120" cy="452" r="5" fill={INK} opacity={0.55} />
      <circle cx="520" cy="444" r="5" fill={INK} opacity={0.55} />
      <circle cx="320" cy="546" r="12" fill={A3} opacity={0.22} />
      <circle cx="320" cy="546" r="4.5" fill={A3} opacity={0.95} />
      <rect x="48" y="578" width="120" height="22" rx="11" fill={S3} stroke={HAIR} />
      <rect x="60" y="585" width="72" height="8" rx="4" fill={INK} opacity={0.3} />

      {/* technician strip */}
      <rect x="24" y="630" width="592" height="92" rx="16" fill={S1} stroke={HAIR} />
      <circle cx="72" cy="676" r="20" fill={INK} opacity={0.14} />
      <rect x="110" y="656" width="160" height="9" rx="4.5" fill={INK} opacity={0.5} />
      <rect x="110" y="675" width="112" height="7" rx="3.5" fill={INK} opacity={0.22} />
      <rect x="110" y="692" width="72" height="7" rx="3.5" fill={INK} opacity={0.14} />
      <rect x="458" y="661" width="134" height="30" rx="15" fill={A2} opacity={0.68} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — delivery pipeline, diff review and agent run log                */
/* ------------------------------------------------------------------ */

const CODE_W = [268, 342, 214, 386, 296, 178, 358, 240];
/** 1 = added hunk, -1 = removed hunk, 0 = context */
const DIFF = [0, 0, 1, 1, 0, 0, -1, 0];
const LOG_W = [364, 288, 428, 212];
const GATE_W = [268, 214, 306];

function vPipeline(id: string): JSX.Element {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={A2} />
          <stop offset="100%" stopColor={A3} />
        </linearGradient>
      </defs>

      {/* delivery stages */}
      <line x1="88" y1="58" x2="552" y2="58" stroke={HAIR} strokeWidth="2" />
      {seq(4).map((k) => {
        const cx = 88 + k * 155;
        return (
          <g key={k}>
            <circle cx={cx} cy="58" r="22" fill={k < 3 ? S3 : S1} stroke={HAIR} />
            <circle
              cx={cx}
              cy="58"
              r={k === 2 ? 9 : 7}
              fill={k === 2 ? A1 : INK}
              opacity={k === 2 ? 0.9 : k < 2 ? 0.45 : 0.14}
            />
            <rect x={cx - 28} y="92" width="56" height="6" rx="3" fill={INK} opacity={k <= 2 ? 0.26 : 0.13} />
          </g>
        );
      })}

      {/* diff under review */}
      <rect x="24" y="124" width="592" height="300" rx="16" fill={GROUND} stroke={HAIR} />
      <rect x="24" y="124" width="56" height="300" rx="16" fill={S2} />
      <rect x="56" y="124" width="24" height="300" fill={S2} />
      <line x1="80" y1="124" x2="80" y2="424" stroke={HAIR} />
      {DIFF.map((d, k) =>
        d === 0 ? null : (
          <rect
            key={`h${k}`}
            x="80"
            y={142 + k * 33}
            width="536"
            height="26"
            fill={d > 0 ? A1 : A3}
            opacity={0.09}
          />
        ),
      )}
      {DIFF.map((d, k) => (
        <g key={k}>
          <rect x="40" y={151 + k * 33} width="22" height="6" rx="3" fill={INK} opacity={0.16} />
          {d !== 0 && (
            <rect x="89" y={153 + k * 33} width="11" height="2.5" rx="1.2" fill={d > 0 ? A1 : A3} opacity={0.85} />
          )}
          {d > 0 && <rect x="93.25" y={149 + k * 33} width="2.5" height="11" rx="1.2" fill={A1} opacity={0.85} />}
          <rect
            x={110 + (k % 3) * 20}
            y={150 + k * 33}
            width={CODE_W[k]}
            height="8"
            rx="4"
            fill={INK}
            opacity={d === 0 ? 0.22 : 0.48}
          />
        </g>
      ))}

      {/* review gates */}
      <rect x="24" y="440" width="592" height="132" rx="16" fill={S1} stroke={HAIR} />
      {GATE_W.map((w, k) => (
        <g key={k}>
          <path
            d={`M56 ${476 + k * 36} l 8 9 l 15 -18`}
            fill="none"
            stroke={k === 0 ? A3 : INK}
            strokeOpacity={k === 0 ? 0.9 : 0.32}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="98" y={471 + k * 36} width={w} height="8" rx="4" fill={INK} opacity={k === 0 ? 0.42 : 0.24} />
        </g>
      ))}

      {/* agent run log */}
      <rect x="24" y="588" width="592" height="134" rx="16" fill={GROUND} stroke={HAIR} />
      {LOG_W.map((w, k) => (
        <g key={k}>
          <rect x="48" y={614 + k * 24} width="26" height="6" rx="3" fill={INK} opacity={0.16} />
          <rect x="88" y={614 + k * 24} width={w} height="6" rx="3" fill={INK} opacity={0.24} />
        </g>
      ))}
      <rect x="48" y="694" width="10" height="10" rx="2" fill={`url(#${id}-bar)`} opacity={0.9} />
      <rect x="68" y="696" width="118" height="6" rx="3" fill={INK} opacity={0.14} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — attendance roster grid with a payroll summary                   */
/* ------------------------------------------------------------------ */

/** 1 = present, 0 = absent, 2 = leave */
const ROSTER: number[][] = [
  [1, 1, 1, 1, 1, 1],
  [1, 1, 2, 1, 1, 1],
  [1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1],
];
const NAME_W = [104, 82, 118, 92, 110];
const PAY_LABEL_W = [142, 108, 168];
const PAY_VALUE_W = [96, 72, 84];

function vRoster(id: string): JSX.Element {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-total`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={A2} />
          <stop offset="100%" stopColor={A1} />
        </linearGradient>
      </defs>

      <rect x="24" y="16" width="140" height="10" rx="5" fill={INK} opacity={0.42} />
      <rect x="470" y="10" width="146" height="26" rx="13" fill={S3} stroke={HAIR} />

      {/* roster grid — days across, people down */}
      <rect x="24" y="52" width="592" height="420" rx="16" fill={S1} stroke={HAIR} />
      {seq(6).map((k) => (
        <rect key={k} x={196 + k * 66} y="78" width="22" height="6" rx="3" fill={INK} opacity={0.22} />
      ))}
      <path
        d="M24 100 H616 M246 100 V472 M312 100 V472 M378 100 V472 M444 100 V472 M510 100 V472"
        stroke={HAIR}
        fill="none"
      />
      {NAME_W.map((w, r) => (
        <rect key={r} x="48" y={127 + r * 74} width={w} height="8" rx="4" fill={INK} opacity={0.4} />
      ))}
      {ROSTER.map((row, r) =>
        row.map((state, c) => (
          <rect
            key={`${r}-${c}`}
            x={180 + c * 66}
            y={116 + r * 74}
            width="54"
            height="30"
            rx="8"
            fill={state === 2 ? WARM : INK}
            opacity={state === 2 ? 0.42 : state === 1 ? 0.17 : 0.05}
          />
        )),
      )}
      <line x1="411" y1="100" x2="411" y2="472" stroke={A3} strokeWidth="1.5" opacity={0.45} />

      {/* payroll summary */}
      <rect x="24" y="492" width="592" height="230" rx="16" fill={GROUND} stroke={HAIR} />
      <rect x="48" y="518" width="118" height="8" rx="4" fill={INK} opacity={0.34} />
      {PAY_LABEL_W.map((w, k) => (
        <g key={k}>
          <rect x="48" y={560 + k * 38} width={w} height="7" rx="3.5" fill={INK} opacity={0.24} />
          <rect
            x={592 - PAY_VALUE_W[k]!}
            y={560 + k * 38}
            width={PAY_VALUE_W[k]}
            height="7"
            rx="3.5"
            fill={INK}
            opacity={0.4}
          />
        </g>
      ))}
      <line x1="48" y1="666" x2="592" y2="666" stroke={HAIR} />
      <rect x="424" y="686" width="168" height="14" rx="7" fill={`url(#${id}-total)`} opacity={0.7} />
    </>
  );
}

const VARIANTS: ReadonlyArray<(id: string) => JSX.Element> = [vConsole, vPipeline, vRoster];

export interface ProductFrameProps {
  /** Product name, rendered in the window title bar. Never a URL. */
  title: string;
  variant: 0 | 1 | 2;
  className?: string;
}

function ProductFrameBase({ title, variant, className }: ProductFrameProps): JSX.Element {
  const v = ((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length;
  const draw = VARIANTS[v]!;
  const id = `pf${v}`;

  return (
    <div
      className={
        'flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(215,226,234,0.12)] bg-[#121212] ' +
        (className ?? '')
      }
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-[rgba(215,226,234,0.10)] bg-[#161616] px-4 py-3 sm:px-5">
        <span className="flex shrink-0 items-center gap-[6px]" aria-hidden="true">
          <span className="h-[7px] w-[7px] rounded-full bg-bone/25" />
          <span className="h-[7px] w-[7px] rounded-full bg-bone/[0.16]" />
          <span className="h-[7px] w-[7px] rounded-full bg-bone/[0.11]" />
        </span>
        <span className="min-w-0 truncate text-[0.58rem] font-light uppercase tracking-[0.2em] text-bone/55 sm:text-[0.65rem]">
          {title}
        </span>
      </div>

      <div className="relative aspect-[64/74] w-full md:aspect-auto md:min-h-[440px] md:flex-1">
        <svg
          viewBox="0 0 640 740"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
          shapeRendering="geometricPrecision"
        >
          <rect x="0" y="0" width="640" height="740" fill={GROUND} />
          {draw(id)}
        </svg>
      </div>
    </div>
  );
}

const ProductFrame = memo(ProductFrameBase);
ProductFrame.displayName = 'ProductFrame';

export default ProductFrame;
