"use client";

import React from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Plus, UploadCloud } from "lucide-react";
import Link from "next/link";

interface PortfolioProjectItem {
  id?: string;
  title: string;
  technique: string;
  imageUrl: string;
}

interface PortfolioGalleryProps {
  portfolios?: PortfolioProjectItem[];
  onUploadPortfolio?: () => void;
}

export const PortfolioGallery = ({ portfolios, onUploadPortfolio }: PortfolioGalleryProps) => {
  const activePortfolios = portfolios || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white/95 border border-[#ecdccb] p-6 sm:p-7 rounded-3xl h-full min-h-[300px] sm:min-h-[340px] shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0 shadow-2xs">
            <ImageIcon size={18} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Portfolio Projects</h2>
        </div>
        {onUploadPortfolio ? (
          <button
            type="button"
            onClick={onUploadPortfolio}
            className="text-xs sm:text-sm font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3 py-1.5 rounded-full shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} /> Upload New
          </button>
        ) : (
          <Link
            href="/student/portfolio?upload=true"
            className="text-xs sm:text-sm font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3 py-1.5 rounded-full shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} /> Upload New
          </Link>
        )}
      </div>

      {/* Content centered vertically with plenty of height */}
      <div className="flex-1 flex flex-col justify-center py-3">
        {activePortfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <UploadCloud size={44} className="text-[#e86034] mb-2.5" />
            <p className="text-stone-700 text-sm font-semibold">No projects uploaded yet.</p>
            {onUploadPortfolio ? (
              <button
                type="button"
                onClick={onUploadPortfolio}
                className="text-[#c4431d] hover:text-[#942008] text-xs sm:text-sm font-bold transition-colors mt-1 cursor-pointer"
              >
                Start your portfolio
              </button>
            ) : (
              <Link
                href="/student/portfolio?upload=true"
                className="text-[#c4431d] hover:text-[#942008] text-xs sm:text-sm font-bold transition-colors mt-1"
              >
                Start your portfolio
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activePortfolios.slice(0, 2).map((project, i) => (
              <div
                key={project.id || i}
                className="flex items-center gap-3.5 p-3 sm:p-3.5 bg-[#faf8f5] border border-stone-200/80 rounded-2xl shadow-2xs"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c4431d] font-semibold truncate mt-0.5">
                    {project.technique}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
