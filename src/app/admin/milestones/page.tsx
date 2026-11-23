"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Target, CheckCircle2, Circle, Plus, Trash2, Edit2, Check, X, Search, Filter, Calendar, Loader2 } from "lucide-react";

import { ListSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL } from "@/config/api";

export default function AdminMilestones() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({ name: "", completed: false });
  const [applyToAll, setApplyToAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [togglingMilestoneId, setTogglingMilestoneId] = useState<string | null>(null);
  const [isSavingNameId, setIsSavingNameId] = useState<string | null>(null);
  const [deletingMilestoneId, setDeletingMilestoneId] = useState<string | null>(null);

  const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const headers = { Authorization: `Bearer ${effectiveToken}`, "Content-Type": "application/json" };
  const API = API_BASE_URL;

  // Fetch all milestones (flat list with student context from dedicated endpoint)
  const fetchMilestones = async () => {
    try {
      const res = await fetch(`${API}/admin/milestones`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMilestones(data);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  // Fetch lean student list for the student filter dropdown
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/admin/students/summary`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setStudents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) {
      fetchMilestones();
      fetchStudents();
    }
  }, [token]);


  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const toggleMilestone = async (milestoneId: string, current: boolean) => {
    setTogglingMilestoneId(milestoneId);
    try {
      await fetch(`${API}/admin/milestones/${milestoneId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ completed: !current, completedAt: !current ? new Date() : null })
      });
      await fetchMilestones();
      showSuccess("Milestone status updated!");
    } catch (_) {
    } finally {
      setTogglingMilestoneId(null);
    }
  };

  const saveMilestoneName = async (milestoneId: string) => {
    if (!editingName.trim()) return;
    setIsSavingNameId(milestoneId);
    try {
      await fetch(`${API}/admin/milestones/${milestoneId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ name: editingName.trim() })
      });
      setEditingMilestoneId(null);
      setEditingName("");
      await fetchMilestones();
      showSuccess("Milestone title updated!");
    } catch (_) {
    } finally {
      setIsSavingNameId(null);
    }
  };

  const startEditing = (m: any) => {
    setEditingMilestoneId(m.id);
    setEditingName(m.name);
  };

  const deleteMilestone = async (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    setDeletingMilestoneId(milestoneId);
    try {
      await fetch(`${API}/admin/milestones/${milestoneId}`, { method: 'DELETE', headers });
      await fetchMilestones();
      showSuccess("Milestone deleted!");
    } catch (_) {
    } finally {
      setDeletingMilestoneId(null);
    }
  };

  const addMilestone = async () => {
    if (!newMilestone.name.trim()) return;
    setIsAddingMilestone(true);
    try {
      if (applyToAll || selectedStudentId === "all") {
        // Add to all students
        for (const s of students) {
          await fetch(`${API}/admin/students/${s.id}/milestones`, {
            method: 'POST', headers,
            body: JSON.stringify({
              name: newMilestone.name.trim(),
              completed: newMilestone.completed,
              completedAt: newMilestone.completed ? new Date().toISOString() : null,
              order: 99
            })
          });
        }
        showSuccess(`Milestone added to all ${students.length} students!`);
      } else {
        await fetch(`${API}/admin/students/${selectedStudentId}/milestones`, {
          method: 'POST', headers,
          body: JSON.stringify({
            name: newMilestone.name.trim(),
            completed: newMilestone.completed,
            completedAt: newMilestone.completed ? new Date().toISOString() : null,
            order: 99
          })
        });
        showSuccess("Milestone added to student!");
      }
      setNewMilestone({ name: "", completed: false });
      await fetchMilestones();
    } catch (_) {
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const displayedMilestones = milestones
    .filter(m => selectedStudentId === "all" || m.studentId === selectedStudentId)
    .filter(m => filterStatus === "all" || (filterStatus === "completed" ? m.completed : !m.completed))
    .filter(m => !searchQuery.trim() || m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.studentName?.toLowerCase().includes(searchQuery.toLowerCase()));

  const total = milestones.length;
  const done = milestones.filter(m => m.completed).length;
  const pending = total - done;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {successMsg && (
          <div className="mb-6">
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full inline-flex items-center gap-2">
              <CheckCircle2 size={16} /> {successMsg}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Milestones", value: total, color: "text-stone-900" },
            { label: "Completed", value: done, color: "text-green-400" },
            { label: "Pending", value: pending, color: "text-[#c4431d]" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/95 border border-[#ecdccb] rounded-3xl p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
              <p className="text-stone-500 text-sm mb-1 font-bold">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add Milestone */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl p-6 mb-8 shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#c4431d]" /> Add New Milestone
          </h2>
          <div className="flex gap-3 flex-wrap items-center">
            <select
              value={selectedStudentId}
              onChange={e => {
                setSelectedStudentId(e.target.value);
                if (e.target.value === "all") setApplyToAll(true);
              }}
              className="bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors min-w-[200px]"
            >
              <option value="all">-- All Students (Global) --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="e.g. 100th Resin Piece Mastered..."
              value={newMilestone.name}
              onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addMilestone()}
              className="flex-1 min-w-[240px] bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
            />
            <label className="flex items-center gap-2 text-sm text-stone-600 px-3 cursor-pointer select-none font-medium">
              <input
                type="checkbox"
                checked={newMilestone.completed}
                onChange={e => setNewMilestone({ ...newMilestone, completed: e.target.checked })}
                className="accent-[#c4431d] w-4 h-4 rounded"
              />
              Mark Completed
            </label>
            <button
              onClick={addMilestone}
              disabled={isAddingMilestone || !newMilestone.name.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-black disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer"
            >
              {isAddingMilestone ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Save Milestone
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-3 mb-6 items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-stone-400" />
            {(['all', 'completed', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize cursor-pointer ${
                  filterStatus === f ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white font-black shadow-xs' : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search milestone or student..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
            />
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-[#fcfaf7] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
            >
              <option value="all">All Students ({students.length})</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#fcfaf7] border-b border-stone-200 text-xs font-bold text-stone-600 uppercase tracking-wider">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Milestone Title (Click Pencil to Edit)</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {isLoading ? (
            <ListSkeleton count={5} />
          ) : displayedMilestones.length === 0 ? (
            <div className="p-12 text-center text-stone-400 font-medium">No milestones found.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {displayedMilestones.map(m => (
                <div
                  key={m.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#fff5ee]/60 transition-colors ${
                    m.completed ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Checkbox Status */}
                  <div className="col-span-1">
                    <button
                      onClick={() => toggleMilestone(m.id, m.completed)}
                      disabled={togglingMilestoneId === m.id}
                      title={m.completed ? "Mark as Incomplete" : "Mark as Completed"}
                      className="cursor-pointer disabled:opacity-50"
                    >
                      {togglingMilestoneId === m.id ? (
                        <Loader2 size={22} className="animate-spin text-[#c4431d]" />
                      ) : m.completed ? (
                        <CheckCircle2 size={22} className="text-emerald-400 hover:scale-110 transition-transform" />
                      ) : (
                        <Circle size={22} className="text-stone-400 hover:text-[#c4431d] transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Milestone Name & Inline Edit */}
                  <div className="col-span-6">
                    {editingMilestoneId === m.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveMilestoneName(m.id);
                            if (e.key === 'Escape') setEditingMilestoneId(null);
                          }}
                          autoFocus
                          className="flex-1 bg-white border border-[#c4431d] rounded-xl px-3 py-1.5 text-sm text-stone-900 focus:outline-none"
                        />
                        <button
                          onClick={() => saveMilestoneName(m.id)}
                          disabled={isSavingNameId === m.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg cursor-pointer disabled:opacity-50"
                          title="Save Changes"
                        >
                          {isSavingNameId === m.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        </button>
                        <button
                          onClick={() => setEditingMilestoneId(null)}
                          className="bg-stone-200 hover:bg-stone-300 text-stone-700 p-1.5 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className={`font-semibold text-sm ${m.completed ? 'text-stone-500 line-through' : 'text-stone-900 font-bold'}`}>
                          {m.name}
                        </p>
                        <button
                          onClick={() => startEditing(m)}
                          className="text-stone-400 hover:text-[#c4431d] p-1 transition-colors cursor-pointer"
                          title="Edit Milestone Name"
                        >
                          <Edit2 size={13} />
                        </button>
                        {m.completed && m.completedAt && (
                          <span className="text-xs text-emerald-400 font-medium ml-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {new Date(m.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Student Name */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                        {m.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-stone-700 text-xs font-medium">{m.studentName}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEditing(m)}
                      className="text-stone-400 hover:text-[#c4431d] p-1.5 bg-stone-100 hover:bg-[#fff5ee] rounded-lg transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteMilestone(m.id)}
                      disabled={deletingMilestoneId === m.id}
                      className="text-stone-400 hover:text-rose-600 p-1.5 bg-stone-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Milestone"
                    >
                      {deletingMilestoneId === m.id ? <Loader2 size={14} className="animate-spin text-rose-600" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
