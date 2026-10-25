import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

import { projectAt } from "@/data/portfolio";
import {
  DESKTOP_PROFILE,
  MOBILE_PROFILE,
  TABLET_PROFILE,
  resolveAtmosphere,
  resolveCard,
  resolveFigure,
  resolveHeadline,
  resolveNotes,
  ringPosition,
  type FieldProfile,
} from "./heroField";

const AUTOPLAY_MS = 4800;

type StageNodes = {
  cards: HTMLElement[];
  figure: HTMLElement | null;
  headline: HTMLElement | null;
  watermark: HTMLElement | null;
  notes: HTMLElement | null;
  atmosphere: HTMLElement | null;
};

/** Caches the last string written to each style property to avoid redundant work. */
type StyleCache = Map<HTMLElement, Record<string, string>>;

function write(cache: StyleCache, el: HTMLElement, prop: string, value: string) {
  let entry = cache.get(el);
  if (!entry) {
    entry = {};
    cache.set(el, entry);
  }
  if (entry[prop] === value) return;
  entry[prop] = value;
  el.style.setProperty(prop, value);
}

const round = (v: number, step: number) => Math.round(v / step) * step;

export type HeroStage = {
  /** Attach to the tall scroll container. */
  stageRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the sticky 100vh frame that holds every moving layer. */
  frameRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  isDragging: boolean;
  /** Jump the ring to a specific project by the shortest route. */
  focusProject: (index: number) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
};

