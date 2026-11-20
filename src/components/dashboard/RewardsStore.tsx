"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";

interface Reward {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  imageUrl: string;
}

const DEFAULT_REWARDS: Reward[] = [
  {
    id: "reward-1",
    title: "30 min 1-on-1 Mentoring Call",
    description: "Private 1-on-1 strategy & portfolio review session with Vrajangna Patel.",
    pointCost: 1500,
    imageUrl: "/images/mentor/vrajangna-patel.jpg",
  },
  {
    id: "reward-2",
    title: "15% Off Discount Voucher",
    description: "Redeem 15% discount on any advanced masterclass course.",
    pointCost: 3000,
    imageUrl: "/images/valuestack/resin-rose.jpg",
  },
  {
    id: "reward-3",
    title: "Custom Artistry Journal with Pen",
    description: "Premium hardcover resin artist planner & goal tracking journal.",
    pointCost: 5000,
    imageUrl: "/images/valuestack/resin-amber.jpg",
  },
  {
    id: "reward-4",
    title: "Ravishing Art Physical Merch Kit",
    description: "Complete 9-Piece Merch Bundle: Badge/Fridge Magnet, Keychain.",
    pointCost: 8000,
    imageUrl: "/images/student-art/art-1.jpg",
  },
  {
    id: "reward-5",
    title: "50% OFF Live Ticket + Certification",
    description: "50% discount on live event ticket + printed Renaissance Master Certification.",
    pointCost: 10000,
    imageUrl: "/images/mentor/live-workshop.jpg",
  },
];

export const RewardsStore = ({
  currentPoints = 0,
  onRedeem,
}: {
  currentPoints?: number;
  onRedeem?: () => void;
}) => {
  const { token } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const merged = data.map((d: Reward, idx: number) => ({
              ...d,
              imageUrl:
                d.imageUrl ||
                DEFAULT_REWARDS[idx % DEFAULT_REWARDS.length]?.imageUrl ||
                "",
            }));
            setRewards(merged);
          }
        })
        .catch((err) => {
          console.error("Error fetching rewards:", err);
        });
    }
  }, [token]);

  const total = rewards.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Get current 3 items wrapped around circular buffer
  const visibleRewards = [
    rewards[currentIndex % total],
    rewards[(currentIndex + 1) % total],
    rewards[(currentIndex + 2) % total],
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
            <Gift size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900">Rewards Store</h2>
        </div>

        <Link
          href="/student/rewards"
          className="text-xs font-bold text-[#c4431d] hover:text-[#942008] transition-colors flex items-center gap-0.5 cursor-pointer shrink-0"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Carousel of Reward Items centered with balanced vertical proportions */}
      <div className="flex-1 flex items-center justify-between gap-1.5 py-1">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-stone-200 hover:border-[#c4431d] text-stone-600 hover:text-[#c4431d] shadow-2xs flex items-center justify-center cursor-pointer transition-all shrink-0 z-10"
          aria-label="Previous reward"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Cards Row (3 visible) */}
        <div className="flex-1 grid grid-cols-3 gap-1.5 sm:gap-2">
          {visibleRewards.map((reward, idx) => (
            <Link
              key={`${reward.id}-${idx}`}
              href="/student/rewards"
              className="group flex flex-col items-center cursor-pointer"
              title={`${reward.title} (${reward.pointCost} XP)`}
            >
              <div className="w-full h-20 sm:h-22 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group-hover:border-[#e86034] transition-all">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Reward title */}
              <p className="text-xs font-bold text-stone-800 truncate w-full text-center mt-1 group-hover:text-[#c4431d] transition-colors">
                {reward.title}
              </p>
              {/* XP Pill Tag */}
              <span className="mt-0.5 text-xs sm:text-xs font-extrabold px-1.5 py-0.5 rounded-md bg-[#fff2ea] text-[#c4431d] border border-[#fbdcd0] transition-colors whitespace-nowrap">
                {reward.pointCost} XP
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-stone-200 hover:border-[#c4431d] text-stone-600 hover:text-[#c4431d] shadow-2xs flex items-center justify-center cursor-pointer transition-all shrink-0 z-10"
          aria-label="Next reward"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </motion.div>
  );
};
