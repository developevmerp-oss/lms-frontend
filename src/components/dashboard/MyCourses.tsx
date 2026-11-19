'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Play, Lock, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/config/api';

interface CourseCardItem {
  id: string;
  levelTag: string;
  levelColor: string;
  title: string;
  subtitle: string;
  image?: string | null;
  isEnrolled: boolean;
  price?: string;
  tierCode: string;
}

interface MyCoursesProps {
  courses?: any[];
  allCourses?: any[];
  currentTier?: any;
  userLevel?: string;
  levelTiers?: any[];
  onUnlockTier?: (tierCode: string) => void;
}

export const MyCourses = ({
  courses = [],
  currentTier,
  userLevel = 'L0',
  levelTiers = [],
  onUnlockTier,
}: MyCoursesProps) => {
  const router = useRouter();

  // Hydrate tiers from sessionStorage if not yet passed via props (prevents any flash on page refresh)
  const cachedTiers = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cached_level_tiers');
        if (cached) return JSON.parse(cached);
      } catch (_) {}
    }
    return [];
  }, []);

  const activeTiers = levelTiers && levelTiers.length > 0 ? levelTiers : cachedTiers;

  // Check student enrolled status for tiers
  const normalizedLevel = (userLevel || currentTier?.code || 'L0').toUpperCase();
  const isL1Enrolled = ['L1', 'L2', 'L3', 'L3+'].some((l) => normalizedLevel.includes(l));
  const isL2Enrolled = ['L2', 'L3', 'L3+'].some((l) => normalizedLevel.includes(l));
  const isL3Enrolled = ['L3', 'L3+'].some((l) => normalizedLevel.includes(l));

  const resolveTier = (
    lvl: string,
    defaultTitle: string,
    defaultSub: string,
    defaultPrice: string,
    levelColor: string,
    isEnrolled: boolean
  ): CourseCardItem => {
    const liveLevel = activeTiers.find((t: any) => {
      const c = (t.code || t.levelCode || '').toUpperCase();
      const target = lvl.toUpperCase();
      return c === target || c.startsWith(target) || c.includes(target);
    });

    const liveThumb = liveLevel?.thumbnail || liveLevel?.image || liveLevel?.bannerImage;
    const cardImage = liveThumb ? getImageUrl(liveThumb) : null;
    const title = liveLevel?.name || defaultTitle;
    const subtitle = liveLevel?.description || defaultSub;
    const price = liveLevel?.price ? `₹${Number(liveLevel.price).toLocaleString('en-IN')}` : defaultPrice;

    return {
      id: `${lvl.toLowerCase()}-card`,
      levelTag: lvl,
      levelColor,
      title,
      subtitle,
      image: cardImage,
      isEnrolled,
      price,
      tierCode: lvl,
    };
  };

  // The 4 Membership Level Cards matching the Courses page exact naming & images
  const defaultCards: CourseCardItem[] = [
    resolveTier(
      'L0',
      'Fast Track: Resin FastStart Bundle',
      'Foundations, chemistry, and first creations',
      '₹399',
      'bg-[#ffedd5] text-[#c2410c]',
      true
    ),
    resolveTier(
      'L1',
      'Silver Membership: Explore Membership',
      'Core techniques, first client sale, and portfolio building',
      '₹4,999',
      'bg-[#fce7f3] text-[#be185d]',
      isL1Enrolled
    ),
    resolveTier(
      'L2',
      'Gold Membership: Master Membership',
      'High-ticket geode clocks, bridal preservation, and consistent revenue',
      '₹19,999',
      'bg-[#ede9fe] text-[#6d28d9]',
      isL2Enrolled
    ),
    resolveTier(
      'L3',
      'Diamond Membership: Renaissance Certification',
      'Scale beyond ₹50K/month, furniture river tables, and corporate orders',
      '₹59,999',
      'bg-[#e0f2fe] text-[#0284c7]',
      isL3Enrolled
    ),
  ];

  const handleCardClick = (course: CourseCardItem) => {
    router.push(`/student/courses?level=${course.levelTag}&action=open`);
  };

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

      {/* Grid of Course Cards (L0, L1, L2, L3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 flex-1">
        {defaultCards.map((course) => {
          return (
            <div
              key={course.id}
              onClick={() => handleCardClick(course)}
              className="rounded-2xl border border-[#ecdccb] bg-[#faf8f5]/60 hover:bg-white p-3.5 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md cursor-pointer hover:border-[#c4431d]/40"
              title={`Click to view ${course.title} and open next step`}
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
                <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 mb-2.5 relative flex items-center justify-center border border-stone-200/60">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-100 via-stone-200/60 to-amber-50/80 flex flex-col items-center justify-center gap-1 p-2 text-center">
                      <BookOpen size={22} className="text-[#942008]/40" />
                      <span className="text-[10px] font-bold text-stone-600 line-clamp-1">{course.title}</span>
                    </div>
                  )}
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

              {/* Bottom Action Row (Percentage tracking removed per user request) */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#c4431d] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{course.isEnrolled ? 'Open Next Step' : course.price || 'Unlock'}</span>
                  <ArrowRight size={12} />
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(course);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer shrink-0 ${
                    course.isEnrolled
                      ? 'bg-[#e86034] hover:bg-[#c4431d] text-white'
                      : 'bg-stone-100 hover:bg-[#fff2ea] border border-stone-200 hover:border-[#fbdcd0] text-stone-500 hover:text-[#c4431d]'
                  }`}
                  title={course.isEnrolled ? `Play ${course.title}` : `Unlock ${course.title}`}
                >
                  {course.isEnrolled ? (
                    <Play size={11} className="fill-white ml-0.5" />
                  ) : (
                    <Lock size={12} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
