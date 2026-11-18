"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle } from 'lucide-react';

interface Milestone {
  id?: string;
  name?: string;
  title?: string;
  completed?: boolean;
  completedAt?: Date | string;
  order?: number;
}

export const BusinessMilestones = ({ milestones }: { milestones?: Milestone[] }) => {
  const displayMilestones = milestones || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-[#c4431d]" size={18} />
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Business Milestones</h2>
        </div>
        
        {displayMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
            {/* Concentric bullseye icon matching reference */}
            <div className="w-12 h-12 rounded-full border-2 border-stone-300 flex items-center justify-center mb-3">
              <div className="w-7 h-7 rounded-full border-2 border-stone-400 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-500" />
              </div>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm font-medium">No milestones set yet.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-stone-200 ml-3 space-y-4 my-2">
            {displayMilestones.map((milestone, i) => {
              const isCompleted = milestone.completed || !!milestone.completedAt;
              const label = milestone.name || milestone.title || `Milestone ${i + 1}`;

              return (
                <div key={milestone.id || i} className="relative pl-5">
                  {isCompleted ? (
                    <div className="absolute -left-[10px] top-0.5 bg-white rounded-full">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                  ) : (
                    <div className="absolute -left-[10px] top-0.5 bg-white rounded-full">
                      <Circle size={18} className={i === displayMilestones.findIndex(m => !m.completed && !m.completedAt) ? "text-[#c4431d] animate-pulse" : "text-stone-400"} />
                    </div>
                  )}
                  <h3 className={`text-xs sm:text-sm font-semibold leading-tight ${
                    isCompleted 
                      ? 'text-stone-900' 
                      : i === displayMilestones.findIndex(m => !m.completed && !m.completedAt)
                        ? 'text-[#c4431d] font-bold' 
                        : 'text-stone-500'
                  }`}>
                    {label}
                  </h3>
                  {isCompleted && milestone.completedAt && (
                    <p className="text-[0.65rem] sm:text-xs text-stone-400 mt-0.5">
                      {new Date(milestone.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
