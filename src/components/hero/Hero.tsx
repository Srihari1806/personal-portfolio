import { ArrowDown } from "lucide-react";
import { useCallback, useEffect } from "react";

import character from "@/assets/srihari-character.png";
import { PROJECTS } from "@/data/portfolio";
import { KineticHeadline } from "./KineticHeadline";
import { useHeroStage } from "./useHeroStage";

function getRelativePos(index: number, activeIndex: number, count: number): number {
  let diff = index - activeIndex;
  const half = count / 2;
  if (diff > half) diff -= count;
  if (diff <= -half) diff += count;
  return diff;
}

export function Hero() {
  const {
    stageRef,
    frameRef,
    activeIndex,
    isDragging,
    focusProject,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useHeroStage(PROJECTS.length);

  // Keyboard navigation for accessible 3D carousel
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        focusProject(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        focusProject(activeIndex + 1);
      }
    },
    [activeIndex, focusProject],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section id="home" className="hero-stage" ref={stageRef}>
      <div
        className="hero-frame"
        ref={frameRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: isDragging ? "grabbing" : "default" }}
      >
        <div className="hero-grain" aria-hidden="true" />

        {/* Layer 1 — Background Kinetic Display Headline & Kicker */}
        <KineticHeadline />

        {/* Layer 2 — Interactive 3D Curved Perspective Carousel (preserve-3d, perspective: 1200px) */}
        <div
          className="field"
          aria-label="3D Project Carousel"
          tabIndex={0}
          role="region"
          aria-roledescription="3D carousel"
        >
          {PROJECTS.map((project, i) => {
            const isFeatured = i === activeIndex;
            const pos = getRelativePos(i, activeIndex, PROJECTS.length);
            const posAttr = Math.abs(pos) <= 2 ? String(pos) : "hidden";
            return (
              <div
                key={project.slug}
                data-field-card
                data-pos={posAttr}
                className={isFeatured ? "field-card mockup-card is-featured" : "field-card mockup-card"}
                onClick={() => focusProject(i)}
                role="button"
                tabIndex={0}
                aria-label={`View ${project.title}`}
                aria-current={isFeatured ? "true" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    focusProject(i);
                  }
                }}
              >
                {/* Sleek Smartphone Mockup Chassis */}
                <div className="field-card__chassis">
                  {/* Pinned Top Perimeter Bar: Micro Pill Tag (left) & Mono Case (right) */}
                  <div className="field-card__top-bar" aria-hidden="true">
                    <span className="field-card__pill-tag">
                      <span className="field-card__dot" />
                      {project.editorialTag}
                    </span>
                    <span className="field-card__case-mono">{project.caseNumber}</span>
                  </div>

                  {/* Dynamic Island Notch */}
                  <div className="field-card__notch" aria-hidden="true">
                    <span className="field-card__camera" />
                    <span className="field-card__sensor" />
                  </div>

                  {/* Edge-to-edge Visual Artwork Container — natural, vivid, crisp brightness */}
                  <div className="field-card__screen">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={1024}
                      height={1280}
                      decoding="async"
                      loading={i < 3 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                    />
                  </div>

                  {/* Pinned Bottom Perimeter Bar: Title Pill & Action Anchor */}
                  <div className="field-card__bottom-bar">
                    <div className="field-card__title-pill">
                      <span className="field-card__index">{project.n}</span>
                      <strong className="field-card__title">{project.title}</strong>
                    </div>

                    <a
                      href="#work"
                      className="field-card__action-btn"
                      onClick={(e) => {
                        if (!isFeatured) {
                          e.preventDefault();
                          focusProject(i);
                        }
                      }}
                      aria-label={`Explore ${project.title}`}
                    >
                      <span>EXPLORE</span>
                      <ArrowDown className="explore-bounce-icon" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 2.5 — Dual-sided Depth-of-Field Lens Blur (s0animation optical vignette) */}
        <div className="wheel-lens-blur wheel-lens-blur--left" aria-hidden="true" />
        <div className="wheel-lens-blur wheel-lens-blur--right" aria-hidden="true" />

        {/* Layer 3 — Foreground Character Cutout Anchor (z-index: 20) */}
        {/* Project cards fan out dynamically behind his shoulders */}
        <div className="hero-character-anchor" aria-hidden="true">
          <span className="figure-shadow" />
          <img
            className="figure"
            data-field-figure
            src={character}
            alt="Illustrated portrait of Srihari Beesetti"
            width={514}
            height={1481}
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Layer 4 — Flanking Angled Labels beside character knees */}
        <div className="hero-flank-labels" aria-hidden="true">
          <span className="hero-flank hero-flank--left">CREATIVITY TO CONVERSATIONS</span>
          <span className="hero-flank hero-flank--right">DATA TO INSIGHTS</span>
        </div>

        {/* Layer 5 — Bottom Anchor Pill (Pinned at bottom: 0, grounds sneakers) */}
        <a href="#work" className="hero-explore-cue" aria-label="Explore projects">
          <span className="hero-explore-cue__text">EXPLORE</span>
          <ArrowDown className="hero-explore-cue__arrow" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