export function useHeroStage(count: number): HeroStage {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // `turn` is unbounded on purpose: the ring only ever rolls forward, so the
  // eased float never has to jump when the index wraps 5 -> 0.
  const turnRef = useRef(0);
  const floatRef = useRef(0);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const startRef = useRef(0);
  const elapsedRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Gesture tracking
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTurnRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const wheelTimeoutRef = useRef<number | null>(null);

  const focusProject = useCallback(
    (index: number) => {
      lastInteractionRef.current = Date.now();
      const current = ((turnRef.current % count) + count) % count;
      // Shortest signed route around the ring, so clicking never unwinds the
      // whole carousel backwards.
      let delta = index - current;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      turnRef.current += delta;
      setActiveIndex(index);
    },
    [count],
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    lastInteractionRef.current = Date.now();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartTurnRef.current = turnRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    lastInteractionRef.current = Date.now();
    const dx = e.clientX - dragStartXRef.current;
    turnRef.current = dragStartTurnRef.current - dx / 280;

    const now = performance.now();
    const dt = Math.max(now - lastPointerTimeRef.current, 1);
    velocityRef.current = (e.clientX - lastPointerXRef.current) / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      lastInteractionRef.current = Date.now();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const v = velocityRef.current;
      if (Math.abs(v) > 0.35) {
        turnRef.current -= Math.sign(v) * (Math.abs(v) > 0.8 ? 1.4 : 0.8);
      }

      turnRef.current = Math.round(turnRef.current);
      const newIdx = ((Math.round(turnRef.current) % count) + count) % count;
      setActiveIndex(newIdx);
    },
    [count],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      lastInteractionRef.current = Date.now();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;

      turnRef.current += Math.sign(delta) * 0.28;

      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = window.setTimeout(() => {
        turnRef.current = Math.round(turnRef.current);
        const newIdx = ((Math.round(turnRef.current) % count) + count) % count;
        setActiveIndex(newIdx);
      }, 200);
    },
    [count],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const nodes: StageNodes = {
      cards: Array.from(frame.querySelectorAll<HTMLElement>("[data-field-card]")),
      figure: frame.querySelector<HTMLElement>("[data-field-figure]"),
      headline: frame.querySelector<HTMLElement>("[data-field-headline]"),
      watermark: frame.querySelector<HTMLElement>("[data-field-watermark]"),
      notes: frame.querySelector<HTMLElement>("[data-field-notes]"),
      atmosphere: frame.querySelector<HTMLElement>("[data-field-atmosphere]"),
    };

    const items = nodes.cards.map((el, i) => ({ el, i, motion: projectAt(i).motion }));
    const cache: StyleCache = new Map();

    let profile: FieldProfile = DESKTOP_PROFILE;
    let width = frame.clientWidth || 1;
    let height = frame.clientHeight || 1;
    let cardWidth = 200;
    let motionOff = false;

    const measure = () => {
      width = frame.clientWidth || 1;
      height = frame.clientHeight || 1;
      // Card size is set in CSS per breakpoint; the arc is specified relative
      // to it, so read it rather than duplicate the breakpoints here.
      cardWidth = nodes.cards[0]?.offsetWidth || 200;
    };

    /** One full pass over every layer. Reads nothing from the DOM. */
    const render = (t: number) => {
      const p = progressRef.current;
      const ptr = pointerRef.current;

      // Publish progress to CSS so purely presentational layers (the overview
      // caption, the scroll cue) can respond without extra JS bookkeeping.
      write(cache, frame, "--p", round(p, 0.01).toFixed(2));

      // Background watermark headline
      if (nodes.watermark) {
        const wy = -p * height * 0.16;
        const wOp = 0.085 * (1 - p * 1.6);
        write(cache, nodes.watermark, "transform", `translate3d(0, ${round(wy, 0.2)}px, 0)`);
        write(cache, nodes.watermark, "opacity", Math.max(0, wOp).toFixed(3));
      }

      for (const item of items) {
        const out = resolveCard({
          index: item.i,
          activeFloat: floatRef.current,
          count,
          motion: item.motion,
          t,
          pointerX: ptr.x,
          pointerY: ptr.y,
          progress: p,
          width,
          height,
          cardWidth,
          profile,
        });

        write(
          cache,
          item.el,
          "transform",
          `translate3d(${round(out.x, 0.1)}px, ${round(out.y, 0.1)}px, ${round(
            out.z,
            0.1,
          )}px) rotateY(${round(out.rotateY, 0.05)}deg) rotateZ(${round(
            out.rotateZ,
            0.05,
          )}deg) rotateX(${round(out.rotateX, 0.05)}deg) scale(${round(out.scale, 0.002)})`,
        );
        write(cache, item.el, "opacity", round(out.opacity, 0.005).toFixed(3));
        const ad = Math.abs(ringPosition(item.i, floatRef.current, count));
        const zIndex = ad <= 0.5 ? 5 : ad <= 1.5 ? 4 : ad <= 2.5 ? 3 : 1;
        write(cache, item.el, "z-index", String(zIndex));
        if (out.blur > 0.05) {
          write(cache, item.el, "filter", `blur(${round(out.blur, 0.1)}px)`);
        } else {
          write(cache, item.el, "filter", "none");
        }
        write(cache, item.el, "pointer-events", out.opacity < 0.1 ? "none" : "auto");
        write(cache, item.el, "--focus", round(out.focus, 0.02).toFixed(2));

        const intPos = Math.round(ringPosition(item.i, floatRef.current, count));
        const posStr = Math.abs(intPos) <= 2 ? String(intPos) : "hidden";
        if (item.el.getAttribute("data-pos") !== posStr) {
          item.el.setAttribute("data-pos", posStr);
        }
      }

      if (nodes.figure) {
        const f = resolveFigure(t, ptr.x, ptr.y, p, width, height, profile);
        write(
          cache,
          nodes.figure,
          "transform",
          `translate3d(${round(f.x, 0.1)}px, ${round(f.y, 0.1)}px, 0) scale(${round(
            f.scale,
            0.002,
          )})`,
        );
        write(cache, nodes.figure, "opacity", round(f.opacity, 0.005).toFixed(3));
      }

      if (nodes.headline) {
        const h = resolveHeadline(p, height);
        write(cache, nodes.headline, "transform", `translate3d(0, ${round(h.y, 0.2)}px, 0)`);
        write(cache, nodes.headline, "opacity", round(h.opacity, 0.005).toFixed(3));
        const hb = round(h.blur, 0.5);
        write(cache, nodes.headline, "filter", hb > 0.05 ? `blur(${hb}px)` : "none");
      }

      if (nodes.notes) {
        const n = resolveNotes(t, p, height, profile);
        write(cache, nodes.notes, "transform", `translate3d(0, ${round(n.y, 0.2)}px, 0)`);
        write(cache, nodes.notes, "opacity", round(n.opacity, 0.005).toFixed(3));
      }

      if (nodes.atmosphere) {
        const a = resolveAtmosphere(t, ptr.x, ptr.y, p, width, height, profile);
        write(
          cache,
          nodes.atmosphere,
          "transform",
          `translate3d(${round(a.x, 0.2)}px, ${round(a.y, 0.2)}px, 0) scale(${round(a.scale, 0.004)})`,
        );
        write(cache, nodes.atmosphere, "opacity", round(a.opacity, 0.005).toFixed(3));
      }
    };

    /**
     * Own the frame loop rather than borrowing gsap's ticker. gsap sleeps its
     * ticker when the document is hidden and wakes it from events that are not
     * guaranteed to arrive in every embedding — and a hero frozen half way
     * through its scroll choreography is a far worse failure than a dropped
     * frame. A plain rAF loop is throttled and resumed by the browser itself.
     */
    const tick = (nowMs: number) => {
      const now = nowMs / 1000;
      // Accumulate our own clock and clamp the delta. rAF stops while the tab
      // is backgrounded, so wall-clock time would jump the drift to a new phase
      // and snap every card the instant the tab comes back.
      const delta = startRef.current === 0 ? 0 : Math.min(now - startRef.current, 0.1);
      startRef.current = now;
      elapsedRef.current += delta;
      const t = elapsedRef.current;

      // Read the scroll position straight off the stage. One rect read at the
      // top of the frame, before any writes, so nothing is forced to reflow —
      // and the hero stays correct through resize, zoom and image reflow
      // without depending on a ScrollTrigger refresh landing at the right time.
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - height;
      progressRef.current = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      // Ease the carousel and the pointer rather than tracking them directly —
      // this is what turns a state change into a continuous camera move.
      floatRef.current += (turnRef.current - floatRef.current) * 0.065;
      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;

      render(t);
    };

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        // The fan needs horizontal room. Landscape tablets get a reduced
        // version of it; anything narrower takes the vertical system, which
        // suits a portrait tablet far better than a squeezed fan would.
        tablet:
          "(min-width: 901px) and (max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
        still: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const c = context.conditions as Record<string, boolean>;
        motionOff = c["still"] === true;
        profile = c["desktop"] ? DESKTOP_PROFILE : c["tablet"] ? TABLET_PROFILE : MOBILE_PROFILE;
        measure();

        if (motionOff) {
          // Compose the frame once and leave it alone.
          floatRef.current = turnRef.current;
          progressRef.current = 0;
          render(0);
          return;
        }

        let raf = 0;
        const loop = (nowMs: number) => {
          raf = window.requestAnimationFrame(loop);
          tick(nowMs);
        };
        raf = window.requestAnimationFrame(loop);

        const autoplay = window.setInterval(() => {
          // Don't queue up rotations nobody is watching — otherwise the ring
          // spins through a backlog the moment the tab is focused again.
          if (
            document.hidden ||
            isDraggingRef.current ||
            Date.now() - lastInteractionRef.current < 6000
          )
            return;
          turnRef.current += 1;
          setActiveIndex(((turnRef.current % count) + count) % count);
        }, AUTOPLAY_MS);

        const onVisibility = () => {
          if (document.hidden) return;
          floatRef.current = turnRef.current;
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
          window.cancelAnimationFrame(raf);
          window.clearInterval(autoplay);
          document.removeEventListener("visibilitychange", onVisibility);
        };
      },
    );

    const onPointerMove = (event: PointerEvent) => {
      if (motionOff || event.pointerType !== "mouse") return;
      pointerRef.current.tx = event.clientX / window.innerWidth - 0.5;
      pointerRef.current.ty = event.clientY / window.innerHeight - 0.5;
    };

    const onResize = () => {
      measure();
      if (motionOff) render(0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      mm.revert();
      cache.clear();
    };
  }, [count]);

  return {
    stageRef,
    frameRef,
    activeIndex,
    isDragging,
    focusProject,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
