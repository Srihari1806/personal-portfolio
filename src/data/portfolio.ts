import city from "@/assets/project-city.jpg";
import hiremap from "@/assets/project-hiremap.jpg";
import ipl from "@/assets/project-ipl.jpg";
import kalakshetra from "@/assets/project-kalakshetra.jpg";
import ott from "@/assets/project-ott.jpg";
import sahitya from "@/assets/project-sahitya.jpg";

export type Discipline = "cinema" | "writing" | "analytics" | "tech" | "creative" | "impact";

export type Project = {
  /** Two-digit editorial index used in labels and the work section. */
  n: string;
  slug: string;
  title: string;
  /** Short editorial label, e.g. the "01 / SPORTS INTELLIGENCE" marks. */
  label: string;
  positioning: string;
  axes: string;
  role: string;
  problem: string;
  idea: string;
  tools: string[];
  outcome: string;
  image: string;
  /** Disciplines this project belongs to — drives the bottom rail highlight. */
  disciplines: Discipline[];
  /** Editorial pill tag for 3D staging preview, e.g. #SPORTS/ANALYTICS */
  editorialTag: string;
  /** Editorial case study mono indicator, e.g. CASE 01 */
  caseNumber: string;
  /**
   * Per-project motion personality. Keeps the field hand-composed rather than
   * mechanically symmetric: each card carries its own tilt, lift and drift
   * speed as it travels around the ring.
   */
  motion: {
    /** Vertical bias in stage units, applied on top of the ring arc. */
    lift: number;
    /** Resting tilt in degrees. */
    tilt: number;
    /** Size bias multiplier. */
    size: number;
    /** Drift cycle speed. */
    speed: number;
    /** Phase offset so no two cards breathe in sync. */
    phase: number;
  };
};

