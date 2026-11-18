"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Pagination } from "@/components/ui/Pagination";
import { API_BASE_URL } from "@/config/api";
import {
  Users, Search, SlidersHorizontal, ChevronDown, ChevronRight, X, Plus, Trash2, CheckCircle2,
  Circle, Star, Edit3, Trophy, Flame, IndianRupee, BookOpen, Save, UserPlus, Eye, EyeOff, Send, AlertTriangle
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
  lastLoginAt?: string | null;
  membershipExpiresAt?: string | null;
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [lastActivityFilter, setLastActivityFilter] = useState<'any' | '24h' | '7d' | '30d' | '30d_plus' | 'never'>('any');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftLevelFilter, setDraftLevelFilter] = useState<string>('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [draftLastActivityFilter, setDraftLastActivityFilter] = useState<'any' | '24h' | '7d' | '30d' | '30d_plus' | 'never'>('any');
  const filterPopoverRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [reEngageSending, setReEngageSending] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', city: '', phone: '' });
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddPwd, setShowAddPwd] = useState(false);

  // Form states
  const [editProfile, setEditProfile] = useState<any>({});
  const [newMilestone, setNewMilestone] = useState({ name: "", completed: false });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneError, setMilestoneError] = useState("");
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestoneName, setEditingMilestoneName] = useState("");
  const [newSale, setNewSale] = useState({ amount: "", productName: "", date: "" });
  const [skillsForm, setSkillsForm] = useState<any>({});
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API = API_BASE_URL;
  const effectiveToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const headers = { Authorization: `Bearer ${effectiveToken}`, "Content-Type": "application/json" };

  // Debounce ref for search
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStudents = useCallback(async (pg = 1, search = searchQuery, level = levelFilter) => {
    setIsLoading(true);
    try {
      const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ravishingarthub.com';
      const url = new URL(`${API}/admin/students`, baseOrigin);
      url.searchParams.set('page', String(pg));
      url.searchParams.set('limit', String(LIMIT));
      if (search.trim()) url.searchParams.set('search', search.trim());
      if (level && level !== 'all') url.searchParams.set('level', level);
      // statusFilter & lastActivityFilter are client-side via lastLoginAt since backend
      // doesn't have those columns; search + level are server-side
      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setStudents(data.data);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(pg);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  }, [API, token, searchQuery, levelFilter]); // eslint-disable-line

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

  const [levelTiers, setLevelTiers] = useState<any[]>([]);

  const fetchLevelTiers = async () => {
    try {
      const res = await fetch(`${API}/admin/levels`, { headers });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setLevelTiers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) {
      fetchStudents(1, searchQuery);
      fetchAllCourses();
      fetchAllBadges();
      fetchLevelTiers();
    }
  }, [token]); // eslint-disable-line

  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterOpen]);

  // Debounced search — wait 400ms after typing before hitting API
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchStudents(1, val, levelFilter);
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage, searchQuery, levelFilter);
    // Scroll the list back to top
    document.getElementById('student-list-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFilterPopover = () => {
    if (!isFilterOpen) {
      setDraftLevelFilter(levelFilter);
      setDraftStatusFilter(statusFilter);
      setDraftLastActivityFilter(lastActivityFilter);
    }
    setIsFilterOpen(prev => !prev);
  };

  const handleApplyFilters = () => {
    const levelChanged = draftLevelFilter !== levelFilter;
    setLevelFilter(draftLevelFilter);
    setStatusFilter(draftStatusFilter);
    setLastActivityFilter(draftLastActivityFilter);
    setIsFilterOpen(false);
    if (levelChanged) {
      fetchStudents(1, searchQuery, draftLevelFilter);
    }
  };

  const handleClearFilters = () => {
    const hadLevelFilter = levelFilter !== 'all';
    setDraftLevelFilter('all');
    setDraftStatusFilter('all');
    setDraftLastActivityFilter('any');
    setLevelFilter('all');
    setStatusFilter('all');
    setLastActivityFilter('any');
    if (hadLevelFilter) {
      fetchStudents(1, searchQuery, 'all');
    }
  };


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

  const openStudent = async (s: Student) => {
    setActiveTab('profile');
    // If basic data already has skills/milestones (full detail), use it directly
    if (s.milestones) {
      setSelectedStudent(s);
      setEditProfile({ name: s.name, points: s.points, xpPoints: s.xpPoints, streak: s.streak, membershipLevel: s.membershipLevel || 'GENERAL', city: s.city || '' });
      setSkillsForm(s.skills || { resinBasics: 0, mixing: 0, colourTheory: 0, finishing: 0, creativity: 0, professionalQuality: 0 });
      return;
    }
    // Otherwise fetch full detail (list only has lean fields now)
    try {
      const res = await fetch(`${API}/admin/students/${s.id}`, { headers });
      const full = await res.json();
      setSelectedStudent(full);
      setEditProfile({ name: full.name, points: full.points, xpPoints: full.xpPoints, streak: full.streak, membershipLevel: full.membershipLevel || 'GENERAL', city: full.city || '' });
      setSkillsForm(full.skills || { resinBasics: 0, mixing: 0, colourTheory: 0, finishing: 0, creativity: 0, professionalQuality: 0 });
    } catch (e) { console.error(e); }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Refresh selected student data
  const refreshStudent = async (id: string) => {
    try {
      const res = await fetch(`${API}/admin/students/${id}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.id) {
        setSelectedStudent(data);
        setStudents(prev => prev.map(s => s.id === id ? data : s));
      }
    } catch (err) {
      console.error('Error refreshing student:', err);
    }
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

  // Delete / Soft-delete student
  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API}/admin/students/${selectedStudent.id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message || "Student removed successfully!");
        setDeleteConfirmOpen(false);
        setSelectedStudent(null);
        await fetchStudents();
      } else {
        alert(data.message || "Failed to delete student");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error deleting student: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle milestone complete
  const toggleMilestone = async (milestoneId: string, currentStatus: boolean) => {
    if (!selectedStudent) return;
    try {
      const newStatus = !currentStatus;
      const res = await fetch(`${API}/admin/milestones/${milestoneId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ completed: newStatus, completedAt: newStatus ? new Date().toISOString() : null })
      });
      if (res.ok) {
        setSelectedStudent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            milestones: (prev.milestones || []).map((m: any) =>
              m.id === milestoneId ? { ...m, completed: newStatus, completedAt: newStatus ? new Date().toISOString() : null } : m
            )
          };
        });
        showSuccess("Milestone updated!");
        await refreshStudent(selectedStudent.id);
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  // Update milestone name
  const updateMilestoneName = async (milestoneId: string) => {
    if (!selectedStudent || !editingMilestoneName.trim()) return;
    try {
      const trimmed = editingMilestoneName.trim();
      const res = await fetch(`${API}/admin/milestones/${milestoneId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ name: trimmed })
      });
      if (res.ok) {
        setSelectedStudent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            milestones: (prev.milestones || []).map((m: any) =>
              m.id === milestoneId ? { ...m, name: trimmed } : m
            )
          };
        });
        setEditingMilestoneId(null);
        setEditingMilestoneName("");
        showSuccess("Milestone title updated!");
        await refreshStudent(selectedStudent.id);
      }
    } catch (err) {
      console.error('Error updating milestone title:', err);
    }
  };

  // Add milestone
  const addMilestone = async () => {
    if (!selectedStudent) return;
    const trimmed = newMilestone.name.trim();
    if (!trimmed) {
      setMilestoneError("Please enter a milestone name");
      return;
    }
    setMilestoneError("");
    setIsAddingMilestone(true);
    try {
      const res = await fetch(`${API}/admin/students/${selectedStudent.id}/milestones`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: trimmed,
          completed: newMilestone.completed,
          completedAt: newMilestone.completed ? new Date().toISOString() : null,
          order: (selectedStudent.milestones?.length || 0) + 1
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMilestoneError(data.message || "Failed to add milestone");
        return;
      }
      setNewMilestone({ name: "", completed: false });
      setSelectedStudent(prev => {
        if (!prev) return prev;
        const currentList = prev.milestones || [];
        if (currentList.some((m: any) => m.id === data.id)) return prev;
        return {
          ...prev,
          milestones: [...currentList, data]
        };
      });
      await refreshStudent(selectedStudent.id);
      showSuccess("Milestone added!");
    } catch (err: any) {
      console.error('Error adding milestone:', err);
      setMilestoneError(err.message || "Failed to add milestone");
    } finally {
      setIsAddingMilestone(false);
    }
  };

  // Delete milestone
  const deleteMilestone = async (milestoneId: string) => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${API}/admin/milestones/${milestoneId}`, { method: 'DELETE', headers });
      if (res.ok) {
        setSelectedStudent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            milestones: (prev.milestones || []).filter((m: any) => m.id !== milestoneId)
          };
        });
        showSuccess("Milestone removed!");
        await refreshStudent(selectedStudent.id);
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
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

  const formatLastLogin = (dateStr?: string | null) => {
    if (!dateStr) return { text: "Never logged in", color: "text-stone-400", dot: "bg-stone-300", isInactive: true };
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return { text: "Active just now", color: "text-emerald-400", dot: "bg-emerald-400 animate-pulse", isInactive: false };
    if (diffHours < 24) return { text: `Active ${diffHours}h ago`, color: "text-emerald-400", dot: "bg-emerald-400", isInactive: false };
    if (diffDays < 7) return { text: `Active ${diffDays}d ago`, color: "text-teal-400", dot: "bg-teal-400", isInactive: false };
    return { text: `Inactive ${diffDays}d ago`, color: "text-amber-400", dot: "bg-amber-400", isInactive: true };
  };

  const handleSendReengagement = async (studentId: string, studentName: string) => {
    setReEngageSending(true);
    try {
      await fetch(`${API}/admin/students/${studentId}/notifications`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: "🔥 We miss you at Ravishing Art Hub!",
          message: `Hello ${studentName}, your resin journey awaits! New masterclasses and community challenges are live in your portal. Jump back in today!`
        }),
      });
      showSuccess(`Re-engagement notification sent to ${studentName}! 🚀`);
    } catch (e) {
      console.error(e);
    } finally {
      setReEngageSending(false);
    }
  };

  const matchesLastActivity = (dateStr?: string | null, filter = lastActivityFilter) => {
    if (filter === 'any') return true;
    if (filter === 'never') return !dateStr;
    if (!dateStr) return false;
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (filter === '24h') return diffHours < 24;
    if (filter === '7d') return diffDays < 7;
    if (filter === '30d') return diffDays < 30;
    if (filter === '30d_plus') return diffDays >= 30;
    return true;
  };

  // Client-side status & last-activity filter on current page (based on lastLoginAt)
  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all') {
      const loginStatus = formatLastLogin(s.lastLoginAt);
      if (statusFilter === 'active' && loginStatus.isInactive) return false;
      if (statusFilter === 'inactive' && !loginStatus.isInactive) return false;
    }
    return matchesLastActivity(s.lastLoginAt, lastActivityFilter);
  });

  const availableLevelTiers: Array<{ code: string; name: string; price?: string }> = levelTiers.length > 0
    ? levelTiers
    : [
        { code: 'L0', name: 'Fast Start', price: '₹499' },
        { code: 'L1', name: 'Silver', price: '₹4,999' },
        { code: 'L2', name: 'Gold', price: '₹19,999' },
        { code: 'L3', name: 'Diamond/Masters', price: '₹59,999' },
      ];

  const hasActiveFilters = levelFilter !== 'all' || statusFilter !== 'all' || lastActivityFilter !== 'any';

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
        <header className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">Student Management &amp; Engagement</h1>
            <p className="text-stone-500 mt-1 md:mt-2 text-sm font-medium">Track last login activity, milestones, sales, and trigger re-engagement notifications.</p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setAddError(''); }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 rounded-xl font-bold text-white transition-all shadow-md shadow-[#c4431d]/25 shrink-0 cursor-pointer"
          >
            <UserPlus size={18} /> Add Student
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-[600px] lg:h-[calc(100vh-220px)]">
          
          {/* Student List */}
          <div className="w-full lg:w-80 xl:w-[21.5rem] lg:shrink-0 bg-white border border-[#ecdccb] rounded-3xl flex flex-col relative shadow-[0_12px_32px_-12px_rgba(90,55,20,0.1)] max-h-[28rem] lg:max-h-none">
            <div className="px-4 pt-4 pb-3.5 border-b border-stone-100 space-y-3 shrink-0 rounded-t-3xl bg-white">
              <div className="flex items-center justify-between gap-2 px-0.5">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  Students ({total})
                </h2>

                <div className="relative" ref={filterPopoverRef}>
                  <button
                    type="button"
                    onClick={toggleFilterPopover}
                    aria-label="Filter students"
                    aria-expanded={isFilterOpen}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative ${
                      isFilterOpen || hasActiveFilters
                        ? 'bg-[#fdeee2] border-[#c4431d]/40 text-[#942008] shadow-xs'
                        : 'bg-[#fff5ee] border-[#f5ded0] text-[#c4431d] hover:bg-[#fdeee2] hover:border-[#c4431d]/40'
                    }`}
                  >
                    <SlidersHorizontal size={18} />
                    {hasActiveFilters && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c4431d] ring-2 ring-white"
                      />
                    )}
                  </button>

                  {isFilterOpen && (
                    <div
                      role="dialog"
                      aria-label="Filter Students"
                      className="absolute right-0 top-full mt-2.5 z-30 w-64 sm:w-72 bg-white border border-[#ecdccb] rounded-2xl p-4 shadow-[0_18px_40px_-12px_rgba(90,55,20,0.22)]"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute -top-1.5 right-3.5 w-3 h-3 rotate-45 bg-white border-l border-t border-[#ecdccb]"
                      />

                      <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
                        <h3 className="text-sm font-black text-stone-900">Filter Students</h3>
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="text-xs font-bold text-[#c4431d] hover:text-[#942008] transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="space-y-3 relative z-10">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            Membership Level
                          </label>
                          <div className="relative">
                            <select
                              value={draftLevelFilter}
                              onChange={e => setDraftLevelFilter(e.target.value)}
                              className="w-full appearance-none bg-[#fcfaf7] border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-stone-800 outline-none focus:bg-white focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 transition-all cursor-pointer"
                            >
                              <option value="all">All Levels</option>
                              <option value="GENERAL">GENERAL - General Member</option>
                              {availableLevelTiers.map((lt) => (
                                <option key={lt.code} value={lt.code}>
                                  {lt.code} - {lt.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            Activity Status
                          </label>
                          <div className="relative">
                            <select
                              value={draftStatusFilter}
                              onChange={e => setDraftStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                              className="w-full appearance-none bg-[#fcfaf7] border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-stone-800 outline-none focus:bg-white focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 transition-all cursor-pointer"
                            >
                              <option value="all">All Status</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            Last Activity
                          </label>
                          <div className="relative">
                            <select
                              value={draftLastActivityFilter}
                              onChange={e => setDraftLastActivityFilter(e.target.value as 'any' | '24h' | '7d' | '30d' | '30d_plus' | 'never')}
                              className="w-full appearance-none bg-[#fcfaf7] border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-stone-800 outline-none focus:bg-white focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 transition-all cursor-pointer"
                            >
                              <option value="any">Any Time</option>
                              <option value="24h">Last 24 Hours</option>
                              <option value="7d">Last 7 Days</option>
                              <option value="30d">Last 30 Days</option>
                              <option value="30d_plus">30+ Days Ago</option>
                              <option value="never">Never Logged In</option>
                            </select>
                            <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyFilters}
                        className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white rounded-xl text-sm font-bold shadow-md shadow-[#c4431d]/25 transition-all cursor-pointer relative z-10"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-200 rounded-full pl-10 pr-4 py-2 text-stone-900 placeholder:text-stone-400 text-sm outline-none focus:bg-white focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/15 transition-all"
                />
              </div>

              {/* Inactivity & Status Filter Tabs */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white border-transparent shadow-sm shadow-[#c4431d]/25'
                      : 'bg-[#fcfaf7] border-stone-200 text-stone-600 hover:bg-[#fff5ee] hover:border-[#f5ded0] hover:text-[#942008]'
                  }`}
                >
                  All ({total})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'active'
                      ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white border-transparent shadow-sm shadow-[#c4431d]/25'
                      : 'bg-[#fcfaf7] border-stone-200 text-stone-600 hover:bg-[#fff5ee] hover:border-[#f5ded0] hover:text-[#942008]'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'inactive'
                      ? 'bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] text-white border-transparent shadow-sm shadow-[#c4431d]/25'
                      : 'bg-[#fcfaf7] border-stone-200 text-stone-600 hover:bg-[#fff5ee] hover:border-[#f5ded0] hover:text-[#942008]'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div
              id="student-list-scroll"
              className={`flex-1 overflow-y-auto divide-y divide-stone-100 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent] ${totalPages <= 1 ? 'rounded-b-3xl' : ''}`}
            >
              {isLoading ? (
                <div className="p-8 text-center text-sm text-stone-400 font-medium">Loading students...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-400 font-medium">No students match filter</div>
              ) : (
                filteredStudents.map(student => {
                  const lastLog = formatLastLogin(student.lastLoginAt);
                  const isSelected = selectedStudent?.id === student.id;

                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => openStudent(student)}
                      className={`relative w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-[#fff5ee]' : 'bg-white hover:bg-[#fcfaf7]'
                      }`}
                    >
                      {isSelected && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-[#c4431d]"
                        />
                      )}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs">
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-900 text-sm truncate leading-snug">{student.name}</p>
                        <p className="text-xs flex items-center gap-1.5 font-medium mt-0.5 text-stone-600 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${lastLog.dot}`} />
                          <span className="truncate">{lastLog.text}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wide text-[#942008] bg-[#fdeee2] border border-[#f5ded0]/80 px-2 py-0.5 rounded-md">
                          {student.membershipLevel || 'L0'}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`shrink-0 transition-colors ${
                            isSelected ? 'text-[#c4431d]' : 'text-stone-400 group-hover:text-[#c4431d]'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-stone-100 bg-[#fcfaf7]/80 rounded-b-3xl">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={LIMIT}
                  onPageChange={handlePageChange}
                  itemLabel="students"
                />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white/95 border border-[#ecdccb] rounded-3xl flex flex-col overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] min-h-[500px]">
            {!selectedStudent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Users size={48} className="text-stone-300 mb-4" />
                <p className="text-stone-700 font-bold text-lg">Select a student</p>
                <p className="text-stone-400 text-sm mt-1 font-medium">Choose a student from the left to manage their data</p>
              </div>
            ) : (
              <>
                {/* Student Header */}
                <div className="p-6 border-b border-stone-200/80 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center font-black text-xl text-white shadow-md">
                      {selectedStudent.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-stone-900">{selectedStudent.name}</h2>
                      <p className="text-stone-500 text-sm font-medium">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {successMsg && (
                      <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                        <CheckCircle2 size={14} /> {successMsg}
                      </span>
                    )}

                    {/* Re-engagement Quick Action */}
                    <button
                      type="button"
                      onClick={() => handleSendReengagement(selectedStudent.id, selectedStudent.name)}
                      disabled={reEngageSending}
                      className="px-3.5 py-1.5 bg-[#fff5ee] hover:bg-[#fde5d6] text-[#942008] border border-[#f5ded0] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Send re-engagement push notification"
                    >
                      <Send size={13} /> {reEngageSending ? 'Sending...' : 'Send Reminder'}
                    </button>

                    {/* Delete Student Quick Action */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Soft delete student from software"
                    >
                      <Trash2 size={13} /> Delete Student
                    </button>

                    <div className="text-right">
                      <p className="text-[#c4431d] font-black text-lg font-mono">{(selectedStudent.points || 0).toLocaleString()} XP</p>
                      <p className="text-stone-500 text-xs font-semibold">🔥 {selectedStudent.streak || 0} day streak</p>
                    </div>
                  </div>
                </div>

                {/* Last Login Info Strip */}
                <div className="px-6 py-2.5 bg-[#fcfaf7] border-b border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-semibold">Activity Status:</span>
                    {(() => {
                      const logInfo = formatLastLogin(selectedStudent.lastLoginAt);
                      return (
                        <span className={`font-bold flex items-center gap-1.5 ${logInfo.color}`}>
                          <span className={`w-2 h-2 rounded-full ${logInfo.dot}`} />
                          {logInfo.text}
                          {selectedStudent.lastLoginAt && (
                            <span className="text-stone-400 font-normal">
                              ({new Date(selectedStudent.lastLoginAt).toLocaleString('en-IN')})
                            </span>
                          )}
                        </span>
                      );
                    })()}
                  </div>
                  <span className="text-stone-500 font-mono text-[11px] font-semibold">
                    ID: {selectedStudent.id.slice(0, 8)}...
                  </span>
                </div>

                {/* Tabs - scrollable on mobile */}
                <div className="flex gap-1 px-4 md:px-6 pt-4 border-b border-stone-200/80 pb-0 overflow-x-auto scrollbar-none">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-all -mb-px ${
                        activeTab === tab.key
                          ? 'text-[#c4431d] border-[#c4431d] bg-[#fff5ee]'
                          : 'text-stone-600 border-transparent hover:text-stone-900 hover:bg-stone-50'
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
                            <label className="block text-xs text-stone-600 mb-1.5 uppercase tracking-wider font-bold">{field.label}</label>
                            <input
                              type={field.type}
                              value={editProfile[field.key] || ''}
                              onChange={e => setEditProfile({ ...editProfile, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                              className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-xs text-stone-600 mb-1.5 uppercase tracking-wider font-bold">Membership Level</label>
                          <select
                            value={editProfile.membershipLevel || 'GENERAL'}
                            onChange={e => setEditProfile({ ...editProfile, membershipLevel: e.target.value })}
                            className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                          >
                            <option value="GENERAL">GENERAL - General Member (Preview / Free)</option>
                            {availableLevelTiers.map((lt) => (
                              <option key={lt.code} value={lt.code}>
                                {lt.code} - {lt.name} ({lt.price || '₹499'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={saveProfile}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer"
                        >
                          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmOpen(true)}
                          className="flex items-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <Trash2 size={16} /> Delete Student
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Milestones Tab */}
                  {activeTab === 'milestones' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="New milestone name..."
                            value={newMilestone.name}
                            onChange={e => {
                              setNewMilestone({ ...newMilestone, name: e.target.value });
                              if (milestoneError) setMilestoneError("");
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addMilestone();
                              }
                            }}
                            className={`flex-1 bg-[#fcfaf7] border ${milestoneError ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#c4431d]'} rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:ring-1 focus:ring-[#c4431d]/30 transition-colors`}
                          />
                          <label className="flex items-center gap-2 text-sm text-stone-600 px-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newMilestone.completed}
                              onChange={e => setNewMilestone({ ...newMilestone, completed: e.target.checked })}
                              className="accent-[#c4431d]"
                            />
                            Done
                          </label>
                          <button
                            type="button"
                            onClick={addMilestone}
                            disabled={isAddingMilestone}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 shrink-0 cursor-pointer"
                          >
                            <Plus size={16} /> {isAddingMilestone ? 'Adding...' : 'Add'}
                          </button>
                        </div>
                        {milestoneError && (
                          <p className="text-red-500 text-xs font-medium mt-1.5 pl-1">{milestoneError}</p>
                        )}
                      </div>

                      {(selectedStudent.milestones || []).length === 0 ? (
                        <div className="text-center text-stone-400 font-medium py-8">No milestones yet. Add one above!</div>
                      ) : (
                        <div className="space-y-2">
                          {(selectedStudent.milestones || []).map((m: any) => (
                            <div key={m.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${m.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-[#fcfaf7] border-stone-200'}`}>
                              <button onClick={() => toggleMilestone(m.id, m.completed)} className="shrink-0 cursor-pointer" title={m.completed ? "Mark incomplete" : "Mark complete"}>
                                {m.completed
                                  ? <CheckCircle2 size={22} className="text-emerald-400" />
                                  : <Circle size={22} className="text-stone-400 hover:text-[#c4431d] transition-colors" />
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
                                    className="flex-1 bg-white border border-[#c4431d] rounded-xl px-3 py-1.5 text-sm text-stone-900 focus:outline-none"
                                  />
                                  <button onClick={() => updateMilestoneName(m.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                                    Save
                                  </button>
                                  <button onClick={() => setEditingMilestoneId(null)} className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium text-sm ${m.completed ? 'text-stone-900 line-through' : 'text-stone-900 font-medium'}`}>{m.name}</span>
                                    <button
                                      onClick={() => {
                                        setEditingMilestoneId(m.id);
                                        setEditingMilestoneName(m.name);
                                      }}
                                      className="text-stone-400 hover:text-[#c4431d] p-1 transition-colors text-xs"
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

                              <button onClick={() => deleteMilestone(m.id)} className="text-stone-400 hover:text-rose-600 transition-colors p-1 shrink-0" title="Delete">
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
                          className="flex-1 min-w-[150px] bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors" />
                        <input type="number" placeholder="Amount (₹)" value={newSale.amount} onChange={e => setNewSale({ ...newSale, amount: e.target.value })}
                          className="w-36 bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors" />
                        <input type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })}
                          className="bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors" />
                        <button
                          onClick={addSaleRecord}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 shrink-0 cursor-pointer"
                        >
                          <Plus size={16} /> Add Sale
                        </button>
                      </div>

                      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-stone-50 text-xs font-bold text-stone-600 uppercase tracking-wider border-b border-stone-200">
                          <div>Product</div>
                          <div className="text-right">Amount</div>
                          <div>Date</div>
                          <div className="text-right">Action</div>
                        </div>
                        {(selectedStudent.salesRecords || []).length === 0 ? (
                          <div className="p-8 text-center text-stone-400 font-medium">No sales records yet.</div>
                        ) : (
                          (selectedStudent.salesRecords || []).map((s: any) => (
                            <div key={s.id} className="grid grid-cols-4 gap-4 px-4 py-4 items-center border-b border-stone-100 last:border-0 hover:bg-[#fff5ee]/60 transition-colors">
                              <div className="font-bold text-stone-900">{s.productName}</div>
                              <div className="text-right font-bold text-emerald-700 font-mono">₹{s.amount?.toLocaleString('en-IN')}</div>
                              <div className="text-stone-500 text-sm">{s.date ? new Date(s.date).toLocaleDateString('en-IN') : '-'}</div>
                              <div className="text-right">
                                <button onClick={() => deleteSaleRecord(s.id)} className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                        {(selectedStudent.salesRecords || []).length > 0 && (
                          <div className="px-4 py-3 bg-stone-50 flex justify-between items-center border-t border-stone-200">
                            <span className="text-stone-600 text-sm font-bold">Total Revenue</span>
                            <span className="font-black text-emerald-700 font-mono text-base">
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
                      <p className="text-stone-500 text-sm font-medium">Set skill scores (0–100) that appear on the student's radar chart.</p>
                      {skillKeys.map(key => (
                        <div key={key} className="flex items-center gap-4">
                          <label className="w-36 text-sm font-bold text-stone-700 shrink-0">{skillLabels[key]}</label>
                          <input
                            type="range" min={0} max={100}
                            value={skillsForm[key] || 0}
                            onChange={e => setSkillsForm({ ...skillsForm, [key]: parseInt(e.target.value) })}
                            className="flex-1 accent-[#c4431d]"
                          />
                          <span className="w-10 text-right font-black text-[#c4431d] font-mono">{skillsForm[key] || 0}</span>
                        </div>
                      ))}
                      <button
                        onClick={saveSkills}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer"
                      >
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Skills'}
                      </button>
                    </div>
                  )}

                  {/* Courses Tab */}
                  {activeTab === 'courses' && (
                    <div className="space-y-4">
                      <h3 className="text-stone-600 text-sm font-bold uppercase tracking-wider">Enrolled Courses</h3>
                      {(selectedStudent.courses || []).length === 0 ? (
                        <p className="text-stone-400 text-sm font-medium">No courses enrolled yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {(selectedStudent.courses || []).map((c: any) => (
                            <div key={c.id} className="flex items-center gap-4 p-4 bg-[#fcfaf7] border border-stone-200 rounded-2xl shadow-xs">
                              <BookOpen size={18} className="text-[#c4431d] shrink-0" />
                              <div className="flex-1">
                                <p className="font-bold text-stone-900">{c.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 bg-stone-200 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] h-1.5 rounded-full" style={{ width: `${c.UserCourse?.progress || 0}%` }} />
                                  </div>
                                  <span className="text-xs text-stone-500 font-medium">{c.UserCourse?.progress || 0}%</span>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    c.UserCourse?.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                    c.UserCourse?.status === 'enrolled' ? 'bg-[#fde5d6] text-[#942008] border border-[#f5ded0]' :
                                    'bg-stone-100 text-stone-600'
                                  }`}>{c.UserCourse?.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <h3 className="text-stone-600 text-sm font-bold uppercase tracking-wider mt-6">Enroll in Course</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {allCourses
                          .filter(c => !(selectedStudent.courses || []).find((sc: any) => sc.id === c.id))
                          .map(course => (
                            <button
                              key={course.id}
                              onClick={() => enrollCourse(course.id)}
                              className="flex items-center gap-3 p-4 bg-[#fcfaf7] border border-stone-200 hover:border-[#c4431d]/40 hover:bg-[#fff5ee]/60 rounded-2xl text-left transition-all group"
                            >
                              <Plus size={16} className="text-stone-400 group-hover:text-[#c4431d] transition-colors shrink-0" />
                              <span className="font-bold text-stone-800 group-hover:text-[#942008] transition-colors text-sm">{course.title}</span>
                            </button>
                          ))
                        }
                        {allCourses.filter(c => !(selectedStudent.courses || []).find((sc: any) => sc.id === c.id)).length === 0 && (
                          <p className="text-stone-400 text-sm col-span-2 font-medium">Student is enrolled in all available courses!</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===== BADGES TAB ===== */}
                  {activeTab === 'badges' && (
                    <div className="space-y-6">
                      {/* Earned Badges */}
                      <div>
                        <h3 className="text-stone-900 font-bold text-base mb-3 flex items-center gap-2">
                          🎖️ Badges Earned
                          <span className="ml-1 text-xs font-bold bg-[#fde5d6] text-[#942008] border border-[#f5ded0] px-2.5 py-0.5 rounded-full">
                            {(selectedStudent.badges || []).length} badge{(selectedStudent.badges || []).length !== 1 ? 's' : ''}
                          </span>
                        </h3>
                        {(selectedStudent.badges || []).length === 0 ? (
                          <div className="p-6 bg-[#fcfaf7] border border-stone-200 rounded-2xl text-center">
                            <p className="text-stone-500 text-sm font-medium">No badges awarded yet.</p>
                            <p className="text-stone-400 text-xs mt-1 font-medium">Award badges from the list below.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(selectedStudent.badges || []).map((badge: any) => (
                              <div
                                key={badge.id}
                                className="flex flex-col items-center p-4 bg-[#fff5ee] border border-[#f5ded0] rounded-2xl text-center relative group shadow-xs"
                              >
                                <span className="text-3xl mb-2">{badge.icon || '🏅'}</span>
                                <p className="text-stone-900 text-xs font-bold leading-tight">{badge.name}</p>
                                {badge.description && (
                                  <p className="text-stone-500 text-[10px] mt-1 leading-snug">{badge.description}</p>
                                )}
                                <button
                                  onClick={() => revokeBadgeFromStudent(badge.id)}
                                  className="mt-3 text-[10px] px-2.5 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 font-bold shadow-xs"
                                >
                                  Revoke
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-stone-900 font-bold text-base flex items-center gap-2">
                            ➕ Award a Badge
                          </h3>
                          <Link
                            href="/admin/badges"
                            className="text-xs font-bold text-[#c4431d] hover:text-[#942008] flex items-center gap-1"
                          >
                            ⚙️ Add / Edit Master Badges →
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {allBadges
                            .filter(b => !(selectedStudent.badges || []).find((sb: any) => sb.id === b.id))
                            .map((badge: any) => (
                              <button
                                key={badge.id}
                                onClick={() => awardBadgeToStudent(badge.id)}
                                className="flex flex-col items-center p-4 bg-[#fcfaf7] border border-stone-200 hover:border-[#c4431d]/40 hover:bg-[#fff5ee]/60 rounded-2xl text-center transition-all group shadow-xs"
                              >
                                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{badge.icon || '🏅'}</span>
                                <p className="text-stone-800 text-xs font-bold leading-tight group-hover:text-[#942008] transition-colors">{badge.name}</p>
                                {badge.description && (
                                  <p className="text-stone-500 text-[10px] mt-1 leading-snug">{badge.description}</p>
                                )}
                                <span className="mt-2 text-[10px] px-2.5 py-0.5 bg-[#fde5d6] text-[#942008] border border-[#f5ded0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                  Click to Award
                                </span>
                              </button>
                            ))}
                          {allBadges.filter(b => !(selectedStudent.badges || []).find((sb: any) => sb.id === b.id)).length === 0 && (
                            <p className="text-stone-400 text-sm col-span-3 font-medium">🎉 Student has all available badges!</p>
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
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-stone-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-3">
                <UserPlus className="text-[#c4431d]" /> Add New Student
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
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
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text" placeholder="Student Name"
                    value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text" placeholder="e.g. Mumbai"
                    value={addForm.city}
                    onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Email *</label>
                  <input
                    type="email" placeholder="student@example.com"
                    value={addForm.email}
                    onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel" placeholder="+91 9876543210"
                    value={addForm.phone}
                    onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showAddPwd ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={addForm.password}
                    onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 pr-12 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPwd(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {showAddPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={isAdding}
                className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdding ? 'Creating...' : <><UserPlus size={16} /> Create Student</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && selectedStudent && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-stone-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-stone-900">Delete Student Account?</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to soft delete <strong className="text-stone-900">{selectedStudent.name}</strong> (<span className="text-[#c4431d] font-mono font-bold">{selectedStudent.email}</span>)?
              </p>
              <p className="text-[11px] text-rose-400/90 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-left">
                ⚠️ Soft-deleting will remove this student from active student lists, leaderboards, feeds, attendance, and all software modules while preserving safe data audit history.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-colors cursor-pointer shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
