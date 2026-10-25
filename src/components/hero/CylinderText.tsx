import { useLayoutEffect, useRef } from "react";

export type CylinderPart = { text: string; tone?: "ink" | "accent" };

type Props = {
  /** Keep this referentially stable — a new array refits the line. */
  parts: readonly CylinderPart[];
  className: string;
};

/**
 * Type wrapped onto the inside of a cylinder.
 *
 * The reference draws its headline into a canvas with a cylindrical projection,
 * which is why it looks "warped" rather than merely heavy: the ends of the line
 * are nearer the camera than the middle, so they render larger and bow away
 * from the horizon. This reproduces that projection in the DOM so the text stays
 * real, selectable and crisp:
 *
 *   - each glyph is laid out inline first, so real font metrics decide spacing
 *   - its distance `s` from the cylinder axis becomes an angle θ = s / R
 *   - it is moved onto the arc (x = R·sinθ, z = R·(1 − cosθ)) and turned to face
 *     the axis with rotateY(−θ)
 *   - one perspective on the line projects every glyph, with the horizon placed
 *     away from the text so the nearer ends also arc
 *
 * All tuning lives in CSS custom properties on `className`, so breakpoints can
 * change the fit without touching this file:
 *
 *   --cyl-fit      rendered width as a fraction of the stage width
 *   --cyl-max      largest font size in px
 *   --cyl-max-h    largest font size as a fraction of the viewport height, so
 *                  short statements (which fit to a larger size) can never grow
 *                  up under the header
 *   --cyl-radius   cylinder radius as a multiple of the stage width
 *   --cyl-persp    perspective distance as a multiple of the stage width
 *   --cyl-horizon  horizon offset in ems (+ below the text, − above)
 *   --cyl-axis     where the cylinder axis sits relative to this text's centre,
 *                  as a fraction of the stage width (labels sit off-axis)
 */
export function CylinderText({ parts, className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const line = innerRef.current;
    if (!root || !line) return;

    const glyphs = Array.from(line.querySelectorAll<HTMLElement>("[data-cyl-char]"));
    const num = (style: CSSStyleDeclaration, name: string, fallback: number) => {
      const value = Number.parseFloat(style.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };

    const fit = () => {
      const stage = root.clientWidth;
      if (stage === 0) return;
      const style = getComputedStyle(root);
      const fitRatio = num(style, "--cyl-fit", 0.66);
      const maxFont = Math.min(
        num(style, "--cyl-max", 220),
        num(style, "--cyl-max-h", Number.POSITIVE_INFINITY) * window.innerHeight,
      );
      const radius = stage * num(style, "--cyl-radius", 1.1);
      const persp = stage * num(style, "--cyl-persp", 0.85);
      const horizon = num(style, "--cyl-horizon", 1.4);
      const axis = stage * num(style, "--cyl-axis", 0);

      // Measure flat. Clearing the transforms first means every read below is
      // of the true inline layout, not of last frame's projection.
      for (const glyph of glyphs) glyph.style.transform = "";
      line.style.fontSize = "100px";
      const natural = line.offsetWidth || 1;
      const fontSize = Math.min(maxFont, (100 * stage * fitRatio) / natural);
      line.style.fontSize = `${fontSize}px`;

      const width = line.offsetWidth;
      const height = line.offsetHeight;
      const centres = glyphs.map((glyph) => glyph.offsetLeft + glyph.offsetWidth / 2);

      // Writes only from here on.
      glyphs.forEach((glyph, i) => {
        const s = (centres[i] ?? 0) - width / 2 - axis;
        const theta = s / radius;
        const x = radius * Math.sin(theta) - s;
        const z = radius * (1 - Math.cos(theta));
        glyph.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${(
          (-theta * 180) /
          Math.PI
        ).toFixed(3)}deg)`;
        // Normalised position, used by the kinetic timeline to track glyphs
        // in from the edges.
        glyph.dataset["s"] = (s / (width / 2 || 1)).toFixed(3);
      });

      line.style.perspective = `${persp.toFixed(1)}px`;
      line.style.perspectiveOrigin = `${(width / 2 + axis).toFixed(1)}px ${(
        height / 2 +
        horizon * fontSize
      ).toFixed(1)}px`;
    };

    fit();
    // Metrics change once the display face arrives; refit rather than keep the
    // fallback font's spacing baked into the transforms.
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });
    const observer = new ResizeObserver(() => fit());
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [parts]);

  let index = 0;
  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      <span ref={innerRef} className="cyl__line">
        {parts.map((part) =>
          Array.from(part.text).map((char) => {
            const key = index++;
            return (
              <span
                key={key}
                data-cyl-char
                className={char === " " ? "cyl__char cyl__char--space" : "cyl__char"}
                data-tone={part.tone ?? "ink"}
              >
                <span data-glyph className="cyl__glyph">
                  {char === " " ? " " : char}
                </span>
              </span>
            );
          }),
        )}
      </span>
    </div>
  );
}
