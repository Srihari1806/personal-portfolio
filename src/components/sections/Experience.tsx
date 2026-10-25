import { PROJECTS } from "@/data/portfolio";

/**
 * Practice, not a CV.
 *
 * The four modes below are how the work actually gets made; the timeline entries
 * describe the current body of work rather than inventing employment history.
 * Drop real roles into `TIMELINE` when you want this to read as a résumé.
 */
const MODES = [
  {
    n: "01",
    title: "Research & Analytics",
    body: "Finding the evidence layer under a cultural question — audiences, economics, behaviour — and turning it into something a decision can rest on.",
  },
  {
    n: "02",
    title: "Product & Engineering",
    body: "Building the thing. Interfaces, data models and the unglamorous plumbing that decides whether an idea survives contact with real use.",
  },
  {
    n: "03",
    title: "Creative Direction",
    body: "Deciding how it should feel. Typography, pacing, restraint — the difference between a product that works and one people want to be near.",
  },
  {
    n: "04",
    title: "Storytelling",
    body: "Making the argument land. Writing, structure and narrative so the work can be understood by someone who was not in the room.",
  },
];

const TIMELINE = [
  {
    period: "Now",
    title: "Building six multidisciplinary projects",
    body: "IPL Analytics Engine, Sahitya Rachanalu, Kalakshetra, OTT vs Theatre, Business City and Hiremap — each one a different way of asking the same question.",
  },
  {
    period: "Ongoing",
    title: "Writing about cinema, culture and attention",
    body: "Essays and notes on why stories travel, how audiences actually behave, and what Telugu creative work needs from the internet.",
  },
  {
    period: "Open",
    title: "Collaborations",
    body: "Product, analytics and creative strategy work with teams who want the story and the numbers built by the same person.",
  },
];

export function Experience() {
  const toolkit = Array.from(new Set(PROJECTS.flatMap((project) => project.tools))).sort();

  return (
    <section id="experience" className="experience">
      <header className="experience__intro">
        <span className="eyebrow" data-reveal>
          Practice / How the work gets made
        </span>
        <h2 data-reveal>
          Four modes.
          <br />
          <em>One process.</em>
        </h2>
      </header>

      <ol className="modes">
        {MODES.map((mode) => (
          <li className="mode" key={mode.n} data-reveal>
            <span className="mode__n">{mode.n}</span>
            <h3>{mode.title}</h3>
            <p>{mode.body}</p>
          </li>
        ))}
      </ol>

      <div className="experience__split">
        <ol className="timeline">
          {TIMELINE.map((entry) => (
            <li key={entry.title} data-reveal>
              <span className="timeline__period">{entry.period}</span>
              <div>
                <h4>{entry.title}</h4>
                <p>{entry.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="toolkit" data-reveal>
          <h4>Toolkit</h4>
          <ul>
            {toolkit.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
