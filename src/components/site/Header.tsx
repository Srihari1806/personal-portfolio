import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CONTACT } from "@/data/portfolio";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export function Header() {
  const [active, setActive] = useState<string>("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Synchronize Dark Mode to HTML element & localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Synchronize Header Collapsed state to HTML & body elements
  useEffect(() => {
    document.documentElement.classList.toggle("header--collapsed", isCollapsed);
    document.body.classList.toggle("header--collapsed", isCollapsed);
    return () => {
      document.documentElement.classList.remove("header--collapsed");
      document.body.classList.remove("header--collapsed");
    };
  }, [isCollapsed]);

  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Work and Contact are dark/red grounds; everything else is paper.
  const tone = active === "work" || active === "contact" ? "dark" : "light";

  return (
    <>
      <header
        className={`header ${isCollapsed ? "is-collapsed" : ""}`}
        data-tone={tone}
      >
        <div className="header__brand-cluster">
          <a className="brand" href="#home">
            <span className="brand__mark" aria-hidden="true">
              SB
            </span>
            <span className="brand__text">
              <strong>Srihari Beesetti</strong>
              <small>Cinema × Data × Creative × Impact</small>
            </span>
          </a>
          <span className="header__location" aria-label="Based in Visakhapatnam, India">
            <span className="header__location-dot" aria-hidden="true" />
            VISAKHAPATNAM, IN
          </span>
        </div>

        <nav className="header__nav" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? "is-active" : undefined}
              aria-current={active === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__end">
          <span className="header__social">
            <a href={`mailto:${CONTACT.email}`} aria-label="Email Srihari">
              <Mail aria-hidden="true" />
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin aria-hidden="true" />
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram aria-hidden="true" />
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github aria-hidden="true" />
            </a>
          </span>

          <a className="pill" href="#contact">
            Let’s talk <ArrowUpRight aria-hidden="true" />
          </a>

          {/* Dark Mode Switch Option */}
          <button
            type="button"
            className="header__control-btn header__theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
          </button>

          {/* Collapse Header Icon (frees up vertical space for title text) */}
          <button
            type="button"
            className="header__control-btn header__collapse-btn"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse header for more view space"
            title="Collapse header"
          >
            <ChevronUp size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Floating Controls when Header is Collapsed */}
      {isCollapsed ? (
        <aside className="header__floating-bar" aria-label="Header quick controls">
          {/* Dark Mode Switch Option */}
          <button
            type="button"
            className="header__control-btn header__theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
          </button>

          {/* Expand Header Button beside the Dark Mode switch */}
          <button
            type="button"
            className="header__control-btn header__expand-btn"
            onClick={() => setIsCollapsed(false)}
            aria-label="Show full header"
            title="Show header"
          >
            <ChevronDown size={14} aria-hidden="true" />
            <span className="header__expand-label">Header</span>
          </button>
        </aside>
      ) : null}
    </>
  );
}

