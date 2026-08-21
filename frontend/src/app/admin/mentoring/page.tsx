"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Check, X, Star, ImageIcon, MessageSquare } from "lucide-react";

import { API_BASE_URL } from "@/config/api";

export default function AdminMentoring() {
  const { user, token, logout } = useAuth();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [scores, setScores] = useState({
    resinBasics: 0,
    mixing: 0,
    colourTheory: 0,
    finishing: 0,
    creativity: 0,
    professionalQuality: 0
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPending = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPortfolios(data);
      }
    } catch (err) {
      console.error("Error fetching mentoring portfolios:", err);
    }
  };


  useEffect(() => {
    fetchPending();
  }, [token]);

  const handleSubmitReview = async () => {
    if (!token || !selectedItem) return;
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/portfolios/${selectedItem.id}/review`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          feedback: feedback || 'Artwork reviewed & approved by mentor.',
          scores,
          skills: scores
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`✅ Review submitted! Student awarded 500 XP.`);
        setSelectedItem(null);
        setFeedback("");
        setScores({
          resinBasics: 0,
          mixing: 0,
          colourTheory: 0,
          finishing: 0,
          creativity: 0,
          professionalQuality: 0
        });
        fetchPending();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data?.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreChange = (skill: string, value: string) => {
    setScores(prev => ({ ...prev, [skill]: parseInt(value) || 0 }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mentoring Center</h1>
          <p className="text-slate-400">Review student portfolios, assign skills, and give feedback.</p>
        </header>

        {/* Toast Messages */}
        {successMsg && (
          <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-2xl font-semibold">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl font-semibold">{errorMsg}</div>
        )}

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl min-h-[60vh] shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Star className="text-orange-500" size={32} />
            <h1 className="text-3xl font-bold text-white">Pending Reviews</h1>
          </div>

          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Check size={48} className="mb-4 text-green-500 opacity-50" />
              <p>All caught up! No pending student artworks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map(item => (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors cursor-pointer shadow-lg" onClick={() => setSelectedItem(item)}>
                  <div className="h-48 w-full bg-black">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-90" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                    <p className="text-sm text-orange-400 mb-2">{item.technique}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {item.User?.avatarUrl ? (
                          <img src={item.User.avatarUrl} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <span>{item.User?.name?.charAt(0).toUpperCase() || 'S'}</span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-300">{item.User?.name || 'Unknown Student'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Grading Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <h2 className="text-2xl font-bold text-white">Review: {selectedItem.title}</h2>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Image & Details */}
              <div className="space-y-6">
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-black">
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain" />
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <h3 className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Student Notes</h3>
                  <p className="text-white">"I struggled a bit with getting the lacing exactly right, but I love how the cells turned out."</p>
                </div>
              </div>

              {/* Grading Form */}
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="text-orange-500" size={20} /> Skill Evaluation (1-100)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(scores).map(skill => (
                      <div key={skill} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <label className="block text-xs text-slate-400 mb-1">{skill}</label>
                        <input 
                          type="number" 
                          value={(scores as any)[skill]} 
                          onChange={(e) => handleScoreChange(skill, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-orange-500 transition-colors"
                          min="0" max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="text-blue-400" size={20} /> Mentor Feedback
                  </h3>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white min-h-[120px] outline-none focus:border-orange-500 transition-colors"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">{errorMsg}</div>
                )}
                <button 
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting Review...' : 'Approve & Award XP'}
                  {!isSubmitting && <Check size={20} />}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
