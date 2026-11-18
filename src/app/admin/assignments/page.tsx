"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { ClipboardList, Plus, X, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function AdminAssignments() {
  const { token, user, logout } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(50);
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'assignments'>('pending');

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    if (!token) return;
    try {
      const [assnRes, subRes, courseRes] = await Promise.all([
        fetch(`${API_BASE_URL}/assignments`, { headers }),
        fetch(`${API_BASE_URL}/assignments/submissions`, { headers }),
        fetch(`${API_BASE_URL}/courses`, { headers }),
      ]);
      const assnData = await assnRes.json();
      const subData = await subRes.json();
      const courseData = await courseRes.json();
      if (Array.isArray(assnData)) setAssignments(assnData);
      if (Array.isArray(subData)) setSubmissions(subData);
      if (Array.isArray(courseData)) setCourses(courseData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, description, points, dueDate, courseId: courseId || courses[0]?.id }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setTitle(""); setDescription(""); setPoints(50); setDueDate(""); setCourseId("");
        await fetchData();
        showSuccess("Assignment created!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = async (submissionId: string, status: string, pointsAwarded: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/assignments/submissions/${submissionId}/review`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status, pointsAwarded }),
      });
      if (res.ok) {
        await fetchData();
        showSuccess(status === "approved" ? "Submission approved!" : "Submission rejected.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pending = submissions.filter(s => s.status === "pending");
  const reviewed = submissions.filter(s => s.status !== "pending");

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
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
              <ClipboardList className="text-purple-400" /> Assignment Management
            </h1>
            <p className="text-stone-500 mt-2 font-medium">Create tasks, review submissions, and award points.</p>
          </div>
          <div className="flex items-center gap-4">
            {successMsg && (
              <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle2 size={14} /> {successMsg}
              </span>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold transition-all shadow-md shadow-[#c4431d]/25"
            >
              <Plus size={18} /> Create Assignment
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Assignments", value: assignments.length, color: "text-purple-400" },
            { label: "Pending Review", value: pending.length, color: "text-yellow-400" },
            { label: "Approved", value: submissions.filter(s => s.status === "approved").length, color: "text-green-400" },
            { label: "Rejected", value: submissions.filter(s => s.status === "rejected").length, color: "text-red-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
              <p className="text-stone-500 text-sm mb-1 font-bold">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-[#ecdccb] p-1.5 rounded-2xl w-fit shadow-xs">
          {([['pending', '⏳ Needs Review'], ['assignments', '📋 All Assignments']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`}
            >
              {label} {tab === 'pending' && pending.length > 0 && (
                <span className="ml-1 bg-[#fde5d6] text-[#942008] border border-[#f5ded0] text-xs font-black px-1.5 py-0.5 rounded-full">{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pending Submissions */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
                <CheckCircle2 size={48} className="text-green-500/30 mb-4" />
                <p className="text-stone-700 font-bold">All caught up!</p>
                <p className="text-stone-400 text-sm mt-1">No pending submissions to review.</p>
              </div>
            ) : (
              pending.map(sub => (
                <div key={sub.id} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-6 flex items-start md:items-center gap-6 justify-between flex-wrap shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-lg shrink-0">
                      {(sub.student?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{sub.student?.name} <span className="text-stone-400 text-sm font-normal">({sub.student?.email})</span></p>
                      <p className="text-sm text-purple-400 mt-0.5">Assignment: {sub.assignment?.title}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-stone-400 flex items-center gap-1"><Clock size={12} /> Submitted {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-IN') : ''}</span>
                        {sub.fileUrl && (
                          <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <ExternalLink size={12} /> View File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(sub.id, 'rejected', 0)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-bold"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      onClick={() => handleReview(sub.id, 'approved', sub.assignment?.points || 50)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors text-sm font-bold"
                    >
                      <CheckCircle2 size={16} /> Approve (+{sub.assignment?.points || 50} pts)
                    </button>
                  </div>
                </div>
              ))
            )}

            {reviewed.length > 0 && (
              <div className="mt-8">
                <h3 className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-4">Recently Reviewed</h3>
                <div className="space-y-2">
                  {reviewed.slice(0, 5).map(sub => (
                    <div key={sub.id} className="bg-[#fcfaf7] border border-stone-200 rounded-xl px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                          {(sub.student?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-stone-800 text-sm font-semibold">{sub.student?.name}</span>
                        <span className="text-stone-400 text-xs">— {sub.assignment?.title}</span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${sub.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* All Assignments */}
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.length === 0 ? (
              <div className="col-span-3 bg-white/95 border border-[#ecdccb] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
                <ClipboardList size={48} className="text-stone-300 mb-4" />
                <p className="text-stone-700 font-bold">No assignments yet</p>
                <p className="text-stone-400 text-sm mt-1">Create your first assignment above</p>
              </div>
            ) : assignments.map(assn => (
              <div key={assn.id} className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 flex flex-col shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] hover:border-[#c4431d]/40 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-stone-900">{assn.title}</h3>
                  <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-full border border-purple-400/20">{assn.points} pts</span>
                </div>
                <p className="text-stone-600 text-sm flex-1 mb-4 line-clamp-2">{assn.description}</p>
                <div className="flex items-center justify-between text-xs text-stone-400 mt-auto font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Due: {assn.dueDate ? new Date(assn.dueDate).toLocaleDateString('en-IN') : '—'}
                  </span>
                  <span>{submissions.filter(s => s.assignmentId === assn.id).length} submissions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-stone-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <ClipboardList className="text-purple-400" /> Create Assignment
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                  placeholder="e.g. Create a Resin Clock" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Description</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors resize-none"
                  placeholder="What should the student do?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Points</label>
                  <input type="number" required value={points} onChange={e => setPoints(Number(e.target.value))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors" min={1} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Due Date</label>
                  <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Course</label>
                <select required value={courseId} onChange={e => setCourseId(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors">
                  <option value="" disabled>Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors font-bold border border-stone-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25">
                  {isSubmitting ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
