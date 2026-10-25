/**
 * Hero field maths.
 *
 * The hero is a ring of project cards that never stops moving. Every frame each
 * card resolves to a single transform built from four blended sources:
 *
 *   1. ring    — where the card sits in the carousel right now (continuous, so a
 *                change of featured project is a glide, not a slide swap)
 *   2. drift   — an endless low-frequency wander unique to each project
 *   3. pointer — depth parallax; the focal card reacts most, the back layer least
 *   4. scroll  — the four-phase choreography that turns the field into a grid
 *
 * All of it is pure maths so it can be unit-reasoned about and run either inside
 * the animation loop or exactly once for `prefers-reduced-motion`.
 */

export type FieldProfile = {
  /** Horizontal fan spacing as a fraction of stage width. */
  spacing: number;
  /** Width of the gap held open at centre stage for the figure. */
  gap: number;
  /** How far cards are pushed away from the featured card. */
  spread: number;
  /** Drift amplitude multiplier — dialled down on smaller screens. */
  drift: number;
  /** Pointer parallax multiplier — zero on touch devices. */
  pointer: number;
  /** How many slots either side of the focus stay visible. */
  reach: number;
  /** Maximum depth-of-field blur in px. */
  maxBlur: number;
  /**
   * Where the featured card rests, in slots. Desktop parks it half a slot left
   * of centre so the figure always stands in open space beside it; mobile has
   * no figure to dodge, so the featured card sits dead centre.
   */
  focal: number;
  /** Mobile stacks the ring vertically instead of fanning it horizontally. */
  vertical: boolean;
  /** Whether the scroll choreography resolves the field into a grid. */
  enableGrid: boolean;
};

export const DESKTOP_PROFILE: FieldProfile = {
  spacing: 0.16,
  gap: 0.08,
  spread: 0.04,
  drift: 0.8,
  pointer: 1,
  reach: 3,
  maxBlur: 0,
  focal: 0,
  vertical: false,
  enableGrid: false,
};

export const TABLET_PROFILE: FieldProfile = {
  spacing: 0.16,
  gap: 0.06,
  spread: 0.03,
  drift: 0.5,
  pointer: 0,
  reach: 3,
  maxBlur: 0,
  focal: 0,
  vertical: false,
  enableGrid: false,
};

export const MOBILE_PROFILE: FieldProfile = {
  spacing: 0.18,
  gap: 0,
  spread: 0,
  drift: 0.4,
  pointer: 0,
  reach: 3,
  maxBlur: 0,
  focal: 0,
  vertical: false,
  enableGrid: false,
};

export type CardMotion = {
  lift: number;
  tilt: number;
  size: number;
  speed: number;
  phase: number;
};

export type FieldInput = {
  /** Card index in the ring. */
  index: number;
  /** Eased, unbounded carousel position. */
  activeFloat: number;
  /** Number of cards in the ring. */
  count: number;
  motion: CardMotion;
  /** Seconds since the loop started. */
  t: number;
  /** Eased pointer offset, -0.5..0.5 on each axis. */
  pointerX: number;
  pointerY: number;
  /** Hero scroll progress, 0..1. */
  progress: number;
  width: number;
  height: number;
  /** Rendered card width in px — the arc is specified relative to the card. */
  cardWidth: number;
  profile: FieldProfile;
};

