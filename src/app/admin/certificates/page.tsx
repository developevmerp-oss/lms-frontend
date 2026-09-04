"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import { Award, Plus, X, ExternalLink, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function AdminCertificates() {
  const { token, user, logout } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    if (!token) return;
    try {
      const [certRes, studentsRes, coursesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/certificates`, { headers }),
        fetch(`${API_BASE_URL}/admin/students`, { headers }),
        fetch(`${API_BASE_URL}/courses`, { headers }),
      ]);
      const certData = await certRes.json();
      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();
      if (Array.isArray(certData)) setCertificates(certData);
      if (Array.isArray(studentsData)) setStudents(studentsData);
      if (Array.isArray(coursesData)) setCourses(coursesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleAward = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/certificates/award`, {
        method: "POST",
        headers,
        body: JSON.stringify({ studentId, courseId, pdfUrl }),
      });
      if (res.ok) {
        setShowModal(false);
        setStudentId("");
        setCourseId("");
        setPdfUrl("");
        await fetchData();
        setSuccessMsg("Certificate awarded!");
        setTimeout(() => setSuccessMsg(""), 3000);
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Award className="text-yellow-400" /> Certificate Management
            </h1>
            <p className="text-slate-400 mt-2">
              Award course completion certificates to students.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {successMsg && (
              <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle2 size={14} /> {successMsg}
              </span>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-colors shadow-lg shadow-yellow-500/20"
            >
              <Plus size={18} /> Award Certificate
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Awarded", value: certificates.length, color: "text-yellow-400" },
            { label: "Students Certified", value: new Set(certificates.map(c => c.userId || c.studentId)).size, color: "text-green-400" },
            { label: "Courses Covered", value: new Set(certificates.map(c => c.courseId)).size, color: "text-blue-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Certificates Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/50 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Student</div>
            <div className="col-span-4">Course</div>
            <div className="col-span-2">Issued</div>
            <div className="col-span-2 text-right">Certificate</div>
          </div>

          {certificates.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Award size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-400 font-medium">No certificates issued yet</p>
              <p className="text-slate-600 text-sm mt-1">Click "Award Certificate" to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-sm shrink-0">
                      {(cert.student?.name || cert.User?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{cert.student?.name || cert.User?.name || "Student"}</p>
                      <p className="text-xs text-slate-500">{cert.student?.email || cert.User?.email || ""}</p>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <p className="font-medium text-slate-300">{cert.course?.title || cert.Course?.title || "Course"}</p>
                  </div>
                  <div className="col-span-2 text-slate-500 text-sm">
                    {cert.createdAt
                      ? new Date(cert.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {cert.pdfUrl ? (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 text-sm font-bold transition-colors bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 hover:border-yellow-400/50"
                      >
                        <ExternalLink size={14} /> View PDF
                      </a>
                    ) : (
                      <span className="text-slate-600 text-sm">No PDF</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Award Certificate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="text-yellow-400" /> Award Certificate
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAward} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Select Student</label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition-colors"
                >
                  <option value="" disabled>-- Choose a student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Select Course</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition-colors"
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">PDF URL (optional)</label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !studentId || !courseId}
                  className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 disabled:opacity-50 rounded-xl font-bold transition-colors"
                >
                  {isSubmitting ? "Awarding..." : "Award Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
