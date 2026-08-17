"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

export const PortfolioGallery = ({ portfolios }: { portfolios?: any[] }) => {
  // Use real portfolios if available, else empty array
  const activePortfolios = portfolios || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full shadow-xl flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-orange-500" />
          <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
        </div>
        <Link href="/student/portfolio" className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-full text-white transition-colors flex items-center gap-1">
          <Plus size={14} /> Upload New
        </Link>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {activePortfolios.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-sm mb-2">No projects uploaded yet.</p>
            <Link href="/student/portfolio" className="text-orange-500 hover:text-orange-400 text-sm font-bold">Start your portfolio</Link>
          </div>
        ) : (
          activePortfolios.map((project, i) => (
            <div key={project.id || i} className="flex gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-black">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold">{project.title}</h3>
                  <span className="text-xs text-slate-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-orange-400 mb-2">{project.technique}</p>
                
                {project.feedback ? (
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex gap-2 items-start mt-2">
                    <MessageSquare size={14} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-300 italic">"{project.feedback}"</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">— {project.mentorName || 'Mentor'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20 text-orange-400 text-xs italic">
                    Awaiting mentor feedback...
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
