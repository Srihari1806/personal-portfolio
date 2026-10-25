import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Header } from "@/components/site/Header";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Srihari Beesetti — Ideas to Impact" },
      {
        name: "description",
        content:
          "The portfolio of Srihari Beesetti — an engineer and creative strategist working where cinema, storytelling, data and technology meet.",
      },
      { property: "og:title", content: "Srihari Beesetti — Ideas to Impact" },
      {
        property: "og:description",
        content: "Cinema × Data × Creative × Impact. Six multidisciplinary projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const root = useRef<HTMLDivElement | null>(null);
  useReveal(root);

  return (
    <div className="portfolio" ref={root}>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
      </main>
      <Contact />
    </div>
  );
}
