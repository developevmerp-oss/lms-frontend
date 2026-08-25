"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { API_BASE_URL } from "@/config/api";
import {
  Users, Search, ChevronRight, X, Plus, Trash2, CheckCircle2,
  Circle, Star, Edit3, Trophy, Flame, IndianRupee, BookOpen, Save, UserPlus, Eye, EyeOff
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  points: number;
  xpPoints: number;
  streak: number;
  membershipLevel: string;
  city?: string;
  skills?: any;
  badges?: any[];
  portfolios?: any[];
  milestones?: any[];
  salesRecords?: any[];
  courses?: any[];
}

export default function AdminStudents() {
  const { token, user, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'milestones' | 'sales' | 'skills' | 'courses' | 'badges'>('profile');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', city: '', phone: '' });
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddPwd, setShowAddPwd] = useState(false);

  // Form states
  const [editProfile, setEditProfile] = useState<any>({});
  const [newMilestone, setNewMilestone] = useState({ name: "", completed: false });
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestoneName, setEditingMilestoneName] = useState("");
  const [newSale, setNewSale] = useState({ amount: "", productName: "", date: "" });
  const [skillsForm, setSkillsForm] = useState<any>({});
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  const API = API_BASE_URL;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/admin/students`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setStudents(data);
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  const fetchAllCourses = async () => {
    try {
      const res = await fetch(`${API}/courses`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setAllCourses(data);
    } catch (err) { console.error(err); }
  };

  const fetchAllBadges = async () => {
    try {
      const res = await fetch(`${API}/admin/badges`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setAllBadges(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) { fetchStudents(); fetchAllCourses(); fetchAllBadges(); }
  }, [token]);


  const handleAddStudent = async () => {
    if (!addForm.name || !addForm.email || !addForm.password) {
      setAddError('Name, Email, and Password are required.');
      return;
    }
    setIsAdding(true);
    setAddError('');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, role: 'student' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create student');
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', city: '', phone: '' });
      await fetchStudents();
      showSuccess('Student added successfully!');
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const openStudent = (s: Student) => {
    setSelectedStudent(s);
    setEditProfile({ name: s.name, points: s.points, xpPoints: s.xpPoints, streak: s.streak, membershipLevel: s.membershipLevel, city: s.city || '' });
    setSkillsForm(s.skills || { resinBasics: 0, mixing: 0, colourTheory: 0, finishing: 0, creativity: 0, professionalQuality: 0 });
    setActiveTab('profile');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Refresh selected student data
  const refreshStudent = async (id: string) => {
    const res = await fetch(`${API}/admin/students/${id}`, { headers });
    const data = await res.json();
    setSelectedStudent(data);
    setStudents(prev => prev.map(s => s.id === id ? data : s));
  };

  // Save profile
  const saveProfile = async () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    try {
      await fetch(`${API}/admin/students/${selectedStudent.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify(editProfile)
      });
      await refreshStudent(selectedStudent.id);
      showSuccess("Profile updated!");
    } catch (err) { console.error(err); }
    setIsSaving(false);
  };

  // Toggle milestone complete
  const toggleMilestone = async (milestoneId: string, currentStatus: boolean) => {
    if (!selectedStudent) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ completed: !currentStatus, completedAt: !currentStatus ? new Date() : null })
    });
    await refreshStudent(selectedStudent.id);
    showSuccess("Milestone updated!");
  };

  // Update milestone name
  const updateMilestoneName = async (milestoneId: string) => {
    if (!selectedStudent || !editingMilestoneName.trim()) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ name: editingMilestoneName.trim() })
    });
    setEditingMilestoneId(null);
    setEditingMilestoneName("");
    await refreshStudent(selectedStudent.id);
    showSuccess("Milestone title updated!");
  };

  // Add milestone
  const addMilestone = async () => {
    if (!selectedStudent || !newMilestone.name.trim()) return;
    await fetch(`${API}/admin/students/${selectedStudent.id}/milestones`, {
      method: 'POST', headers,
      body: JSON.stringify({ name: newMilestone.name, completed: newMilestone.completed, order: (selectedStudent.milestones?.length || 0) + 1 })
    });
    setNewMilestone({ name: "", completed: false });
    await refreshStudent(selectedStudent.id);
    showSuccess("Milestone added!");
  };

  // Delete milestone
  const deleteMilestone = async (milestoneId: string) => {
    if (!selectedStudent) return;
    await fetch(`${API}/admin/milestones/${milestoneId}`, { method: 'DELETE', headers });
    await refreshStudent(selectedStudent.id);
    showSuccess("Milestone removed!");
  };

  // Add sales record
  const addSaleRecord = async () => {
    if (!selectedStudent || !newSale.amount || !newSale.productName) return;
    await fetch(`${API}/admin/students/${selectedStudent.id}/sales`, {
      method: 'POST', headers,
      body: JSON.stringify({ amount: parseFloat(newSale.amount), productName: newSale.productName, date: newSale.date || new Date().toISOString() })
    });
    setNewSale({ amount: "", productName: "", date: "" });
    await refreshStudent(selectedStudent.id);
    showSuccess("Sale record added!");
  };

  // Delete sale record
  const deleteSaleRecord = async (recordId: string) => {
    if (!selectedStudent) return;
    await fetch(`${API}/admin/sales/${recordId}`, { method: 'DELETE', headers });
    await refreshStudent(selectedStudent.id);
    showSuccess("Sale record removed!");
  };

  // Save skills
  const saveSkills = async () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    await fetch(`${API}/admin/students/${selectedStudent.id}/skills`, {
      method: 'PUT', headers,
      body: JSON.stringify(skillsForm)
    });
    await refreshStudent(selectedStudent.id);
    showSuccess("Skills updated!");
    setIsSaving(false);
  };

  // Enroll in course
  const enrollCourse = async (courseId: string) => {
    if (!selectedStudent) return;
    await fetch(`${API}/admin/students/${selectedStudent.id}/courses`, {
      method: 'POST', headers,
      body: JSON.stringify({ courseId, status: 'enrolled', progress: 0 })
    });
    await refreshStudent(selectedStudent.id);
    showSuccess("Student enrolled!");
  };

  // Award badge to student
  const awardBadgeToStudent = async (badgeId: string) => {
    if (!selectedStudent) return;
    const res = await fetch(`${API}/admin/students/${selectedStudent.id}/badges`, {
      method: 'POST', headers,
      body: JSON.stringify({ badgeId })
    });
    const data = await res.json();
    if (res.status === 409) { showSuccess('Badge already awarded!'); return; }
    await refreshStudent(selectedStudent.id);
    showSuccess('Badge awarded! 🎖️');
  };

  // Revoke badge from student
  const revokeBadgeFromStudent = async (badgeId: string) => {
    if (!selectedStudent) return;
    await fetch(`${API}/admin/students/${selectedStudent.id}/badges/${badgeId}`, {
      method: 'DELETE', headers
    });
    await refreshStudent(selectedStudent.id);
    showSuccess('Badge removed.');
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS = [
    { key: 'profile', label: 'Profile & XP' },
    { key: 'milestones', label: 'Milestones' },
    { key: 'sales', label: 'Sales Records' },
    { key: 'skills', label: 'Skills' },
    { key: 'courses', label: 'Courses' },
    { key: 'badges', label: '🎖️ Badges' },
  ];

  const skillKeys = ['resinBasics', 'mixing', 'colourTheory', 'finishing', 'creativity', 'professionalQuality'];
  const skillLabels: Record<string, string> = {
    resinBasics: 'Resin Basics', mixing: 'Mixing', colourTheory: 'Colour Theory',
    finishing: 'Finishing', creativity: 'Creativity', professionalQuality: 'Prof. Quality'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Student Management</h1>
            <p className="text-slate-400 mt-1 md:mt-2 text-sm">View and manage all student profiles, milestones, sales, skills, and course enrollments.</p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setAddError(''); }}
            className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-white transition-colors shadow-lg shadow-orange-500/20 shrink-0"
          >
            <UserPlus size={18} /> Add Student
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-[600px] lg:h-[calc(100vh-220px)]">
          
          {/* Student List */}
          <div className="w-full lg:w-80 lg:shrink-0 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-xl max-h-80 lg:max-h-none">
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Loading...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No students found</div>
              ) : (
                filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => openStudent(student)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-colors mb-1 group ${
                      selectedStudent?.id === student.id ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-orange-400 shrink-0">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate">{student.email}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-xl min-h-[500px]">
            {!selectedStudent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Users size={48} className="text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium text-lg">Select a student</p>
                <p className="text-slate-600 text-sm mt-1">Choose a student from the left to manage their data</p>
              </div>
            ) : (
              <>
                {/* Student Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center font-black text-xl text-orange-400">
                      {selectedStudent.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                      <p className="text-slate-400 text-sm">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {successMsg && (
                      <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} /> {successMsg}
                      </span>
                    )}
                    <div className="text-right">
                      <p className="text-orange-400 font-black">{(selectedStudent.points || 0).toLocaleString()} XP</p>
                      <p className="text-slate-500 text-xs">🔥 {selectedStudent.streak || 0} day streak</p>
                    </div>
                  </div>
                </div>

                {/* Tabs - scrollable on mobile */}
                <div className="flex gap-1 px-4 md:px-6 pt-4 border-b border-slate-800 pb-0 overflow-x-auto scrollbar-none">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-all -mb-px ${
                        activeTab === tab.key
                          ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                          : 'text-slate-500 border-transparent hover:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Full Name', key: 'name', type: 'text' },
                          { label: 'City', key: 'city', type: 'text' },
                          { label: 'Points (XP)', key: 'points', type: 'number' },
                          { label: 'XP Points', key: 'xpPoints', type: 'number' },
                          { label: 'Streak (days)', key: 'streak', type: 'number' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">{field.label}</label>
                            <input
                              type={field.type}
                              value={editProfile[field.key] || ''}
                              onChange={e => setEditProfile({ ...editProfile, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">Membership Level</label>
                          <select
                            value={editProfile.membershipLevel || 'L0'}
                            onChange={e => setEditProfile({ ...editProfile, membershipLevel: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                          >
                            <option value="L0">L0 - Fast Start</option>
                            <option value="L1">L1 - Silver</option>
                            <option value="L2">L2 - Gold</option>
                            <option value="L3">L3 - Diamond/Masters</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20"
                      >
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  )}

                  {/* Milestones Tab */}
                  {activeTab === 'milestones' && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="New milestone name..."
                          value={newMilestone.name}
                          onChange={e => setNewMilestone({ ...newMilestone, name: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && addMilestone()}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                        />
                        <label className="flex items-center gap-2 text-sm text-slate-400 px-3 cursor-pointer">
                          <input type="checkbox" checked={newMilestone.completed} onChange={e => setNewMilestone({ ...newMilestone, completed: e.target.checked })} className="accent-orange-500" />
                          Done
                        </label>
                        <button onClick={addMilestone} className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold transition-colors shrink-0 cursor-pointer">
                          <Plus size={16} /> Add
                        </button>
                      </div>

                      {(selectedStudent.milestones || []).length === 0 ? (
                        <div className="text-center text-slate-500 py-8">No milestones yet. Add one above!</div>
                      ) : (
                        <div className="space-y-2">
                          {(selectedStudent.milestones || []).map((m: any) => (
                            <div key={m.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${m.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/50 border-slate-700'}`}>
                              <button onClick={() => toggleMilestone(m.id, m.completed)} className="shrink-0 cursor-pointer" title={m.completed ? "Mark incomplete" : "Mark complete"}>
                                {m.completed
                                  ? <CheckCircle2 size={22} className="text-emerald-400" />
                                  : <Circle size={22} className="text-slate-600 hover:text-orange-500 transition-colors" />
                                }
                              </button>

                              {editingMilestoneId === m.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingMilestoneName}
                                    onChange={e => setEditingMilestoneName(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') updateMilestoneName(m.id);
                                      if (e.key === 'Escape') setEditingMilestoneId(null);
                                    }}
                                    autoFocus
                                    className="flex-1 bg-slate-950 border border-orange-500 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                                  />
                                  <button onClick={() => updateMilestoneName(m.id)} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-2 py-1.5 rounded-lg text-xs font-bold">
                                    Save
                                  </button>
                                  <button onClick={() => setEditingMilestoneId(null)} className="bg-slate-800 text-slate-300 px-2 py-1.5 rounded-lg text-xs">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium text-sm ${m.completed ? 'text-white' : 'text-slate-400'}`}>{m.name}</span>
                                    <button
                                      onClick={() => {
                                        setEditingMilestoneId(m.id);
                                        setEditingMilestoneName(m.name);
                                      }}
                                      className="text-slate-500 hover:text-orange-400 p-1 transition-colors text-xs"
                                      title="Edit Name"
                                    >
                                      ✎
                                    </button>
                                  </div>
                                  {m.completedAt && (
                                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                                      {new Date(m.completedAt).toLocaleDateString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              )}

                              <button onClick={() => deleteMilestone(m.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sales Records Tab */}
                  {activeTab === 'sales' && (
                    <div className="space-y-4">
                      <div className="flex gap-3 flex-wrap">
                        <input type="text" placeholder="Product name" value={newSale.productName} onChange={e => setNewSale({ ...newSale, productName: e.target.value })}
                          className="flex-1 min-w-[150px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors" />
                        <input type="number" placeholder="Amount (₹)" value={newSale.amount} onChange={e => setNewSale({ ...newSale, amount: e.target.value })}
                          className="w-36 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors" />
                        <input type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors" />
                        <button onClick={addSaleRecord} className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold transition-colors shrink-0">
                          <Plus size={16} /> Add Sale
                        </button>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <div>Product</div>
                          <div className="text-right">Amount</div>
                          <div>Date</div>
                          <div className="text-right">Action</div>
                        </div>
                        {(selectedStudent.salesRecords || []).length === 0 ? (
                          <div className="p-8 text-center text-slate-500">No sales records yet.</div>
                        ) : (
                          (selectedStudent.salesRecords || []).map((s: any) => (
                            <div key={s.id} className="grid grid-cols-4 gap-4 px-4 py-4 items-center border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
                              <div className="font-medium text-white">{s.productName}</div>
                              <div className="text-right font-bold text-green-400">₹{s.amount?.toLocaleString('en-IN')}</div>
                              <div className="text-slate-400 text-sm">{s.date ? new Date(s.date).toLocaleDateString('en-IN') : '-'}</div>
                              <div className="text-right">
                                <button onClick={() => deleteSaleRecord(s.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                        {(selectedStudent.salesRecords || []).length > 0 && (
                          <div className="px-4 py-3 bg-slate-800/30 flex justify-between items-center border-t border-slate-800">
                            <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
                            <span className="font-black text-white">
                              ₹{(selectedStudent.salesRecords || []).reduce((s: number, r: any) => s + (r.amount || 0), 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === 'skills' && (
                    <div className="space-y-4 max-w-xl">
                      <p className="text-slate-400 text-sm">Set skill scores (0–100) that appear on the student's radar chart.</p>
                      {skillKeys.map(key => (
                        <div key={key} className="flex items-center gap-4">
                          <label className="w-36 text-sm font-medium text-slate-300 shrink-0">{skillLabels[key]}</label>
                          <input
                            type="range" min={0} max={100}
                            value={skillsForm[key] || 0}
                            onChange={e => setSkillsForm({ ...skillsForm, [key]: parseInt(e.target.value) })}
                            className="flex-1 accent-orange-500"
                          />
                          <span className="w-10 text-right font-bold text-orange-400">{skillsForm[key] || 0}</span>
                        </div>
                      ))}
                      <button
                        onClick={saveSkills}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20"
                      >
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Skills'}
                      </button>
                    </div>
                  )}

                  {/* Courses Tab */}
                  {activeTab === 'courses' && (
                    <div className="space-y-4">
                      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Enrolled Courses</h3>
                      {(selectedStudent.courses || []).length === 0 ? (
                        <p className="text-slate-500 text-sm">No courses enrolled yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {(selectedStudent.courses || []).map((c: any) => (
                            <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
                              <BookOpen size={18} className="text-orange-400 shrink-0" />
                              <div className="flex-1">
                                <p className="font-semibold text-white">{c.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${c.UserCourse?.progress || 0}%` }} />
                                  </div>
                                  <span className="text-xs text-slate-400">{c.UserCourse?.progress || 0}%</span>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    c.UserCourse?.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                    c.UserCourse?.status === 'enrolled' ? 'bg-orange-500/10 text-orange-400' :
                                    'bg-slate-800 text-slate-500'
                                  }`}>{c.UserCourse?.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mt-6">Enroll in Course</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {allCourses
                          .filter(c => !(selectedStudent.courses || []).find((sc: any) => sc.id === c.id))
                          .map(course => (
                            <button
                              key={course.id}
                              onClick={() => enrollCourse(course.id)}
                              className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 hover:border-orange-500/30 hover:bg-orange-500/5 rounded-2xl text-left transition-colors group"
                            >
                              <Plus size={16} className="text-slate-500 group-hover:text-orange-500 transition-colors shrink-0" />
                              <span className="font-medium text-slate-300 group-hover:text-white transition-colors text-sm">{course.title}</span>
                            </button>
                          ))
                        }
                        {allCourses.filter(c => !(selectedStudent.courses || []).find((sc: any) => sc.id === c.id)).length === 0 && (
                          <p className="text-slate-500 text-sm col-span-2">Student is enrolled in all available courses!</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== BADGES TAB ===== */}
                  {activeTab === 'badges' && (
                    <div className="space-y-6">
                      {/* Earned Badges */}
                      <div>
                        <h3 className="text-slate-300 font-bold text-base mb-3 flex items-center gap-2">
                          🎖️ Badges Earned
                          <span className="ml-1 text-xs font-normal bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                            {(selectedStudent.badges || []).length} badge{(selectedStudent.badges || []).length !== 1 ? 's' : ''}
                          </span>
                        </h3>
                        {(selectedStudent.badges || []).length === 0 ? (
                          <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
                            <p className="text-slate-500 text-sm">No badges awarded yet.</p>
                            <p className="text-slate-600 text-xs mt-1">Award badges from the list below.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(selectedStudent.badges || []).map((badge: any) => (
                              <div
                                key={badge.id}
                                className="flex flex-col items-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center relative group"
                              >
                                <span className="text-3xl mb-2">{badge.icon || '🏅'}</span>
                                <p className="text-white text-xs font-bold leading-tight">{badge.name}</p>
                                {badge.description && (
                                  <p className="text-slate-400 text-[10px] mt-1 leading-snug">{badge.description}</p>
                                )}
                                <button
                                  onClick={() => revokeBadgeFromStudent(badge.id)}
                                  className="mt-3 text-[10px] px-2.5 py-1 bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  Revoke
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Award Badges */}
                      <div>
                        <h3 className="text-slate-300 font-bold text-base mb-3 flex items-center gap-2">
                          ➕ Award a Badge
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {allBadges
                            .filter(b => !(selectedStudent.badges || []).find((sb: any) => sb.id === b.id))
                            .map((badge: any) => (
                              <button
                                key={badge.id}
                                onClick={() => awardBadgeToStudent(badge.id)}
                                className="flex flex-col items-center p-4 bg-slate-800/50 border border-slate-700 hover:border-orange-500/40 hover:bg-orange-500/5 rounded-2xl text-center transition-all group"
                              >
                                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{badge.icon || '🏅'}</span>
                                <p className="text-slate-300 text-xs font-bold leading-tight group-hover:text-white transition-colors">{badge.name}</p>
                                {badge.description && (
                                  <p className="text-slate-500 text-[10px] mt-1 leading-snug">{badge.description}</p>
                                )}
                                <span className="mt-2 text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  Click to Award
                                </span>
                              </button>
                            ))}
                          {allBadges.filter(b => !(selectedStudent.badges || []).find((sb: any) => sb.id === b.id)).length === 0 && (
                            <p className="text-slate-500 text-sm col-span-3">🎉 Student has all available badges!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserPlus className="text-orange-500" /> Add New Student
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {addError && (
              <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {addError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text" placeholder="Student Name"
                    value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text" placeholder="e.g. Mumbai"
                    value={addForm.city}
                    onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                  <input
                    type="email" placeholder="student@example.com"
                    value={addForm.email}
                    onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel" placeholder="+91 9876543210"
                    value={addForm.phone}
                    onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showAddPwd ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={addForm.password}
                    onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-orange-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showAddPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={isAdding}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? 'Creating...' : <><UserPlus size={16} /> Create Student</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
