"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** Label for the items, e.g. "students", "transactions" */
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  itemLabel = "items",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build smart page window: always show first, last, current ±1, and ellipses
  const buildPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pages = buildPages();

  const btn =
    "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed";
  const activeCls = "bg-orange-500 text-white shadow shadow-orange-500/30";
  const inactiveCls = "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-1 ${className}`}>
      {/* Count info */}
      <p className="text-xs text-slate-500 whitespace-nowrap">
        Showing{" "}
        <span className="text-slate-300 font-bold">{from}–{to}</span>{" "}
        of{" "}
        <span className="text-slate-300 font-bold">{total}</span>{" "}
        {itemLabel}
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          className={`${btn} ${inactiveCls}`}
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Prev */}
        <button
          className={`${btn} ${inactiveCls}`}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-8 text-center text-xs text-slate-600">
              ···
            </span>
          ) : (
            <button
              key={p}
              className={`${btn} ${p === page ? activeCls : inactiveCls}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={`${btn} ${inactiveCls}`}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last */}
        <button
          className={`${btn} ${inactiveCls}`}
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
