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
      return;
    }

    // When the top of container passes top of viewport, scroll is within [0, totalScroll]
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / totalScroll));

    list.scrollTop = progress * maxScroll;
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
    window.addEventListener(
      "resize",
      () => {
        updateDimensions();
        onScrollOrResize();
      },
      { passive: true }
    );

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, [updateDimensions, handleScroll]);

  // Recalculate dimensions whenever an accordion item is toggled
  useEffect(() => {
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
        backgroundColor: "#ffffff",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-start bg-[#f7f6f0] rounded-t-[32px] sm:rounded-t-[40px] lg:rounded-t-[48px] border-t border-[#F4E9DF]/80 shadow-[0_-12px_32px_rgba(41,37,34,0.04)]">
        {/* DESKTOP FULL-HEIGHT LEFT ARTWORK: Full height from top to bottom of section */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[44%] xl:w-[46%] h-full overflow-hidden select-none pointer-events-none z-0">
          <img
            src="/images/webinar/faq-art-desktop.png"
            alt="Resin Art Masterclass FAQs"
            className="w-full h-full object-cover object-left-top select-none"
          />
        </div>

        {/* MOBILE TOP BANNER: Half image on top with rounded top edge and subtle blur fade (< lg) */}
        <div className="lg:hidden relative w-full h-[28vh] min-h-[175px] max-h-[235px] shrink-0 overflow-hidden select-none pointer-events-none rounded-t-[32px] sm:rounded-t-[40px]">
          <img
            src="/images/webinar/faq-art-mobile.png"
            alt="Resin Art Masterclass FAQs"
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle blur overlay and soft gradient fade into the content below */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f6f0] via-[#f7f6f0]/85 to-transparent backdrop-blur-[2px]" />
        </div>

        {/* MAIN RESPONSIVE CONTAINER */}
        <div className="relative z-10 flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col lg:grid lg:grid-cols-12 lg:items-center h-full">
          {/* Spacer column on desktop where full-height left art is positioned */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full pointer-events-none" />

          {/* RIGHT / MAIN CONTENT COLUMN: Header + Scrollable Accordion List */}
          <div className="flex-1 min-h-0 w-full lg:col-span-7 xl:col-span-7 h-full max-h-[92vh] flex flex-col justify-center py-2 lg:py-6 lg:pl-6 xl:pl-10">
            {/* FAQ HEADER */}
            <div className="shrink-0 mb-3 sm:mb-4 lg:mb-5">
              {/* Mobile FAQ Badge */}
              <div className="lg:hidden mb-1.5">
                <span className="inline-block text-sm sm:text-base md:text-base lg:text-sm font-semibold uppercase tracking-[0.18em] text-[#942008]">
                  FAQ
                </span>
              </div>

              {/* Desktop Eyebrow */}
              <p className="hidden lg:block text-xs sm:text-base lg:text-sm font-semibold uppercase tracking-[0.18em] text-[#942008] mb-2 sm:mb-2.5">
                HAVE QUESTIONS?
              </p>

              {/* Title with two-tone styling matching Reference Image 2 */}
              <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-neutral-950 leading-[1.15]">
                Frequently Asked <span className="text-[#942008]">Questions</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-xl lg:text-lg font-normal text-neutral-600 leading-relaxed mt-2 max-w-xl">
                Everything you need to know about the masterclass, materials, access and support.
              </p>
            </div>

            {/* SCROLLABLE QUESTIONS LIST PINNED INSIDE THE VIEWPORT */}
            <div className="relative flex-1 min-h-0 w-full">
              <div
                ref={listRef}
                className="faq-scroll-list flex-1 min-h-0 h-full w-full overflow-y-hidden pr-1.5 sm:pr-3 relative"
                tabIndex={0}
                aria-label="Frequently Asked Questions"
                style={{
                  touchAction: "pan-y",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 14px, black calc(100% - 20px), transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 14px, black calc(100% - 20px), transparent 100%)",
                }}
              >
                <div ref={contentInnerRef} className="flex flex-col gap-2.5 sm:gap-3 py-2 sm:py-3">
                  {faqs.map((faq, idx) => {
                    const expanded = open === idx;
                    return (
                      <article
                        key={faq.q}
                        className={`transition-all duration-300 rounded-2xl border ${expanded
                          ? "bg-[#FFF6F2] border-[#E86A24]/35 shadow-[0_8px_24px_-8px_rgba(232,106,36,0.12)]"
                          : "bg-white border-[#F4E9DF]/80 shadow-[0_4px_16px_-6px_rgba(41,37,34,0.06)] hover:border-[#E86A24]/30 hover:shadow-md"
                          }`}
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
                          className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left cursor-pointer group select-none"
                        >
                          <span className="font-bold text-sm sm:text-xl lg:text-base text-neutral-900 group-hover:text-[#942008] transition-colors leading-snug">
                            {faq.q}
                          </span>
                          <span
                            className={`inline-flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center shrink-0 transition-all duration-300 ${expanded
                              ? "bg-[#F0DDD1] text-[#B94F1B] rotate-180"
                              : "bg-[#F5F2EE] text-[#77716C] group-hover:bg-[#F4E9DF] group-hover:text-[#B94F1B]"
                              }`}
                            aria-hidden="true"
                          >
                            <svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-current stroke-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3.5 8h9" strokeLinecap="round" />
                              <path
                                d="M8 3.5v9"
                                strokeLinecap="round"
                                className={`transition-all duration-300 origin-center ${expanded ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
                                  }}`}
                              />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <p className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-sm sm:text-lg lg:text-base leading-relaxed text-neutral-600">
                            {faq.a}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}