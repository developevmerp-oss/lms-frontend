"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Image as ImageIcon, Send, X, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function StudentPortfolio() {
  const { user, token } = useAuth();
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
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student/dashboard" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            My Portfolio
          </h1>
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-3xl min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/10 border border-purple-500/30">
            <ImageIcon size={40} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Showcase Your Journey</h2>
          <p className="text-gray-400 max-w-md mb-8">
            Upload your finished resin pieces here. Our Diamond Mentors will review your work, provide feedback, and update your Skill Mastery scores!
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Send size={18} /> Submit New Artwork
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="text-pink-400" /> Upload Artwork
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="e.g. Ocean Wave Coaster"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Technique Used</label>
                <select 
                  required
                  value={formData.technique}
                  onChange={e => setFormData({...formData, technique: e.target.value})}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
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
                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="https://imgur.com/... or similar"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50"
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
