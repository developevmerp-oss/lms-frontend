"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { ClipboardList, CheckCircle2, Clock, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/api";

export default function StudentAssignments() {
  const { user, token, logout } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [showSubmitModal, setShowSubmitModal] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!token) return;
    try {
      // Nav Stats
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData && !statsData.message) {
        setStats({ points: statsData.points, notifications: statsData.notifications });
      }

      // Assignments
      const assnRes = await fetch(`${API_BASE_URL}/assignments/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const assnData = await assnRes.json();
      if (Array.isArray(assnData)) {
        setAssignments(assnData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSubmitModal) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/assignments/${showSubmitModal}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileUrl })
      });
      
      if (res.ok) {
        setShowSubmitModal(null);
        setFileUrl("");
        await fetchData(); // Refresh to show the submission
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelName = (points: number) => {
    if (points < 500) return "Fast Start (L0)";
    if (points < 5000) return "Silver Member (L1)";
    if (points < 10000) return "Gold Member (L2)";
    if (points < 50000) return "Diamond Club (L3)";
    return "Masters Club (L3+)";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <StudentNav 
        user={user} 
        level={getLevelName(stats.points)} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
            <ClipboardList className="text-orange-500" size={28} /> Daily Tasks & Missions
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-lg">Complete assignments to earn XP points and maintain your streak!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
               <CheckCircle2 size={64} className="text-green-500/50 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h3>
               <p className="text-slate-400">No active assignments available right now. Take a break or explore new courses.</p>
             </div>
          )}

          {assignments.map((assn, idx) => {
            const mySubmission = assn.submissions?.find((sub: any) => sub.studentId === user?.id);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={assn.id} 
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-colors flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white pr-4">{assn.title}</h3>
                  <div className="shrink-0 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    +{assn.points} XP
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 flex-1">{assn.description}</p>
                
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> Due {new Date(assn.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-auto">
                  {mySubmission ? (
                    <div className={`w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 ${
                      mySubmission.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      mySubmission.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {mySubmission.status === 'approved' ? (
                        <><CheckCircle2 size={18} /> Approved (+{mySubmission.pointsAwarded} XP)</>
                      ) : mySubmission.status === 'rejected' ? (
                        <><X size={18} /> Needs Revision</>
                      ) : (
                        <><Clock size={18} /> Pending Review</>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowSubmitModal(assn.id)}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                      <Upload size={18} /> Submit Work
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Upload className="text-orange-500" /> Submit Assignment
              </h2>
              <button 
                onClick={() => setShowSubmitModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Project URL</label>
                <input 
                  type="url" 
                  required 
                  value={fileUrl} 
                  onChange={e => setFileUrl(e.target.value)} 
                  placeholder="e.g. Google Drive link, Instagram post, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors" 
                />
                <p className="text-xs text-slate-500 mt-2">Make sure your link is publicly accessible so mentors can review it.</p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowSubmitModal(null)} 
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !fileUrl}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
