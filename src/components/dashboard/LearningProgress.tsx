"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

interface CourseItem {
  id?: string;
  title?: string;
  description?: string;
  chapters?: unknown[];
  lessons?: unknown[];
  UserCourse?: {
    status?: string;
    progress?: number;
  };
}

interface LearningProgressProps {
  courses?: CourseItem[];
  nextGoal?: string;
  progress?: number;
}

export const LearningProgress = ({
  courses = [],
  progress: passedProgress,
}: LearningProgressProps) => {
  // Find primary enrolled course
  const enrolledCourse =
    courses.find((c) => c.UserCourse?.status === "enrolled") || courses[0];
  const progress =
    passedProgress !== undefined
      ? passedProgress
      : enrolledCourse?.UserCourse?.progress || 0;

  // Real curriculum lesson calculations
  const isEnrolled = Boolean(enrolledCourse);
  const totalLessons = enrolledCourse?.chapters?.length || (isEnrolled ? 12 : 0);

  let completedLessons = 0;
  let inProgressLessons = 0;
  let notStartedLessons = 0;

  if (isEnrolled && totalLessons > 0) {
    if (progress >= 100) {
      completedLessons = totalLessons;
      inProgressLessons = 0;
      notStartedLessons = 0;
    } else if (progress > 0) {
      completedLessons = Math.floor((progress / 100) * totalLessons);
      inProgressLessons = 1;
      notStartedLessons = Math.max(0, totalLessons - completedLessons - inProgressLessons);
    } else {
      completedLessons = 0;
      inProgressLessons = 0;
      notStartedLessons = totalLessons;
    }
  }

  // BIG half-circle SVG calculations (R = 85, Arc length = Math.PI * 85 ≈ 267.04)
  const radius = 85;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;
  const strokeDashoffset =
    arcLength - (arcLength * Math.min(Math.max(progress, 0), 100)) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
            <BarChart2 size={16} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Learning Progress</h2>
        </div>

        {enrolledCourse?.title && (
          <span
            className="text-xs font-semibold text-stone-400 max-w-[150px] truncate hidden sm:block"
            title={enrolledCourse.title}
          >
            {enrolledCourse.title}
          </span>
        )}
      </div>

      {/* Body: Prominent BIG Half-Circle Gauge on Left, Balanced Breakdown on Right */}
      <Link
        href="/student/courses"
        className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-7 py-2 group cursor-pointer"
        title="Click to resume course lessons"
      >
        {/* BIG Semi-circular Arc Gauge */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg width="205" height="122" viewBox="0 0 205 122" className="overflow-visible">
            {/* Background semi-circle track */}
            <path
              d="M 18 108 A 85 85 0 0 1 188 108"
              fill="none"
              stroke="#fde5d6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Active filled progress arc */}
            <path
              d="M 18 108 A 85 85 0 0 1 188 108"
              fill="none"
              stroke="#e86034"
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Large percentage & label inside arc */}
          <div className="absolute bottom-2 flex flex-col items-center text-center">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-none group-hover:text-[#c4431d] transition-colors">
              {progress}%
            </span>
            <span className="text-xs sm:text-sm font-semibold text-stone-500 mt-1.5">
              Course Progress
            </span>
          </div>
        </div>

        {/* Breakdown Legend with dynamic logic */}
        <div className="w-full sm:w-auto flex flex-col justify-center space-y-2.5 min-w-[170px] pl-1 sm:pl-3">
          <div className="flex items-center justify-between gap-4 text-xs sm:text-sm py-1 border-b border-stone-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e86034] shrink-0" />
              <span className="text-stone-700 font-medium">Completed Lessons</span>
            </div>
            <span className="font-bold text-stone-900 font-mono text-sm">{completedLessons}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs sm:text-sm py-1 border-b border-stone-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shrink-0" />
              <span className="text-stone-700 font-medium">In Progress</span>
            </div>
            <span className="font-bold text-stone-900 font-mono text-sm">{inProgressLessons}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs sm:text-sm py-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" />
              <span className="text-stone-700 font-medium">Not Started</span>
            </div>
            <span className="font-bold text-stone-900 font-mono text-sm">{notStartedLessons}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
