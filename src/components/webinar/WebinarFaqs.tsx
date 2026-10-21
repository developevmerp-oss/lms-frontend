"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type WebinarFaq = {
  q: string;
  a: string;
};

export default function WebinarFaqs({ faqs }: { faqs: WebinarFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);

  const [outerHeight, setOuterHeight] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Recalculate outer container height based on questions list scrollable height
  const updateDimensions = useCallback(() => {
    if (!listRef.current || !contentInnerRef.current) return;
    const list = listRef.current;
    const content = contentInnerRef.current;
    const maxScroll = Math.max(0, content.offsetHeight - list.clientHeight);

    // Outer height = window viewport height + scrollable overflow distance
    // 1px page scroll = 1px question scroll (1:1 natural speed)
    const windowH = window.innerHeight;
    const totalTrackHeight = maxScroll > 0 ? windowH + maxScroll : windowH;
    setOuterHeight(totalTrackHeight);
  }, []);

  // Update list scroll position based on window scroll progress through the outer container
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !listRef.current || !contentInnerRef.current) return;
    const container = containerRef.current;
    const list = listRef.current;
    const content = contentInnerRef.current;

    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalScroll = container.offsetHeight - windowH;
    const maxScroll = Math.max(0, content.offsetHeight - list.clientHeight);

    if (totalScroll <= 0 || maxScroll <= 0) {
      list.scrollTop = 0;
      setScrollProgress(0);
      return;
    }

    // When the top of container passes top of viewport, scroll is within [0, totalScroll]
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / totalScroll));

    list.scrollTop = progress * maxScroll;
    setScrollProgress(progress);
  }, []);

  // ResizeObserver to watch for accordion toggle expansion and window resize
  useEffect(() => {
    updateDimensions();
    handleScroll();

    let resizeObserver: ResizeObserver | null = null;
    if (contentInnerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
        handleScroll();
      });
      resizeObserver.observe(contentInnerRef.current);
    }

    if (listRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver?.observe(listRef.current);
    }

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", () => {
      updateDimensions();
      onScrollOrResize();
    }, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, [updateDimensions, handleScroll]);

  // Recalculate dimensions whenever an accordion item is toggled
  useEffect(() => {
    // Check height immediately and also after CSS max-height transition finishes
    updateDimensions();
    handleScroll();
    const timer = setTimeout(() => {
      updateDimensions();
      handleScroll();
    }, 460);
    return () => clearTimeout(timer);
  }, [open, updateDimensions, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="faq-sticky-container relative w-full"
      style={{
        height: outerHeight ? `${outerHeight}px` : "220vh",
      }}
    >
      <section className="faq-sec faq-sec-sticky sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-start">
        <img
          src="/images/webinar/faq-bg.jpg"
          alt=""
          className="faq-bg absolute inset-0 h-full w-full object-cover pointer-events-none select-none opacity-40 sm:opacity-90"
        />

        <div className="nav-width faq-wrap relative z-10 flex flex-col h-full max-h-screen pt-5 pb-20 sm:pt-8 sm:pb-24">
          <div className="faq-head shrink-0 mb-3 sm:mb-5">
            <p className="faq-eyebrow">QUESTIONS</p>
            <h2>Frequently asked</h2>
          </div>

          {/* Scrollable questions container pinned inside the h-screen sticky viewport */}
          <div className="relative flex-1 min-h-0 w-full max-w-[760px] mx-auto">
            <div
              ref={listRef}
              className="faq-list flex-1 min-h-0 h-full w-full overflow-y-hidden pr-2 sm:pr-3 relative"
              tabIndex={0}
              aria-label="Frequently Asked Questions"
              style={{
                touchAction: "pan-y",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 20px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 20px), transparent 100%)",
              }}
            >
              <div ref={contentInnerRef} className="flex flex-col gap-3 py-3">
                {faqs.map((faq, idx) => {
                  const expanded = open === idx;
                  return (
                    <article
                      key={faq.q}
                      className={expanded ? "faq-item is-open" : "faq-item"}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setOpen(expanded ? null : idx)}
                        onFocus={(e) => {
                          e.currentTarget.scrollIntoView({
                            block: "nearest",
                            behavior: "smooth",
                          });
                        }}
                      >
                        <span>{faq.q}</span>
                        <span className="faq-toggle" aria-hidden="true">
                          <svg viewBox="0 0 16 16">
                            <path d="M3.2 8h9.6" />
                            <path className="faq-plus-stem" d="M8 3.2v9.6" />
                          </svg>
                        </span>
                      </button>
                      <div className="faq-answer">
                        <div>
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Subtle custom vertical scroll track indicator */}
            {/* <div
              className="absolute right-0 top-3 bottom-3 w-1 rounded-full bg-stone-300/40 pointer-events-none hidden sm:block"
              aria-hidden="true"
            >
              <div
                className="w-full rounded-full bg-orange-500/80 transition-transform duration-75 ease-out shadow-xs"
                style={{
                  height: "28%",
                  transform: `translateY(${scrollProgress * 255}%)`,
                }}
              />
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
