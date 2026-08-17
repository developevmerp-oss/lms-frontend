"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { BookOpen, Plus, X, Layers, FileVideo, FileText } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function AdminCourses() {
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterVideo, setChapterVideo] = useState("");
  const [chapterPdf, setChapterPdf] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourses = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCourses(data); })
      .catch(err => console.error("Error fetching courses", err));
  };

  useEffect(() => {
    if (token) fetchCourses();
  }, [token]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setShowCourseModal(false);
        setTitle("");
        setDescription("");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showChapterModal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${showChapterModal}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: chapterTitle, videoUrl: chapterVideo, pdfUrl: chapterPdf })
      });
      if (res.ok) {
        setShowChapterModal(null);
        setChapterTitle(""); setChapterVideo(""); setChapterPdf("");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
            <p className="text-slate-400 mt-2">Create course content and add chapters for students.</p>
          </div>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} /> Create New Course
          </button>
        </header>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BookOpen size={48} className="text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">No courses yet</p>
            <p className="text-slate-600 text-sm mt-1">Click "Create New Course" to add your first course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col shadow-xl hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="text-orange-500" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                      <Layers size={12} /> {course.chapters?.length || 0} Chapters
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">{course.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-700">
                    Edit
                  </button>
                  <button 
                    onClick={() => setShowChapterModal(course.id)}
                    className="flex-1 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl text-sm font-bold transition-colors border border-orange-500/20"
                  >
                    + Chapter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Course Creation Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Course</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Course Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors" 
                  placeholder="e.g. Resin Geode Masterclass" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Description</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Describe what students will learn..." />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl font-bold transition-colors">
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add Chapter</h2>
              <button onClick={() => setShowChapterModal(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddChapter} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">Chapter Title</label>
                <input type="text" required value={chapterTitle} onChange={e => setChapterTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                  placeholder="e.g. Module 1: Introduction" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium flex items-center gap-2">
                  <FileVideo size={14} /> Video URL (Optional)
                </label>
                <input type="text" value={chapterVideo} onChange={e => setChapterVideo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium flex items-center gap-2">
                  <FileText size={14} /> PDF URL (Optional)
                </label>
                <input type="text" value={chapterPdf} onChange={e => setChapterPdf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://drive.google.com/..." />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowChapterModal(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl font-bold transition-colors">
                  {isSubmitting ? 'Adding...' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
