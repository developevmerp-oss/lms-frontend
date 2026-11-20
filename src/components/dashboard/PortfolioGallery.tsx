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
}

export const PortfolioGallery = ({ portfolios }: PortfolioGalleryProps) => {
  const activePortfolios = portfolios || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
            <ImageIcon size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900">Portfolio Projects</h2>
        </div>
        <Link
          href="/student/portfolio"
          className="text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-2.5 py-1 rounded-full shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus size={12} /> Upload New
        </Link>
      </div>

      {/* Content centered vertically with no bottom dead space */}
      <div className="flex-1 flex flex-col justify-center py-2 sm:py-3">
        {activePortfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud size={34} className="text-[#e86034] mb-2" />
            <p className="text-stone-600 text-xs font-medium">No projects uploaded yet.</p>
            <Link
              href="/student/portfolio"
              className="text-[#c4431d] hover:text-[#942008] text-xs font-bold transition-colors mt-0.5"
            >
              Start your portfolio
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activePortfolios.slice(0, 2).map((project, i) => (
              <div
                key={project.id || i}
                className="flex items-center gap-2.5 p-2 bg-[#faf8f5] border border-stone-200/80 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-stone-900 truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#c4431d] font-semibold truncate">
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
