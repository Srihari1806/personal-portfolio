import { ArrowUpRight } from "lucide-react";

import { CONTACT } from "@/data/portfolio";

const CHANNELS = [
  { label: "LinkedIn", href: CONTACT.linkedin },
  { label: "GitHub", href: CONTACT.github },
  { label: "Instagram", href: CONTACT.instagram },
];

export function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="contact__kicker" data-reveal>
        <span className="contact__kicker-dot" />
        <span>HAVE AN IDEA WORTH TURNING INTO IMPACT?</span>
      </div>

      <a className="contact__name" href={`mailto:${CONTACT.email}`}>
        <span>LET’S</span>
        <span>TALK</span>
      </a>

      <a className="contact__mail" href={`mailto:${CONTACT.email}`}>
        <span>{CONTACT.email}</span>
        <ArrowUpRight aria-hidden="true" />
      </a>

      <nav className="contact__channels" aria-label="Elsewhere">
        {CHANNELS.map((channel) => (
          <a key={channel.label} href={channel.href} target="_blank" rel="noreferrer">
            <span className="contact__bracket">[</span>
            <span>{channel.label}</span>
            <span className="contact__bracket">]</span>
          </a>
        ))}
      </nav>

      <div className="contact__foot">
        <small>SRIHARI BEESETTI © 2026 — CINEMA × DATA × IMPACT</small>
        <small>VISAKHAPATNAM, INDIA · ALL RIGHTS RESERVED</small>
      </div>
    </footer>
  );
}
