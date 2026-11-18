"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FocusItem {
  id: number;
  title: string;
  description: string;
  href?: string;
}

interface TodayFocusProps {
  enrolledCourse?: { title?: string };
  nextGoal?: string;
  progress?: number;
}

export const TodayFocus = ({
  enrolledCourse,
  nextGoal,
  progress = 0,
}: TodayFocusProps) => {
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);

  const defaultTasks: FocusItem[] = [
    {
      id: 1,
      title: enrolledCourse?.title || "Coasters, Fridge Magnets, Keychains",
      description: `You're ${progress}% through — keep going!`,
      href: "/student/courses",
    },
    {
      id: 2,
      title: nextGoal ? `Goal: ${nextGoal}` : "Goal: Complete pending missions",
      description: "Make sure to finish your next milestone.",
      href: "/student/courses",
    },
    {
      id: 3,
      title: "Upload Portfolio Project",
      description: "Submit your latest artwork for mentor review.",
      href: "/student/portfolio",
    },
  ];

  const toggleTask = (id: number) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
              <Calendar size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Today&apos;s Focus</h2>
          </div>
          <span className="text-xs text-stone-400 font-medium shrink-0">
            {completedTaskIds.length} of {defaultTasks.length} completed
          </span>
        </div>

        {/* Task List with Square Checkboxes & Balanced Card Styles */}
        <div className="space-y-2.5 sm:space-y-3">
          {defaultTasks.map((task) => {
            const isDone = completedTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer select-none group ${
                  isDone
                    ? "bg-[#faf8f5]/40 border-stone-200/60"
                    : "bg-[#faf8f5]/80 hover:bg-white border-[#ecdccb]/80 hover:border-[#e86034]/40 shadow-2xs hover:shadow-xs"
                }`}
              >
                {/* Square checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? "bg-[#e86034] border-[#e86034] text-white"
                      : "border-stone-300 bg-white group-hover:border-[#e86034]"
                  }`}
                >
                  {isDone && <Check size={12} strokeWidth={3} />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                      isDone
                        ? "text-stone-400 line-through"
                        : "text-stone-900 group-hover:text-[#c4431d]"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {task.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Action: fills vertical space and connects to tasks */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span className="text-[11px] font-medium text-stone-400">
          Synced with your daily course goals
        </span>
        <Link
          href="/student/tasks"
          className="text-xs font-bold text-[#c4431d] hover:text-[#942008] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>All Tasks</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TodayFocus;
