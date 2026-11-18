"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, Lock, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface CourseCardItem {
  id: string;
  levelTag: string;
  levelColor: string;
  title: string;
  subtitle: string;
  image: string;
  isEnrolled: boolean;
  progress?: number;
  price?: string;
  tierCode: string;
}

interface MyCoursesProps {
  courses?: any[];
  allCourses?: any[];
  currentTier?: any;
  userLevel?: string;
  onUnlockTier?: (tierCode: string) => void;
}

export const MyCourses = ({
  courses = [],
  currentTier,
  userLevel = "L0",
  onUnlockTier,
}: MyCoursesProps) => {
  // Check student enrolled status for tiers
  const normalizedLevel = (userLevel || currentTier?.code || "L0").toUpperCase();
  const isL1Enrolled = ["L1", "L2", "L3", "L3+"].some((l) => normalizedLevel.includes(l));
  const isL2Enrolled = ["L2", "L3", "L3+"].some((l) => normalizedLevel.includes(l));

  // Find enrolled course progress
  const enrolledCourse =
    courses.find((c: any) => c.UserCourse?.status === "enrolled") || courses[0];
  const dynamicProgress = enrolledCourse?.UserCourse?.progress || 0;

  const defaultCards: CourseCardItem[] = [
    {
      id: "fast-track-l0",
      levelTag: "L0",
      levelColor: "bg-[#ffedd5] text-[#c2410c]",
      title: enrolledCourse?.title || "Fast Track: Resin FastStart Bundle",
      subtitle: enrolledCourse?.description || "Foundations, chemistry, and first creations.",
      image: "/images/student-art/real-art-3.jpg",
      isEnrolled: true,
      progress: dynamicProgress,
      tierCode: "L0",
    },
    {
      id: "explore-l1",
      levelTag: "L1",
      levelColor: "bg-[#fce7f3] text-[#be185d]",
      title: "Explore Membership",
      subtitle: "Build your skills and explore projects.",
      image: "/images/student-art/real-art-2.jpg",
      isEnrolled: isL1Enrolled,
      progress: isL1Enrolled ? 0 : undefined,
      price: "₹2,999",
      tierCode: "L1",
    },
    {
      id: "master-l2",
      levelTag: "L2",
      levelColor: "bg-[#ede9fe] text-[#6d28d9]",
      title: "Master Membership",
      subtitle: "Take your resin art to the next level.",
      image: "/images/student-art/real-art-4.jpg",
      isEnrolled: isL2Enrolled,
      progress: isL2Enrolled ? 0 : undefined,
      price: "₹5,999",
      tierCode: "L2",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
              <BookOpen size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">My Courses</h2>
          </div>

          <Link
            href="/student/courses"
            className="text-xs sm:text-sm font-bold text-[#c4431d] hover:text-[#942008] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All Courses</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-xs text-stone-500 mb-3 sm:mb-4">
          Continue learning from your enrolled courses.
        </p>
      </div>

      {/* Grid of 3 Course Cards matching Image 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 flex-1">
        {defaultCards.map((course) => {
          return (
            <div
              key={course.id}
              className="rounded-2xl border border-[#ecdccb] bg-[#faf8f5]/60 hover:bg-white p-3.5 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${course.levelColor}`}
                  >
                    {course.levelTag}
                  </span>

                  {course.isEnrolled ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center gap-1">
                      <Check size={10} strokeWidth={3} /> Enrolled
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 flex items-center gap-1 border border-stone-200">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>

                {/* Course Image */}
                <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 mb-2.5 relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Course Details */}
                <h3
                  className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#c4431d] transition-colors"
                  title={course.title}
                >
                  {course.title}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 leading-tight">
                  {course.subtitle}
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                {course.isEnrolled ? (
                  <>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-stone-600 block">
                        {course.progress || 0}% Complete
                      </span>
                      <div className="w-16 sm:w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#e86034] h-full rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href="/student/courses"
                      className="w-7 h-7 rounded-full bg-[#e86034] hover:bg-[#c4431d] text-white flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer shrink-0"
                      title="Play course"
                    >
                      <Play size={11} className="fill-white ml-0.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                      {course.price || "Locked"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUnlockTier && onUnlockTier(course.tierCode)}
                      className="w-7 h-7 rounded-full bg-stone-100 hover:bg-[#fff2ea] border border-stone-200 hover:border-[#fbdcd0] text-stone-500 hover:text-[#c4431d] flex items-center justify-center transition-all cursor-pointer shrink-0"
                      title={`Unlock ${course.title}`}
                    >
                      <Lock size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

