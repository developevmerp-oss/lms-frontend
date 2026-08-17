"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Target, CheckCircle2, Circle, Plus, Trash2, Search, Filter } from "lucide-react";

import { API_BASE_URL } from "@/config/api";

export default function AdminMilestones() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({ name: "", completed: false });
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const API = API_BASE_URL;

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/admin/students`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
        // Flatten all milestones with student info
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
      body: JSON.stringify({ completed: !current })
    });
    await fetchStudents();
    showSuccess("Milestone updated!");
  };

  const deleteMilestone = async (milestoneId: string) => {
    if (!confirm("Delete this milestone?")) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, { method: 'DELETE', headers });
    await fetchStudents();
    showSuccess("Milestone deleted!");
  };

  const addMilestone = async () => {
    if (!selectedStudentId || selectedStudentId === "all" || !newMilestone.name.trim()) return;
    await fetch(`${API}/admin/students/${selectedStudentId}/milestones`, {
      method: 'POST', headers,
      body: JSON.stringify({ name: newMilestone.name, completed: newMilestone.completed, order: 99 })
    });
    setNewMilestone({ name: "", completed: false });
    await fetchStudents();
    showSuccess("Milestone added!");
  };

  const displayedMilestones = milestones
    .filter(m => selectedStudentId === "all" || m.studentId === selectedStudentId)
    .filter(m => filterStatus === "all" || (filterStatus === "completed" ? m.completed : !m.completed));

  const total = milestones.length;
  const done = milestones.filter(m => m.completed).length;
  const pending = total - done;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="text-orange-500" /> Milestone Management
            </h1>
            <p className="text-slate-400 mt-2">Track and update business milestones for all students.</p>
          </div>
          {successMsg && (
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <CheckCircle2 size={14} /> {successMsg}
            </span>
          )}
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Milestones", value: total, color: "text-white" },
            { label: "Completed", value: done, color: "text-green-400" },
            { label: "Pending", value: pending, color: "text-orange-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add Milestone */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus size={18} className="text-orange-500" /> Add Milestone</h2>
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors min-w-[180px]"
            >
              <option value="all">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input
              type="text" placeholder="Milestone name..."
              value={newMilestone.name}
              onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addMilestone()}
              className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
            />
            <label className="flex items-center gap-2 text-sm text-slate-400 px-3 cursor-pointer">
              <input type="checkbox" checked={newMilestone.completed}
                onChange={e => setNewMilestone({ ...newMilestone, completed: e.target.checked })}
                className="accent-orange-500 w-4 h-4" />
              Mark as Done
            </label>
            <button
              onClick={addMilestone}
              disabled={selectedStudentId === "all" || !newMilestone.name.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 items-center flex-wrap">
          <Filter size={16} className="text-slate-500" />
          {(['all', 'completed', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors capitalize ${filterStatus === f ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto">
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
            >
              <option value="all">All Students</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Milestone</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-2">Completed</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading milestones...</div>
          ) : displayedMilestones.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No milestones found.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {displayedMilestones.map(m => (
                <div key={m.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors ${m.completed ? 'opacity-80' : ''}`}>
                  <div className="col-span-1">
                    <button onClick={() => toggleMilestone(m.id, m.completed)} title={m.completed ? "Mark Pending" : "Mark Complete"}>
                      {m.completed
                        ? <CheckCircle2 size={22} className="text-green-500 hover:text-green-400 transition-colors" />
                        : <Circle size={22} className="text-slate-600 hover:text-orange-500 transition-colors" />
                      }
                    </button>
                  </div>
                  <div className="col-span-5">
                    <p className={`font-semibold ${m.completed ? 'line-through text-slate-500' : 'text-white'}`}>{m.name}</p>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400">
                        {m.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-400 text-sm">{m.studentName}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-slate-500 text-sm">
                    {m.completedAt ? new Date(m.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => deleteMilestone(m.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={16} />
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
