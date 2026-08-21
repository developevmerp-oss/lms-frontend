"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Medal, Trophy, Zap, BookOpen } from 'lucide-react';

interface CourseRecord {
  id: string;
  title: string;
  description?: string;
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
  
  // Dynamic calculation of locked courses
  // Find courses the user is NOT enrolled in
  const enrolledCourseIds = courses?.map(c => c.id) || [];
  const lockedCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id));
  
  // Fallback to static if allCourses isn't populated for some reason
  const displayLocked = lockedCourses.length > 0 
    ? lockedCourses 
    : [
        { id: 'l1', title: '3D Photo Resin Art', description: 'Advanced diamond module' },
        { id: 'l2', title: 'Wood & Resin Table', description: 'Advanced diamond module' },
        { id: 'l3', title: 'Diamond Certification', description: 'The ultimate leadership goal' }
      ];

  const displayedBadges = badges || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Courses Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-orange-500" /> My Courses
        </h2>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {enrolledCourses.map((course, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl cursor-pointer hover:bg-orange-500/20 transition-colors">
              <Zap size={20} className="text-orange-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{course.title}</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-orange-500 rounded-full h-1.5 transition-all"
                    style={{ width: `${course.UserCourse?.progress || 0}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-orange-400 font-bold">{course.UserCourse?.progress || 0}%</span>
            </div>
          ))}

          {completedCourses.length > 0 && (
            <div className="pt-4 mt-2 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Completed</h3>
              {completedCourses.map((course, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl mb-2 hover:bg-slate-800 transition-colors cursor-pointer">
                  <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                  <span className="text-white font-medium truncate">{course.title}</span>
                </div>
              ))}
            </div>
          )}

          {courses.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <BookOpen size={32} className="text-slate-700 mb-2" />
              <p className="text-slate-500">No courses enrolled yet</p>
            </div>
          )}

          {/* Locked premium courses */}
          <div className="pt-4 mt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock size={12}/> Diamond Exclusives
            </h3>
            {displayLocked.map((course: any, i: number) => (
              <div key={`locked-${i}`} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl opacity-50 mb-2">
                <Lock size={18} className="text-slate-600 shrink-0" />
                <span className="text-slate-400 font-medium">{course.title || course.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl"
      >
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Medal className="text-yellow-400" /> Badges Earned
        </h2>
        <p className="text-slate-500 text-xs mb-4">
          {displayedBadges.length} badge{displayedBadges.length !== 1 ? 's' : ''} collected
        </p>
        
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
          {/* Earned Badges */}
          {displayedBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-amber-500/5 text-center hover:scale-105 transition-transform cursor-pointer shadow-md"
            >
              <div className="text-3xl mb-2">{badge.icon || '🏅'}</div>
              <span className="text-white text-xs font-bold leading-tight">{badge.name || 'Achievement'}</span>
              {badge.description && (
                <span className="text-slate-400 text-[10px] mt-1 leading-snug line-clamp-2">{badge.description}</span>
              )}
              <span className="mt-2 text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                ✓ Earned
              </span>
            </motion.div>
          ))}
          
          {/* Empty state */}
          {displayedBadges.length === 0 && (
             <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                <Trophy size={32} className="text-slate-700 mb-2" />
                <p className="text-slate-400 text-sm font-medium">No badges yet</p>
                <p className="text-slate-600 text-xs mt-1">Complete missions to earn your first badge!</p>
             </div>
          )}

          {/* Locked badge placeholders — show un-earned ones from the static list */}
          {[
            { icon: '🎨', name: 'First Resin Pour' },
            { icon: '💰', name: 'First Client Sale' },
            { icon: '💎', name: 'Geode Master' },
            { icon: '⏰', name: 'Clock Artisan' },
            { icon: '🔥', name: 'Streak Champion' },
            { icon: '🌊', name: 'Ocean Waves Specialist' },
            { icon: '💐', name: 'Bridal Preservationist' },
            { icon: '👑', name: 'Hall of Fame Creator' },
          ]
            .filter(locked => !displayedBadges.find((b: any) => b.name === locked.name))
            .slice(0, 4)
            .map((locked, i) => (
              <div key={`locked-${i}`} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-800 bg-slate-900/30 text-center opacity-40">
                <div className="text-2xl mb-2 grayscale">{locked.icon}</div>
                <span className="text-slate-500 text-xs font-bold leading-tight">{locked.name}</span>
                <span className="mt-2 text-[10px] text-slate-600">🔒 Locked</span>
              </div>
            ))
          }
        </div>
      </motion.div>
    </div>
  );
};
