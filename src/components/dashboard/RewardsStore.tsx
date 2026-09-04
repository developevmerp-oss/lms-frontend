"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Lock, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
    id: 'reward-1',
    title: 'Exclusive Resin Art Templates & Cutouts',
    description: 'Download ready-to-print vector templates, clock dial bases, and coaster cutout designs.',
    pointCost: 500,
    imageUrl: '',
  },
  {
    id: 'reward-2',
    title: 'Live Masterclass Workshop (10% Off)',
    description: 'Get an exclusive 10% discount pass for upcoming VIP live interactive workshops.',
    pointCost: 1000,
    imageUrl: '',
  },
  {
    id: 'reward-3',
    title: 'Store Merchandise & Materials (15% Off)',
    description: 'Claim 15% discount coupon on pigments, silicone molds, crystal glass, and tools.',
    pointCost: 1500,
    imageUrl: '',
  },
  {
    id: 'reward-4',
    title: '1-on-1 Consulting & Portfolio Review',
    description: 'Personalized 30-minute private portfolio critique and art business roadmap with Vrajangna Patel.',
    pointCost: 2000,
    imageUrl: '',
  },
  {
    id: 'reward-5',
    title: 'Complete Brand Success Kit',
    description: 'All-in-one packaging guidelines, pricing calculator spreadsheet, and legal client contract templates.',
    pointCost: 3000,
    imageUrl: '',
  },
];

export const RewardsStore = ({ currentPoints, onRedeem }: { currentPoints: number, onRedeem: () => void }) => {
  const { token } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [isLoading, setIsLoading] = useState(false);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/rewards`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setRewards(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching rewards:", err);
          setIsLoading(false);
        });
    }
  }, [token]);

  const handleRedeem = async (reward: Reward) => {
    if (currentPoints < reward.pointCost || redeeming) return;
    
    if (!confirm(`Redeem "${reward.title}" for ${reward.pointCost} XP?`)) return;

    setRedeeming(reward.id);
    try {
      const res = await fetch(`${API_BASE_URL}/rewards/${reward.id}/redeem`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        alert("Reward redeemed successfully! Check your email for details.");
        onRedeem(); // trigger parent update to refresh points
      } else {
        const data = await res.json();
        alert(data.message || "Failed to redeem reward.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl mt-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Gift className="text-pink-500" />
          <h2 className="text-xl font-bold text-white">Rewards Store</h2>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full text-orange-400 font-bold text-sm">
          {currentPoints.toLocaleString('en-IN')} XP Available
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-slate-600" size={32} />
        </div>
      ) : rewards.length === 0 ? (
        <div className="text-center p-8 text-slate-500">
          No rewards available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map(reward => {
            const canAfford = currentPoints >= reward.pointCost;
            return (
              <div key={reward.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-600 transition-colors">
                <div className="h-32 bg-slate-800 relative overflow-hidden">
                  {reward.imageUrl ? (
                    <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Gift size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-orange-400 flex items-center gap-1">
                    {reward.pointCost} XP
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-white mb-1 line-clamp-1">{reward.title}</h3>
                  <p className="text-slate-400 text-xs mb-4 flex-1 line-clamp-2">{reward.description}</p>
                  
                  <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeeming === reward.id}
                    className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      redeeming === reward.id
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : canAfford 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {redeeming === reward.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : canAfford ? (
                      'Redeem Now'
                    ) : (
                      <>
                        <Lock size={14} /> Need {reward.pointCost - currentPoints} more XP
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
