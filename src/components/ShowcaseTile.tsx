import { memo, type JSX } from 'react';

/**
 * ShowcaseTile — 21 hand-drawn, abstracted product-surface vignettes.
 *
 * Every tile is pure inline SVG: no images, no network, no animation, no filters.
 * Rendered up to 63x on the page, so each variant is kept deterministic and cheap
 * (< ~35 SVG nodes, zero per-tile effects). Nothing here animates, so
 * prefers-reduced-motion is satisfied by construction.
 */

const GROUND = '#0C0C0C';
const S1 = '#121212';
const S2 = '#161616';
const S3 = '#1C1C1C';
const INK = '#D7E2EA';
const HAIR = 'rgba(215,226,234,0.10)';

/* accents pulled from the CTA gradient — used at most twice per tile */
const A1 = '#B600A8';
const A2 = '#7621B0';
const A3 = '#BE4C00';

const seq = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/** Tiny deterministic PRNG (mulberry32) so StrictMode double-renders are identical. */
function prng(seed: number): () => number {
  let t = (seed + 1) * 0x9e3779b9;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* 00 — Executive dashboard with KPI tiles                             */
/* ------------------------------------------------------------------ */
function vDashboard(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="0" y="0" width="420" height="32" fill={S2} />
      <line x1="0" y1="32" x2="420" y2="32" stroke={HAIR} />
      <rect x="18" y="12" width="56" height="8" rx="4" fill={INK} opacity={0.5} />
      <rect x="352" y="10" width="50" height="12" rx="6" fill={A2} opacity={0.55} />
      {seq(4).map((k) => (
        <g key={k}>
          <rect x={18 + k * 97} y="48" width="87" height="56" rx="10" fill={S3} stroke={HAIR} />
          <rect x={30 + k * 97} y="60" width="32" height="5" rx="2.5" fill={INK} opacity={0.26} />
          <rect x={30 + k * 97} y="74" width={22 + Math.round(r() * 28)} height="13" rx="3" fill={INK} opacity={0.58} />
        </g>
      ))}
      <rect x="18" y="118" width="248" height="134" rx="10" fill={GROUND} stroke={HAIR} />
      <polyline
        points={seq(8)
          .map((k) => `${34 + k * 30},${222 - (18 + r() * 74)}`)
          .join(' ')}
        fill="none"
        stroke={A1}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="278" y="118" width="124" height="134" rx="10" fill={GROUND} stroke={HAIR} />
      {seq(5).map((k) => (
        <rect key={k} x="292" y={136 + k * 22} width={30 + Math.round(r() * 66)} height="10" rx="5" fill={INK} opacity={0.22 + k * 0.06} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Trend line chart with area fill                                */
/* ------------------------------------------------------------------ */
function vLineChart(i: number): JSX.Element {
  const r = prng(i);
  const id = `st-area-${i}`;
  const pts = seq(9).map((k) => ({ x: 40 + k * 43, y: 214 - (26 + r() * 96) }));
  const d = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={A2} stopOpacity="0.42" />
          <stop offset="100%" stopColor={A2} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={S1} stroke={HAIR} />
      <rect x="34" y="34" width="62" height="7" rx="3.5" fill={INK} opacity={0.45} />
      <rect x="106" y="34" width="30" height="7" rx="3.5" fill={INK} opacity={0.2} />
      {seq(3).map((k) => (
        <line key={k} x1="40" y1={104 + k * 42} x2="386" y2={104 + k * 42} stroke={HAIR} />
      ))}
      <path d={`${d} L 384 218 L 40 218 Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={A2} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {[2, 5, 8].map((k) => (
        <circle key={k} cx={pts[k]!.x} cy={pts[k]!.y} r="3.2" fill={GROUND} stroke={INK} strokeOpacity="0.5" />
      ))}
      <line x1="40" y1="218" x2="386" y2="218" stroke={HAIR} />
      <rect x="40" y="232" width="92" height="5" rx="2.5" fill={INK} opacity={0.14} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Bar chart                                                      */
/* ------------------------------------------------------------------ */
function vBarChart(i: number): JSX.Element {
  const r = prng(i);
  const heights = seq(10).map(() => 32 + Math.round(r() * 132));
  return (
    <>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={S1} stroke={HAIR} />
      <rect x="34" y="34" width="74" height="8" rx="4" fill={INK} opacity={0.42} />
      {seq(3).map((k) => (
        <line key={k} x1="34" y1={90 + k * 44} x2="386" y2={90 + k * 44} stroke={HAIR} />
      ))}
      {heights.map((h, k) => (
        <rect
          key={k}
          x={38 + k * 35}
          y={222 - h}
          width="22"
          height={h}
          rx="4"
          fill={k === 6 ? A1 : k === 9 ? A3 : INK}
          opacity={k === 6 || k === 9 ? 0.8 : 0.14 + (h / 170) * 0.2}
        />
      ))}
      <line x1="34" y1="222" x2="386" y2="222" stroke={HAIR} />
      <rect x="266" y="234" width="120" height="5" rx="2.5" fill={INK} opacity={0.14} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Kanban board                                                   */
/* ------------------------------------------------------------------ */
function vKanban(i: number): JSX.Element {
  const r = prng(i);
  const cards = [3, 2, 2].flatMap((n, c) => seq(n).map((k) => [c, k] as [number, number]));
  return (
    <>
      {seq(3).map((c) => (
        <rect key={c} x={16 + c * 131} y="16" width="119" height="238" rx="12" fill={S1} stroke={HAIR} />
      ))}
      {seq(3).map((c) => (
        <rect key={c} x={30 + c * 131} y="30" width={38 + c * 8} height="6" rx="3" fill={INK} opacity={0.4} />
      ))}
      {cards.map(([c, k], n) => (
        <rect key={n} x={28 + c * 131} y={50 + k * 60} width="95" height="48" rx="8" fill={S3} stroke={HAIR} />
      ))}
      {cards.map(([c, k], n) => (
        <rect
          key={n}
          x={38 + c * 131}
          y={62 + k * 60}
          width={n === 3 ? 28 : 20}
          height="6"
          rx="3"
          fill={n === 3 ? A1 : INK}
          opacity={n === 3 ? 0.82 : 0.22}
        />
      ))}
      {cards.map(([c, k], n) => (
        <rect key={n} x={38 + c * 131} y={78 + k * 60} width={40 + Math.round(r() * 32)} height="7" rx="3.5" fill={INK} opacity={0.42} />
      ))}
      <rect x="290" y="170" width="95" height="30" rx="8" fill={A2} opacity={0.12} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Data table with status pills                                   */
/* ------------------------------------------------------------------ */
function vTable(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="0" y="0" width="420" height="42" fill={S2} />
      <line x1="0" y1="42" x2="420" y2="42" stroke={HAIR} />
      {[24, 140, 236].map((x, k) => (
        <rect key={k} x={x} y="18" width={k === 0 ? 62 : 44} height="6" rx="3" fill={INK} opacity={0.32} />
      ))}
      <rect x="332" y="16" width="64" height="10" rx="5" fill={INK} opacity={0.18} />
      {seq(5).map((k) => (
        <rect key={k} x="24" y={62 + k * 40} width={52 + Math.round(r() * 46)} height="8" rx="4" fill={INK} opacity={0.5} />
      ))}
      {seq(5).map((k) => (
        <rect key={k} x="140" y={63 + k * 40} width={44 + Math.round(r() * 60)} height="7" rx="3.5" fill={INK} opacity={0.24} />
      ))}
      {seq(5).map((k) => (
        <rect
          key={k}
          x="332"
          y={58 + k * 40}
          width={k === 1 ? 64 : 52}
          height="17"
          rx="8.5"
          fill={k === 1 ? A1 : k === 3 ? A3 : INK}
          opacity={k === 1 || k === 3 ? 0.24 : 0.09}
        />
      ))}
      {seq(5).map((k) => (
        <line key={k} x1="24" y1={86 + k * 40} x2="396" y2={86 + k * 40} stroke={HAIR} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 05 — Mobile app frame (technician job card)                         */
/* ------------------------------------------------------------------ */
function vMobile(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="146" y="12" width="128" height="256" rx="20" fill={GROUND} stroke={HAIR} />
      <rect x="188" y="22" width="44" height="6" rx="3" fill={INK} opacity={0.16} />
      <rect x="158" y="40" width="52" height="7" rx="3.5" fill={INK} opacity={0.5} />
      <rect x="158" y="58" width="104" height="62" rx="10" fill={S3} stroke={HAIR} />
      <circle cx="174" cy="76" r="8" fill={INK} opacity={0.2} />
      <rect x="188" y="70" width={40 + Math.round(r() * 22)} height="6" rx="3" fill={INK} opacity={0.46} />
      <rect x="188" y="82" width="38" height="5" rx="2.5" fill={INK} opacity={0.22} />
      <rect x="168" y="100" width="46" height="12" rx="6" fill={A1} opacity={0.24} />
      <rect x="158" y="130" width="104" height="42" rx="10" fill={S1} stroke={HAIR} />
      <rect x="168" y="142" width="60" height="6" rx="3" fill={INK} opacity={0.32} />
      <rect x="168" y="154" width="42" height="5" rx="2.5" fill={INK} opacity={0.18} />
      <rect x="158" y="184" width="104" height="26" rx="13" fill={A2} opacity={0.7} />
      <line x1="146" y1="230" x2="274" y2="230" stroke={HAIR} />
      {seq(4).map((k) => (
        <rect key={k} x={162 + k * 26} y="242" width="14" height="6" rx="3" fill={INK} opacity={k === 0 ? 0.5 : 0.16} />
      ))}
      <rect x="24" y="58" width="102" height="164" rx="12" fill={INK} opacity={0.028} />
      <rect x="294" y="58" width="102" height="164" rx="12" fill={INK} opacity={0.028} />
      <rect x="40" y="78" width="70" height="7" rx="3.5" fill={INK} opacity={0.12} />
      <rect x="310" y="78" width="70" height="7" rx="3.5" fill={INK} opacity={0.12} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 06 — Map with pins and a route                                      */
/* ------------------------------------------------------------------ */
function vMap(i: number): JSX.Element {
  const r = prng(i);
  const pins: Array<[number, number]> = [
    [96, 84],
    [214, 168],
    [318, 96],
  ];
  return (
    <>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={GROUND} stroke={HAIR} />
      <path d="M16 92 H404 M16 190 H404 M132 16 V254 M290 16 V254" stroke={HAIR} strokeWidth="1" fill="none" />
      <path d="M52 254 L 132 140 L 250 140 L 300 44" stroke={HAIR} strokeWidth="1" fill="none" />
      <rect x="40" y="112" width={54 + Math.round(r() * 30)} height="46" rx="6" fill={INK} opacity={0.05} />
      <rect x="300" y="196" width="72" height="42" rx="6" fill={INK} opacity={0.05} />
      <path
        d="M96 84 C 140 96, 150 150, 214 168 S 296 140, 318 96"
        fill="none"
        stroke={A1}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {pins.map(([cx, cy], k) => (
        <g key={k}>
          <circle cx={cx} cy={cy} r="9" fill={k === 1 ? A3 : INK} opacity={k === 1 ? 0.28 : 0.12} />
          <circle cx={cx} cy={cy} r="3.6" fill={k === 1 ? A3 : INK} opacity={k === 1 ? 0.95 : 0.6} />
        </g>
      ))}
      <rect x="32" y="222" width="86" height="18" rx="9" fill={S3} stroke={HAIR} />
      <rect x="42" y="228" width="52" height="6" rx="3" fill={INK} opacity={0.3} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 07 — Chat / conversation thread                                     */
/* ------------------------------------------------------------------ */
function vChat(i: number): JSX.Element {
  const r = prng(i);
  const rows: Array<[boolean, number]> = seq(5).map((k) => [k % 2 === 1, 96 + Math.round(r() * 96)] as [boolean, number]);
  return (
    <>
      <rect x="0" y="0" width="420" height="34" fill={S2} />
      <line x1="0" y1="34" x2="420" y2="34" stroke={HAIR} />
      <circle cx="34" cy="17" r="9" fill={INK} opacity={0.18} />
      <rect x="52" y="13" width="70" height="7" rx="3.5" fill={INK} opacity={0.42} />
      {rows.map(([right, w], k) => (
        <g key={k}>
          <rect
            x={right ? 404 - w : 44}
            y={48 + k * 34}
            width={w}
            height="26"
            rx="13"
            fill={right ? A2 : S3}
            opacity={right ? 0.5 : 1}
            stroke={right ? 'none' : HAIR}
          />
          {!right && <circle cx="28" cy={61 + k * 34} r="7" fill={INK} opacity={0.14} />}
        </g>
      ))}
      <rect x="16" y="222" width="352" height="30" rx="15" fill={S1} stroke={HAIR} />
      <rect x="34" y="234" width="96" height="6" rx="3" fill={INK} opacity={0.2} />
      <circle cx="386" cy="237" r="15" fill={A1} opacity={0.72} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 08 — Code diff with +/- gutters                                     */
/* ------------------------------------------------------------------ */
function vDiff(i: number): JSX.Element {
  const r = prng(i);
  const marks = [2, 3, 7, 8];
  const hot = (k: number): boolean => marks.includes(k);
  return (
    <>
      <rect x="0" y="0" width="420" height="270" fill={GROUND} />
      <rect x="0" y="0" width="38" height="270" fill={S2} />
      <line x1="38" y1="0" x2="38" y2="270" stroke={HAIR} />
      {marks.map((k) => (
        <rect key={k} x="38" y={20 + k * 24} width="382" height="20" fill={k < 5 ? A3 : A1} opacity={0.1} />
      ))}
      {seq(10).map((k) => (
        <rect key={k} x="14" y={28 + k * 24} width="14" height="4" rx="2" fill={INK} opacity={0.16} />
      ))}
      {seq(10).map((k) => (
        <rect
          key={k}
          x={62 + (k % 3) * 14}
          y={27 + k * 24}
          width={110 + Math.round(r() * 180)}
          height="6"
          rx="3"
          fill={INK}
          opacity={hot(k) ? 0.5 : 0.24}
        />
      ))}
      {marks.map((k) => (
        <rect key={k} x="46" y={29 + k * 24} width="8" height="2.5" rx="1.2" fill={k < 5 ? A3 : A1} opacity={0.9} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 09 — CI / delivery pipeline stages                                  */
/* ------------------------------------------------------------------ */
function vPipeline(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="24" y="30" width="86" height="7" rx="3.5" fill={INK} opacity={0.42} />
      <line x1="46" y1="112" x2="374" y2="112" stroke={HAIR} strokeWidth="2" />
      {seq(5).map((k) => (
        <g key={k}>
          <rect x={24 + k * 78} y="86" width="52" height="52" rx="14" fill={k < 3 ? S3 : S1} stroke={HAIR} />
          <circle cx={50 + k * 78} cy="112" r={k === 3 ? 8 : 6} fill={k === 3 ? A1 : INK} opacity={k === 3 ? 0.9 : k < 3 ? 0.5 : 0.16} />
          <rect x={30 + k * 78} y="154" width={30 + Math.round(r() * 14)} height="5" rx="2.5" fill={INK} opacity={k <= 3 ? 0.3 : 0.14} />
        </g>
      ))}
      <rect x="24" y="196" width="372" height="10" rx="5" fill={S3} stroke={HAIR} />
      <rect x="24" y="196" width="248" height="10" rx="5" fill={A2} opacity={0.62} />
      <rect x="24" y="222" width="104" height="6" rx="3" fill={INK} opacity={0.2} />
      <rect x="336" y="222" width="60" height="6" rx="3" fill={INK} opacity={0.2} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 10 — Calendar / roster grid                                         */
/* ------------------------------------------------------------------ */
function vCalendar(i: number): JSX.Element {
  const r = prng(i);
  const cells: Array<[number, number]> = [
    [0, 0],
    [2, 0],
    [5, 0],
    [1, 1],
    [3, 1],
    [4, 2],
    [6, 2],
  ];
  return (
    <>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={S1} stroke={HAIR} />
      <rect x="32" y="32" width="72" height="7" rx="3.5" fill={INK} opacity={0.42} />
      {seq(7).map((k) => (
        <rect key={k} x={34 + k * 52} y="58" width="22" height="5" rx="2.5" fill={INK} opacity={0.2} />
      ))}
      <path
        d="M84 74 V246 M136 74 V246 M188 74 V246 M240 74 V246 M292 74 V246 M344 74 V246 M32 132 H388 M32 190 H388 M32 74 H388"
        stroke={HAIR}
        fill="none"
      />
      {cells.map(([c, rw], k) => (
        <rect
          key={k}
          x={36 + c * 52}
          y={84 + rw * 58}
          width={44 + Math.round(r() * 6)}
          height="16"
          rx="5"
          fill={k === 3 ? A2 : INK}
          opacity={k === 3 ? 0.55 : 0.14}
        />
      ))}
      <rect x="36" y="208" width="44" height="16" rx="5" fill={A3} opacity={0.4} />
      <rect x="192" y="208" width="96" height="16" rx="5" fill={INK} opacity={0.1} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 11 — Conversion funnel                                              */
/* ------------------------------------------------------------------ */
function vFunnel(i: number): JSX.Element {
  const r = prng(i);
  const widths = [268, 224, 176, 124, 78];
  const cx = 158;
  return (
    <>
      <rect x="24" y="26" width="86" height="7" rx="3.5" fill={INK} opacity={0.42} />
      {widths.map((w, k) => {
        const next = widths[k + 1] ?? 52;
        const y = 52 + k * 40;
        return (
          <g key={k}>
            <polygon
              points={`${cx - w / 2},${y} ${cx + w / 2},${y} ${cx + next / 2},${y + 32} ${cx - next / 2},${y + 32}`}
              fill={k === 4 ? A2 : INK}
              opacity={k === 4 ? 0.62 : 0.19 - k * 0.032}
            />
            <rect x="316" y={y + 12} width={20 + Math.round(r() * 44)} height="7" rx="3.5" fill={INK} opacity={0.28} />
          </g>
        );
      })}
      <line x1="300" y1="52" x2="300" y2="244" stroke={HAIR} />
      <rect x="316" y="30" width="52" height="5" rx="2.5" fill={INK} opacity={0.16} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 12 — Org / capability tree                                          */
/* ------------------------------------------------------------------ */
function vTree(i: number): JSX.Element {
  const r = prng(i);
  const leaves = [60, 128, 202, 276, 344];
  return (
    <>
      <path
        d="M228 66 V88 M94 88 H310 M94 88 V110 M202 88 V110 M310 88 V110 M94 134 V152 M60 152 H128 M60 152 V178 M128 152 V178 M310 134 V152 M276 152 H344 M276 152 V178 M344 152 V178 M202 134 V178"
        stroke={HAIR}
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="190" y="38" width="76" height="28" rx="9" fill={S3} stroke={HAIR} />
      <rect x="204" y="49" width="48" height="6" rx="3" fill={A1} opacity={0.75} />
      {[94, 202, 310].map((x, k) => (
        <g key={k}>
          <rect x={x - 36} y="110" width="72" height="24" rx="8" fill={S1} stroke={HAIR} />
          <rect x={x - 22} y="119" width={30 + Math.round(r() * 14)} height="6" rx="3" fill={INK} opacity={0.4} />
        </g>
      ))}
      {leaves.map((x, k) => (
        <g key={k}>
          <rect x={x - 28} y="178" width="56" height="22" rx="7" fill={GROUND} stroke={HAIR} />
          <rect x={x - 16} y="186" width={22 + Math.round(r() * 10)} height="5" rx="2.5" fill={INK} opacity={0.24} />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 13 — Multi-step form wizard                                         */
/* ------------------------------------------------------------------ */
function vWizard(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <line x1="72" y1="44" x2="348" y2="44" stroke={HAIR} strokeWidth="2" />
      <line x1="72" y1="44" x2="256" y2="44" stroke={INK} strokeOpacity="0.28" strokeWidth="2" />
      {seq(4).map((k) => (
        <circle
          key={k}
          cx={72 + k * 92}
          cy="44"
          r={k === 2 ? 12 : 9}
          fill={k === 2 ? A2 : k < 2 ? INK : S3}
          opacity={k === 2 ? 0.8 : k < 2 ? 0.3 : 1}
          stroke={k > 2 ? HAIR : 'none'}
        />
      ))}
      <rect x="40" y="78" width="340" height="160" rx="12" fill={S1} stroke={HAIR} />
      <rect x="60" y="96" width="94" height="7" rx="3.5" fill={INK} opacity={0.45} />
      {seq(3).map((k) => (
        <g key={k}>
          <rect x="60" y={122 + k * 36} width={38 + Math.round(r() * 26)} height="5" rx="2.5" fill={INK} opacity={0.22} />
          <rect x="60" y={134 + k * 36} width={k === 2 ? 152 : 300} height="18" rx="6" fill={S3} stroke={HAIR} />
        </g>
      ))}
      <rect x="248" y="206" width="112" height="20" rx="10" fill={A1} opacity={0.6} />
      <rect x="60" y="206" width="72" height="20" rx="10" fill={INK} opacity={0.08} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 14 — Notification / alert stack                                     */
/* ------------------------------------------------------------------ */
function vNotifications(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="24" y="24" width="80" height="7" rx="3.5" fill={INK} opacity={0.4} />
      <circle cx="384" cy="28" r="9" fill={A1} opacity={0.7} />
      {seq(5).map((k) => (
        <g key={k}>
          <rect
            x={30 + k * 6}
            y={48 + k * 38}
            width={360 - k * 12}
            height="30"
            rx="10"
            fill={k === 0 ? S3 : S1}
            stroke={HAIR}
          />
          <rect x={44 + k * 6} y={57 + k * 38} width="12" height="12" rx="4" fill={k === 1 ? A3 : INK} opacity={k === 1 ? 0.7 : 0.18} />
          <rect x={66 + k * 6} y={60 + k * 38} width={110 + Math.round(r() * 120)} height="6" rx="3" fill={INK} opacity={0.42 - k * 0.06} />
          <rect x={320 - k * 6} y={60 + k * 38} width="34" height="6" rx="3" fill={INK} opacity={0.14} />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 15 — Search results with ranking rows                               */
/* ------------------------------------------------------------------ */
function vSearch(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="24" y="22" width="372" height="30" rx="15" fill={S3} stroke={HAIR} />
      <circle cx="46" cy="37" r="6" fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" />
      <line x1="50.5" y1="41.5" x2="55" y2="46" stroke={INK} strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="66" y="34" width="128" height="7" rx="3.5" fill={INK} opacity={0.28} />
      {seq(5).map((k) => (
        <g key={k}>
          <rect x="24" y={66 + k * 36} width="20" height="20" rx="6" fill={k === 0 ? A2 : INK} opacity={k === 0 ? 0.6 : 0.1} />
          <rect x="56" y={68 + k * 36} width={130 + Math.round(r() * 120)} height="7" rx="3.5" fill={INK} opacity={0.5 - k * 0.05} />
          <rect x="56" y={80 + k * 36} width={80 + Math.round(r() * 90)} height="5" rx="2.5" fill={INK} opacity={0.18} />
          <rect x="330" y={72 + k * 36} width={66 - k * 11} height="8" rx="4" fill={k === 0 ? A1 : INK} opacity={k === 0 ? 0.5 : 0.14} />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 16 — Terminal / log stream                                          */
/* ------------------------------------------------------------------ */
function vTerminal(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={GROUND} stroke={HAIR} />
      <rect x="16" y="16" width="388" height="26" rx="12" fill={S2} />
      <line x1="16" y1="42" x2="404" y2="42" stroke={HAIR} />
      {seq(3).map((k) => (
        <circle key={k} cx={34 + k * 14} cy="29" r="4" fill={INK} opacity={0.16} />
      ))}
      {seq(10).map((k) => (
        <rect key={k} x="32" y={56 + k * 17} width="26" height="6" rx="3" fill={k === 4 ? A3 : INK} opacity={k === 4 ? 0.75 : 0.16} />
      ))}
      {seq(10).map((k) => (
        <rect
          key={k}
          x="66"
          y={56 + k * 17}
          width={104 + Math.round(r() * 216)}
          height="6"
          rx="3"
          fill={INK}
          opacity={k === 4 ? 0.55 : 0.24}
        />
      ))}
      <rect x="32" y="224" width="9" height="9" rx="1.5" fill={A1} opacity={0.85} />
      <rect x="49" y="226" width="86" height="6" rx="3" fill={INK} opacity={0.14} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 17 — Settings panel with toggles                                    */
/* ------------------------------------------------------------------ */
function vSettings(i: number): JSX.Element {
  const r = prng(i);
  const on = [true, false, true, false, false];
  return (
    <>
      <rect x="0" y="0" width="112" height="270" fill={S2} />
      <line x1="112" y1="0" x2="112" y2="270" stroke={HAIR} />
      {seq(5).map((k) => (
        <rect key={k} x="22" y={40 + k * 32} width={46 + Math.round(r() * 30)} height="7" rx="3.5" fill={INK} opacity={k === 1 ? 0.55 : 0.18} />
      ))}
      <rect x="14" y="66" width="4" height="15" rx="2" fill={INK} opacity={0.5} />
      <rect x="140" y="28" width="88" height="7" rx="3.5" fill={INK} opacity={0.42} />
      {on.map((_isOn, k) => (
        <rect key={k} x="140" y={62 + k * 40} width={98 + Math.round(r() * 76)} height="7" rx="3.5" fill={INK} opacity={0.4} />
      ))}
      {on.map((isOn, k) => (
        <rect key={k} x="356" y={58 + k * 40} width="34" height="16" rx="8" fill={isOn ? A2 : INK} opacity={isOn ? 0.6 : 0.12} />
      ))}
      {on.map((isOn, k) => (
        <circle key={k} cx={isOn ? 382 : 364} cy={66 + k * 40} r="6" fill={INK} opacity={isOn ? 0.9 : 0.35} />
      ))}
      {on.map((_isOn, k) => (
        <line key={k} x1="140" y1={86 + k * 40} x2="390" y2={86 + k * 40} stroke={HAIR} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 18 — File / asset grid                                              */
/* ------------------------------------------------------------------ */
function vAssets(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="24" y="22" width="72" height="7" rx="3.5" fill={INK} opacity={0.42} />
      <rect x="330" y="18" width="66" height="16" rx="8" fill={INK} opacity={0.1} />
      {seq(8).map((k) => (
        <rect key={k} x={24 + (k % 4) * 95} y={50 + Math.floor(k / 4) * 106} width="83" height="90" rx="10" fill={S1} stroke={HAIR} />
      ))}
      {seq(8).map((k) => (
        <rect
          key={k}
          x={36 + (k % 4) * 95}
          y={62 + Math.floor(k / 4) * 106}
          width="59"
          height="44"
          rx="6"
          fill={k === 2 ? A2 : k === 5 ? A3 : INK}
          opacity={k === 2 ? 0.42 : k === 5 ? 0.3 : 0.09}
        />
      ))}
      {seq(8).map((k) => (
        <rect
          key={k}
          x={36 + (k % 4) * 95}
          y={116 + Math.floor(k / 4) * 106}
          width={30 + Math.round(r() * 28)}
          height="6"
          rx="3"
          fill={INK}
          opacity={0.32}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 19 — Timeline / gantt                                               */
/* ------------------------------------------------------------------ */
function vGantt(i: number): JSX.Element {
  const r = prng(i);
  const bars: Array<[number, number]> = seq(6).map((k) => [
    132 + Math.round(r() * 90) + k * 6,
    56 + Math.round(r() * 110),
  ] as [number, number]);
  return (
    <>
      <rect x="16" y="16" width="388" height="238" rx="12" fill={S1} stroke={HAIR} />
      <line x1="120" y1="16" x2="120" y2="254" stroke={HAIR} />
      <path d="M180 44 V254 M240 44 V254 M300 44 V254 M360 44 V254 M16 44 H404" stroke={HAIR} fill="none" />
      {bars.map(([x, w], k) => (
        <g key={k}>
          <rect x="34" y={62 + k * 32} width={40 + Math.round(r() * 40)} height="6" rx="3" fill={INK} opacity={0.28} />
          <rect x={x} y={58 + k * 32} width={w} height="14" rx="7" fill={k === 2 ? A2 : INK} opacity={k === 2 ? 0.6 : 0.16 + k * 0.02} />
        </g>
      ))}
      <line x1="266" y1="44" x2="266" y2="254" stroke={A1} strokeWidth="1.5" opacity={0.7} />
      <rect x="34" y="28" width="64" height="6" rx="3" fill={INK} opacity={0.2} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 20 — API request / response pair                                    */
/* ------------------------------------------------------------------ */
function vApi(i: number): JSX.Element {
  const r = prng(i);
  return (
    <>
      <rect x="16" y="16" width="186" height="238" rx="12" fill={S1} stroke={HAIR} />
      <rect x="218" y="16" width="186" height="238" rx="12" fill={GROUND} stroke={HAIR} />
      <rect x="32" y="32" width="46" height="16" rx="5" fill={A2} opacity={0.6} />
      <rect x="86" y="37" width="94" height="6" rx="3" fill={INK} opacity={0.34} />
      <rect x="234" y="32" width="40" height="16" rx="5" fill={A3} opacity={0.35} />
      <rect x="282" y="37" width="76" height="6" rx="3" fill={INK} opacity={0.22} />
      <line x1="16" y1="62" x2="202" y2="62" stroke={HAIR} />
      <line x1="218" y1="62" x2="404" y2="62" stroke={HAIR} />
      {seq(6).map((k) => (
        <rect key={k} x={38 + (k % 3) * 10} y={80 + k * 22} width={64 + Math.round(r() * 82)} height="6" rx="3" fill={INK} opacity={0.3 - (k % 3) * 0.06} />
      ))}
      {seq(7).map((k) => (
        <rect key={k} x={240 + (k % 3) * 10} y={80 + k * 22} width={58 + Math.round(r() * 90)} height="6" rx="3" fill={INK} opacity={0.26 - (k % 3) * 0.05} />
      ))}
      <path d="M198 154 H222 M214 148 L222 154 L214 160" stroke={INK} strokeOpacity="0.28" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  );
}

const VARIANTS: ReadonlyArray<(i: number) => JSX.Element> = [
  vDashboard,
  vLineChart,
  vBarChart,
  vKanban,
  vTable,
  vMobile,
  vMap,
  vChat,
  vDiff,
  vPipeline,
  vCalendar,
  vFunnel,
  vTree,
  vWizard,
  vNotifications,
  vSearch,
  vTerminal,
  vSettings,
  vAssets,
  vGantt,
  vApi,
];

export interface ShowcaseTileProps {
  index: number;
  label: string;
  className?: string;
}

function ShowcaseTileBase({ index, label, className }: ShowcaseTileProps): JSX.Element {
  const v = ((index % VARIANTS.length) + VARIANTS.length) % VARIANTS.length;
  const draw = VARIANTS[v]!;

  return (
    <div
      className={
        'relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl border border-[rgba(215,226,234,0.10)] bg-[#121212] ' +
        (className ?? '')
      }
    >
      <svg
        viewBox="0 0 420 270"
        width="420"
        height="270"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
        shapeRendering="geometricPrecision"
      >
        <rect x="0" y="0" width="420" height="270" fill={S1} />
        {draw(v)}
      </svg>

      <span className="absolute bottom-3 left-3 rounded-full border border-[rgba(215,226,234,0.14)] bg-[rgba(12,12,12,0.82)] px-2.5 py-[3px] text-[9px] font-medium uppercase leading-none tracking-[0.18em] text-[#D7E2EA]/70">
        {label}
      </span>
    </div>
  );
}

const ShowcaseTile = memo(ShowcaseTileBase);
ShowcaseTile.displayName = 'ShowcaseTile';

export default ShowcaseTile;
