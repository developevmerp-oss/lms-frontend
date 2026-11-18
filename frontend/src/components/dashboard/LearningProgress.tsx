"use client";

import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, Circle, PlayCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LearningProgressProps {
  courses?: any[];
  nextGoal?: string;
}

export const LearningProgress = ({ courses, nextGoal }: LearningProgressProps) => {
  const allCourses = courses || [];
  
  // Find the first enrolled course
  const enrolledCourse = allCourses.find((c: any) => c.UserCourse?.status === 'enrolled') || allCourses[0];
  const progress = enrolledCourse?.UserCourse?.progress || 0;

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const dailyTasks = [
    {
      title: enrolledCourse ? `Continue: ${enrolledCourse.title}` : '1. Coasters, Fridge Magnets, Keychains',
      description: enrolledCourse ? `You're ${progress}% through — keep going!` : "You're 0% through — keep going!",
      href: '/student/courses',
    },
    {
      title: 'Goal: ' + (nextGoal || 'Complete pending missions'),
      description: 'Make sure to finish your next milestone',
      href: '/student/courses',
    },
    {
      title: 'Upload Portfolio Project',
      description: 'Submit your latest artwork for mentor review (+500 XP)',
      href: '/student/portfolio',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full items-stretch">
      {/* Card 1: Current Course / Learning Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-500" size={18} />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Learning Progress</h2>
          </div>
          
          {enrolledCourse ? (
            <div>
              <p className="text-[0.65rem] sm:text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                CURRENT COURSE
              </p>
              <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug mb-2">
                {enrolledCourse.title || "1. Coasters, Fridge Magnets, Keychains"}
              </h3>
              <p className="text-xs text-stone-500 flex items-start gap-1.5 mb-5 leading-relaxed">
                <PlayCircle size={15} className="text-[#c4431d] shrink-0 mt-0.5" />
                <span>{enrolledCourse.description || "Small format cast pouring, glitter suspension, silicone molding, and hardware attachment."}</span>
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1">No active courses</h3>
              <p className="text-xs text-stone-500 mb-4">You have completed all your enrolled courses.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-stone-500">Course Progress</span>
            <span className="text-stone-900 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-4 border border-stone-200/50">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Link
            href="/student/courses"
            className="w-full bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white py-2.5 sm:py-3 rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            Resume Learning <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Card 2: Today's Focus */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-pink-400" size={18} />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Today's Focus</h2>
          </div>

          <div className="space-y-3">
            {dailyTasks.map((task, i) => {
              const isDone = completedTasks.includes(i);
              return (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  className="flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#faf8f5] border border-transparent hover:border-stone-200/80 transition-all cursor-pointer group"
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 focus:outline-none"
                    aria-label="Toggle task"
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle size={18} className="text-stone-300 group-hover:text-[#c4431d] transition-colors" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isDone ? 'text-stone-400 line-through' : 'text-stone-900 group-hover:text-[#c4431d]'} transition-colors`}>
                      {task.title}
                    </h4>
                    <p className="text-[0.7rem] sm:text-xs text-stone-500 mt-0.5 leading-snug">
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
