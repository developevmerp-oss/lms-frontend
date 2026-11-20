"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Image as ImageIcon, Send, X, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { StudentNav } from "@/components/layout/StudentNav";

export default function StudentPortfolio() {
  const { user, token, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', technique: '', imageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', technique: '', imageUrl: '' });
        alert('Artwork submitted successfully! A mentor will review it shortly.');
        // In a real app we'd refetch portfolios here
      } else {
        const err = await res.json();
        alert(err.message || 'Submission failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-[284px]"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <StudentNav user={user} level={user?.membershipLevel || "General"} points={user?.points || 0} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-medium">
            <span>Student Hub</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium">My Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/dashboard" className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-full transition-colors" title="Back to Dashboard">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
                My Portfolio
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                Upload and showcase your finished resin artwork for mentor feedback.
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white/95 backdrop-blur-xl border border-[#ecdccb] p-8 rounded-3xl min-h-[60vh] flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <div className="w-24 h-24 bg-[#fde5d6] rounded-full flex items-center justify-center mb-6 shadow-md shadow-[#c4431d]/20 border border-[#f5ded0] text-[#942008]">
            <ImageIcon size={40} className="text-[#c4431d]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Showcase Your Journey</h2>
          <p className="text-stone-600 max-w-md mb-8">
            Upload your finished resin pieces here. Our Diamond Mentors will review your work, provide feedback, and update your Skill Mastery scores!
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-3 px-8 rounded-full shadow-md shadow-[#c4431d]/25 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Send size={18} /> Submit New Artwork
          </button>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-[0_20px_50px_-15px_rgba(90,55,20,0.2)]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#fff2ea] border border-[#f5ded0] flex items-center justify-center text-[#e86034] shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">Upload Artwork</h2>
                <p className="text-xs text-stone-500">Submit your masterpiece for mentor review</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#faf8f5] border border-[#ecdccb] rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:bg-white focus:ring-2 focus:ring-[#c4431d]/10 transition-all"
                  placeholder="e.g. Ocean Wave Coaster"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Technique Used</label>
                <select 
                  required
                  value={formData.technique}
                  onChange={e => setFormData({...formData, technique: e.target.value})}
                  className="w-full bg-[#faf8f5] border border-[#ecdccb] rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#c4431d] focus:bg-white focus:ring-2 focus:ring-[#c4431d]/10 transition-all cursor-pointer"
                >
                  <option value="">Select a technique...</option>
                  <option value="Resin Basics">Resin Basics</option>
                  <option value="Marbling">Marbling</option>
                  <option value="Beach Theme">Beach Theme</option>
                  <option value="Geode Art">Geode Art</option>
                  <option value="3D Encapsulation">3D Encapsulation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-[#faf8f5] border border-[#ecdccb] rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#c4431d] focus:bg-white focus:ring-2 focus:ring-[#c4431d]/10 transition-all"
                  placeholder="https://imgur.com/... or similar"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#c4431d]/20 disabled:opacity-50 cursor-pointer text-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit to Mentor'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
