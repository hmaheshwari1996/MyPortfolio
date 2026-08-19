import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, JSX } from 'react';

/**
 * HeroObject
 * ----------
 * A gimballed instrument — three concentric bands on independent axes around a
 * faceted cuboctahedral core, threaded by a polar axle. Everything is authored
 * in code: the geometry is a signed-distance field sphere-traced in the
 * fragment shader, the environment is procedural, and there is not a single
 * byte of external asset. Lit by the CTA gradient (magenta key, burnt-orange
 * rim, cool slate fill) so it belongs to the page it sits on.
 *
 * Renders one <canvas> that fills its parent. The parent owns the size.
 */

export interface HeroObjectProps {
  className?: string;
}

type AnyGL = WebGL2RenderingContext | WebGLRenderingContext;

/* Time used for the single frame drawn under prefers-reduced-motion. Chosen
   because the three bands sit in a legible, non-overlapping arrangement. */
const STATIC_TIME = 12.35;

/* Pointer parallax amplitude, radians. ~7.5 deg yaw / ~5 deg pitch. */
const PARALLAX_YAW = 0.132;
const PARALLAX_PITCH = 0.086;

const VERT_BODY = `
void main(){
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_BODY = `
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uCam;

const float PI  = 3.14159265;
const float TAU = 6.28318531;

/* CTA-gradient palette, linearised (approx. sRGB^2.2) */
const vec3 KEY_L  = vec3(0.477, 0.000, 0.400);   /* #B600A8 magenta key   */
const vec3 RIM_L  = vec3(0.523, 0.070, 0.000);   /* #BE4C00 burnt orange  */
const vec3 FILL_L = vec3(0.127, 0.142, 0.173);   /* #646973 cool fill     */
const vec3 VIO_L  = vec3(0.184, 0.011, 0.442);   /* #7621B0 violet        */

/* pre-normalised light + environment-lobe directions (GLSL ES 1.00 requires
   constant expressions for global initialisers, so no normalize() here) */
const vec3 L_KEY = vec3(-0.6129,  0.6722,  0.4152);
const vec3 L_RIM = vec3( 0.7579,  0.1819, -0.6265);
const vec3 L_FIL = vec3( 0.3598, -0.6597,  0.6597);
const vec3 E_VIO = vec3(-0.7010,  0.4090,  0.5842);
const vec3 E_FIL = vec3(-0.6852, -0.5482,  0.4796);

/* keep every trig argument inside one turn so long sessions never drift */
float ang(float rate){ return mod(uTime * rate, TAU); }

mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0,   0.0,  c,   s,   0.0, -s,   c); }
mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3( c,  0.0, -s,    0.0, 1.0, 0.0,   s,  0.0,  c); }
mat3 rotZ(float a){ float c = cos(a), s = sin(a); return mat3( c,   s,  0.0,   -s,   c,  0.0,  0.0, 0.0, 1.0); }

