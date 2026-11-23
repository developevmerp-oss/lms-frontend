"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Award,
  Plus,
  X,
  ExternalLink,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Check,
  Sparkles,
  BookOpen,
  Search,
  User,
  Download,
  Edit2,
  Calendar,
} from "lucide-react";
import { StatCardSkeleton, AdminTableSkeleton } from "@/components/ui/SkeletonLoader";
import { API_BASE_URL, getImageUrl } from "@/config/api";

export default function AdminCertificates() {
  const { token, user, logout } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [liveLevels, setLiveLevels] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<{ url: string; title: string; studentName: string } | null>(null);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit Certificate Modal State
  const [editCert, setEditCert] = useState<any | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // Student specific details (enrolled courses, transactions & exact memberships)
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [paymentTxs, setPaymentTxs] = useState<any[]>([]);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);

  // Tree dropdown state
  const [isTreeDropdownOpen, setIsTreeDropdownOpen] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    standalone: true,
  });
  const [courseSearch, setCourseSearch] = useState("");
  const treeDropdownRef = useRef<HTMLDivElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [certRes, studentsRes, coursesRes, levelsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/certificates`, { headers }),
        fetch(`${API_BASE_URL}/admin/students/summary`, { headers }),
        fetch(`${API_BASE_URL}/courses`, { headers }),
        fetch(`${API_BASE_URL}/admin/levels`, { headers }).catch(() => null),
      ]);
      const certData = await certRes.json();
      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();

      if (Array.isArray(certData)) setCertificates(certData);
      if (Array.isArray(studentsData)) {
        setStudents(studentsData);
        if (studentsData.length > 0 && !studentId) setStudentId(studentsData[0].id);
      }
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
        if (coursesData.length > 0 && !courseId) setCourseId(coursesData[0].id);
      }
      if (levelsRes && levelsRes.ok) {
        const levelsData = await levelsRes.json();
        if (Array.isArray(levelsData)) setLiveLevels(levelsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Click outside listener for tree dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (treeDropdownRef.current && !treeDropdownRef.current.contains(e.target as Node)) {
        setIsTreeDropdownOpen(false);
      }
    };
    if (isTreeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isTreeDropdownOpen]);

  // Fetch student details & payment transactions whenever selected student changes
  const fetchStudentDetails = async (id: string, email?: string) => {
    if (!id || !token) return;
    setLoadingStudentDetails(true);
    try {
      const studentReq = fetch(`${API_BASE_URL}/admin/students/${id}`, { headers });
      const paymentsReq = email
        ? fetch(`${API_BASE_URL}/payments/history?search=${encodeURIComponent(email)}&status=completed`, { headers }).catch(() => null)
        : Promise.resolve(null);

      const [sRes, pRes] = await Promise.all([studentReq, paymentsReq]);
      if (sRes.ok) {
        const data = await sRes.json();
        setStudentDetails(data);
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        const txs = Array.isArray(pData?.transactions) ? pData.transactions : [];
        setPaymentTxs(txs);
      } else {
        setPaymentTxs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  useEffect(() => {
    if (studentId && showModal) {
      const target = students.find((s) => s.id === studentId);
      fetchStudentDetails(studentId, target?.email);
    }
  }, [studentId, showModal]);

  const handleOpenModal = () => {
    if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
    setErrorMsg("");
    setCourseSearch("");
    setShowAllCourses(false);
    setIsTreeDropdownOpen(false);
    setShowModal(true);
  };

  const LEVEL_HIERARCHY: Record<string, number> = {
    GENERAL: 0,
    L0: 1,
    L1: 2,
    L2: 3,
    L3: 4,
    "L3+": 5,
    L4: 6,
    L6: 7,
    L7: 8,
  };

  // Helper to extract clean Level code (e.g. L0, L1, L2, L3, L3+, L4, L6, L7)
  const extractLevelCode = (raw?: string): string => {
    if (!raw) return "";
    const str = String(raw).toUpperCase().trim();
    if (str.includes("GENERAL")) return "";
    if (str.includes("L3+")) return "L3+";
    if (str.includes("L4")) return "L4";
    if (str.includes("L6")) return "L6";
    if (str.includes("L7")) return "L7";
    if (str.includes("L3") || str.includes("DIAMOND")) return "L3";
    if (str.includes("L2") || str.includes("GOLD")) return "L2";
    if (str.includes("L1") || str.includes("SILVER")) return "L1";
    if (str.includes("L0") || str.includes("FAST") || str.includes("STARTER")) return "L0";
    const match = str.match(/L\d\+?/);
    return match ? match[0] : "";
  };

  const selectedStudent = students.find((s) => s.id === studentId) || studentDetails;
  const currentLevelRaw = studentDetails?.membershipLevel || selectedStudent?.membershipLevel || "";
  const studentLevelCode = extractLevelCode(currentLevelRaw);

  // Student enrolled courses (from /admin/students/:id)
  const studentEnrolledCourses: any[] = studentDetails?.courses || [];

  // Categorize courses into groups for tree rendering
  const isStandaloneCourse = (c: any) =>
    !c.levelCode || c.levelCode === "NONE" || String(c.levelCode).trim() === "";

  // 1. Collect ALL Membership Tier Codes the student has purchased or unlocked
  const purchasedTierCodes = new Set<string>();

  // A. From completed payment transactions
  paymentTxs.forEach((tx: any) => {
    if (tx.status === "completed" && tx.tierCode && tx.tierCode !== "COURSE" && tx.tierCode !== "GENERAL") {
      const code = extractLevelCode(tx.tierCode) || tx.tierCode.toUpperCase().trim();
      if (code) purchasedTierCodes.add(code);
    }
  });

  // B. From student's assigned membership level (including cumulative level access)
  if (studentLevelCode && studentLevelCode !== "GENERAL") {
    purchasedTierCodes.add(studentLevelCode);

    const studentRankNum = LEVEL_HIERARCHY[studentLevelCode] ?? 0;
    if (studentRankNum > 0) {
      Object.entries(LEVEL_HIERARCHY).forEach(([code, rank]) => {
        if (code !== "GENERAL" && rank <= studentRankNum && rank > 0) {
          purchasedTierCodes.add(code);
        }
      });
    }
  }

  // Sorted list of purchased membership tier objects
  const purchasedTiersList = Array.from(purchasedTierCodes)
    .map((code) => {
      const tierObj = liveLevels.find((l) => l.code === code);
      return {
        code,
        name:
          tierObj?.name ||
          (code === "L0"
            ? "Fast Track: Resin FastStart"
            : code === "L1"
            ? "Explore Membership"
            : code === "L2"
            ? "Master Membership"
            : code === "L3"
            ? "Renaissance Certification"
            : code === "L3+"
            ? "Masters Club"
            : `${code} Membership`),
        order: tierObj?.order ?? LEVEL_HIERARCHY[code] ?? 99,
      };
    })
    .sort((a, b) => a.order - b.order);

  // 2. Collect ALL standalone courses the student has purchased / enrolled in
  const purchasedStandaloneCourses: any[] = [];
  const seenCourseIds = new Set<string>();

  studentEnrolledCourses.forEach((sc: any) => {
    if (isStandaloneCourse(sc) && !seenCourseIds.has(sc.id)) {
      seenCourseIds.add(sc.id);
      const full = courses.find((c) => c.id === sc.id) || sc;
      purchasedStandaloneCourses.push(full);
    }
  });

  paymentTxs.forEach((tx: any) => {
    if (tx.status === "completed" && tx.courseId && !seenCourseIds.has(tx.courseId)) {
      seenCourseIds.add(tx.courseId);
      const full = courses.find((c) => c.id === tx.courseId);
      if (full) {
        purchasedStandaloneCourses.push(full);
      } else {
        purchasedStandaloneCourses.push({
          id: tx.courseId,
          title: tx.tierName || "Purchased Standalone Masterclass",
          levelCode: null,
        });
      }
    }
  });

  // 3. Unpurchased Standalone & Other Levels (for Admin Override toggle only)
  const unpurchasedStandaloneCourses = courses.filter(
    (c) => isStandaloneCourse(c) && !seenCourseIds.has(c.id)
  );
  const otherLevels = liveLevels.filter((l) => !purchasedTierCodes.has(l.code));

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isFolderOpen = (key: string) => expandedFolders[key] !== false; // Open by default

  // Currently selected course object
  const selectedCourse = courses.find((c) => c.id === courseId);

  // Collect all courses from all purchased memberships + purchased standalone courses
  const allPurchasedCourses: any[] = [];
  purchasedTiersList.forEach((tier) => {
    const tierCourses = courses.filter((c) => String(c.levelCode).toUpperCase() === tier.code);
    allPurchasedCourses.push(...tierCourses);
  });
  allPurchasedCourses.push(...purchasedStandaloneCourses);

  const hasPurchasedCourses = allPurchasedCourses.length > 0;

  // Auto-select course when student changes or purchases load
  useEffect(() => {
    if (!showModal) return;
    if (allPurchasedCourses.length > 0) {
      const isCurrentlyValid = allPurchasedCourses.some((c) => c.id === courseId);
      if (!isCurrentlyValid) {
        setCourseId(allPurchasedCourses[0].id);
      }
    } else {
      setCourseId("");
    }
  }, [
    studentId,
    studentDetails,
    paymentTxs,
    showModal,
    allPurchasedCourses.length,
  ]);

  // Helper to remove course numbering (e.g. "1. ", "2. ") from course names
  const cleanCourseTitle = (rawTitle?: string): string => {
    if (!rawTitle) return "";
    return rawTitle.replace(/^\s*\d+[\.\:\-\)\s]+\s*/, "").trim();
  };

  // Helper to format today's date as DD-MM-YYYY (e.g. 23-11-2026)
  const getFormattedTodayDate = (): string => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Helper to dynamically draw text fitted within maxWidth on canvas
  const drawFittedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    baseSize: number,
    fontFamily: string,
    maxWidth: number,
    style: string = ""
  ) => {
    let size = baseSize;
    ctx.font = `${style} ${size}px ${fontFamily}`.trim();
    while (ctx.measureText(text).width > maxWidth && size > 16) {
      size -= 2;
      ctx.font = `${style} ${size}px ${fontFamily}`.trim();
    }
    ctx.fillText(text, x, y);
  };

  // Generates the certificate image matching Reference Image 2
  const generateCertificateBlob = async (
    studentName: string,
    courseName: string,
    dateStr: string
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 768;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Failed to get 2D canvas context"));
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/images/certificate-template.png";

      img.onload = async () => {
        try {
          // 1. Draw base certificate template (navy patterned frame, gold corners & double border, Ravishing Art butterfly logo, appreciation headings, signature)
          ctx.drawImage(img, 0, 0, 1024, 768);

          // 2. Preload fonts if available
          try {
            if (document.fonts) {
              await Promise.all([
                document.fonts.load("56px 'Alex Brush'"),
                document.fonts.load("bold 26px 'Montserrat'"),
              ]);
            }
          } catch (_) {}

          // 3. Draw Student Profile Name (in elegant cursive calligraphy)
          ctx.save();
          ctx.fillStyle = "#1a2b49";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          drawFittedText(
            ctx,
            studentName,
            512,
            365,
            56,
            "'Alex Brush', 'Dancing Script', 'Brush Script MT', 'Great Vibes', cursive",
            700,
            "italic"
          );
          ctx.restore();

          // 4. Draw Course Name (Bold deep navy - numbers stripped)
          ctx.save();
          ctx.fillStyle = "#14223d";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          drawFittedText(
            ctx,
            cleanCourseTitle(courseName),
            512,
            482,
            26,
            "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
            720,
            "bold"
          );
          ctx.restore();

          // 5. Draw Date (DD-MM-YYYY above the date line)
          ctx.save();
          ctx.fillStyle = "#14223d";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "bold 17px 'Montserrat', sans-serif";
          ctx.fillText(dateStr, 305, 608);
          ctx.restore();

          // 6. Convert canvas to PNG Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas toBlob failed"));
              }
            },
            "image/png",
            1.0
          );
        } catch (renderErr) {
          reject(renderErr);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load certificate template image (/images/certificate-template.png)"));
      };
    });
  };

  const handleAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId || !hasPurchasedCourses) {
      setErrorMsg("Please select both a student and a purchased course.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const studentName = selectedStudent?.name || "Student";
      const courseTitle = cleanCourseTitle(selectedCourse?.title || "Resin Art Masterclass");
      const todayDate = getFormattedTodayDate();

      // 1. Generate certificate matching Reference Image 2
      const certBlob = await generateCertificateBlob(studentName, courseTitle, todayDate);

      // 2. Upload generated certificate image
      const formData = new FormData();
      formData.append("file", certBlob, `certificate_${studentId}_${courseId}_${Date.now()}.png`);

      let certUrl = "";
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/upload/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          certUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn("Image upload fallback:", uploadErr);
      }

      // Fallback url if upload response is empty
      if (!certUrl) {
        certUrl = `/uploads/images/certificate_${studentId}_${courseId}.png`;
      }

      // 3. Award certificate in database
      const res = await fetch(`${API_BASE_URL}/certificates/award`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          studentId,
          courseId,
          pdfUrl: certUrl,
          certificateUrl: certUrl,
          title: `${courseTitle} Completion Certificate`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setShowModal(false);
        setPdfUrl("");
        await fetchData();
        setSuccessMsg(`Certificate successfully awarded to ${studentName}!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data?.message || data?.error || "Failed to award certificate. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to generate certificate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (cert: any) => {
    const rawStudentName = cert.student?.name || cert.User?.name || "";
    const rawCourseName =
      cert.course?.title ||
      cert.Course?.title ||
      (cert.title ? cert.title.replace(/ Completion Certificate$/i, "") : "");
    setEditCert(cert);
    setEditStudentName(rawStudentName);
    setEditCourseName(cleanCourseTitle(rawCourseName));
    setEditErrorMsg("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCert) return;
    if (!editStudentName.trim() || !editCourseName.trim()) {
      setEditErrorMsg("Please enter both student name and course name.");
      return;
    }

    setIsSavingEdit(true);
    setEditErrorMsg("");
    try {
      const studentName = editStudentName.trim();
      const courseName = cleanCourseTitle(editCourseName.trim());
      const todayDate = getFormattedTodayDate();

      // 1. Generate updated certificate image with today's date and clean course title
      const certBlob = await generateCertificateBlob(studentName, courseName, todayDate);

      // 2. Upload regenerated certificate image
      const formData = new FormData();
      formData.append(
        "file",
        certBlob,
        `certificate_${editCert.studentId || editCert.userId || "student"}_${editCert.courseId || "course"}_${Date.now()}.png`
      );

      let certUrl = "";
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/upload/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          certUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn("Upload fallback on edit:", uploadErr);
      }

      if (!certUrl) {
        certUrl = `/uploads/images/certificate_${editCert.id}_${Date.now()}.png`;
      }

      // 3. Update certificate on backend (which also updates student name and sets updatedAt/createdAt to now)
      const res = await fetch(`${API_BASE_URL}/certificates/${editCert.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: `${courseName} Completion Certificate`,
          certificateUrl: certUrl,
          pdfUrl: certUrl,
          studentName,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEditCert(null);
        await fetchData();
        setSuccessMsg(`Certificate updated successfully for ${studentName} with date ${todayDate}!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setEditErrorMsg(data?.message || data?.error || "Failed to update certificate. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setEditErrorMsg(err?.message || "Failed to update certificate. Please try again.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors lg:pl-64"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "radial-gradient(circle, #e2ded4 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNav user={user} logout={logout} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Actions Bar - Award Certificate on RIGHT side */}
        <div className="flex flex-wrap items-center justify-end gap-4 mb-6">
          {successMsg && (
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 mr-auto">
              <CheckCircle2 size={14} /> {successMsg}
            </span>
          )}
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer ml-auto"
          >
            <Plus size={18} /> Award Certificate
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <AdminTableSkeleton rows={5} cols={4} />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Total Awarded", value: certificates.length, color: "text-yellow-400" },
                {
                  label: "Students Certified",
                  value: new Set(certificates.map((c) => c.userId || c.studentId)).size,
                  color: "text-green-400",
                },
                {
                  label: "Courses Covered",
                  value: new Set(certificates.map((c) => c.courseId)).size,
                  color: "text-blue-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/95 border border-[#ecdccb] rounded-2xl p-5 shadow-[0_4px_16px_-4px_rgba(45,30,15,0.06)]"
                >
                  <p className="text-stone-500 text-xs sm:text-sm mb-1 font-bold">{stat.label}</p>
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Certificates Table */}
            <div className="bg-white/95 border border-[#ecdccb] rounded-3xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#fcfaf7] border-b border-stone-200 text-xs font-bold text-stone-600 uppercase tracking-wider">
                <div className="col-span-4 sm:col-span-3">Student</div>
                <div className="col-span-4 sm:col-span-4">Course</div>
                <div className="col-span-2 sm:col-span-2">Issued</div>
                <div className="col-span-2 sm:col-span-3 text-right">Certificate & Actions</div>
              </div>

              {certificates.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <Award size={48} className="text-stone-300 mb-4" />
                  <p className="text-stone-700 font-bold">No certificates issued yet</p>
                  <p className="text-stone-400 text-sm mt-1">Click &quot;Award Certificate&quot; to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#fff5ee]/60 transition-colors"
                    >
                      <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#942008] via-[#c4431d] to-[#ea580c] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
                          {(cert.student?.name || cert.User?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate">{cert.student?.name || cert.User?.name || "Student"}</p>
                          <p className="text-xs text-stone-400 truncate">{cert.student?.email || cert.User?.email || ""}</p>
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-4">
                        <p className="font-semibold text-stone-800">
                          {cleanCourseTitle(cert.course?.title || cert.Course?.title || (cert.title ? cert.title.replace(/ Completion Certificate$/i, "") : "Course"))}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-2 text-stone-500 text-sm">
                        {cert.createdAt
                          ? new Date(cert.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </div>
                      <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
                        {cert.pdfUrl || cert.certificateUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewCert({
                                url: getImageUrl(cert.pdfUrl || cert.certificateUrl),
                                title: cleanCourseTitle(cert.course?.title || cert.Course?.title || cert.title || "Certificate"),
                                studentName: cert.student?.name || cert.User?.name || "Student",
                              })
                            }
                            className="flex items-center gap-1.5 text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-bold transition-colors bg-yellow-50 hover:bg-yellow-100/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-yellow-200 cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <ExternalLink size={14} /> View Certificate
                          </button>
                        ) : (
                          <span className="text-stone-400 text-xs sm:text-sm">No Certificate</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cert)}
                          className="flex items-center gap-1 text-stone-700 hover:text-[#942008] text-xs sm:text-sm font-bold transition-colors bg-stone-100 hover:bg-[#fff5ee] hover:border-[#f5ded0] px-2.5 sm:px-3 py-1.5 rounded-lg border border-stone-200 cursor-pointer shadow-2xs whitespace-nowrap"
                          title="Edit Student Name & Course Name"
                        >
                          <Edit2 size={13} className="text-[#c4431d]" /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Award Certificate Modal with Tree-Format Course Picker */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-stone-900 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-100">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <Award className="text-[#c4431d]" /> Award Certificate
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAward} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold leading-relaxed">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* 1. Select Student */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User size={14} className="text-[#c4431d]" /> Select Student
                </label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/20 transition-all cursor-pointer font-medium text-xs sm:text-sm"
                >
                  {students.length === 0 ? (
                    <option value="" disabled>No students available</option>
                  ) : (
                    students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email}) — {s.membershipLevel || "General"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* 2. Course Selection in Tree Format */}
              <div className="relative" ref={treeDropdownRef}>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#c4431d]" /> Select Course to Certify
                  </span>
                  {hasPurchasedCourses && selectedCourse?.levelCode && (
                    <span className="text-[10px] font-bold text-[#942008] bg-[#fde5d6] px-2 py-0.5 rounded-md">
                      Level {selectedCourse.levelCode}
                    </span>
                  )}
                  {hasPurchasedCourses && selectedCourse && isStandaloneCourse(selectedCourse) && (
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                      Standalone Course
                    </span>
                  )}
                </label>

                {/* Tree Dropdown Trigger Button */}
                <button
                  type="button"
                  disabled={!hasPurchasedCourses || loadingStudentDetails}
                  onClick={() => {
                    if (hasPurchasedCourses) {
                      setIsTreeDropdownOpen((prev) => !prev);
                    }
                  }}
                  className={`w-full border rounded-xl px-4 py-3 text-left flex items-center justify-between gap-3 transition-all ${
                    !hasPurchasedCourses
                      ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-80"
                      : isTreeDropdownOpen
                      ? "border-[#c4431d] ring-2 ring-[#c4431d]/20 bg-white cursor-pointer"
                      : "bg-[#fcfaf7] border-stone-300 hover:border-[#c4431d]/60 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText
                      size={16}
                      className={hasPurchasedCourses ? "text-[#c4431d] shrink-0" : "text-stone-400 shrink-0"}
                    />
                    <div className="min-w-0 truncate">
                      {loadingStudentDetails ? (
                        <span className="text-stone-400 text-xs sm:text-sm flex items-center gap-2">
                          <Loader2 size={13} className="animate-spin text-[#c4431d]" /> Checking student purchases...
                        </span>
                      ) : !hasPurchasedCourses ? (
                        <span className="text-stone-500 font-semibold text-xs sm:text-sm">
                          No course purchased by this student
                        </span>
                      ) : selectedCourse ? (
                        <span className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {selectedCourse.title}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs sm:text-sm">
                          Select a purchased course...
                        </span>
                      )}
                    </div>
                  </div>
                  {hasPurchasedCourses && (
                    <ChevronDown
                      size={18}
                      className={`text-stone-400 shrink-0 transition-transform duration-200 ${
                        isTreeDropdownOpen ? "rotate-180 text-[#c4431d]" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Tree Dropdown Menu */}
                {isTreeDropdownOpen && hasPurchasedCourses && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-[#ecdccb] rounded-2xl shadow-[0_16px_36px_-8px_rgba(90,55,20,0.18)] max-h-80 overflow-y-auto p-2.5 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                    {/* Search inside tree */}
                    <div className="pb-2">
                      <div className="flex items-center gap-2 bg-[#faf8f5] border border-stone-200 rounded-xl px-3 py-1.5">
                        <Search size={14} className="text-stone-400 shrink-0" />
                        <input
                          type="text"
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="Filter course title..."
                          className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Tree Node 1: All Purchased Membership Tiers */}
                    {purchasedTiersList.map((tier) => {
                      const tierCourses = courses.filter(
                        (c) => String(c.levelCode).toUpperCase() === tier.code
                      );
                      if (tierCourses.length === 0) return null;
                      const isOpen = isFolderOpen(`tier_${tier.code}`);

                      return (
                        <div key={tier.code} className="py-2">
                          <button
                            type="button"
                            onClick={() => toggleFolder(`tier_${tier.code}`)}
                            className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-[#942008]">
                              {isOpen ? (
                                <FolderOpen size={16} className="text-[#c4431d] shrink-0" />
                              ) : (
                                <Folder size={16} className="text-[#c4431d] shrink-0" />
                              )}
                              <span className="font-black">
                                📂 {tier.name} ({tier.code}) — {tierCourses.length} Courses
                              </span>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold">
                                ✓ Purchased
                              </span>
                            </div>
                            {isOpen ? (
                              <ChevronDown size={14} className="text-stone-400" />
                            ) : (
                              <ChevronRight size={14} className="text-stone-400" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="relative pl-6 mt-1 space-y-0.5 before:content-[''] before:absolute before:left-3.5 before:top-1 before:bottom-3 before:w-px before:bg-stone-200">
                              {tierCourses
                                .filter((c) =>
                                  !courseSearch.trim() ||
                                  c.title.toLowerCase().includes(courseSearch.toLowerCase())
                                )
                                .map((c) => {
                                  const isSelected = courseId === c.id;
                                  return (
                                    <div key={c.id} className="relative flex items-center">
                                      <span className="absolute -left-2.5 w-2.5 h-px bg-stone-200" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCourseId(c.id);
                                          setIsTreeDropdownOpen(false);
                                        }}
                                        className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-[#fff5ee] text-[#942008] font-bold border border-[#f5ded0] shadow-2xs"
                                            : "hover:bg-[#faf8f5] text-stone-700"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <FileText
                                            size={13}
                                            className={isSelected ? "text-[#c4431d] shrink-0" : "text-stone-400 shrink-0"}
                                          />
                                          <span className="truncate">{c.title}</span>
                                        </div>
                                        {isSelected && <Check size={14} className="text-[#c4431d] shrink-0" />}
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Tree Node 2: Purchased Standalone Courses (Only standalone courses the student has purchased) */}
                    {purchasedStandaloneCourses.length > 0 && (
                      <div className="py-2">
                        <button
                          type="button"
                          onClick={() => toggleFolder("standalone")}
                          className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-stone-900">
                            {expandedFolders.standalone ? (
                              <FolderOpen size={16} className="text-orange-500 shrink-0" />
                            ) : (
                              <Folder size={16} className="text-orange-500 shrink-0" />
                            )}
                            <span className="font-black">
                              🎨 Purchased Standalone Courses ({purchasedStandaloneCourses.length})
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold">
                              ✓ Purchased
                            </span>
                          </div>
                          {expandedFolders.standalone ? (
                            <ChevronDown size={14} className="text-stone-400" />
                          ) : (
                            <ChevronRight size={14} className="text-stone-400" />
                          )}
                        </button>

                        {expandedFolders.standalone && (
                          <div className="relative pl-6 mt-1 space-y-0.5 before:content-[''] before:absolute before:left-3.5 before:top-1 before:bottom-3 before:w-px before:bg-stone-200">
                            {purchasedStandaloneCourses
                              .filter((c) =>
                                !courseSearch.trim() ||
                                c.title.toLowerCase().includes(courseSearch.toLowerCase())
                              )
                              .map((c) => {
                                const isSelected = courseId === c.id;
                                return (
                                  <div key={c.id} className="relative flex items-center">
                                    <span className="absolute -left-2.5 w-2.5 h-px bg-stone-200" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCourseId(c.id);
                                        setIsTreeDropdownOpen(false);
                                      }}
                                      className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-[#fff5ee] text-[#942008] font-bold border border-[#f5ded0] shadow-2xs"
                                          : "hover:bg-[#faf8f5] text-stone-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText
                                          size={13}
                                          className={isSelected ? "text-[#c4431d] shrink-0" : "text-stone-400 shrink-0"}
                                        />
                                        <span className="truncate">{c.title}</span>
                                      </div>
                                      {isSelected && <Check size={14} className="text-[#c4431d] shrink-0" />}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty State: Student has neither purchased memberships nor standalone courses */}
                    {purchasedTiersList.length === 0 && purchasedStandaloneCourses.length === 0 && !showAllCourses && (
                      <div className="py-6 px-4 text-center">
                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-2 text-stone-400">
                          <BookOpen size={18} />
                        </div>
                        <p className="text-xs font-bold text-stone-800">No Purchased Courses</p>
                        <p className="text-[11px] text-stone-400 mt-0.5 max-w-xs mx-auto">
                          This student has not purchased any membership or standalone course yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAllCourses(true)}
                          className="mt-2.5 text-xs text-[#c4431d] font-bold hover:underline cursor-pointer"
                        >
                          Browse all courses (Admin Override) →
                        </button>
                      </div>
                    )}

                    {/* Admin Override Section (Show all other courses only when manually expanded) */}
                    {showAllCourses && (
                      <div className="pt-2 space-y-2 border-t border-dashed border-stone-200">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 flex items-center justify-between">
                          <span>Other Courses (Admin Override)</span>
                          <button
                            type="button"
                            onClick={() => setShowAllCourses(false)}
                            className="text-[10px] text-[#c4431d] hover:underline cursor-pointer font-bold"
                          >
                            Hide
                          </button>
                        </div>

                        {/* Unpurchased Standalone Courses */}
                        {unpurchasedStandaloneCourses.length > 0 && (
                          <div>
                            <div className="text-[11px] font-bold text-stone-600 px-2 py-1">
                              🎨 Other Standalone Courses ({unpurchasedStandaloneCourses.length})
                            </div>
                            <div className="pl-4 space-y-0.5">
                              {unpurchasedStandaloneCourses
                                .filter((c) =>
                                  !courseSearch.trim() ||
                                  c.title.toLowerCase().includes(courseSearch.toLowerCase())
                                )
                                .map((c) => {
                                  const isSelected = courseId === c.id;
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setCourseId(c.id);
                                        setIsTreeDropdownOpen(false);
                                      }}
                                      className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-[#fff5ee] text-[#942008] font-bold border border-[#f5ded0]"
                                          : "hover:bg-[#faf8f5] text-stone-600"
                                      }`}
                                    >
                                      <span className="truncate">{c.title}</span>
                                      {isSelected && <Check size={14} className="text-[#c4431d] shrink-0" />}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {/* Other Membership Levels */}
                        {otherLevels.map((lvl) => {
                          const lvlCourses = courses.filter(
                            (c) => String(c.levelCode).toUpperCase() === lvl.code
                          );
                          if (lvlCourses.length === 0) return null;
                          return (
                            <div key={lvl.code}>
                              <div className="text-[11px] font-bold text-stone-600 px-2 py-1">
                                📂 {lvl.name || lvl.code} ({lvlCourses.length} Courses)
                              </div>
                              <div className="pl-4 space-y-0.5">
                                {lvlCourses
                                  .filter((c) =>
                                    !courseSearch.trim() ||
                                    c.title.toLowerCase().includes(courseSearch.toLowerCase())
                                  )
                                  .map((c) => {
                                    const isSelected = courseId === c.id;
                                    return (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => {
                                          setCourseId(c.id);
                                          setIsTreeDropdownOpen(false);
                                        }}
                                        className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-[#fff5ee] text-[#942008] font-bold border border-[#f5ded0]"
                                            : "hover:bg-[#faf8f5] text-stone-600"
                                        }`}
                                      >
                                        <span className="truncate">{c.title}</span>
                                        {isSelected && <Check size={14} className="text-[#c4431d] shrink-0" />}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Bottom Link to expand all courses if needed */}
                    {!showAllCourses && (purchasedTiersList.length > 0 || purchasedStandaloneCourses.length > 0) && (
                      <div className="pt-2 text-center border-t border-dashed border-stone-200 mt-2">
                        <button
                          type="button"
                          onClick={() => setShowAllCourses(true)}
                          className="text-[11px] text-stone-400 hover:text-[#c4431d] font-semibold transition-colors cursor-pointer"
                        >
                          + Need to certify an unpurchased course? Click here
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. PDF URL (optional) - Commented as requested */}
              {/*
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  PDF URL (optional)
                </label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/20 transition-all text-xs sm:text-sm"
                />
              </div>
              */}

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors border border-stone-300 cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !studentId || !courseId || !hasPurchasedCourses}
                  className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white disabled:opacity-50 rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSubmitting ? "Generating Certificate..." : "Award Certificate"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Certificate Modal */}
      {editCert && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ecdccb] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-100">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <Edit2 className="text-[#c4431d]" size={22} /> Edit Certificate
              </h2>
              <button
                type="button"
                onClick={() => setEditCert(null)}
                className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editErrorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold leading-relaxed">
                  ⚠️ {editErrorMsg}
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User size={14} className="text-[#c4431d]" /> Student Name
                </label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  placeholder="e.g. Shreya Shah"
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/20 transition-all font-medium text-xs sm:text-sm"
                />
              </div>

              {/* Course Name (No course number) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#c4431d]" /> Course Name (without course number)
                </label>
                <input
                  type="text"
                  required
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                  placeholder="e.g. Resin Fundamentals"
                  className="w-full bg-[#fcfaf7] border border-stone-300 rounded-xl px-4 py-3 text-stone-900 outline-none focus:border-[#c4431d] focus:ring-2 focus:ring-[#c4431d]/20 transition-all font-medium text-xs sm:text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Leading numbers (e.g. &quot;1.&quot;, &quot;2.&quot;) will automatically be stripped from the certificate.
                </p>
              </div>

              {/* Automatic Today's Date info box */}
              <div className="p-3.5 rounded-xl bg-[#fff8f3] border border-[#f5ded0] flex items-center gap-3">
                <Calendar size={18} className="text-[#c4431d] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-stone-900">Certificate Issue Date: </span>
                  <span className="font-black text-[#942008] bg-white px-2 py-0.5 rounded border border-[#f5ded0]">
                    {getFormattedTodayDate()}
                  </span>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Will update automatically to today&apos;s date upon saving.
                  </p>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCert(null)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors border border-stone-300 cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit || !editStudentName.trim() || !editCourseName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white disabled:opacity-50 rounded-xl font-bold transition-all shadow-md shadow-[#c4431d]/25 cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {isSavingEdit && <Loader2 size={16} className="animate-spin" />}
                  <span>{isSavingEdit ? "Updating & Regenerating..." : "Save & Update Certificate"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900">{previewCert.title}</h3>
                <p className="text-xs text-stone-500 font-medium">Awarded to {previewCert.studentName}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewCert.url}
                  download={`${previewCert.studentName}_${previewCert.title}_Certificate.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#fff5ee] text-[#942008] border border-[#f5ded0] rounded-xl text-xs font-bold hover:bg-[#fde5d6] transition-colors cursor-pointer shadow-2xs"
                >
                  <Download size={14} /> Download / Open
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewCert(null)}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 flex items-center justify-center shadow-inner">
              <img
                src={previewCert.url}
                alt={previewCert.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
