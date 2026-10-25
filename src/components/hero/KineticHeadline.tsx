import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { STATEMENTS, statementAt } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CylinderText, type CylinderPart } from "./CylinderText";

const STACK_QUERY = "(max-width: 900px)";

/** Narrow screens stack the statement so long phrases never shrink to a whisper. */
function useStacked() {
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(STACK_QUERY);
    const sync = () => setStacked(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return stacked;
}

/**
 * The rotating statement, wrapped onto the hero cylinder.
 *
 * It sits at the very back of the stage: the cards pass in front of it and the
 * figure's head cuts through it. Glyphs arrive tracked out from the edges,
 * rising and unblurring from the centre outward, then leave upward from the
 * edges in.
 */
export function KineticHeadline() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const still = usePrefersReducedMotion();
  const stacked = useStacked();

  const [lead, accent] = statementAt(index);
  const single = useMemo<CylinderPart[]>(
    () => [{ text: `${lead} ` }, { text: accent, tone: "accent" }],
    [lead, accent],
  );
  const leadLine = useMemo<CylinderPart[]>(() => [{ text: lead }], [lead]);
  const accentLine = useMemo<CylinderPart[]>(() => [{ text: accent, tone: "accent" }], [accent]);

  useLayoutEffect(() => {
    if (still) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const glyphs = root.querySelectorAll<HTMLElement>("[data-glyph]");
      // Position on the line, -1 at the left edge to 1 at the right, published
      // by CylinderText when it fits the line.
      const side = (el: Element) =>
        Number((el.parentElement as HTMLElement | null)?.dataset["s"] ?? 0);

      const tl = gsap.timeline();
      tl.fromTo(
        glyphs,
        {
          yPercent: 110,
          xPercent: (_: number, el: Element) => side(el) * 55,
          scaleY: 1.3,
          opacity: 0,
          filter: "blur(14px)",
        },
        {
          yPercent: 0,
          xPercent: 0,
          scaleY: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.03, from: "center" },
        },
      );
      tl.to(glyphs, {
        yPercent: -95,
        xPercent: (_: number, el: Element) => side(el) * -25,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.55,
        ease: "power2.in",
        stagger: { each: 0.018, from: "edges" },
        delay: 2.6,
      });
      tl.call(() => setIndex((i) => (i + 1) % STATEMENTS.length));
    }, root);

    return () => ctx.revert();
  }, [index, still, stacked]);

  return (
    <div className="hero-title" data-field-headline ref={rootRef}>
      {/* One stable heading for assistive tech instead of a line that rewrites itself. */}
      <h1 className="sr-only">
        Srihari Beesetti — {STATEMENTS.map(([l, a]) => `${l} ${a}`).join(", ")}
      </h1>
      {stacked ? (
        <div className="hero-title__stack" key={`stack-${index}`}>
          <CylinderText parts={leadLine} className="cyl cyl--title cyl--title-lead" />
          <CylinderText parts={accentLine} className="cyl cyl--title cyl--title-accent" />
        </div>
      ) : (
        <CylinderText key={`line-${index}`} parts={single} className="cyl cyl--title" />
      )}
    </div>
  );
}
