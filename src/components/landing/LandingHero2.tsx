"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/#real-transformations", label: "Work" },
  { href: "/#mentor", label: "About" },
  { href: "/#curriculum", label: "Classes" },
];

const MENU_LINKS = [
  { href: "/#problem", label: "The Journey" },
  { href: "/#mentor", label: "Meet Mentor" },
  { href: "/#path", label: "The Path" },
  { href: "/#curriculum", label: "What You'll Learn" },
  { href: "/#dimensions", label: "6 Dimensions" },
  { href: "/#community", label: "Community" },
  { href: "/#membership", label: "Memberships" },
  { href: "/#real-transformations", label: "Artworks" },
];

function organizeDesktop() {
  const line1 = document.querySelector<HTMLElement>(".lh2-title .line");
  const line2 = document.querySelector<HTMLElement>(".lh2-title .line-2");
  const lead = document.querySelector<HTMLElement>(".lh2-lead");
  const note = document.querySelector<HTMLElement>(".lh2-note-a");
  if (!line1 || !line2 || !lead || !note) return;

  const desktop = window.innerWidth > 860;
  if (!desktop) {
    line2.style.paddingLeft = "";
    lead.style.top = "";
    lead.style.width = "";
    note.style.left = "";
    note.style.top = "";
    note.style.right = "";
    return;
  }

  const leadW = Math.min(228, Math.max(176, window.innerWidth * 0.145));
  lead.style.width = `${leadW}px`;
  const top = line2.offsetTop + Math.max(0, (line2.offsetHeight - lead.offsetHeight) / 2);
  lead.style.top = `${top}px`;
  line2.style.paddingLeft = `${leadW + 26}px`;
  note.style.right = "auto";
  note.style.left = `${line1.offsetLeft + line1.offsetWidth + 36}px`;
  note.style.top = `${line1.offsetTop + 6}px`;
}

