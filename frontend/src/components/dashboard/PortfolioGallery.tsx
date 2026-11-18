"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MessageSquare, Plus, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export const PortfolioGallery = ({ portfolios }: { portfolios?: any[] }) => {
  const activePortfolios = portfolios || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-[#c4431d]" size={18} />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Portfolio Projects</h2>
          </div>
          <Link
            href="/student/portfolio"
            className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-1 rounded-full text-stone-900 font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} /> Upload New
          </Link>
        </div>
        
        <div className="space-y-3">
          {activePortfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
              <UploadCloud size={36} className="text-[#c4431d] mb-2" />
              <p className="text-stone-600 text-xs sm:text-sm font-medium mb-1">No projects uploaded yet.</p>
              <Link
                href="/student/portfolio"
                className="text-[#c4431d] hover:text-[#942008] text-xs sm:text-sm font-bold transition-colors"
              >
                Start your portfolio
              </Link>
            </div>
          ) : (
            activePortfolios.slice(0, 3).map((project, i) => (
              <div key={project.id || i} className="flex gap-3 p-2.5 bg-[#faf8f5] border border-stone-200/80 rounded-2xl">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs sm:text-sm text-stone-900 font-bold truncate">{project.title}</h3>
                    <span className="text-[0.65rem] text-stone-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-[#c4431d] font-semibold mb-1">{project.technique}</p>
                  
                  {project.feedback ? (
                    <div className="bg-white p-1.5 rounded-lg border border-stone-200 flex gap-1.5 items-start">
                      <MessageSquare size={12} className="text-stone-400 shrink-0 mt-0.5" />
                      <p className="text-[0.65rem] text-stone-700 italic line-clamp-1">"{project.feedback}"</p>
                    </div>
                  ) : (
                    <p className="text-[0.65rem] text-stone-400 italic">Awaiting feedback...</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
