import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import { CONTACT, PROJECTS, type Project } from "@/data/portfolio";

function mailto(project: Project) {
  const subject = encodeURIComponent(`${project.n} — ${project.title}`);
  const body = encodeURIComponent(
    `Hi Srihari,\n\nI would like to see more of ${project.title} (${project.positioning}).\n\n`,
  );
  return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
}

export function Work() {
  const root = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The image frames wipe open, so a project arrives the way a cut arrives
      // in a title sequence rather than fading in like a web page.
      gsap.utils.toArray<HTMLElement>(".work-block__frame").forEach((frame) => {
        const image = frame.querySelector("img");
        gsap.fromTo(
          frame,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 84%" },
          },
        );
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.22, yPercent: 6 },
            {
              scale: 1,
              yPercent: 0,
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: { trigger: frame, start: "top 84%" },
            },
          );
          // A slow counter-drift keeps the section alive while reading.
          gsap.to(image, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(".work-block").forEach((block) => {
        const rise = block.querySelectorAll<HTMLElement>("[data-rise]");
        gsap.fromTo(
          rise,
          { yPercent: 60, opacity: 0, filter: "blur(8px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 72%" },
          },
        );

        const numeral = block.querySelector<HTMLElement>(".work-block__numeral");
        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: 28 },
            {
              yPercent: -28,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="work" ref={root}>
      <header className="work__intro">
        <span className="eyebrow" data-reveal>
          Selected work / 01—06
        </span>
        <h2 className="work__statement" data-reveal>
          Different disciplines.
          <br />
          <em>One point of view.</em>
        </h2>
        <p data-reveal>
          Six systems built where culture meets evidence — each one an argument that a story and a
          spreadsheet are better together than apart.
        </p>
      </header>

      {PROJECTS.map((project, i) => (
        <article
          className="work-block"
          key={project.slug}
          data-flip={i % 2 === 1 ? "true" : undefined}
        >
          <span className="work-block__numeral" aria-hidden="true">
            {project.n}
          </span>

          <div className="work-block__visual">
            <div className="work-block__frame">
              <img
                src={project.image}
                alt={`${project.title} — ${project.positioning}`}
                width={1024}
                height={1280}
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="work-block__caption">
              {project.n} / {project.label}
            </span>
          </div>

          <div className="work-block__body">
            <span className="eyebrow" data-rise>
              {project.label}
            </span>
            <h3 className="work-block__title" data-rise>
              {project.title}
            </h3>
            <p className="work-block__positioning" data-rise>
              {project.positioning}
            </p>

            <dl className="work-block__meta">
              <div data-rise>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div data-rise>
                <dt>Problem</dt>
                <dd>{project.problem}</dd>
              </div>
              <div data-rise>
                <dt>Idea</dt>
                <dd>{project.idea}</dd>
              </div>
              <div data-rise>
                <dt>Stack</dt>
                <dd>
                  <span className="chips">
                    {project.tools.map((tool) => (
                      <span className="chip" key={tool}>
                        {tool}
                      </span>
                    ))}
                  </span>
                </dd>
              </div>
              <div data-rise>
                <dt>Status</dt>
                <dd>{project.outcome}</dd>
              </div>
            </dl>

            <a className="work-block__cta" href={mailto(project)} data-rise>
              View project <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