export type FieldOutput = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateY: number;
  rotateX: number;
  rotateZ: number;
  blur: number;
  opacity: number;
  /** 0..1 — how strongly this card is the featured one. Drives saturation/UI. */
  focus: number;
  depth: number;
};

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Hermite ease between two edges. */
export function smoothstep(edge0: number, edge1: number, v: number): number {
  if (edge1 === edge0) return v < edge0 ? 0 : 1;
  const t = clamp((v - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Signed ring distance wrapped into [-count/2, count/2). */
export function ringPosition(index: number, activeFloat: number, count: number): number {
  const half = count / 2;
  return ((((index - activeFloat + half) % count) + count) % count) - half;
}

export function resolveCard(input: FieldInput): FieldOutput {
  const { motion: m, t, progress: p, width: W, height: H, profile } = input;

  // Signed distance wrapped around ring: u in [-count/2, count/2)
  const u = ringPosition(input.index, input.activeFloat, input.count);
  const ad = Math.abs(u);
  const focus = Math.max(0, 1 - ad);
  const depth = Math.max(0.2, 1 - 0.25 * ad);

  // Responsive scale factor so cards fan out elegantly across all display widths
  const responsiveScale = Math.min(1, Math.max(0.65, W / 1140));

  // --- 1. The 5-Card Cylindrical Staging Arc (s0animation reference) ----------
  // Pos -2 (Far Left):   translateX(-520px) translateZ(-140px) rotateY(26deg)  opacity: 0.35, blur: 1px
  // Pos -1 (Near Left):  translateX(-260px) translateZ(-60px)  rotateY(13deg)  opacity: 0.75
  // Pos 0  (Center):     translateX(0px)    translateZ(20px)   rotateY(0deg)   opacity: 1.0
  // Pos 1  (Near Right): translateX(260px)  translateZ(-60px)  rotateY(-13deg) opacity: 0.75
  // Pos 2  (Far Right):  translateX(520px)  translateZ(-140px) rotateY(-26deg) opacity: 0.35, blur: 1px
  // Pos > 2.2:           opacity: 0
  const sign = Math.sign(u);
  let x = 215 * u * responsiveScale;
  let y = (5 * ad + 3 * ad * ad) * responsiveScale;
  let z = (20 - 80 * ad) * responsiveScale;
  let rotateY = -15 * u;
  let rotateZ = -sign * (1.8 * ad + 0.6 * ad * ad);
  let rotateX = 2.5 * ad;
  const scale = Math.max(0.85, 1 - 0.1 * p);

  // Reduced opacity so cards act as a soft, atmospheric backdrop
  let opacity = 0;
  if (ad <= 1) {
    opacity = 0.85 - 0.40 * ad;
  } else if (ad <= 2) {
    opacity = 0.45 - 0.27 * (ad - 1);
  } else if (ad < 2.3) {
    opacity = Math.max(0, 0.18 * (1 - (ad - 2) / 0.3));
  } else {
    opacity = 0;
  }

  // Soft depth-of-field blur on far cards
  let blur = 0;
  if (ad > 1.4) {
    blur = Math.min(1, (ad - 1.4) / 0.6);
  }

  // --- 2. Micro-drift --------------------------------------------------------
  const dr = profile.drift;
  x += Math.sin(t * m.speed + m.phase) * 4 * dr;
  y += Math.cos(t * m.speed * 0.8 + m.phase * 1.6) * 3 * dr;
  rotateY += Math.sin(t * m.speed * 0.6 + m.phase) * 0.8 * dr;

  // --- 3. Interactive Pointer Parallax --------------------------------------
  const pt = profile.pointer;
  x += input.pointerX * depth * 12 * pt;
  rotateY += input.pointerX * 4 * pt;
  rotateX -= input.pointerY * 2.5 * pt;

  // --- 4. Scroll Choreography -----------------------------------------------
  const lift = smoothstep(0, 0.5, p);
  const finalX = x * (1 + lift * 0.15);
  const finalY = y - lift * H * 0.2;
  const finalZ = z - lift * 200;
  const finalOpacity = opacity * (1 - smoothstep(0.45, 0.9, p));

  return {
    x: finalX,
    y: finalY,
    z: finalZ,
    scale,
    rotateY,
    rotateX,
    rotateZ: 0,
    blur,
    opacity: finalOpacity,
    focus,
    depth,
  };
}

export type FigureOutput = { x: number; y: number; scale: number; opacity: number };

/** The figure stands proudly as a centered foreground anchor over the center card. */
export function resolveFigure(
  t: number,
  pointerX: number,
  pointerY: number,
  p: number,
  W: number,
  H: number,
  profile: FieldProfile,
): FigureOutput {
  const lift = smoothstep(0, 0.55, p);
  return {
    x: pointerX * 10 * profile.pointer,
    y: pointerY * 6 * profile.pointer - lift * H * 0.32,
    scale: 1,
    opacity: 1 - smoothstep(0.35, 0.7, p),
  };
}

export type LayerOutput = { y: number; opacity: number; blur: number };

/** Headline lifts first and clears the frame before the cards regroup. */
export function resolveHeadline(p: number, H: number): LayerOutput {
  const out = smoothstep(0, 0.26, p);
  return { y: -out * H * 0.42, opacity: 1 - out, blur: out * 9 };
}

/** Margin notes are the first thing to go — they belong to the still frame. */
export function resolveNotes(t: number, p: number, H: number, profile: FieldProfile): LayerOutput {
  const out = smoothstep(0, 0.16, p);
  return {
    y: Math.sin(t * 0.3) * H * 0.006 * profile.drift - out * H * 0.14,
    opacity: 1 - out,
    blur: out * 6,
  };
}

/**
 * Background plate: a very slow push-in that never repeats within a visit.
 *
 * The plate is flat, so it has its own small result type rather than borrowing
 * the card's — it has no business carrying the carousel's 3D rotation fields.
 */
export type PlateOutput = { x: number; y: number; scale: number; opacity: number };

export function resolveAtmosphere(
  t: number,
  pointerX: number,
  pointerY: number,
  p: number,
  W: number,
  H: number,
  profile: FieldProfile,
): PlateOutput {
  return {
    x: Math.sin(t * 0.055) * W * 0.018 * profile.drift - pointerX * W * 0.016 * profile.pointer,
    y: Math.cos(t * 0.042) * H * 0.016 * profile.drift - pointerY * H * 0.012 * profile.pointer,
    scale: 1.12 + Math.sin(t * 0.037) * 0.03 + smoothstep(0, 1, p) * 0.06,
    opacity: 1 - smoothstep(0.55, 0.95, p) * 0.75,
  };
}
