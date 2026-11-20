"use client";
import React from "react";

// --- Base Shimmer / Pulse ----------------------------------------------------
export const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`shimmer-box rounded-xl ${className}`} />
);

export const Pulse = Shimmer;

// --- Page Header Skeleton ----------------------------------------------------
export const PageHeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div className="space-y-2">
      <Shimmer className="h-6 sm:h-8 lg:h-9 w-40 sm:w-64" />
      <Shimmer className="h-3.5 sm:h-4 w-52 sm:w-80" />
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <Shimmer className="h-9 sm:h-10 w-24 sm:w-32 rounded-xl" />
      <Shimmer className="h-9 sm:h-10 w-24 sm:w-32 rounded-xl" />
    </div>
  </div>
);

// --- Stat Card Skeleton ------------------------------------------------------
export const StatCardSkeleton = () => (
  <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
    <div className="flex items-center justify-between">
      <Shimmer className="h-3.5 sm:h-4 w-24 sm:w-28" />
      <Shimmer className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl" />
    </div>
    <Shimmer className="h-6 sm:h-8 w-16 sm:w-24" />
    <Shimmer className="h-2.5 sm:h-3 w-28 sm:w-36" />
  </div>
);

// --- Table Row Skeleton ------------------------------------------------------
export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr className="border-b border-stone-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-3 sm:px-4 py-3 sm:py-3.5">
        <Shimmer className={`h-3.5 sm:h-4 ${i === 0 ? "w-28 sm:w-40" : i === 1 ? "w-20 sm:w-28" : "w-14 sm:w-20"}`} />
      </td>
    ))}
  </tr>
);

// --- Admin Table Skeleton ----------------------------------------------------
export const AdminTableSkeleton = ({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="bg-white/95 border border-[#ecdccb] rounded-2xl overflow-hidden shadow-xs">
    <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <Shimmer className="h-5 sm:h-6 w-36 sm:w-48" />
      <div className="flex items-center gap-2">
        <Shimmer className="h-8 w-28 sm:w-36 rounded-xl" />
        <Shimmer className="h-8 w-20 rounded-xl" />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Card Grid Skeleton ------------------------------------------------------
export const CardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <Shimmer className="h-36 sm:h-44 w-full rounded-xl" />
        <div className="flex items-center justify-between pt-1">
          <Shimmer className="h-4 w-20 rounded-full" />
          <Shimmer className="h-3.5 w-16" />
        </div>
        <Shimmer className="h-4 sm:h-5 w-3/4" />
        <Shimmer className="h-3 sm:h-3.5 w-1/2" />
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

// --- List Skeleton -----------------------------------------------------------
export const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3 sm:space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-xs">
        <Shimmer className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Shimmer className="h-4 sm:h-5 w-36 sm:w-56" />
            <Shimmer className="h-3 w-16" />
          </div>
          <Shimmer className="h-3 sm:h-3.5 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// --- Leaderboard Skeleton ----------------------------------------------------
export const LeaderboardSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="space-y-2.5 sm:space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-xs">
        <Shimmer className="h-7 w-7 sm:h-8 sm:w-8 rounded-full shrink-0" />
        <Shimmer className="h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <Shimmer className="h-3.5 sm:h-4 w-28 sm:w-40" />
          <Shimmer className="h-2.5 sm:h-3 w-16 sm:w-24" />
        </div>
        <Shimmer className="h-6 sm:h-7 w-16 sm:w-20 rounded-xl shrink-0" />
      </div>
    ))}
  </div>
);

// --- Feed Skeleton -----------------------------------------------------------
export const FeedSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
    {/* Composer skeleton */}
    <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-full shrink-0" />
        <Shimmer className="h-10 flex-1 rounded-xl" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-stone-100">
        <div className="flex gap-2">
          <Shimmer className="h-8 w-20 rounded-lg" />
          <Shimmer className="h-8 w-20 rounded-lg" />
        </div>
        <Shimmer className="h-8 w-20 rounded-lg" />
      </div>
    </div>

    {/* Posts skeleton */}
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-32" />
            <Shimmer className="h-3 w-20" />
          </div>
        </div>
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-4/5" />
        <Shimmer className="h-48 sm:h-64 w-full rounded-xl" />
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <Shimmer className="h-7 w-16 rounded-lg" />
          <Shimmer className="h-7 w-16 rounded-lg" />
          <Shimmer className="h-7 w-16 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// --- Profile Skeleton --------------------------------------------------------
export const ProfileSkeleton = () => (
  <div className="space-y-5 sm:space-y-6">
    <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Shimmer className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-6 sm:h-7 w-40 sm:w-56" />
          <Shimmer className="h-3.5 w-32" />
          <div className="flex gap-2 pt-1">
            <Shimmer className="h-6 w-20 rounded-full" />
            <Shimmer className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <Shimmer className="h-9 w-28 rounded-xl" />
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <CardGridSkeleton count={3} />
  </div>
);

// --- Dashboard Full Skeleton -------------------------------------------------
export const DashboardSkeleton = () => (
  <div className="space-y-6 sm:space-y-8">
    {/* Welcome header */}
    <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Shimmer className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shrink-0" />
          <div className="space-y-2">
            <Shimmer className="h-5 sm:h-7 w-36 sm:w-56" />
            <Shimmer className="h-3 sm:h-3.5 w-28 sm:w-40" />
          </div>
        </div>
        <Shimmer className="h-9 w-28 rounded-xl self-start sm:self-auto" />
      </div>
      <Shimmer className="h-2.5 w-full rounded-full mt-4" />
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Content row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <Shimmer className="h-5 w-36" />
          <Shimmer className="h-4 w-16" />
        </div>
        <Shimmer className="h-48 sm:h-56 w-full rounded-xl" />
      </div>
      <div className="bg-white/95 border border-[#ecdccb] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <Shimmer className="h-5 w-36" />
          <Shimmer className="h-4 w-16" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
            <Shimmer className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <Shimmer className="h-3.5 w-3/4" />
              <Shimmer className="h-2.5 w-1/3" />
            </div>
            <Shimmer className="h-6 w-14 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
