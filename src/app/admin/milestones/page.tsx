"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Target, CheckCircle2, Circle, Plus, Trash2, Edit2, Check, X, Search, Filter, Calendar } from "lucide-react";

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

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const API = API_BASE_URL;

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/admin/students`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
        const all = data.flatMap((s: any) =>
          (s.milestones || []).map((m: any) => ({ ...m, studentName: s.name, studentId: s.id }))
        );
        setMilestones(all);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  useEffect(() => { if (token) fetchStudents(); }, [token]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const toggleMilestone = async (milestoneId: string, current: boolean) => {
    await fetch(`${API}/admin/milestones/${milestoneId}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ completed: !current, completedAt: !current ? new Date() : null })
    });
    await fetchStudents();
    showSuccess("Milestone status updated!");
  };

  const saveMilestoneName = async (milestoneId: string) => {
    if (!editingName.trim()) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ name: editingName.trim() })
    });
    setEditingMilestoneId(null);
    setEditingName("");
    await fetchStudents();
    showSuccess("Milestone title updated!");
  };

  const startEditing = (m: any) => {
    setEditingMilestoneId(m.id);
    setEditingName(m.name);
  };

  const deleteMilestone = async (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, { method: 'DELETE', headers });
    await fetchStudents();
    showSuccess("Milestone deleted!");
  };

  const addMilestone = async () => {
    if (!newMilestone.name.trim()) return;

    if (applyToAll || selectedStudentId === "all") {
      // Add to all students
      for (const s of students) {
        await fetch(`${API}/admin/students/${s.id}/milestones`, {
          method: 'POST', headers,
          body: JSON.stringify({ name: newMilestone.name.trim(), completed: newMilestone.completed, order: 99 })
        });
      }
      showSuccess(`Milestone added to all ${students.length} students!`);
    } else {
      await fetch(`${API}/admin/students/${selectedStudentId}/milestones`, {
        method: 'POST', headers,
        body: JSON.stringify({ name: newMilestone.name.trim(), completed: newMilestone.completed, order: 99 })
      });
      showSuccess("Milestone added to student!");
    }

    setNewMilestone({ name: "", completed: false });
    await fetchStudents();
  };

  const displayedMilestones = milestones
    .filter(m => selectedStudentId === "all" || m.studentId === selectedStudentId)
    .filter(m => filterStatus === "all" || (filterStatus === "completed" ? m.completed : !m.completed))
    .filter(m => !searchQuery.trim() || m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.studentName?.toLowerCase().includes(searchQuery.toLowerCase()));

  const total = milestones.length;
  const done = milestones.filter(m => m.completed).length;
  const pending = total - done;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="text-orange-500" /> Milestone Management
            </h1>
            <p className="text-slate-400 mt-2">
              Create, rename, complete, and customize Business Milestones across all student journeys.
            </p>
          </div>
          {successMsg && (
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 self-start md:self-auto">
              <CheckCircle2 size={16} /> {successMsg}
            </span>
          )}
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Milestones", value: total, color: "text-white" },
            { label: "Completed", value: done, color: "text-green-400" },
            { label: "Pending", value: pending, color: "text-orange-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add Milestone */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Plus size={18} className="text-orange-500" /> Add New Milestone
          </h2>
          <div className="flex gap-3 flex-wrap items-center">
            <select
              value={selectedStudentId}
              onChange={e => {
                setSelectedStudentId(e.target.value);
                if (e.target.value === "all") setApplyToAll(true);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors min-w-[200px]"
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
              className="flex-1 min-w-[240px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
            />
            <label className="flex items-center gap-2 text-sm text-slate-400 px-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newMilestone.completed}
                onChange={e => setNewMilestone({ ...newMilestone, completed: e.target.checked })}
                className="accent-orange-500 w-4 h-4 rounded"
              />
              Mark Completed
            </label>
            <button
              onClick={addMilestone}
              disabled={!newMilestone.name.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus size={16} /> Save Milestone
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-3 mb-6 items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            {(['all', 'completed', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize cursor-pointer ${
                  filterStatus === f ? 'bg-orange-500 text-slate-950 font-black' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
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
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
            />
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
            >
              <option value="all">All Students ({students.length})</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Milestone Title (Click Pencil to Edit)</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading milestones...</div>
          ) : displayedMilestones.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No milestones found.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {displayedMilestones.map(m => (
                <div
                  key={m.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors ${
                    m.completed ? 'bg-slate-900/40' : ''
                  }`}
                >
                  {/* Checkbox Status */}
                  <div className="col-span-1">
                    <button
                      onClick={() => toggleMilestone(m.id, m.completed)}
                      title={m.completed ? "Mark as Incomplete" : "Mark as Completed"}
                      className="cursor-pointer"
                    >
                      {m.completed
                        ? <CheckCircle2 size={22} className="text-emerald-400 hover:scale-110 transition-transform" />
                        : <Circle size={22} className="text-slate-600 hover:text-orange-500 transition-colors" />
                      }
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
                          className="flex-1 bg-slate-950 border border-orange-500 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                        />
                        <button
                          onClick={() => saveMilestoneName(m.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-1.5 rounded-lg cursor-pointer"
                          title="Save Changes"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingMilestoneId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className={`font-semibold text-sm ${m.completed ? 'text-slate-300' : 'text-white'}`}>
                          {m.name}
                        </p>
                        <button
                          onClick={() => startEditing(m)}
                          className="text-slate-500 hover:text-orange-400 p-1 transition-colors cursor-pointer"
                          title="Edit Milestone Name"
                        >
                          <Edit2 size={13} />
                        </button>
                        {m.completed && m.completedAt && (
                          <span className="text-[11px] text-emerald-400 font-medium ml-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {new Date(m.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Student Name */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400">
                        {m.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-300 text-xs font-medium">{m.studentName}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEditing(m)}
                      className="text-slate-400 hover:text-orange-400 p-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteMilestone(m.id)}
                      className="text-slate-400 hover:text-red-400 p-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 size={14} />
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
