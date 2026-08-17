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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full shadow-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-orange-500" />
        <h2 className="text-xl font-bold text-white">Business Milestones</h2>
      </div>
      
      {displayMilestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <Target size={32} className="text-slate-700 mb-2" />
          <p className="text-slate-500 text-sm">No milestones set yet.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-700/50 ml-3 space-y-6">
          {displayMilestones.map((milestone, i) => {
            const isCompleted = milestone.completed || !!milestone.completedAt;
            const label = milestone.name || milestone.title || `Milestone ${i + 1}`;

            return (
              <div key={milestone.id || i} className="relative pl-6">
                {isCompleted ? (
                  <div className="absolute -left-[11px] top-1 bg-slate-900 rounded-full">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                ) : (
                  <div className="absolute -left-[11px] top-1 bg-slate-900 rounded-full">
                    <Circle size={20} className={i === displayMilestones.findIndex(m => !m.completed && !m.completedAt) ? "text-orange-500 animate-pulse" : "text-slate-600"} />
                  </div>
                )}
                <h3 className={`font-semibold ${
                  isCompleted 
                    ? 'text-white' 
                    : i === displayMilestones.findIndex(m => !m.completed && !m.completedAt)
                      ? 'text-orange-400 font-bold' 
                      : 'text-slate-500'
                }`}>
                  {label}
                </h3>
                {isCompleted && milestone.completedAt && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(milestone.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
