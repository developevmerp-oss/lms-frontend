"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Medal, Trophy, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CourseRecord {
  id: string;
  title: string;
  description?: string;
  image?: string;
  flyerImage?: string;
  UserCourse?: { progress: number; status: 'locked' | 'enrolled' | 'completed' };
}

interface CoursesAndBadgesProps {
  badges: any[];
  courses: CourseRecord[];
  allCourses?: CourseRecord[];
}

export const CoursesAndBadges = ({ badges, courses, allCourses = [] }: CoursesAndBadgesProps) => {
  const completedCourses = courses?.filter(c => c.UserCourse?.status === 'completed') || [];
  const enrolledCourses = courses?.filter(c => c.UserCourse?.status === 'enrolled') || [];
  
  const enrolledCourseIds = courses?.map(c => c.id) || [];
  const lockedCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id));
  
  const displayLocked = lockedCourses.length > 0 
    ? lockedCourses 
    : [
        { id: 'l1', title: '3D Photo Resin Art', description: 'Advanced diamond module' },
        { id: 'l2', title: 'Wood & Resin Table', description: 'Advanced diamond module' },
        { id: 'l3', title: 'Diamond Certification', description: 'The ultimate leadership goal' }
      ];

  const displayedBadges = badges || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full items-stretch">
      {/* Courses Section */}
      <motion.div 
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
      >
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <BookOpen className="text-[#c4431d]" size={18} /> My Courses
          </h2>
          
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {enrolledCourses.map((course, i) => (
              <Link
                key={course.id || i}
                href="/student/courses"
                className="flex items-center gap-3 p-3 bg-[#fde5d6]/40 border border-[#f5ded0] rounded-2xl hover:bg-[#fff5ee] transition-colors cursor-pointer"
              >
                {(course.image || course.flyerImage) ? (
                  <img src={(course.image || course.flyerImage)!} alt={course.title} className="w-8 h-8 rounded-lg object-cover border border-[#f5ded0] shrink-0" />
                ) : (
                  <Zap size={18} className="text-[#942008] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-stone-900 font-bold truncate">{course.title}</p>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1.5 border border-stone-200/50">
                    <div 
                      className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] rounded-full h-1.5 transition-all"
                      style={{ width: `${course.UserCourse?.progress || 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#942008] font-bold shrink-0">{course.UserCourse?.progress || 0}%</span>
              </Link>
            ))}

            {completedCourses.length > 0 && (
              <div className="pt-3 mt-2 border-t border-stone-100">
                <h3 className="text-[0.65rem] sm:text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Completed</h3>
                {completedCourses.map((course, i) => (
                  <Link
                    key={course.id || i}
                    href="/student/courses"
                    className="flex items-center gap-2.5 p-2.5 bg-stone-50 border border-stone-200 rounded-xl mb-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-stone-900 font-medium truncate">{course.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {enrolledCourses.length === 0 && completedCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen size={28} className="text-stone-300 mb-2" />
                <p className="text-stone-500 text-xs sm:text-sm">No courses enrolled yet</p>
              </div>
            )}

            {/* Locked premium courses */}
            <div className="pt-3 mt-2 border-t border-stone-100">
              <h3 className="text-[0.65rem] sm:text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={12}/> Diamond Exclusives
              </h3>
              {displayLocked.slice(0, 2).map((course: any, i: number) => (
                <div key={`locked-${i}`} className="flex items-center gap-2.5 p-2 bg-stone-50 border border-stone-200/70 rounded-xl opacity-60 mb-1.5">
                  <Lock size={14} className="text-stone-400 shrink-0" />
                  <span className="text-xs text-stone-500 font-medium truncate">{course.title || course.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div 
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl flex flex-col justify-between shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]"
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Medal className="text-yellow-500" size={18} /> Badges Earned
            </h2>
          </div>
          <p className="text-stone-500 text-xs mb-3">
            {displayedBadges.length} badge{displayedBadges.length !== 1 ? 's' : ''} collected
          </p>
          
          <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {displayedBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-[#f5ded0] bg-gradient-to-b from-[#fde5d6]/40 to-[#fff5ee]/30 text-center hover:scale-[1.02] transition-transform cursor-pointer shadow-xs"
              >
                <div className="text-2xl mb-1.5">{badge.icon || '🏅'}</div>
                <span className="text-stone-900 text-xs font-bold leading-tight">{badge.name || 'Achievement'}</span>
                {badge.description && (
                  <span className="text-stone-500 text-[0.65rem] mt-1 leading-snug line-clamp-2">{badge.description}</span>
                )}
                <span className="mt-2 text-[0.65rem] bg-[#fde5d6] text-[#942008] border border-[#f5ded0] px-2 py-0.5 rounded-full font-bold">
                  ✓ Earned
                </span>
              </motion.div>
            ))}
            
            {displayedBadges.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-10 text-center">
                <Trophy size={28} className="text-stone-300 mb-2" />
                <p className="text-stone-700 text-xs sm:text-sm font-bold">No badges yet</p>
                <p className="text-stone-400 text-xs mt-0.5">Complete missions to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
