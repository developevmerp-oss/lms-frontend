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
        fetch(`${API_BASE_URL}/admin/students/summary`, { headers }),
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
              <Award className="text-[#c4431d]" /> Certificate Management
            </h1>
            <p className="text-stone-500 mt-2 font-medium">
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
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer"
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
            <div key={stat.label} className="bg-white/95 border border-[#ecdccb] rounded-2xl p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]">
              <p className="text-stone-500 text-sm mb-1 font-bold">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Certificates Table */}
        <div className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#fcfaf7] border-b border-stone-200 text-xs font-bold text-stone-600 uppercase tracking-wider">
            <div className="col-span-4">Student</div>
            <div className="col-span-4">Course</div>
            <div className="col-span-2">Issued</div>
            <div className="col-span-2 text-right">Certificate</div>
          </div>

          {certificates.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Award size={48} className="text-stone-300 mb-4" />
              <p className="text-stone-700 font-bold">No certificates issued yet</p>
              <p className="text-stone-400 text-sm mt-1">Click "Award Certificate" to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#fff5ee]/60 transition-colors"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
                      {(cert.student?.name || cert.User?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{cert.student?.name || cert.User?.name || "Student"}</p>
                      <p className="text-xs text-stone-400">{cert.student?.email || cert.User?.email || ""}</p>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <p className="font-semibold text-stone-800">{cert.course?.title || cert.Course?.title || "Course"}</p>
                  </div>
                  <div className="col-span-2 text-stone-500 text-sm">
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
                      <span className="text-stone-400 text-sm">No PDF</span>
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
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-8 max-w-lg w-full shadow-2xl text-stone-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Award className="text-yellow-400" /> Award Certificate
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAward} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Select Student</label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                >
                  <option value="" disabled>-- Choose a student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Select Course</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">PDF URL (optional)</label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-1 focus:ring-[#c4431d]/30 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors border border-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !studentId || !courseId}
                  className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white disabled:opacity-50 rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer"
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
