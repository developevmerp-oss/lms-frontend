"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { BookOpen, PlayCircle, FileText, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/api";

export default function StudentCourses() {
  const { user, token, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    if (!token) return;
    
    // Fetch user stats for the StudentNav
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats({ points: data.points, notifications: data.notifications });
        }
      })
      .catch(err => console.error("Error fetching stats", err));

    // Fetch courses
    fetch(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Error fetching courses", err));
  }, [token]);

  const getLevelName = () => {
    return stats.membershipLevel || stats.rank || "Fast Track (L0)";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <StudentNav 
        user={user} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <BookOpen className="text-blue-500" size={32} /> My Journey
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Pick up where you left off and master your art.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={course.id} 
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-blue-500/30 transition-colors group flex flex-col"
            >
              <div className="h-48 bg-slate-800 w-full relative overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900 flex items-center justify-center">
                    <BookOpen size={48} className="text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{course.description}</p>
                
                <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-800">
                  <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <PlayCircle size={16} /> {course.chapters?.length || 0} Modules
                  </span>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="px-5 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {courses.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/50 border border-slate-800 rounded-3xl">
               <BookOpen size={64} className="text-slate-700 mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">No Courses Enrolled</h3>
               <p className="text-slate-400">You haven't started your journey yet. Check out the available courses!</p>
             </div>
          )}
        </div>
      </main>

      {/* Chapter Viewer Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpen className="text-blue-500" /> {selectedCourse.title}
              </h2>
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {selectedCourse.chapters?.length > 0 ? (
                selectedCourse.chapters.map((chapter: any, index: number) => (
                  <div key={chapter.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-white text-lg">{chapter.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pl-11">
                      {chapter.videoUrl && (
                        <a href={chapter.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">
                          <PlayCircle size={16} className="text-orange-400" /> Watch Lesson
                        </a>
                      )}
                      {chapter.pdfUrl && (
                        <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors">
                          <FileText size={16} className="text-blue-400" /> Read Resources
                        </a>
                      )}
                      {!chapter.videoUrl && !chapter.pdfUrl && (
                        <span className="text-slate-500 text-sm flex items-center gap-1.5 py-2">
                          <CheckCircle2 size={16} /> Mark as complete
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500">No chapters have been added to this course yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
