"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  BookOpen,
  Plus,
  X,
  Layers,
  FileVideo,
  FileText,
  Play,
  Trash2,
  Edit2,
  FolderOpen,
  Folder,
  CheckCircle2,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Video,
  Filter,
  Sparkles,
  Trophy
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export const LEVEL_TIER_CONFIG: Record<string, { name: string; price: string; color: string; bg: string; border: string }> = {
  L0: { name: "Fast Track", price: "₹499", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  L1: { name: "Silver Member", price: "₹4,999", color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  L2: { name: "Gold Member", price: "₹19,999", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  L3: { name: "Diamond Club", price: "₹59,999", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  "L3+": { name: "Masters Club", price: "Custom", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

function formatEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  if (url.includes("vimeo.com/")) {
    const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }
  return url;
}

export default function AdminCourses() {
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Course Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    levelCode: "L0",
    order: 1,
  });

  // Chapter Modals
  const [showChapterModal, setShowChapterModal] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    videoType: "url" as "url" | "upload",
    videoUrl: "",
    pdfUrl: "",
  });

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const fetchCourses = () => {
    if (!token) return;
    setIsLoading(true);
    fetch(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (selectedCourse) {
            const updated = data.find((c: any) => c.id === selectedCourse.id);
            if (updated) setSelectedCourse(updated);
          }
        }
      })
      .catch((err) => console.error("Error fetching courses", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (token) fetchCourses();
  }, [token]);

  // Handle Course Create / Update
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    setIsSubmitting(true);
    try {
      let res;
      if (editingCourse) {
        res = await fetch(`${API_BASE_URL}/courses/${editingCourse.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(courseForm),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/courses`, {
          method: "POST",
          headers,
          body: JSON.stringify(courseForm),
        });
      }

      if (res.ok) {
        setShowCourseModal(false);
        setEditingCourse(null);
        setCourseForm({ title: "", description: "", levelCode: "L0", order: 1 });
        showSuccess(editingCourse ? "Course updated successfully!" : "New course created!");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Course Delete
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}" and all its chapters?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        if (selectedCourse?.id === courseId) setSelectedCourse(null);
        showSuccess("Course deleted successfully!");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Chapter Create / Update
  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) return;

    setIsSubmitting(true);
    try {
      let res;
      if (editingChapter) {
        res = await fetch(`${API_BASE_URL}/courses/chapters/${editingChapter.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            title: chapterForm.title,
            videoUrl: chapterForm.videoUrl,
            pdfUrl: chapterForm.pdfUrl,
          }),
        });
      } else if (showChapterModal) {
        res = await fetch(`${API_BASE_URL}/courses/${showChapterModal}/chapters`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: chapterForm.title,
            videoUrl: chapterForm.videoUrl,
            pdfUrl: chapterForm.pdfUrl,
          }),
        });
      }

      if (res?.ok) {
        setShowChapterModal(null);
        setEditingChapter(null);
        setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfUrl: "" });
        showSuccess(editingChapter ? "Chapter updated successfully!" : "Chapter added to course!");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Chapter Delete
  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/courses/chapters/${chapterId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showSuccess("Chapter deleted successfully!");
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirectVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setChapterForm((prev) => ({
        ...prev,
        videoUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSyncCurriculum = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/seed`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("All 30 level-wise courses synced to database!");
        fetchCourses();
      } else {
        alert(data.message || "Failed to sync courses");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedCourses = courses.filter((c) => {
    if (activeLevelFilter === "all") return true;
    return (c.levelCode || "L0").toUpperCase() === activeLevelFilter.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <BookOpen size={13} className="text-orange-400" /> Sequential Level Curriculum
            </span>
            <h1 className="text-3xl font-black text-white">Level-Wise Course Management</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Organize course videos sequentially across L0 (Starter), L1 (Silver), L2 (Gold), and L3 (Diamond).
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSyncCurriculum}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer shadow-md"
              title="Populate or sync all 30 standard courses into the database"
            >
              <Sparkles size={16} /> Sync 30 Curriculum Courses
            </button>

            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({
                  title: "",
                  description: "",
                  levelCode: activeLevelFilter === "all" ? "L0" : activeLevelFilter,
                  order: displayedCourses.length + 1,
                });
                setShowCourseModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <Plus size={18} /> Create New Course
            </button>
          </div>
        </header>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Level Tabs / Filter Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveLevelFilter("all")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeLevelFilter === "all"
                ? "bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Levels ({courses.length})
          </button>

          {(["L0", "L1", "L2", "L3"] as const).map((lvl) => {
            const cfg = LEVEL_TIER_CONFIG[lvl];
            const count = courses.filter((c) => (c.levelCode || "L0").toUpperCase() === lvl).length;
            const isActive = activeLevelFilter === lvl;

            return (
              <button
                key={lvl}
                onClick={() => setActiveLevelFilter(lvl)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${isActive ? "bg-slate-950 text-orange-400" : `${cfg.bg} ${cfg.color}`}`}>
                  {lvl}
                </span>
                <span>{cfg.name}</span>
                <span className="text-[11px] opacity-75 font-mono">({cfg.price})</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800/80 text-[10px] text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-slate-500">Loading curriculum library...</div>
        ) : displayedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8">
            <BookOpen size={48} className="text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Courses Found in this Tier</h3>
            <p className="text-slate-400 text-sm mb-4">Click "Create New Course" to add a course to {activeLevelFilter}.</p>
            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({
                  title: "",
                  description: "",
                  levelCode: activeLevelFilter === "all" ? "L0" : activeLevelFilter,
                  order: 1,
                });
                setShowCourseModal(true);
              }}
              className="bg-orange-500 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl cursor-pointer"
            >
              + Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              const lvl = (course.levelCode || "L0").toUpperCase();
              const cfg = LEVEL_TIER_CONFIG[lvl] || LEVEL_TIER_CONFIG.L0;

              return (
                <div
                  key={course.id}
                  className={`bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all ${
                    isSelected ? "border-orange-500 ring-2 ring-orange-500/30" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {lvl} • {cfg.name}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-bold">
                          {cfg.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              title: course.title,
                              description: course.description || "",
                              levelCode: course.levelCode || "L0",
                              order: course.order || 0,
                            });
                            setShowCourseModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                        {isSelected ? <FolderOpen size={20} /> : <Folder size={20} />}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white leading-snug">{course.title}</h3>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-1 font-semibold">
                          <Layers size={12} className="text-orange-400" /> {course.chapters?.length || 0} Video Lessons
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                      {course.description || "Master step-by-step resin art techniques, tools, and business strategies."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => setSelectedCourse(isSelected ? null : course)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                          : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      }`}
                    >
                      <FolderOpen size={15} />
                      {isSelected ? "Close Folder" : "📂 Open Folder & View Chapters"}
                    </button>

                    <button
                      onClick={() => {
                        setEditingChapter(null);
                        setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfUrl: "" });
                        setShowChapterModal(course.id);
                      }}
                      className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl text-xs font-bold transition-colors border border-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> + Add Chapter / Video Lesson
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Opened Course Chapters Drawer / View */}
        {selectedCourse && (
          <div className="mt-12 bg-slate-900/90 border border-orange-500/40 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <FolderOpen size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                      Tier: {selectedCourse.levelCode || "L0"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({LEVEL_TIER_CONFIG[selectedCourse.levelCode || "L0"]?.price || "₹499"})
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingChapter(null);
                    setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfUrl: "" });
                    setShowChapterModal(selectedCourse.id);
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  <Plus size={15} /> Add Lesson to this Course
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Folder"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chapters List */}
            <div className="mt-6 space-y-3">
              {(selectedCourse.chapters || []).length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-sm mb-3">No chapters uploaded in this course yet.</p>
                  <button
                    onClick={() => {
                      setEditingChapter(null);
                      setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfUrl: "" });
                      setShowChapterModal(selectedCourse.id);
                    }}
                    className="bg-orange-500 text-slate-950 font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    + Add First Chapter
                  </button>
                </div>
              ) : (
                selectedCourse.chapters.map((chapter: any, index: number) => (
                  <div
                    key={chapter.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{chapter.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          {chapter.videoUrl ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <FileVideo size={12} /> Video Attached
                            </span>
                          ) : (
                            <span className="text-slate-600">No Video</span>
                          )}
                          {chapter.pdfUrl && (
                            <span className="text-blue-400 font-semibold flex items-center gap-1">
                              <FileText size={12} /> PDF Attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {chapter.videoUrl && (
                        <button
                          onClick={() => setPreviewVideoUrl(chapter.videoUrl)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Play size={13} className="fill-orange-400" /> Preview Video
                        </button>
                      )}

                      {chapter.pdfUrl && (
                        <a
                          href={chapter.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          <FileText size={13} /> View PDF
                          <ExternalLink size={11} />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setEditingChapter(chapter);
                          setChapterForm({
                            title: chapter.title,
                            videoType: "url",
                            videoUrl: chapter.videoUrl || "",
                            pdfUrl: chapter.pdfUrl || "",
                          });
                          setShowChapterModal(selectedCourse.id);
                        }}
                        className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Edit Chapter"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-2 text-slate-500 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-xl transition-colors cursor-pointer"
                        title="Delete Chapter"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Course Modal (Create / Edit) */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="text-orange-500" size={20} />
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Level Tier</label>
                  <select
                    value={courseForm.levelCode}
                    onChange={(e) => setCourseForm({ ...courseForm, levelCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="L0">L0 (Fast Track - ₹499)</option>
                    <option value="L1">L1 (Silver - ₹4,999)</option>
                    <option value="L2">L2 (Gold - ₹19,999)</option>
                    <option value="L3">L3 (Diamond - ₹59,999)</option>
                    <option value="L3+">L3+ (Masters Club)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Sequence Order #</label>
                  <input
                    type="number"
                    value={courseForm.order}
                    onChange={(e) => setCourseForm({ ...courseForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. 1. Resin Fundamentals"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Describe what students will master in this module..."
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter Modal (Create / Edit) */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <FileVideo className="text-orange-500" size={20} />
                {editingChapter ? "Edit Chapter / Lesson" : "Add Chapter / Lesson"}
              </h2>
              <button
                onClick={() => {
                  setShowChapterModal(null);
                  setEditingChapter(null);
                }}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Module 1: Resin Chemistry & Pouring Technique"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Video Lesson Source</label>
                <div className="flex items-center gap-2 mb-3 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChapterForm({ ...chapterForm, videoType: "url" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      chapterForm.videoType === "url"
                        ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LinkIcon size={13} /> YouTube / Drive / Cloud URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterForm({ ...chapterForm, videoType: "upload" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      chapterForm.videoType === "upload"
                        ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Upload size={13} /> Direct Video Upload
                  </button>
                </div>

                {chapterForm.videoType === "url" ? (
                  <div>
                    <input
                      type="text"
                      value={chapterForm.videoUrl}
                      onChange={(e) => setChapterForm({ ...chapterForm, videoUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      placeholder="https://youtube.com/watch?v=... or Google Drive / MP4 URL"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Paste YouTube, Vimeo, Google Drive, or CDN (.mp4) video link.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleDirectVideoUpload}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-slate-950 hover:file:bg-orange-600 cursor-pointer"
                    />
                    {chapterForm.videoUrl && (
                      <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                        ✓ Video file loaded into player memory
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  PDF / Notes Resource Link (Optional)
                </label>
                <input
                  type="text"
                  value={chapterForm.pdfUrl}
                  onChange={(e) => setChapterForm({ ...chapterForm, pdfUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  placeholder="https://drive.google.com/... (PDF link)"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingChapter ? "Update Lesson" : "Save Lesson"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChapterModal(null);
                    setEditingChapter(null);
                  }}
                  className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-sm h-11 px-5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl text-white relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Video className="text-orange-400" size={18} /> Video Lesson Player
              </h3>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              {previewVideoUrl.startsWith("data:video") || previewVideoUrl.endsWith(".mp4") || previewVideoUrl.endsWith(".webm") ? (
                <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={formatEmbedUrl(previewVideoUrl)}
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