export const PROJECTS: Project[] = [
  {
    n: "01",
    slug: "ipl-analytics-engine",
    title: "IPL Analytics Engine",
    label: "Sports Intelligence",
    editorialTag: "#SPORTS/ANALYTICS",
    caseNumber: "CASE 01",
    positioning: "Cricket Intelligence Operating System",
    axes: "Sports × Data × Business × Fan Intelligence",
    role: "Product strategy · Data systems · Narrative design",
    problem:
      "Cricket generates more data than almost any sport on earth, yet decisions about players, venues, auctions and audiences are still made in separate rooms with separate spreadsheets.",
    idea: "One operating layer that reads the match, the market and the fan at the same time — win probability, squad economics and attention signals resolved into a single decision surface.",
    tools: ["React", "Python", "Ball-by-ball modelling", "Data visualisation"],
    outcome: "Concept system · Modelling in progress",
    image: ipl,
    disciplines: ["analytics", "tech", "impact"],
    motion: { lift: -0.06, tilt: -2.4, size: 1.02, speed: 0.22, phase: 0 },
  },
  {
    n: "02",
    slug: "sahitya-rachanalu",
    title: "Sahitya Rachanalu",
    label: "Creative Culture",
    editorialTag: "#CREATIVE/CULTURE",
    caseNumber: "CASE 02",
    positioning: "Where Telugu Words Find a Home",
    axes: "Poetry × Lyrics × Stories × Community",
    role: "Creative direction · Product · Editorial systems",
    problem:
      "Contemporary Telugu writing lives scattered across notes apps, status updates and closed groups. There is no place built for it to be read properly, credited properly, or found again later.",
    idea: "An intimate cultural archive that behaves like a living publication — writers keep authorship, readers get discovery, and the language keeps its own room on the internet.",
    tools: ["Editorial systems", "Community design", "Typography", "Content strategy"],
    outcome: "Platform concept · Editorial model defined",
    image: sahitya,
    disciplines: ["writing", "creative", "cinema"],
    motion: { lift: 0.1, tilt: 2.8, size: 0.97, speed: 0.19, phase: 1.4 },
  },
  {
    n: "03",
    slug: "kalakshetra",
    title: "Kalakshetra",
    label: "Music Ecosystem",
    editorialTag: "#MUSIC/ECOSYSTEM",
    caseNumber: "CASE 03",
    positioning: "A Platform for Bands, Venues & Music Culture",
    axes: "Bands × Venues × Events × Production",
    role: "Ecosystem design · Strategy · Research",
    problem:
      "Independent music scenes are connected socially but not structurally. Bands, venues, sound engineers and audiences all find each other by accident.",
    idea: "A shared stage — one map of who plays, where they play, who makes it happen, and how a local scene turns into a working economy.",
    tools: ["Product thinking", "Field research", "Marketplace design", "Brand"],
    outcome: "Exploration · Scene mapping underway",
    image: kalakshetra,
    disciplines: ["creative", "cinema", "impact"],
    motion: { lift: 0.16, tilt: -1.6, size: 0.99, speed: 0.25, phase: 2.9 },
  },
  {
    n: "04",
    slug: "ott-vs-theatre",
    title: "OTT vs Theatre",
    label: "Entertainment Analytics",
    editorialTag: "#ENTERTAINMENT/ANALYTICS",
    caseNumber: "CASE 04",
    positioning: "Content, Audience & Revenue Intelligence",
    axes: "Cinema × Audience × Business Analytics",
    role: "Research · Analytics · Model design",
    problem:
      "The streaming-versus-theatre argument is fought with opinions and box office headlines. There is no common evidence layer underneath it.",
    idea: "A decision system that maps real audience behaviour to release economics — window length, genre, star weight, city tier — so a release strategy can be argued with numbers.",
    tools: ["Data visualisation", "Revenue modelling", "Audience research", "Python"],
    outcome: "Research study · Dataset assembled",
    image: ott,
    disciplines: ["cinema", "analytics", "impact"],
    motion: { lift: -0.02, tilt: 2.2, size: 1, speed: 0.21, phase: 4.1 },
  },
  {
    n: "05",
    slug: "business-city",
    title: "Business City",
    label: "Future City",
    editorialTag: "#FUTURE/CITY",
    caseNumber: "CASE 05",
    positioning: "Ideas for a Smarter Visakhapatnam",
    axes: "Vizag × Infrastructure × Economy × People",
    role: "Systems thinking · Narrative · Urban research",
    problem:
      "City development is usually told as a series of infrastructure announcements. The line between a new road, a new industry and an ordinary person's week is never actually drawn.",
    idea: "A living model of Vizag — people, economy, coastline and opportunity held in one frame, so the next decade can be discussed as a system rather than a slogan.",
    tools: ["Urban data", "Story mapping", "Economic research", "Scenario design"],
    outcome: "Vision concept · Research phase",
    image: city,
    disciplines: ["impact", "analytics", "creative"],
    motion: { lift: 0.08, tilt: -2.9, size: 0.98, speed: 0.17, phase: 5.6 },
  },
  {
    n: "06",
    slug: "hiremap",
    title: "Hiremap",
    label: "Career Intelligence",
    editorialTag: "#CAREER/INTELLIGENCE",
    caseNumber: "CASE 06",
    positioning: "Jobs. Skills. Roadmaps. All in One Place.",
    axes: "Jobs × Skills × Roadmaps × Opportunities",
    role: "Product · Information design · Recommendation logic",
    problem:
      "Career advice hands people lists — of jobs, of courses, of skills. Almost nobody is handed the path between where they are and where they want to be.",
    idea: "A visual map from current skills to credible next moves, where every step is a real, reachable decision instead of a generic aspiration.",
    tools: ["React", "Recommendation logic", "Information design", "Skills taxonomy"],
    outcome: "Product concept · Prototype in build",
    image: hiremap,
    disciplines: ["tech", "impact", "analytics"],
    motion: { lift: -0.12, tilt: 1.9, size: 1.01, speed: 0.23, phase: 7 },
  },
];

/** Headline statements for the kinetic hero type, as `[lead, accent]`. */
export const STATEMENTS: ReadonlyArray<readonly [string, string]> = [
  ["Creativity to", "Conversations"],
  ["Data to", "Insights"],
  ["Stories to", "Culture"],
  ["Ideas to", "Impact"],
  ["Cinema to", "Connections"],
  ["Technology to", "Possibilities"],
];

export const DISCIPLINES: ReadonlyArray<{
  id: Discipline;
  title: string;
  caption: string;
}> = [
  { id: "cinema", title: "Cinema", caption: "Stories that move people" },
  { id: "writing", title: "Writing", caption: "Words that stay" },
  { id: "analytics", title: "Analytics", caption: "Insights that matter" },
  { id: "tech", title: "Tech", caption: "Tools that build" },
  { id: "creative", title: "Creative", caption: "Ideas that connect" },
  { id: "impact", title: "Impact", caption: "A better tomorrow" },
];

export const CONTACT = {
  email: "sriharibeesetti@gmail.com",
  linkedin: "https://www.linkedin.com/in/sriharibeesetti",
  github: "https://github.com/sriharibeesetti",
  instagram: "https://www.instagram.com/sriharibeesetti",
} as const;

/** Safe modular access — ring indices are free to run past either end. */
export function projectAt(index: number): Project {
  const list = PROJECTS;
  const i = ((index % list.length) + list.length) % list.length;
  return list[i] as Project;
}

export function statementAt(index: number): readonly [string, string] {
  const list = STATEMENTS;
  const i = ((index % list.length) + list.length) % list.length;
  return list[i] as readonly [string, string];
}
