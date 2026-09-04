"use client";
import React from "react";

// --- Pulse animation base ----------------------------------------------------
const Pulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />
);

// --- Stat Card Skeleton ------------------------------------------------------
export const StatCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Pulse className="h-4 w-28" />
      <Pulse className="h-8 w-8 rounded-xl" />
    </div>
    <Pulse className="h-8 w-20" />
    <Pulse className="h-3 w-36" />
  </div>
);

// --- Table Row Skeleton ------------------------------------------------------
export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Pulse className={`h-4 ${i === 0 ? "w-32" : "w-20"}`} />
      </td>
    ))}
  </tr>
);

// --- Card Grid Skeleton ------------------------------------------------------
export const CardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <Pulse className="h-40 w-full rounded-xl" />
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// --- Dashboard Full Skeleton -------------------------------------------------
export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Welcome header */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <Pulse className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Pulse className="h-6 w-48" />
          <Pulse className="h-3 w-32" />
        </div>
      </div>
      <Pulse className="h-2 w-full rounded-full mt-4" />
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Content row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <Pulse className="h-5 w-36" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Pulse className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-3 w-3/4" />
              <Pulse className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <Pulse className="h-5 w-36" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Pulse className="h-8 w-8 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-3 w-2/3" />
              <Pulse className="h-2 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Admin Table Skeleton ----------------------------------------------------
export const AdminTableSkeleton = ({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
    <div className="p-5 border-b border-slate-800">
      <Pulse className="h-5 w-40" />
    </div>
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

// --- Leaderboard Skeleton ----------------------------------------------------
export const LeaderboardSkeleton = ({ rows = 10 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <Pulse className="h-8 w-8 rounded-full shrink-0" />
        <Pulse className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-3 w-20" />
        </div>
        <Pulse className="h-6 w-16 rounded-xl" />
      </div>
    ))}
  </div>
);