float hash21(vec2 p){
  vec3 q = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

/* rectangular-section ring, symmetry axis = local Y */
float sdBand(vec3 p, float R, float halfT, float halfW, float rnd){
  vec2 q = vec2(length(p.xz) - R, p.y);
  vec2 d = abs(q) - vec2(halfT, halfW);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - rnd;
}

float sdOcta(vec3 p, float s){
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.5773503;
}

float sdBox(vec3 p, vec3 b){
  vec3 d = abs(p) - b;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float sdRod(vec3 p, float h, float r){
  p.y -= clamp(p.y, -h, h);
  return length(p) - r;
}

vec2 opU(vec2 a, vec2 b){ return (a.x < b.x) ? a : b; }

/* x = distance, y = material id */
vec2 mapScene(vec3 p){
  /* band 1 - meridian ring, horizontal symmetry axis, precesses about Y.
     Its plane always contains the polar axle, so the two never collide. */
  vec3 q1 = rotZ(1.5707963) * (rotY(ang(0.230)) * p);
  vec2 res = vec2(sdBand(q1, 1.150, 0.027, 0.080, 0.011), 1.0);

  /* band 2 - symmetry axis Y, tumbles end over end about X */
  vec3 q2 = rotX(0.55 + ang(0.310)) * p;
  res = opU(res, vec2(sdBand(q2, 0.930, 0.024, 0.064, 0.010), 2.0));

  /* band 3 - symmetry axis Z, compound tumble on two axes */
  vec3 q3 = rotX(1.5707963) * (rotZ(ang(0.190)) * (rotY(ang(0.410)) * p));
  res = opU(res, vec2(sdBand(q3, 0.715, 0.021, 0.050, 0.009), 3.0));

  /* faceted core - octahedron intersected with a cube = cuboctahedral gem */
  vec3 qc = rotY(ang(0.270)) * (rotX(0.42 + ang(0.130)) * p);
  float core = max(sdOcta(qc, 0.620), sdBox(qc, vec3(0.365))) - 0.018;
  res = opU(res, vec2(core, 4.0));

  /* polar axle with spherical finials */
  float axle = sdRod(p, 1.300, 0.0145);
  axle = min(axle, length(vec3(p.x, abs(p.y) - 1.300, p.z)) - 0.047);
  res = opU(res, vec2(axle, 5.0));

  return res;
}

vec3 calcNormal(vec3 p){
  vec2 k = vec2(1.0, -1.0);
  float e = 0.0012;
  return normalize( k.xyy * mapScene(p + k.xyy * e).x
                  + k.yyx * mapScene(p + k.yyx * e).x
                  + k.yxy * mapScene(p + k.yxy * e).x
                  + k.xxx * mapScene(p + k.xxx * e).x );
}

float calcAO(vec3 p, vec3 n){
  float occ = 0.0;
  float sca = 1.0;
  for(int i = 0; i < 5; i++){
    float h = 0.012 + 0.115 * float(i) * 0.25;
    float d = mapScene(p + n * h).x;
    occ += (h - d) * sca;
    sca *= 0.82;
  }
  return clamp(1.0 - 1.75 * occ, 0.05, 1.0);
}

float softShadow(vec3 ro, vec3 rd, float w){
  float res = 1.0;
  float t = 0.035;
  for(int i = 0; i < 14; i++){
    float h = mapScene(ro + rd * t).x;
    res = min(res, h / (w * t));
    t += clamp(h, 0.03, 0.30);
    if(res < -0.4 || t > 5.0) break;
  }
  res = max(res, -0.4);
  return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}

/* Procedural studio environment: a cool gradient, three broad coloured lobes,
   and three narrow strip lights. The strips are what make the bands read as
   polished metal - they reflect as long travelling highlights rather than the
   soft even wash a lobe-only environment produces. */
vec3 envColor(vec3 d){
  float up = d.y * 0.5 + 0.5;
  vec3 c = mix(vec3(0.0048, 0.0044, 0.0078), vec3(0.031, 0.035, 0.049), up);

  c += KEY_L  * 0.88 * pow(max(dot(d, L_KEY), 0.0), 7.0);
  c += VIO_L  * 0.34 * pow(max(dot(d, E_VIO), 0.0), 2.5);
  c += RIM_L  * 0.62 * pow(max(dot(d, L_RIM), 0.0), 10.0);
  c += FILL_L * 0.90 * pow(max(dot(d, E_FIL), 0.0), 2.0);

  /* magenta key strip, high and to the left */
  float s1 = exp(-abs(d.y - 0.46) * 19.0);
  c += vec3(0.60, 0.05, 0.55) * 1.30 * s1 * smoothstep(0.05, 0.85, d.x * -0.83 + d.z * 0.56);

  /* burnt-orange rim strip, near the horizon and behind to the right */
  float s2 = exp(-abs(d.y - 0.04) * 22.0);
  c += vec3(0.66, 0.17, 0.01) * 1.05 * s2 * smoothstep(0.15, 0.92, d.x * 0.77 + d.z * -0.64);

  /* cool slate strip, low and to the front-right - the only neutral note in
     the rig, and the thing that stops the object reading as monochrome */
  float s3 = exp(-abs(d.y + 0.30) * 15.0);
  c += vec3(0.26, 0.30, 0.40) * 1.25 * s3 * smoothstep(0.00, 0.90, d.x * 0.60 + d.z * 0.80);

  return c;
}

vec3 ggx(vec3 n, vec3 v, vec3 l, float rough, vec3 f0){
  float ndl = dot(n, l);
  if(ndl <= 0.0) return vec3(0.0);
  vec3  h   = normalize(l + v);
  float ndv = max(dot(n, v), 1e-4);
  float ndh = max(dot(n, h), 0.0);
  float vdh = max(dot(v, h), 0.0);
  float a   = max(rough * rough, 0.008);
  float a2  = a * a;
  float den = ndh * ndh * (a2 - 1.0) + 1.0;
  float D   = a2 / (PI * den * den + 1e-7);
  vec3  F   = f0 + (1.0 - f0) * pow(1.0 - vdh, 5.0);
  float k   = a * 0.5;
  float G   = (ndl / (ndl * (1.0 - k) + k)) * (ndv / (ndv * (1.0 - k) + k));
  return min(D * F * G * ndl / (4.0 * ndl * ndv + 1e-4), vec3(18.0));
}

vec3 shade(vec3 pos, vec3 nor, vec3 rd, float mid){
  vec3  v   = -rd;
  float ndv = clamp(dot(nor, v), 0.0, 1.0);

  vec3  f0;
  float rough;
  float isRing = 0.0;
  float isCore = 0.0;
  if(mid < 3.5){
    f0     = vec3(0.330, 0.336, 0.370);
    rough  = 0.085 + 0.022 * mid;
    isRing = 1.0;
  } else if(mid < 4.5){
    f0     = vec3(0.240, 0.210, 0.300);
    rough  = 0.090;
    isCore = 1.0;
  } else {
    f0    = vec3(0.360, 0.300, 0.238);
    rough = 0.200;
  }

  float ao = calcAO(pos, nor);
  float sh = softShadow(pos + nor * 0.014, L_KEY, 0.085);

  vec3 c = vec3(0.0);
  c += ggx(nor, v, L_KEY, rough, f0) * KEY_L  * 4.4 * sh;
  c += ggx(nor, v, L_RIM, rough, f0) * RIM_L  * 2.6;
  c += ggx(nor, v, L_FIL, rough, f0) * FILL_L * 3.4;

  vec3 rdir = reflect(rd, nor);
  vec3 env  = envColor(rdir);
  vec3 fr   = f0 + (max(vec3(1.0 - rough), f0) - f0) * pow(1.0 - ndv, 5.0);
  if(isRing > 0.5){
    float ip   = 0.21 * mid + 1.25 * pow(1.0 - ndv, 2.0) + 0.40 * rdir.y;
    vec3  tint = 0.5 + 0.5 * cos(TAU * (ip + vec3(0.00, 0.33, 0.67)));
    env *= mix(vec3(1.0), tint, 0.32);
  }
  c += env * fr * ao;

  /* very dark diffuse floor so unlit facets read as metal, not holes */
  vec3 alb = f0 * 0.10;
  c += alb * ( KEY_L  * max(dot(nor, L_KEY), 0.0) * sh * 1.1
             + FILL_L * (0.40 + 0.60 * max(dot(nor, L_FIL), 0.0))
             + RIM_L  * max(dot(nor, L_RIM), 0.0) * 0.45 ) * ao;

  float rim = pow(1.0 - ndv, 5.5);
  c += rim * mix(KEY_L, RIM_L, 0.5 + 0.5 * nor.x) * 0.70 * ao;

  if(isCore > 0.5){
    float pulse = 0.5 + 0.5 * sin(ang(0.90));
    c += VIO_L * (0.11 + 0.07 * pulse) * pow(1.0 - ndv, 2.6);
  }
  return c;
}

vec4 renderPixel(vec2 fc){
  /* Screen coords normalised on the SHORT axis, so the instrument is framed
     the same way whatever box the parent gives us and is never cropped by a
     narrow column. For asp >= 1 this is the plain height-normalised mapping. */
  float asp = uRes.x / uRes.y;
  float fit = clamp(asp, 0.45, 1.0);
  vec2  sp  = ((2.0 * fc - uRes) / uRes.y) / fit;

  float yaw   = uCam.x + 0.46 + 0.045 * sin(ang(0.110));
  float pitch = uCam.y + 0.17 + 0.030 * sin(ang(0.083));
  float dist  = 4.28;

  vec3 eye = vec3(cos(pitch) * sin(yaw), sin(pitch), cos(pitch) * cos(yaw)) * dist;
  vec3 ww  = normalize(-eye);
  vec3 uu  = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv  = cross(uu, ww);
  vec3 rd  = normalize(sp.x * uu + sp.y * vv + 2.38 * ww);
  vec3 ro  = eye;

  float alpha = 0.0;
  float glow  = 0.0;
  vec3  col   = vec3(0.0);

  /* analytic bounding sphere (r = 1.85) - kills the march for most pixels */
  float b    = dot(ro, rd);
  float cc   = dot(ro, ro) - 3.4225;
  float disc = b * b - cc;

  if(disc > 0.0){
    float sq  = sqrt(disc);
    float tf  = min(-b + sq, 14.0);
    float t   = max(-b - sq, 0.05);
    float cov = 1.0;
    float tE  = t;
    float mE  = 1.0;
    float mH  = -1.0;
    float px  = 0.55 / uRes.y;

    for(int i = 0; i < 88; i++){
      vec2  h  = mapScene(ro + rd * t);
      float cv = max(h.x, 0.0) / max(px * t, 1e-5);
      if(cv < cov){ cov = cv; tE = t; mE = h.y; }
      glow += 0.0130 / (1.0 + 26.0 * h.x * h.x);
      if(h.x < 0.0004 * t){ mH = h.y; tE = t; mE = h.y; break; }
      t += h.x * 0.92;
      if(t > tf) break;
    }

    if(mH > 0.0)       alpha = 1.0;
    else if(cov < 1.0) alpha = 1.0 - smoothstep(0.0, 1.0, cov);

    if(alpha > 0.0025){
      vec3 pos = ro + rd * tE;
      col = shade(pos, calcNormal(pos), rd, mE);
    }
  }

  /* Ambient falloff. Both the bloom and the halo are cut by a purely RADIAL
     window that reaches zero at r = lim, where lim is the distance to the
     NEAREST frame edge. Every border pixel therefore has r >= lim and gets
     exactly nothing - so the haze can never trace the canvas rectangle onto
     the page, at any aspect ratio. A separable per-axis fade cannot do this:
     it stays ~1 across the interior and then ramps, which is itself the box. */
  float r   = length(sp);
  float lim = min(asp, 1.0) / fit;

  glow = min(glow, 1.3) * (1.0 - smoothstep(0.62 * lim, 1.02 * lim, r));
  float hal = 0.075 * exp(-r * 2.6) * (1.0 - smoothstep(0.45 * lim, lim, r));

  /* everything below is radiance over black, i.e. already premultiplied */
  vec3 rad = col * alpha
           + mix(KEY_L, RIM_L, 0.32) * glow * 0.105
           + VIO_L * glow * glow * 0.060
           + mix(VIO_L, KEY_L, 0.45) * hal;

  rad = (rad * (2.51 * rad + 0.03)) / (rad * (2.43 * rad + 0.59) + 0.14);
  rad = clamp(rad, 0.0, 1.0);

  vec3 srgb = pow(rad, vec3(0.4545455));
  srgb *= 1.0 - 0.20 * smoothstep(0.60, 1.75, r);

  float lum = dot(srgb, vec3(0.2126, 0.7152, 0.0722));
  float gr  = (hash21(fc + fract(uTime) * vec2(113.7, 271.3)) - 0.5) * 0.020;
  srgb += gr * clamp(alpha + lum * 5.0, 0.0, 1.0);

  /* Gamma-encoding lifts near-zero radiance into a visible grey: a far-field
     value of 0.0002 comes out at ~0.016, which paints the canvas rectangle onto
     the #0C0C0C page as a faint box. Crush anything below the knee to nothing so
     the canvas has no edge at all. */
  float mag = max(srgb.r, max(srgb.g, srgb.b));
  srgb *= smoothstep(0.017, 0.050, mag);
  srgb  = clamp(srgb, 0.0, 1.0);

  /* alpha >= every channel keeps the premultiplied buffer well formed, and
     falls to exactly 0 in empty space so the canvas has no visible edge */
  float a = clamp(max(alpha, max(srgb.r, max(srgb.g, srgb.b))), 0.0, 1.0);
  return vec4(srgb, a);
}

void main(){
  vec3  acc = vec3(0.0);
  float accA = 0.0;
  for(int m = 0; m < AA; m++){
    for(int n = 0; n < AA; n++){
      vec2 o = (vec2(float(m), float(n)) + 0.5) / float(AA) - 0.5;
      vec4 s = renderPixel(gl_FragCoord.xy + o);
      acc  += s.rgb;
      accA += s.a;
    }
  }
  float inv = 1.0 / float(AA * AA);
  OUT_COLOR = vec4(acc * inv, accA * inv);
}
`;

function buildVertexSource(isGL2: boolean): string {
  return isGL2
    ? '#version 300 es\nin vec2 aPos;\n' + VERT_BODY
    : 'attribute vec2 aPos;\n' + VERT_BODY;
}

function buildFragmentSource(isGL2: boolean, aa: number): string {
  const head = isGL2
    ? '#version 300 es\nprecision highp float;\nout vec4 fragColor;\n#define OUT_COLOR fragColor\n'
    : '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n#define OUT_COLOR gl_FragColor\n';
  return head + '#define AA ' + String(aa) + '\n' + FRAG_BODY;
}

function compileShader(gl: AnyGL, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (shader === null) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) {
      console.warn('[HeroObject] shader compile failed:', gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const CANVAS_STYLE: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
};

export default function HeroObject({ className }: HeroObjectProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    /* ---------------- environment probes ---------------- */
    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const coarseQuery =
      typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)') : null;

    let reduced = motionQuery !== null ? motionQuery.matches : false;
    const coarse = coarseQuery !== null ? coarseQuery.matches : false;
    const maxDpr = coarse ? 1.5 : 2;

    /* ---------------- gl state ---------------- */
    let gl: AnyGL | null = null;
    let isGL2 = false;
    let program: WebGLProgram | null = null;
    let vbo: WebGLBuffer | null = null;
    let uResLoc: WebGLUniformLocation | null = null;
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uCamLoc: WebGLUniformLocation | null = null;
    let ready = false;

    /* ---------------- loop state ---------------- */
    let raf = 0;
    let staticRaf = 0;
    let running = false;
    /* Optimistic: assume on-screen so the first frame does not wait on the
       IntersectionObserver callback. The observer only ever corrects this -
       it pauses the loop when the hero scrolls away, it is not what starts it. */
    let onScreen = true;
    let pageVisible = document.visibilityState !== 'hidden';
    let destroyed = false;

    let lastStamp = 0;
    let elapsed = 0;

    let camX = 0;
    let camY = 0;
    let targetX = 0;
    let targetY = 0;

    let cssW = 0;
    let cssH = 0;
    let needResize = true;
    /* The PRE-clamp dpr the current backing store was built at. Compared against
       a fresh read so a window dragged between displays rebuilds at the new
       density instead of staying on the old one. */
    let builtDpr = 0;
    let dprQuery: MediaQueryList | null = null;
    let pointerBound = false;

    /* ---------------- gl construction ---------------- */

    function acquireContext(): boolean {
      const attrs: WebGLContextAttributes = {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      };
      const c = canvasRef.current;
      if (c === null) return false;
      const g2 = c.getContext('webgl2', attrs);
      if (g2 !== null && !g2.isContextLost()) {
        gl = g2;
        isGL2 = true;
        return true;
      }
      const g1 = c.getContext('webgl', attrs);
      if (g1 !== null && !g1.isContextLost()) {
        gl = g1;
        isGL2 = false;
        return true;
      }
      /* A canvas whose context was lost hands the same dead object back. Ask for
         it to be restored; the webglcontextrestored listener re-runs setup. */
      const dead = g2 ?? g1;
      if (dead !== null) {
        const lose = dead.getExtension('WEBGL_lose_context');
        if (lose !== null) lose.restoreContext();
      }
      return false;
    }

    function buildResources(): boolean {
      if (gl === null) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const aa = dpr >= 1.75 ? 1 : 2;

      const vs = compileShader(gl, gl.VERTEX_SHADER, buildVertexSource(isGL2));
      if (vs === null) return false;
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, buildFragmentSource(isGL2, aa));
      if (fs === null) {
        gl.deleteShader(vs);
        return false;
      }

      const prog = gl.createProgram();
      if (prog === null) {
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return false;
      }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, 'aPos');
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);

      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        if (import.meta.env.DEV) {
          console.warn('[HeroObject] program link failed:', gl.getProgramInfoLog(prog));
        }
        gl.deleteProgram(prog);
        return false;
      }

      const buf = gl.createBuffer();
      if (buf === null) {
        gl.deleteProgram(prog);
        return false;
      }

      program = prog;
      vbo = buf;

      /* fullscreen triangle */
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.useProgram(program);
      uResLoc = gl.getUniformLocation(program, 'uRes');
      uTimeLoc = gl.getUniformLocation(program, 'uTime');
      uCamLoc = gl.getUniformLocation(program, 'uCam');

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.disable(gl.CULL_FACE);
      gl.clearColor(0, 0, 0, 0);

      needResize = true;
      ready = true;
      return true;
    }

    function releaseResources(): void {
      if (gl !== null) {
        if (program !== null) gl.deleteProgram(program);
        if (vbo !== null) gl.deleteBuffer(vbo);
      }
      program = null;
      vbo = null;
      uResLoc = null;
      uTimeLoc = null;
      uCamLoc = null;
      ready = false;
    }

    /* ---------------- sizing ---------------- */

    function applyResize(): void {
      const c = canvasRef.current;
      if (c === null || gl === null) return;
      if (!needResize) return;
      needResize = false;

      let w = cssW;
      let h = cssH;
      if (w <= 0 || h <= 0) {
        const r = c.getBoundingClientRect();
        w = r.width;
        h = r.height;
      }
      if (w <= 0 || h <= 0) {
        needResize = true;
        return;
      }

      /* Record the raw (pre-budget-clamp) value, and only once past the
         zero-size retry above, so a bailed-out resize never records a dpr it
         did not actually apply. */
      const rawDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      builtDpr = rawDpr;
      let dpr = rawDpr;
      /* never render more than ~3.2 MP regardless of what the layout asks for */
      const budget = 3.2e6;
      if (w * h * dpr * dpr > budget) {
        dpr = Math.max(0.75, Math.sqrt(budget / (w * h)));
      }

      const dw = Math.max(1, Math.round(w * dpr));
      const dh = Math.max(1, Math.round(h * dpr));
      if (c.width !== dw) c.width = dw;
      if (c.height !== dh) c.height = dh;
      gl.viewport(0, 0, dw, dh);
    }

    /* ---------------- drawing ---------------- */

    function draw(timeSec: number): void {
      const c = canvasRef.current;
      if (c === null || gl === null || program === null || !ready) return;
      applyResize();
      if (c.width < 1 || c.height < 1) return;

      gl.useProgram(program);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uResLoc, c.width, c.height);
      gl.uniform1f(uTimeLoc, timeSec);
      gl.uniform2f(uCamLoc, camX, camY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(now: number): void {
      if (destroyed || !running) return;
      raf = window.requestAnimationFrame(loop);

      const dt = lastStamp === 0 ? 0 : Math.min((now - lastStamp) / 1000, 0.05);
      lastStamp = now;
      elapsed += dt;

      /* critically damped-ish easing, frame-rate independent */
      const k = 1 - Math.exp(-dt * 5.5);
      camX += (targetX - camX) * k;
      camY += (targetY - camY) * k;

      draw(elapsed);
    }

    function startLoop(): void {
      if (running || destroyed || !ready) return;
      running = true;
      lastStamp = 0;
      raf = window.requestAnimationFrame(loop);
    }

    function stopLoop(): void {
      running = false;
      if (raf !== 0) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function scheduleStatic(): void {
      if (destroyed || !ready) return;
      if (staticRaf !== 0) return;
      staticRaf = window.requestAnimationFrame(() => {
        staticRaf = 0;
        camX = 0;
        camY = 0;
        draw(STATIC_TIME);
      });
    }

    function cancelStatic(): void {
      if (staticRaf !== 0) {
        window.cancelAnimationFrame(staticRaf);
        staticRaf = 0;
      }
    }

    function evaluate(): void {
      if (destroyed || !ready) return;
      const active = onScreen && pageVisible;
      if (reduced) {
        stopLoop();
        if (active) scheduleStatic();
        return;
      }
      if (active) startLoop();
      else stopLoop();
    }

    /* ---------------- listeners ---------------- */

    function onPointerMove(e: PointerEvent): void {
      const c = canvasRef.current;
      if (c === null) return;
      const r = c.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const nx = (e.clientX - (r.left + r.width * 0.5)) / r.width;
      const ny = (e.clientY - (r.top + r.height * 0.5)) / r.height;
      targetX = Math.max(-1.4, Math.min(1.4, nx)) * PARALLAX_YAW;
      targetY = Math.max(-1.4, Math.min(1.4, -ny)) * PARALLAX_PITCH;
    }

    /* Idempotent, so repeated media-query flips cannot double-register. */
    function bindPointer(on: boolean): void {
      if (on === pointerBound) return;
      pointerBound = on;
      if (on) window.addEventListener('pointermove', onPointerMove, { passive: true });
      else window.removeEventListener('pointermove', onPointerMove);
    }

    /* A (resolution: Ndppx) query flips when the window moves to a display of a
       different density. Driving it from a media query rather than polling in
       draw() means the reduced-motion path — which draws a single static frame
       and then stops — is covered too. */
    function onDprChange(): void {
      if (destroyed) return;
      if (Math.min(window.devicePixelRatio || 1, maxDpr) !== builtDpr) needResize = true;
      watchDpr(); // re-arm at the new dpr
      evaluate(); // startLoop() when animating, scheduleStatic() under reduced motion
    }

    function watchDpr(): void {
      if (typeof window.matchMedia !== 'function') return;
      if (dprQuery !== null) dprQuery.removeEventListener('change', onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprQuery.addEventListener('change', onDprChange);
    }

    function onVisibility(): void {
      pageVisible = document.visibilityState !== 'hidden';
      evaluate();
    }

    function onContextLost(e: Event): void {
      e.preventDefault();
      stopLoop();
      cancelStatic();
      program = null;
      vbo = null;
      uResLoc = null;
      uTimeLoc = null;
      uCamLoc = null;
      ready = false;
    }

    function onContextRestored(): void {
      if (destroyed) return;
      if (buildResources()) evaluate();
    }

    function onMotionChange(e: MediaQueryListEvent): void {
      reduced = e.matches;
      if (reduced) {
        targetX = 0;
        targetY = 0;
      }
      /* Order matters: zeroing before unbinding guarantees no in-flight
         pointermove can re-dirty the targets, and evaluating last means the
         loop/static decision sees the final state. */
      bindPointer(!reduced);
      evaluate();
    }

    /* ---------------- boot ---------------- */

    if (!acquireContext() || !buildResources()) {
      releaseResources();
      gl = null;
      setFailed(true);
      return () => {
        destroyed = true;
      };
    }

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry === undefined) return;
      const box = entry.contentRect;
      if (box.width === cssW && box.height === cssH) return;
      cssW = box.width;
      cssH = box.height;
      needResize = true;
      if (!running) {
        if (reduced) scheduleStatic();
        else if (onScreen && pageVisible) startLoop();
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry === undefined) return;
        onScreen = entry.isIntersecting;
        evaluate();
      },
      { rootMargin: '160px', threshold: 0 },
    );
    io.observe(canvas);

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);
    document.addEventListener('visibilitychange', onVisibility);
    bindPointer(!reduced);
    watchDpr();
    if (motionQuery !== null) {
      motionQuery.addEventListener('change', onMotionChange);
    }

    /* first paint, without waiting on any observer callback */
    evaluate();

    return () => {
      destroyed = true;
      stopLoop();
      cancelStatic();

      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      canvas.removeEventListener('webglcontextrestored', onContextRestored, false);
      document.removeEventListener('visibilitychange', onVisibility);
      bindPointer(false);
      if (dprQuery !== null) {
        dprQuery.removeEventListener('change', onDprChange);
        dprQuery = null;
      }
      if (motionQuery !== null) {
        motionQuery.removeEventListener('change', onMotionChange);
      }

      releaseResources();

      /* Hand the GPU context back — but only on a REAL teardown.
         Under StrictMode the effect is torn down and re-run against the same
         still-connected <canvas>; a force-lost context would be handed straight
         back by getContext() on the second mount and every shader would fail to
         compile. Deferring one task lets React finish its commit, after which a
         genuinely unmounted canvas is detached (isConnected === false) and a
         StrictMode remount is not. */
      const doomed = canvas;
      const dying = gl;
      gl = null;
      window.setTimeout(() => {
        if (doomed.isConnected || dying === null) return;
        const lose = dying.getExtension('WEBGL_lose_context');
        if (lose !== null) lose.loseContext();
      }, 0);
    };
  }, []);

  if (failed) return <HeroObjectFallback className={className} />;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={CANVAS_STYLE}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Pure-CSS fallback: concentric gradient rings on the same palette.   */
/* Static by design, so it is already reduced-motion safe.             */
/* ------------------------------------------------------------------ */

const FALLBACK_WRAP: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  overflow: 'hidden',
};

const FALLBACK_GLOW: CSSProperties = {
  position: 'absolute',
  inset: '-10%',
  background:
    'radial-gradient(circle at 50% 48%, rgba(182,0,168,0.20) 0%, rgba(118,33,176,0.12) 32%, rgba(190,76,0,0.06) 52%, rgba(12,12,12,0) 72%)',
  pointerEvents: 'none',
};

function fallbackRing(size: number, rotate: number, squash: number, color: string): CSSProperties {
  return {
    position: 'absolute',
    width: size + '%',
    height: size + '%',
    borderRadius: '50%',
    border: '1.5px solid ' + color,
    transform: 'rotate(' + rotate + 'deg) scaleY(' + squash + ')',
    boxShadow: '0 0 24px -6px ' + color,
    pointerEvents: 'none',
  };
}

const FALLBACK_CORE: CSSProperties = {
  position: 'absolute',
  width: '17%',
  height: '17%',
  transform: 'rotate(45deg)',
  borderRadius: '14%',
  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
  boxShadow: '0 0 42px -4px rgba(182,0,168,0.55)',
  pointerEvents: 'none',
};

function HeroObjectFallback({ className }: HeroObjectProps): JSX.Element {
  return (
    <div className={className} style={FALLBACK_WRAP} aria-hidden="true" role="presentation">
      <div style={FALLBACK_GLOW} />
      <div style={fallbackRing(72, -18, 0.34, 'rgba(187,204,215,0.34)')} />
      <div style={fallbackRing(56, 26, 0.42, 'rgba(182,0,168,0.42)')} />
      <div style={fallbackRing(40, 72, 0.5, 'rgba(190,76,0,0.38)')} />
      <div style={FALLBACK_CORE} />
    </div>
  );
}
