"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StudentNav } from "@/components/layout/StudentNav";
import { BookOpen, PlayCircle, FileText, ChevronRight, CheckCircle2, Video, X, Layers, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { API_BASE_URL } from "@/config/api";

function formatEmbedUrl(url: string): string {
  if (!url) return "";
  // YouTube watch?v= or youtu.be/
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  // Google Drive view -> preview
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // Vimeo
  if (url.includes("vimeo.com/")) {
    const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }
  return url;
}

export default function StudentCourses() {
  const { user, token, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ points: 0, notifications: [] });
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeVideoLesson, setActiveVideoLesson] = useState<{ title: string; videoUrl: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    
    // Fetch user stats for the StudentNav
    fetch(`${API_BASE_URL}/dashboard/student`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setStats({ points: data.points, notifications: data.notifications, membershipLevel: data.membershipLevel });
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <StudentNav 
        user={user} 
        level={getLevelName()} 
        points={stats.points} 
        logout={logout} 
        notifications={stats.notifications}
      />

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8">
        <header className="mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
            <BookOpen size={13} className="text-orange-400" /> Video Learning Curriculum
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            My Course Library
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Open any course folder below to watch high-definition video lessons and study guides.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={course.id} 
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-orange-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg group-hover:text-orange-400 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                      <Layers size={12} className="text-orange-400" /> {course.chapters?.length || 0} Video Lessons
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                  {course.description || "Master step-by-step resin art techniques, tools, and business strategies."}
                </p>
              </div>

              <button 
                onClick={() => setSelectedCourse(course)}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>📂 Open Course Lessons</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-8">
              <BookOpen size={56} className="text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Courses Available Yet</h3>
              <p className="text-slate-400 text-sm">Course modules will appear here once published by your mentor.</p>
            </div>
          )}
        </div>
      </main>

      {/* Chapter Viewer Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">Course Folder</span>
                  <h2 className="text-xl font-black text-white">{selectedCourse.title}</h2>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCourse(null)} 
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-3">
              {selectedCourse.chapters?.length > 0 ? (
                selectedCourse.chapters.map((chapter: any, index: number) => (
                  <div key={chapter.id} className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{chapter.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          {chapter.videoUrl ? "HD Video Lesson Available" : "Study Notes"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {chapter.videoUrl && (
                        <button
                          onClick={() => setActiveVideoLesson({ title: chapter.title, videoUrl: chapter.videoUrl })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 rounded-xl text-xs font-black transition-all hover:scale-105 shadow-md shadow-orange-500/10 cursor-pointer"
                        >
                          <PlayCircle size={15} /> Watch Lesson
                        </button>
                      )}

                      {chapter.pdfUrl && (
                        <a
                          href={chapter.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                        >
                          <FileText size={14} className="text-blue-400" /> Read PDF
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {!chapter.videoUrl && !chapter.pdfUrl && (
                        <span className="text-slate-500 text-xs flex items-center gap-1.5 py-1">
                          <CheckCircle2 size={14} /> Lesson Notes
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-sm">No chapters have been added to this course yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Embedded Video Lesson Player Modal */}
      {activeVideoLesson && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl text-white relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Video className="text-orange-400" size={20} />
                <h3 className="text-lg font-black text-white truncate max-w-md">
                  {activeVideoLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoLesson(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              {activeVideoLesson.videoUrl.startsWith("data:video") || activeVideoLesson.videoUrl.endsWith(".mp4") || activeVideoLesson.videoUrl.endsWith(".webm") ? (
                <video src={activeVideoLesson.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={formatEmbedUrl(activeVideoLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