export default function LandingHero2() {
  const sinkRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enter = window.setTimeout(() => setEntered(true), reduce ? 0 : 40);

    let frame = 0;
    const tick = () => {
      const height = window.innerHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / (height * 0.92), 0), 1);
      const nav = document.querySelector(".site-navbar");
      const drop = reduce ? 0 : progress * Math.min(height * 0.2, 190);

      if (!reduce && sinkRef.current) {
        sinkRef.current.style.transform = `translate3d(0, ${drop.toFixed(2)}px, 0)`;
      }
      if (!reduce && bgRef.current) {
        bgRef.current.style.transform = `scale(${(1 + progress * 0.07).toFixed(4)})`;
      }
      if (barRef.current) {
        if (reduce) {
          barRef.current.style.transform = "";
          barRef.current.style.opacity = "";
          barRef.current.style.pointerEvents = "";
        } else {
          const hide = Math.min(window.scrollY / 220, 1);
          const lift = hide * (barRef.current.offsetHeight + 18);
          barRef.current.style.transform = `translate3d(0, ${(-(lift + drop)).toFixed(2)}px, 0)`;
          barRef.current.style.opacity = (1 - hide).toFixed(3);
          barRef.current.style.pointerEvents = hide > 0.85 ? "none" : "";
        }
      }
      organizeDesktop();
      nav?.classList.toggle("lh2-nav-show", window.scrollY > height * 0.82);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      organizeDesktop();
      onScroll();
    };

    tick();
    organizeDesktop();
    const settle = window.setTimeout(organizeDesktop, 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.querySelector(".site-navbar")?.classList.remove("lh2-nav-show");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const scrollNext = () => {
    document.getElementById("problem")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        .landing-page:has(.lh2) > .site-navbar {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 70;
          visibility: hidden;
          pointer-events: none;
        }
        .landing-page:has(.lh2) > .site-navbar.lh2-nav-show {
          visibility: visible;
          pointer-events: auto;
        }

        .lh2 {
          position: sticky;
          top: 0;
          z-index: 1;
          height: 100dvh;
          min-height: 640px;
          width: 100%;
          overflow: hidden;
          background: #14110f;
          color: #f6f1e8;
        }

        .lh2-bg {
          position: absolute;
          inset: -4%;
          transform-origin: center 42%;
          will-change: transform;
        }
        .lh2-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 62% 42%;
          display: block;
        }
        .lh2-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(18,14,12,0.55) 0%, rgba(18,14,12,0.08) 24%, rgba(18,14,12,0.02) 48%, rgba(18,14,12,0.28) 78%, rgba(18,14,12,0.55) 100%),
            linear-gradient(90deg, rgba(16,13,11,0.62) 0%, rgba(16,13,11,0.22) 38%, rgba(16,13,11,0.05) 62%, rgba(16,13,11,0.12) 100%);
          pointer-events: none;
        }

        .lh2-sink {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: clamp(1.15rem, 2.2vw, 1.8rem) clamp(1.15rem, 3.4vw, 3.4rem) clamp(1rem, 2vw, 1.5rem);
          will-change: transform;
        }

        .lh2-bar,
        .lh2-title,
        .lh2-lead,
        .lh2-note-a,
        .lh2-note-b,
        .lh2-actions,
        .lh2-scroll {
          opacity: 0;
          transform: translateY(26px);
        }
        .lh2.is-in .lh2-bar,
        .lh2.is-in .lh2-title,
        .lh2.is-in .lh2-lead,
        .lh2.is-in .lh2-note-a,
        .lh2.is-in .lh2-note-b,
        .lh2.is-in .lh2-actions,
        .lh2.is-in .lh2-scroll {
          animation: lh2-rise 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .lh2.is-in .lh2-bar { animation-delay: 0.02s; }
        .lh2.is-in .lh2-title { animation-delay: 0.12s; }
        .lh2.is-in .lh2-note-a { animation-delay: 0.28s; }
        .lh2.is-in .lh2-lead { animation-delay: 0.34s; }
        .lh2.is-in .lh2-note-b { animation-delay: 0.42s; }
        .lh2.is-in .lh2-actions { animation-delay: 0.48s; }
        .lh2.is-in .lh2-scroll { animation-delay: 0.62s; }

        @keyframes lh2-rise {
          to { opacity: 1; transform: translateY(0); }
        }

        .lh2-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .lh2-brand {
          color: inherit;
          text-decoration: none;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }
        .lh2-brand strong {
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.28em;
        }
        .lh2-brand span {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-top: 0.28rem;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.28em;
        }
        .lh2-brand i {
          display: block;
          width: 2.6rem;
          height: 1px;
          background: rgba(246, 241, 232, 0.85);
        }

        .lh2-nav,
        .lh2-links {
          display: flex;
          align-items: center;
          gap: clamp(1rem, 2vw, 2.1rem);
        }
        .lh2-nav a {
          color: #f6f1e8;
          text-decoration: none;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.72rem;
          font-weight: 650;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .lh2-nav a:hover { opacity: 0.72; }
        .lh2-nav .lh2-btn-fill,
        .lh2-nav .lh2-btn-fill:hover {
          color: #1c1714;
          opacity: 1;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
        }
        .lh2-signin { opacity: 0.9; }
        .lh2-links,
        .lh2-signin { display: none; }

        .lh2-menu-btn {
          display: inline-flex;
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid rgba(246,241,232,0.45);
          background: transparent;
          color: #f6f1e8;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .lh2-stage {
          position: relative;
          flex: 1;
          min-height: 0;
        }

        .lh2-bar-wrap {
          position: relative;
          z-index: 4;
          will-change: transform;
        }

        .lh2-copy {
          position: absolute;
          left: 0;
          top: 3%;
          width: min(100%, 72rem);
        }

        .landing-page .lh2 h1.lh2-title {
          position: relative;
          left: auto;
          top: auto;
          margin: 0;
          max-width: none;
          font-family: Bahnschrift, "Arial Narrow", "Segoe UI", Impact, sans-serif;
          font-stretch: condensed;
          font-size: clamp(4.05rem, 7.15vw, 7.35rem);
          font-weight: 600;
          letter-spacing: 0.012em;
          line-height: 0.84;
          text-transform: uppercase;
          color: #f4efe6;
        }
        .lh2-title .line {
          display: block;
        }
        .lh2-title .line-2 {
          padding-left: 14.8rem;
        }

        .landing-page .lh2 .lh2-lead {
          position: absolute;
          left: 0;
          top: 34%;
          width: 13.2rem;
          margin: 0;
          color: rgba(246, 241, 232, 0.92);
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.98rem;
          font-weight: 550;
          line-height: 1.38;
          letter-spacing: 0;
          text-transform: none;
        }

        .lh2-note {
          border: 1px solid rgba(246, 241, 232, 0.62);
          padding: 0.85rem 0.9rem 0.72rem;
          width: max-content;
          max-width: 11.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          line-height: 1.35;
          text-transform: uppercase;
          color: #f6f1e8;
          background: rgba(20, 16, 14, 0.08);
        }
        .lh2-note b {
          font-weight: 700;
        }
        .lh2-note i {
          display: block;
          width: 1.7rem;
          height: 1px;
          margin-top: 0.5rem;
          background: rgba(246, 241, 232, 0.85);
        }
        .lh2-note-a {
          position: absolute;
          right: 24%;
          top: 6%;
        }
        .lh2-note-b {
          position: absolute;
          right: 0;
          bottom: 16%;
        }

        .lh2-actions {
          position: absolute;
          left: 0;
          bottom: 9%;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .lh2-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          min-height: 2.85rem;
          padding: 0.75rem 1.05rem;
          border-radius: 3px;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.7rem;
          font-weight: 750;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .lh2-btn:hover { transform: translateY(-2px); }
        .lh2-btn-fill {
          background: #f3eee4;
          color: #1c1714;
          border: 1px solid #f3eee4;
        }
        .lh2-btn-fill:hover { background: #fffaf3; }
        .lh2-btn-ghost {
          background: transparent;
          color: #f6f1e8;
          border: 1px solid rgba(246, 241, 232, 0.78);
        }
        .lh2-btn-ghost:hover { background: rgba(246, 241, 232, 0.1); }
        .lh2-btn-nav {
          min-height: 2.45rem;
          padding: 0.62rem 0.9rem;
          letter-spacing: 0.12em;
        }

        .lh2-scroll {
          align-self: center;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          margin-top: 0.2rem;
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(246, 241, 232, 0.82);
          cursor: pointer;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .lh2-scroll i {
          display: block;
          width: 1px;
          height: 2.1rem;
          margin-left: -0.11em;
          background: rgba(246, 241, 232, 0.75);
        }

        .lh2-drawer {
          position: absolute;
          top: 4.6rem;
          right: clamp(1.15rem, 3.4vw, 3.4rem);
          z-index: 5;
          width: min(19rem, calc(100% - 2.4rem));
          padding: 0.4rem;
          background: rgba(22, 18, 16, 0.92);
          border: 1px solid rgba(246, 241, 232, 0.2);
          backdrop-filter: blur(10px);
        }
        .lh2-drawer a {
          display: block;
          padding: 0.72rem 0.8rem;
          color: #f6f1e8;
          text-decoration: none;
          font-family: var(--font-landing), "Nunito Sans", sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .lh2-drawer a:hover { background: rgba(246, 241, 232, 0.08); }

        .lh2-sheet {
          position: relative;
          z-index: 2;
          background: #ffffff;
          border-radius: 1.75rem 1.75rem 0 0;
          box-shadow: 0 -28px 70px rgba(0, 0, 0, 0.38);
          overflow: clip;
        }

        @media (min-width: 861px) {
          .lh2-copy {
            top: 42%;
            width: 100%;
            transform: translateY(-48%);
          }
          .lh2-title .line {
            width: max-content;
            max-width: 100%;
          }
          .landing-page .lh2 h1.lh2-title {
            font-family: Bahnschrift, "Segoe UI", Arial, sans-serif;
            font-stretch: 100%;
            font-size: clamp(3.15rem, 7.7vw, 6rem);
            font-weight: 600;
            letter-spacing: -0.02em;
            line-height: 0.95;
          }
          .lh2-title .line-2 { padding-left: 16rem; }
          .landing-page .lh2 .lh2-lead {
            width: 14.2rem;
            font-size: 1.02rem;
            line-height: 1.35;
          }
          .lh2-note-a {
            left: 46%;
            right: auto;
            top: 0;
          }
          .lh2-note-b {
            right: 0.4rem;
            bottom: 11%;
          }
          .lh2-actions { bottom: 6%; }
        }

        @media (min-width: 861px) and (max-width: 1180px) {
          .landing-page .lh2 h1.lh2-title { font-size: clamp(1.15rem, 4.1vw, 1.3rem); }
          .lh2-title .line-2 { padding-left: 14rem; }
          .landing-page .lh2 .lh2-lead { width: 12.4rem; }
        }

        @media (max-width: 860px) {
          .lh2 { min-height: 100dvh; }
          .lh2-bg img { object-position: 74% 22%; }
          .lh2-shade {
            background:
              linear-gradient(180deg, rgba(16,13,11,0.62) 0%, rgba(16,13,11,0.18) 22%, rgba(16,13,11,0.18) 42%, rgba(16,13,11,0.72) 100%);
          }
          .lh2-links, .lh2-signin { display: none; }
          .lh2-menu-btn { display: inline-flex; }
          .lh2-sink { padding: 1rem 1.1rem 0.9rem; }
          .lh2-stage {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 0.9rem;
            padding-bottom: 0.4rem;
          }
          .landing-page .lh2 .lh2-copy,
          .landing-page .lh2 h1.lh2-title,
          .landing-page .lh2 .lh2-lead,
          .lh2-note-a,
          .lh2-note-b,
          .lh2-actions {
            position: static;
            top: auto;
            right: auto;
            left: auto;
          }
          .landing-page .lh2 h1.lh2-title {
            max-width: none;
            font-size: clamp(2.65rem, 12.4vw, 3.7rem);
            line-height: 0.88;
          }
          .lh2-title .line-2 { padding-left: 0.8rem; }
          .landing-page .lh2 .lh2-copy { width: auto; top: auto; }
          .landing-page .lh2 .lh2-lead {
            width: min(18.5rem, 100%);
            font-size: 0.95rem;
            margin: 0.15rem 0 0;
          }
          .lh2-note { max-width: none; }
          .lh2-actions { bottom: auto; }
          .lh2-btn { flex: 1 1 12rem; }
          .lh2-note-b { align-self: flex-end; }
          .lh2-scroll { display: none; }
        }

        @media (max-width: 480px) {
          .lh2-brand strong, .lh2-brand span { letter-spacing: 0.18em; font-size: 0.68rem; }
          .lh2-btn-nav span { display: none; }
          .lh2-btn-nav::after { content: "Join"; letter-spacing: 0.14em; }
          .landing-page .lh2 h1.lh2-title { font-size: clamp(2.45rem, 12vw, 3.15rem); }
          .lh2-actions { width: 100%; }
          .lh2-btn { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lh2-bar, .lh2-title, .lh2-lead, .lh2-note-a, .lh2-note-b, .lh2-actions, .lh2-scroll {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .lh2-sink, .lh2-bg { transform: none !important; }
        }
      `}</style>

      <section className={`lh2${entered ? " is-in" : ""}`} aria-label="Ravishing Art">
        <div className="lh2-bg" ref={bgRef}>
          <img src="/images/hero/hero-studio-bg.jpg" alt="" fetchPriority="high" />
          <div className="lh2-shade" />
        </div>

        <div className="lh2-sink" ref={sinkRef}>
          <div className="lh2-bar-wrap" ref={barRef}>
            <header className="lh2-bar">
              <Link href="/" className="lh2-brand" aria-label="Ravishing Art home">
                <strong>RAVISHING</strong>
                <span>
                  ART
                  <i />
                </span>
              </Link>

              <div className="lh2-nav">
                <nav className="lh2-links" aria-label="Primary">
                  {NAV.map((item) => (
                    <a key={item.href} href={item.href}>
                      {item.label}
                    </a>
                  ))}
                </nav>
                <Link href="/login" className="lh2-signin">
                  Sign In
                </Link>
                <Link href="/webinar" className="lh2-btn lh2-btn-fill lh2-btn-nav">
                  <span>Join Free Masterclass</span>
                </Link>
                <button
                  type="button"
                  className="lh2-menu-btn"
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </header>

            {menuOpen && (
              <div className="lh2-drawer">
                {MENU_LINKS.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </a>
                ))}
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/webinar" onClick={() => setMenuOpen(false)}>
                  Free Masterclass
                </Link>
              </div>
            )}
          </div>

          <div className="lh2-stage">
            <div className="lh2-copy">
              <h1 className="lh2-title">
                <span className="line">Turn Your Resin Art Passion</span>
                <span className="line line-2"> Into Skill, Identity</span>
                <span className="line">&amp; Financial Freedom</span>
              </h1>

              <p className="lh2-lead">
                Turn your creativity into meaningful skills, unique art and real opportunities.
              </p>

              <aside className="lh2-note lh2-note-a">
                <b>Art Classes</b>
                <b>For a Brighter</b>
                <b>Tomorrow</b>
                <i />
              </aside>
            </div>

            <aside className="lh2-note lh2-note-b">
              <b>Real Art</b>
              <b>Real Skills</b>
              <b>Real Growth</b>
              <i />
            </aside>

            <div className="lh2-actions">
              <Link href="/webinar" className="lh2-btn lh2-btn-fill">
                Join Free Masterclass
                <ArrowRight size={15} />
              </Link>
              <a href="/#real-transformations" className="lh2-btn lh2-btn-ghost">
                Explore Artworks
              </a>
            </div>
          </div>

          <button type="button" className="lh2-scroll" onClick={scrollNext}>
            Scroll
            <i />
          </button>
        </div>
      </section>
    </>
  );
}
