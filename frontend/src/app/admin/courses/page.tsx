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
  Trophy,
  Image as ImageIcon,
  Tag,
  Percent,
  Clock,
  Calendar,
  Maximize2,
  Info,
  Download,
} from "lucide-react";
import { API_BASE_URL, getImageUrl, getFileUrl } from "@/config/api";

export const PRESET_COURSE_BANNERS = [
  { name: "Ocean Waves", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80" },
  { name: "Geode Crystal", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" },
  { name: "Gold Marble", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" },
  { name: "Floral Keepsake", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80" },
  { name: "Resin Wood Table", url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80" },
  { name: "Resin Jewellery", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80" },
];

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

export const DEFAULT_30_COURSES = [
  // L0 - Fast Track (Offer Price: ₹499)
  { levelCode: 'L0', order: 1, title: '1. Resin Fundamentals', description: 'Introduction to epoxy resin, safety protocols, PPE, curing times, and essential toolkit setup.' },
  { levelCode: 'L0', order: 2, title: '2. The Right Approach to Resin Art', description: 'Core pouring principles, avoiding bubbles, humidity control, and foundational finishing techniques.' },
  { levelCode: 'L0', order: 3, title: '3. Student Success Stories & Their Roadmap Ahead', description: 'Real case studies of successful artist journeys, career paths, and milestone roadmaps.' },

  // L1 - Silver Member (Offer Price: ₹4,999)
  { levelCode: 'L1', order: 1, title: '1. Coasters, Fridge Magnets, Keychains', description: 'Small format cast pouring, glitter suspension, silicone molding, and hardware attachment.' },
  { levelCode: 'L1', order: 2, title: '2. Marbling Technique', description: 'Creating organic marble veins, alcohol ink blending, and contrasting color swirl patterns.' },
  { levelCode: 'L1', order: 3, title: '3. Evil Eye / Iris', description: 'Concentric color ring manipulation, pigment saturation, and high-gloss protective topcoats.' },
  { levelCode: 'L1', order: 4, title: '4. Lotus Pond', description: 'Multi-layer 3D depth effects, floating flora embedment, and crystalline water simulation.' },
  { levelCode: 'L1', order: 5, title: '5. Beach Theme', description: 'Cell lacing, heat gun wave manipulation, realistic sand texture, and ocean gradients.' },

  // L2 - Gold Member (Offer Price: ₹19,999)
  { levelCode: 'L2', order: 1, title: '1. Geode Art', description: 'Crystal cluster integration, metallic gilding line work, and multi-tone geode structures.' },
  { levelCode: 'L2', order: 2, title: '2. Vein Effect', description: 'Fine-line pigment dispersal, natural stone simulation, and high-gloss depth layering.' },
  { levelCode: 'L2', order: 3, title: '3. Tree of Life Clock', description: 'Wood base preparation, clock mechanism installation, wire tree embedment, and gold leaf accents.' },
  { levelCode: 'L2', order: 4, title: '4. Beach Theme in Depth with 3D Ripples and Waves', description: 'Advanced multi-layer resin sea spray, 3D shoreline ripples, and realistic foam dynamics.' },

  // L3 - Diamond Club (Offer Price: ₹59,999)
  { levelCode: 'L3', order: 1, title: '1. 3D Photo Resin Art', description: 'Preserving heirloom photographs, sealing against ink bleeding, and crystal dome encapsulation.' },
  { levelCode: 'L3', order: 2, title: '2. Wood and Resin Tables', description: 'Live edge slab woodworking, leak-proof barrier molds, deep pour resin casting, and flat surfacing.' },
  { levelCode: 'L3', order: 3, title: '3. Resin Jewellery', description: 'UV resin curing, bezel fabrication, micro-botanical preservation, and commercial jewelry finishing.' },
  { levelCode: 'L3', order: 4, title: '4. Chiffon Technique', description: 'Flowing fabric-like resin drapery, ultra-thin color layering, and delicate translucent folds.' },
  { levelCode: 'L3', order: 5, title: '5. Pebble Effect', description: 'Natural stone mosaic embedding, underwater optical illusion, and high-impact textural pours.' },
  { levelCode: 'L3', order: 6, title: '6. Varmala Preservation', description: 'Preserving wedding garlands, silica gel flower drying, anti-yellowing resin chemistry, and custom block casting.' },
  { levelCode: 'L3', order: 7, title: '7. Labradorite', description: 'Iridescent optical flash simulation, mineral pigment layering, and dark crystal matrix effects.' },
  { levelCode: 'L3', order: 8, title: '8. Galaxy Theme', description: 'Deep cosmic nebula swirls, holographic micro-glitters, and starry dimensional layers.' },
  { levelCode: 'L3', order: 9, title: '9. Concrete and Resin Candles', description: 'Two-part composite casting, thermal-safe concrete bases, and translucent resin tea-light vessels.' },
  { levelCode: 'L3', order: 10, title: '10. Texture Art', description: 'Heavy body modeling paste, palette knife sculpting, and mixed-media resin gloss glazing.' },
  { levelCode: 'L3', order: 11, title: '11. Geode (Normal and Druzy Geode)', description: 'Raw quartz embedding, crushed glass refraction, metallic mica borders, and luxury framing.' },
  { levelCode: 'L3', order: 12, title: '12. Tree of Life Clock (Advanced)', description: 'Large format luxury wall timepieces with custom numerals, heavy resin flood coats, and silent sweep motors.' },
  { levelCode: 'L3', order: 13, title: '13. Aarti Thali', description: 'Festive devotional plates, heat-resistant epoxy coats, mirror work, and traditional motifs.' },
  { levelCode: 'L3', order: 14, title: '14. Ripples and Droplet Effect', description: 'Hyper-realistic surface water droplets, 3D rain splash physics, and crystal drop placement.' },
  { levelCode: 'L3', order: 15, title: '15. Reels Mastery', description: 'Viral Instagram Reels filming techniques, transitions, audio selection, and visual storytelling for resin artists.' },
  { levelCode: 'L3', order: 16, title: '16. Photography Mastery', description: 'Studio lighting, eliminating resin glare, product staging, and professional editing on mobile.' },
  { levelCode: 'L3', order: 17, title: '17. YouTube Set Up', description: 'Channel branding, long-form tutorial production, mic/camera setups, and organic subscriber growth.' },
  { levelCode: 'L3', order: 18, title: '18. Journaling', description: 'Creative entrepreneur mindset, tracking commissions, daily creative reflection, and goal alignment.' }
];

export default function AdminCourses() {
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Course Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [previewFlyerModal, setPreviewFlyerModal] = useState<string | null>(null);
  const [imageRatioInfo, setImageRatioInfo] = useState<{ width: number; height: number; ratioText: string } | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    image: "",
    levelCode: "L0",
    price: "",
    order: 1,
    offerActive: false,
    discountType: "percentage" as "percentage" | "flat",
    discountValue: 0,
    offerStartDate: "",
    offerEndDate: "",
    validityStartDate: "",
    validityEndDate: "",
    validityMonths: 1 as number | null,
  });

  // Calculate image dimensions and ratio in real time whenever courseForm.image changes
  useEffect(() => {
    if (!courseForm.image) {
      setImageRatioInfo(null);
      return;
    }
    const img = new Image();
    img.src = courseForm.image;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      let ratioText = "Custom Ratio";
      const aspect = w / h;
      if (Math.abs(aspect - 16 / 9) < 0.2) ratioText = "16:9 Landscape Banner";
      else if (Math.abs(aspect - 9 / 16) < 0.2) ratioText = "9:16 Portrait Flyer / Story";
      else if (Math.abs(aspect - 4 / 5) < 0.2) ratioText = "4:5 Portrait Poster";
      else if (Math.abs(aspect - 1) < 0.2) ratioText = "1:1 Square";
      else if (aspect > 1) ratioText = "Landscape Format";
      else ratioText = "Portrait Poster";

      setImageRatioInfo({ width: w, height: h, ratioText });
    };
    img.onerror = () => {
      setImageRatioInfo(null);
    };
  }, [courseForm.image]);

  // Chapter Modals
  const [showChapterModal, setShowChapterModal] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    videoType: "url" as "url" | "upload",
    videoUrl: "",
    pdfType: "url" as "url" | "upload",
    pdfUrl: "",
  });
  const [uploadingPdf, setUploadingPdf] = useState(false);

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

  const handleDirectCourseBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCourseForm((prev) => ({
        ...prev,
        image: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenImageFullSize = (imageUrl: string | null) => {
    if (!imageUrl) return;

    if (imageUrl.startsWith("data:")) {
      try {
        const parts = imageUrl.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        return;
      } catch (err) {
        console.error("Failed to open data URL as blob:", err);
      }
    }

    const fullUrl = getImageUrl(imageUrl);
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadFlyer = (imageUrl: string | null) => {
    if (!imageUrl) return;
    try {
      const a = document.createElement("a");
      if (imageUrl.startsWith("data:")) {
        const parts = imageUrl.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = "course-flyer.png";
      } else {
        a.href = getImageUrl(imageUrl);
        a.download = "course-flyer.png";
        a.target = "_blank";
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error downloading flyer:", e);
    }
  };

  const [levels, setLevels] = useState<any[]>([]);

  const fetchLevels = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/admin/levels`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLevels(data);
        }
      })
      .catch((err) => console.error("Error fetching level tiers", err));
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
    if (token) {
      fetchCourses();
      fetchLevels();
    }
  }, [token]);

  const getLevelConfig = (code: string) => {
    if (!code || code.toUpperCase() === "NONE") {
      return {
        name: "Individual Course",
        price: "Custom Price",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
      };
    }
    const match = levels.find((l: any) => (l.code || "").toUpperCase() === (code || "").toUpperCase());
    const fallback = LEVEL_TIER_CONFIG[code] || LEVEL_TIER_CONFIG.L0;
    if (match) {
      return {
        name: match.name || fallback.name,
        price: match.price || fallback.price,
        color: fallback.color,
        bg: fallback.bg,
        border: fallback.border,
      };
    }
    return fallback;
  };

  // Handle Course Create / Update
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    setIsSubmitting(true);
    try {
      const isStandalone = !courseForm.levelCode || courseForm.levelCode === "NONE";
      const payload = {
        title: courseForm.title.trim(),
        description: courseForm.description,
        image: courseForm.image,
        levelCode: isStandalone ? null : courseForm.levelCode,
        price: isStandalone ? courseForm.price.trim() : null,
        order: Number(courseForm.order) || 1,
        offerActive: Boolean(courseForm.offerActive),
        discountType: courseForm.discountType,
        discountValue: Number(courseForm.discountValue) || 0,
        offerStartDate: courseForm.offerStartDate || null,
        offerEndDate: courseForm.offerEndDate || null,
        validityStartDate: isStandalone && courseForm.validityStartDate ? courseForm.validityStartDate : null,
        validityEndDate: isStandalone && courseForm.validityEndDate ? courseForm.validityEndDate : null,
        validityMonths: isStandalone ? (courseForm.validityMonths ? Number(courseForm.validityMonths) : null) : null,
      };

      let res;
      if (editingCourse) {
        res = await fetch(`${API_BASE_URL}/courses/${editingCourse.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/courses`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowCourseModal(false);
        setEditingCourse(null);
        setCourseForm({
          title: "",
          description: "",
          image: "",
          levelCode: "L0",
          price: "",
          order: 1,
          offerActive: false,
          discountType: "percentage",
          discountValue: 0,
          offerStartDate: "",
          offerEndDate: "",
          validityStartDate: "",
          validityEndDate: "",
          validityMonths: 1,
        });
        showSuccess(editingCourse ? "Course updated successfully!" : "New course created!");
        fetchCourses();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to save course: ${errorData.message || res.statusText || "Server Error"}`);
      }
    } catch (err: any) {
      console.error("Course save error:", err);
      alert(`Error saving course: ${err.message || "Network issue"}`);
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

    if (uploadingVideo) {
      alert("Please wait for your video file to finish uploading before saving!");
      return;
    }

    if (uploadingPdf) {
      alert("Please wait for your PDF file to finish uploading before saving!");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalVideoUrl = chapterForm.videoUrl.trim();
      let finalPdfUrl = chapterForm.pdfUrl.trim();

      // Auto-fix if user pasted video link inside the PDF field by mistake
      if (!finalVideoUrl && finalPdfUrl) {
        const lower = finalPdfUrl.toLowerCase();
        if (
          lower.includes("youtube.com") ||
          lower.includes("youtu.be") ||
          lower.includes("vimeo.com") ||
          lower.includes("drive.google.com") ||
          lower.includes("/uploads/videos/") ||
          lower.endsWith(".mp4") ||
          lower.endsWith(".webm") ||
          lower.endsWith(".mov") ||
          lower.startsWith("data:video")
        ) {
          finalVideoUrl = finalPdfUrl;
          finalPdfUrl = "";
        }
      }

      // Clean up pdfUrl if user typed plain text (like "anil") instead of a URL or PDF link
      if (
        finalPdfUrl &&
        !finalPdfUrl.includes("http") &&
        !finalPdfUrl.includes("drive") &&
        !finalPdfUrl.includes("/") &&
        !finalPdfUrl.toLowerCase().endsWith(".pdf")
      ) {
        finalPdfUrl = "";
      }

      let res;
      if (editingChapter) {
        res = await fetch(`${API_BASE_URL}/courses/chapters/${editingChapter.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            title: chapterForm.title,
            videoUrl: finalVideoUrl,
            pdfUrl: finalPdfUrl,
          }),
        });
      } else if (showChapterModal) {
        res = await fetch(`${API_BASE_URL}/courses/${showChapterModal}/chapters`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: chapterForm.title,
            videoUrl: finalVideoUrl,
            pdfUrl: finalPdfUrl,
          }),
        });
      }

      if (res?.ok) {
        setShowChapterModal(null);
        setEditingChapter(null);
        setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
        showSuccess(editingChapter ? "Chapter updated successfully!" : "Chapter added to course!");
        fetchCourses();
      } else {
        const errData = await res?.json().catch(() => ({}));
        alert(errData?.message || `Failed to save chapter (Status ${res?.status || "Unknown"})`);
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

  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleDirectVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const uploadHeaders: Record<string, string> = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      const res = await fetch(`${API_BASE_URL}/upload/video`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setChapterForm((prev) => ({
          ...prev,
          videoUrl: data.url,
        }));
        showSuccess("Video file uploaded successfully!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setChapterForm((prev) => ({
            ...prev,
            videoUrl: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        setChapterForm((prev) => ({
          ...prev,
          videoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDirectPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file (.pdf)");
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const uploadHeaders: Record<string, string> = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      const res = await fetch(`${API_BASE_URL}/upload/pdf`, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setChapterForm((prev) => ({
          ...prev,
          pdfUrl: data.url,
        }));
        showSuccess("PDF document uploaded successfully!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setChapterForm((prev) => ({
            ...prev,
            pdfUrl: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        setChapterForm((prev) => ({
          ...prev,
          pdfUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSyncCurriculum = async () => {
    setIsSubmitting(true);
    try {
      // 1. Try dedicated seed endpoint
      let seeded = false;
      try {
        const res = await fetch(`${API_BASE_URL}/courses/seed`, {
          method: "POST",
          headers,
        });
        if (res.ok) {
          seeded = true;
        }
      } catch (_) {}

      // 2. Fallback: Create courses via standard POST /courses
      if (!seeded) {
        const existingTitles = new Set(courses.map((c) => c.title.trim().toLowerCase()));
        
        for (const item of DEFAULT_30_COURSES) {
          if (!existingTitles.has(item.title.trim().toLowerCase())) {
            const courseRes = await fetch(`${API_BASE_URL}/courses`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                title: item.title,
                description: item.description,
                levelCode: item.levelCode,
                order: item.order,
              }),
            });

            if (courseRes.ok) {
              const createdCourse = await courseRes.json();
              const courseId = createdCourse.course?.id || createdCourse.id;
              if (courseId) {
                // Add default chapter
                await fetch(`${API_BASE_URL}/courses/${courseId}/chapters`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    title: `Lesson 1: ${item.title.replace(/^\d+\.\s*/, "")} Demonstration`,
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  }),
                });
              }
            }
          }
        }
      }

      showSuccess("All 30 level-wise courses synced to database!");
      fetchCourses();
    } catch (err: any) {
      console.error("Sync error:", err);
      alert("Failed to sync courses. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedCourses = courses.filter((c) => {
    if (activeLevelFilter === "all") return true;
    if (activeLevelFilter === "NONE") {
      return !c.levelCode || c.levelCode.toUpperCase() === "NONE";
    }
    return (c.levelCode || "").toUpperCase() === activeLevelFilter.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <BookOpen size={13} className="text-orange-400" /> Sequential Level & Individual Curriculum
            </span>
            <h1 className="text-3xl font-black text-white">Course Management</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Organize sequential level-wise courses (L0-L3) or create standalone individual courses with custom pricing.
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
                  image: "",
                  levelCode: activeLevelFilter === "all" ? "L0" : activeLevelFilter,
                  price: "",
                  order: courses.filter((c) => (c.levelCode || "L0") === (activeLevelFilter === "all" ? "L0" : activeLevelFilter)).length + 1 || 1,
                  offerActive: false,
                  discountType: "percentage",
                  discountValue: 0,
                  offerStartDate: "",
                  offerEndDate: "",
                  validityStartDate: "",
                  validityEndDate: "",
                  validityMonths: 1,
                });
                setShowCourseModal(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer shrink-0"
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
            All Courses ({courses.length})
          </button>

          {/* Standalone / Individual Courses Filter Tab */}
          <button
            onClick={() => setActiveLevelFilter("NONE")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeLevelFilter === "NONE"
                ? "bg-purple-600 text-white font-black shadow-lg shadow-purple-500/20"
                : "bg-slate-900 border border-slate-800 text-purple-300 hover:text-white"
            }`}
          >
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${activeLevelFilter === "NONE" ? "bg-slate-950 text-purple-300" : "bg-purple-500/20 text-purple-400"}`}>
              NONE
            </span>
            <span>Individual / Standalone</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800/80 text-[10px] text-slate-400">
              {courses.filter((c) => !c.levelCode || c.levelCode.toUpperCase() === "NONE").length}
            </span>
          </button>

          {(levels.length > 0
            ? levels.map((l) => ({ code: l.code, name: l.name, price: l.price || "₹499" }))
            : [
                { code: "L0", name: "Fast Track", price: "₹499" },
                { code: "L1", name: "Silver Member", price: "₹4,999" },
                { code: "L2", name: "Gold Member", price: "₹19,999" },
                { code: "L3", name: "Diamond Club", price: "₹59,999" },
                { code: "L3+", name: "Masters Club", price: "Custom" },
              ]
          ).map((lvlObj) => {
            const lvl = lvlObj.code;
            const cfg = getLevelConfig(lvl);
            const count = courses.filter((c) => (c.levelCode || "").toUpperCase() === lvl.toUpperCase()).length;
            const isActive = activeLevelFilter.toUpperCase() === lvl.toUpperCase();

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
            <h3 className="text-lg font-bold text-white mb-1">No Courses Found</h3>
            <p className="text-slate-400 text-sm mb-4">
              {activeLevelFilter === "NONE"
                ? "No standalone individual courses yet. Click below to create one with a custom price."
                : `Click "Create New Course" to add a course to ${activeLevelFilter}.`}
            </p>
            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({
                  title: "",
                  description: "",
                  image: "",
                  levelCode: activeLevelFilter === "all" ? "L0" : activeLevelFilter,
                  price: "",
                  order: 1,
                  offerActive: false,
                  discountType: "percentage",
                  discountValue: 0,
                  offerStartDate: "",
                  offerEndDate: "",
                  validityStartDate: "",
                  validityEndDate: "",
                  validityMonths: 1,
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
              const isStandalone = !course.levelCode || course.levelCode.toUpperCase() === "NONE";
              const lvl = isStandalone ? "NONE" : (course.levelCode || "L0").toUpperCase();
              const cfg = getLevelConfig(lvl);
              const displayPrice = isStandalone
                ? (course.price ? (course.price.startsWith("₹") ? course.price : `₹${course.price}`) : "Price not set")
                : cfg.price;

              return (
                <div
                  key={course.id}
                  className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                    isSelected ? "border-orange-500 ring-2 ring-orange-500/30" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    {/* Course Banner Thumbnail */}
                    <div 
                      onClick={() => course.image && setPreviewFlyerModal(course.image)}
                      className={`relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-4 border border-slate-800/80 bg-slate-950 group flex items-center justify-center ${course.image ? "cursor-pointer" : ""}`}
                      title={course.image ? "Click to view full original flyer" : undefined}
                    >
                      {course.image ? (
                        <>
                          {/* Full Banner Display: Edge-to-Edge */}
                          <img
                            src={getImageUrl(course.image)}
                            alt={course.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-slate-950/40 pointer-events-none z-10" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 flex items-center justify-center">
                          <BookOpen size={36} className="text-slate-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />
                        </div>
                      )}
                      
                      {/* Top Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-20">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border shadow-md backdrop-blur-md ${isStandalone ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : `${cfg.bg} ${cfg.color} ${cfg.border}`}`}>
                          {isStandalone ? "✨ Individual Course" : `${lvl} • ${cfg.name}`}
                        </span>

                        {course.offerActive && (
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-md border border-red-400/40 flex items-center gap-1">
                            <Tag size={10} />
                            {course.discountType === "percentage" ? `${course.discountValue}% OFF` : `₹${course.discountValue} OFF`}
                          </span>
                        )}
                      </div>

                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-xl border border-slate-800 z-20"
                      >
                        {course.image && (
                          <button
                            type="button"
                            onClick={() => setPreviewFlyerModal(course.image)}
                            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="View Full Flyer / Poster"
                          >
                            <Maximize2 size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              title: course.title,
                              description: course.description || "",
                              image: course.image || "",
                              levelCode: course.levelCode || "NONE",
                              price: course.price ? course.price.replace(/[^0-9]/g, "") : "",
                              order: course.order || 0,
                              offerActive: Boolean(course.offerActive),
                              discountType: course.discountType || "percentage",
                              discountValue: course.discountValue || 0,
                              offerStartDate: course.offerStartDate ? new Date(course.offerStartDate).toISOString().slice(0, 16) : "",
                              offerEndDate: course.offerEndDate ? new Date(course.offerEndDate).toISOString().slice(0, 16) : "",
                              validityStartDate: course.validityStartDate ? new Date(course.validityStartDate).toISOString().slice(0, 16) : "",
                              validityEndDate: course.validityEndDate ? new Date(course.validityEndDate).toISOString().slice(0, 16) : "",
                              validityMonths: course.validityMonths !== undefined && course.validityMonths !== null ? Number(course.validityMonths) : 1,
                            });
                            setShowCourseModal(true);
                          }}
                          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                        <span className={`text-[11px] font-mono font-bold ${isStandalone ? "text-purple-300" : "text-amber-400"}`}>
                          {displayPrice}
                        </span>
                        <span className="text-[10px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 font-semibold">
                          #{course.order || 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white leading-snug truncate">{course.title}</h3>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5 font-semibold">
                          <Layers size={11} className="text-orange-400" /> {course.chapters?.length || 0} Lessons
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {course.description || "Master step-by-step resin art techniques, tools, and business strategies."}
                    </p>

                    {isStandalone && (
                      <div className="mb-3 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 border backdrop-blur-sm bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                        <Clock size={12} className="shrink-0 text-indigo-400" />
                        <span>
                          {course.validityMonths && Number(course.validityMonths) > 0
                            ? `Validity: ${course.validityMonths} Month${Number(course.validityMonths) > 1 ? 's' : ''} (from student purchase date)`
                            : 'Validity: Lifetime Access'}
                        </span>
                      </div>
                    )}
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
                        setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
                        setShowChapterModal(course.id);
                      }}
                      className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl text-xs font-bold transition-colors border border-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> + Add Chapter / Video Lesson
                    </button>
                  </div>

                  {/* Inline Expanded Chapters Accordion */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-orange-500/30 space-y-3 bg-slate-950/90 p-4 rounded-2xl animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-black text-orange-400 flex items-center gap-1.5">
                          <Layers size={13} /> Chapters in this Course ({course.chapters?.length || 0})
                        </span>
                        <button
                          onClick={() => {
                            setEditingChapter(null);
                            setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
                            setShowChapterModal(course.id);
                          }}
                          className="text-[10px] font-bold bg-orange-500 text-slate-950 px-2 py-0.5 rounded-md hover:bg-orange-600 cursor-pointer"
                        >
                          + Add Lesson
                        </button>
                      </div>

                      {(course.chapters || []).length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                          <p className="text-slate-500 text-xs mb-2">No video lessons added yet.</p>
                          <button
                            onClick={() => {
                              setEditingChapter(null);
                              setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
                              setShowChapterModal(course.id);
                            }}
                            className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                          >
                            + Add First Lesson Video
                          </button>
                        </div>
                      ) : (
                        course.chapters.map((chapter: any, chIndex: number) => (
                          <div
                            key={chapter.id}
                            className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {chIndex + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-white text-xs truncate">{chapter.title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  {chapter.videoUrl ? (
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                      <FileVideo size={10} /> Video Attached
                                    </span>
                                  ) : (
                                    <span className="text-slate-600">No Video</span>
                                  )}
                                  {chapter.pdfUrl && (
                                    <a
                                      href={getFileUrl(chapter.pdfUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                                      title="Open PDF Document"
                                    >
                                      <FileText size={10} /> PDF
                                      <ExternalLink size={8} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {chapter.videoUrl && (
                                <button
                                  onClick={() => setPreviewVideoUrl(chapter.videoUrl)}
                                  className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 cursor-pointer"
                                  title="Preview Video"
                                >
                                  <Play size={12} className="fill-orange-400" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingChapter(chapter);
                                  const isVideoLink = (url: string) =>
                                    url &&
                                    (url.includes("youtube.com") ||
                                      url.includes("youtu.be") ||
                                      url.includes("vimeo.com") ||
                                      url.includes("drive.google.com") ||
                                      url.includes("/uploads/videos/") ||
                                      url.endsWith(".mp4") ||
                                      url.endsWith(".webm") ||
                                      url.endsWith(".mov") ||
                                      url.startsWith("data:video"));

                                  let vUrl = chapter.videoUrl || "";
                                  let pUrl = chapter.pdfUrl || "";

                                  if (!vUrl && isVideoLink(pUrl)) {
                                    vUrl = pUrl;
                                    pUrl = "";
                                  }

                                  const isPdfUploaded = (url: string) =>
                                    url && (url.includes("/uploads/documents/") || url.startsWith("data:application/pdf"));

                                  setChapterForm({
                                    title: chapter.title,
                                    videoType: vUrl.startsWith("http") || vUrl.includes("youtube") || vUrl.includes("drive") ? "url" : "upload",
                                    videoUrl: vUrl,
                                    pdfType: isPdfUploaded(pUrl) ? "upload" : "url",
                                    pdfUrl: pUrl,
                                  });
                                  setShowChapterModal(course.id);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                                title="Edit Lesson"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteChapter(chapter.id)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700 cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
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
                      Tier: {!selectedCourse.levelCode || selectedCourse.levelCode === "NONE" ? "Individual Course" : selectedCourse.levelCode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({!selectedCourse.levelCode || selectedCourse.levelCode === "NONE"
                        ? (selectedCourse.price ? (selectedCourse.price.startsWith("₹") ? selectedCourse.price : `₹${selectedCourse.price}`) : "Custom Price")
                        : (LEVEL_TIER_CONFIG[selectedCourse.levelCode]?.price || "₹499")})
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
                    setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
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
                      setChapterForm({ title: "", videoType: "url", videoUrl: "", pdfType: "url", pdfUrl: "" });
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
                          href={getFileUrl(chapter.pdfUrl)}
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
                          const isVideoLink = (url: string) =>
                            url &&
                            (url.includes("youtube.com") ||
                              url.includes("youtu.be") ||
                              url.includes("vimeo.com") ||
                              url.includes("drive.google.com") ||
                              url.includes("/uploads/videos/") ||
                              url.endsWith(".mp4") ||
                              url.endsWith(".webm") ||
                              url.endsWith(".mov") ||
                              url.startsWith("data:video"));

                          let vUrl = chapter.videoUrl || "";
                          let pUrl = chapter.pdfUrl || "";

                          if (!vUrl && isVideoLink(pUrl)) {
                            vUrl = pUrl;
                            pUrl = "";
                          }

                          const isPdfUploaded = (url: string) =>
                            url && (url.includes("/uploads/documents/") || url.startsWith("data:application/pdf"));

                          setChapterForm({
                            title: chapter.title,
                            videoType: vUrl.startsWith("http") || vUrl.includes("youtube") || vUrl.includes("drive") ? "url" : "upload",
                            videoUrl: vUrl,
                            pdfType: isPdfUploaded(pUrl) ? "upload" : "url",
                            pdfUrl: pUrl,
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
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {editingCourse ? "Edit Course" : "Create New Course"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingCourse
                      ? "Update course configuration, pricing, validity, and assets"
                      : "Configure new curriculum module, pricing, and content"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCourse} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {/* Top Row: Course Title (6 cols), Level Tier (4 cols), Order (2 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-semibold transition-colors"
                    placeholder="e.g. 1. Resin Fundamentals & Safety"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Level Tier</label>
                  <select
                    value={courseForm.levelCode}
                    onChange={(e) => setCourseForm({ ...courseForm, levelCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-medium transition-colors"
                  >
                    <option value="NONE">✨ None (Individual / Standalone Course)</option>
                    {(levels.length > 0
                      ? levels
                      : [
                          { code: "L0", name: "Fast Track", price: "₹499" },
                          { code: "L1", name: "Silver Member", price: "₹4,999" },
                          { code: "L2", name: "Gold Member", price: "₹19,999" },
                          { code: "L3", name: "Diamond Club", price: "₹59,999" },
                          { code: "L3+", name: "Masters Club", price: "Custom" },
                        ]
                    ).map((lvlObj) => (
                      <option key={lvlObj.code} value={lvlObj.code}>
                        {lvlObj.code} - {lvlObj.name} ({lvlObj.price || '₹499'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Order #</label>
                  <input
                    type="number"
                    value={courseForm.order}
                    onChange={(e) => setCourseForm({ ...courseForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              {/* Conditional Standalone Course Section: Price & Validity side-by-side */}
              {(!courseForm.levelCode || courseForm.levelCode === "NONE") && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/20 via-indigo-950/20 to-slate-950/40 border border-indigo-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                    <span className="text-xs font-black text-indigo-300 flex items-center gap-2">
                      <Tag size={14} className="text-indigo-400" />
                      Individual / Standalone Course Configuration
                    </span>
                    <span className="text-[11px] text-indigo-400/80 font-medium">
                      Applies exclusively to this single course
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Left: Price */}
                    <div className="md:col-span-5 space-y-2">
                      <label className="block text-xs font-bold text-purple-300">
                        Individual Course Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                        <input
                          type="text"
                          required
                          value={courseForm.price}
                          onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                          className="w-full bg-slate-950 border border-purple-500/50 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-purple-400 placeholder-slate-600 shadow-inner"
                          placeholder="e.g. 999 or 1499"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Students purchase this standalone without level membership. Any active offer configured below applies on top of this price.
                      </p>
                    </div>

                    {/* Right: Course Validity Duration Dropdown */}
                    <div className="md:col-span-7 space-y-2">
                      <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Clock size={13} className="text-indigo-400" /> Course Validity Duration (Rolling from Purchase Date)
                      </label>
                      <div className="relative">
                        <select
                          value={courseForm.validityMonths !== null && courseForm.validityMonths !== undefined ? String(courseForm.validityMonths) : "1"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCourseForm({
                              ...courseForm,
                              validityMonths: val === "lifetime" ? null : parseInt(val, 10),
                            });
                          }}
                          className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-semibold cursor-pointer shadow-inner appearance-none"
                        >
                          <option value="1">1 Month Validity (30 Days from student purchase date)</option>
                          <option value="2">2 Months Validity (60 Days from student purchase date)</option>
                          <option value="3">3 Months Validity (90 Days from student purchase date)</option>
                          <option value="4">4 Months Validity (120 Days from student purchase date)</option>
                          <option value="5">5 Months Validity (150 Days from student purchase date)</option>
                          <option value="6">6 Months Validity (180 Days from student purchase date)</option>
                          <option value="lifetime">Lifetime Access (Unlimited access, no expiry)</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 text-xs">
                          ▼
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Each student gets access for this duration starting on their exact purchase/enrollment date. When this period expires, access locks and the student can re-purchase/renew to regain access.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Banner / Thumbnail Image Section */}
              <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon size={15} className="text-orange-400" />
                    Course Banner / Thumbnail Image
                  </span>
                  {courseForm.image && (
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, image: "" })}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Input and Presets */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={courseForm.image}
                          onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 pr-8"
                          placeholder="https://images.unsplash.com/... or paste image URL"
                        />
                        <LinkIcon size={14} className="absolute right-3 top-3 text-slate-600" />
                      </div>

                      <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 shrink-0 transition-colors">
                        <Upload size={13} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDirectCourseBannerUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Or Pick a Preset Resin Art Theme:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COURSE_BANNERS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setCourseForm({ ...courseForm, image: preset.url })}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                              courseForm.image === preset.url
                                ? "bg-orange-500/20 text-orange-400 border-orange-500/50 font-bold shadow-sm"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Preview */}
                  <div className="md:col-span-5">
                    {courseForm.image ? (
                      <div className="space-y-2">
                        <div 
                          onClick={() => setPreviewFlyerModal(courseForm.image)}
                          className="relative w-full h-56 rounded-2xl overflow-hidden border border-orange-500/40 bg-slate-950 shadow-lg group flex items-center justify-center cursor-pointer"
                          title="Click to view full original flyer"
                        >
                          {/* Full Banner Live Preview */}
                          <img
                            src={getImageUrl(courseForm.image)}
                            alt="Course Banner Preview"
                            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none z-10" />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center pointer-events-none">
                            <span className="bg-slate-900/90 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                              <Maximize2 size={13} /> View Full Flyer
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2 z-20">
                            <span className="text-[10px] font-bold text-emerald-400 bg-slate-950/90 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
                              <CheckCircle2 size={10} /> Full Banner Active
                            </span>
                          </div>
                        </div>

                        {/* Image Dimension / Aspect Ratio Indicator */}
                        {imageRatioInfo && (
                          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800">
                            <span className="font-semibold text-slate-300">{imageRatioInfo.ratioText}</span>
                            <span className="font-mono text-[10px] text-slate-500">{imageRatioInfo.width} × {imageRatioInfo.height} px</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-56 rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                        <ImageIcon size={28} className="mb-2 text-slate-700" />
                        <span className="text-xs font-semibold text-slate-400">No flyer / banner selected</span>
                        <span className="text-[10px] text-slate-600 mt-1 max-w-[200px]">
                          Upload a brochure, flyer, or square poster. The original image will be preserved completely without cropping.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Offer & Discount Configuration */}
              <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Percent size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Course Offer &amp; Discount</h4>
                      <p className="text-[10px] text-slate-400">Configure percentage or flat price reduction with active dates</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseForm.offerActive}
                      onChange={(e) => setCourseForm({ ...courseForm, offerActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-orange-500"></div>
                  </label>
                </div>

                {courseForm.offerActive && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Discount Type */}
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-400">Discount Type</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => setCourseForm({ ...courseForm, discountType: "percentage" })}
                            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              courseForm.discountType === "percentage"
                                ? "bg-red-500 text-white shadow-sm font-black"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <Percent size={12} /> Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseForm({ ...courseForm, discountType: "flat" })}
                            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              courseForm.discountType === "flat"
                                ? "bg-red-500 text-white shadow-sm font-black"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <Tag size={12} /> Flat (₹)
                          </button>
                        </div>
                      </div>

                      {/* Discount Value */}
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-400">
                          {courseForm.discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount Amount (₹)"}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={courseForm.discountType === "percentage" ? "100" : undefined}
                          value={courseForm.discountValue || ""}
                          onChange={(e) => setCourseForm({ ...courseForm, discountValue: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                          placeholder={courseForm.discountType === "percentage" ? "e.g. 25 for 25% OFF" : "e.g. 500 for ₹500 OFF"}
                        />
                      </div>
                    </div>

                    {/* Offer Start & End Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                          <Calendar size={11} className="text-orange-400" /> Offer Start Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={courseForm.offerStartDate}
                          onChange={(e) => setCourseForm({ ...courseForm, offerStartDate: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                          <Clock size={11} className="text-red-400" /> Offer End Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={courseForm.offerEndDate}
                          onChange={(e) => setCourseForm({ ...courseForm, offerEndDate: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                  placeholder="Describe what students will master in this module..."
                />
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-800/80 -mx-6 sm:-mx-8 -mb-6 px-6 sm:px-8 py-4 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs h-10 px-5 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter Modal (Create / Edit) */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl text-white">
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
                    {uploadingVideo ? (
                      <p className="text-[11px] text-orange-400 mt-1 font-bold animate-pulse flex items-center gap-1">
                        ⏳ Uploading video file to server... Please wait
                      </p>
                    ) : chapterForm.videoUrl && (
                      <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                        ✓ Video file uploaded &amp; ready for students!
                      </p>
                    )}
                  </div>
                )}
                {chapterForm.videoUrl && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 size={14} className="shrink-0" /> Video Attached: {chapterForm.videoUrl.length > 40 ? chapterForm.videoUrl.slice(0, 40) + "..." : chapterForm.videoUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewVideoUrl(chapterForm.videoUrl)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 text-[10px] uppercase font-black cursor-pointer shrink-0 ml-2"
                    >
                      Preview
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  PDF / Notes Resource (Optional)
                </label>
                <div className="flex items-center gap-2 mb-3 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChapterForm({ ...chapterForm, pdfType: "url" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      chapterForm.pdfType === "url"
                        ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LinkIcon size={13} /> Drive / Cloud URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterForm({ ...chapterForm, pdfType: "upload" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      chapterForm.pdfType === "upload"
                        ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Upload size={13} /> Direct PDF Upload
                  </button>
                </div>

                {chapterForm.pdfType === "url" ? (
                  <div>
                    <input
                      type="text"
                      value={chapterForm.pdfUrl}
                      onChange={(e) => setChapterForm({ ...chapterForm, pdfUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      placeholder="https://drive.google.com/... (PDF Link)"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Paste Google Drive, Dropbox, or public Cloud PDF link.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleDirectPdfUpload}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-slate-950 hover:file:bg-orange-600 cursor-pointer"
                    />
                    {uploadingPdf ? (
                      <p className="text-[11px] text-orange-400 mt-1 font-bold animate-pulse flex items-center gap-1">
                        ⏳ Uploading PDF document... Please wait
                      </p>
                    ) : chapterForm.pdfUrl && (
                      <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                        ✓ PDF document attached &amp; ready for students!
                      </p>
                    )}
                  </div>
                )}
                {chapterForm.pdfUrl && (
                  <div className="mt-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs text-blue-400 font-bold">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText size={14} className="shrink-0" /> PDF Attached: {chapterForm.pdfUrl.length > 40 ? chapterForm.pdfUrl.slice(0, 40) + "..." : chapterForm.pdfUrl}
                    </span>
                    <a
                      href={getFileUrl(chapterForm.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 text-[10px] uppercase font-black cursor-pointer shrink-0 ml-2 flex items-center gap-1"
                    >
                      Preview <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingVideo || uploadingPdf}
                  className={`flex-1 py-3 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer ${
                    uploadingVideo || uploadingPdf || isSubmitting
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950"
                  }`}
                >
                  {uploadingVideo
                    ? "⏳ Video Uploading... Please Wait"
                    : uploadingPdf
                    ? "⏳ PDF Uploading... Please Wait"
                    : isSubmitting
                    ? "Saving..."
                    : editingChapter
                    ? "Update Lesson"
                    : "Save Lesson"}
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
      {previewVideoUrl && (() => {
        const normalizedUrl = previewVideoUrl.replace(/\\/g, "/");
        const lower = normalizedUrl.toLowerCase();
        const isDirectVideo =
          lower.startsWith("data:video") ||
          lower.endsWith(".mp4") ||
          lower.endsWith(".webm") ||
          lower.endsWith(".mov") ||
          lower.includes("uploads/");

        return (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 max-h-[90vh] overflow-y-auto my-auto shadow-2xl text-white relative">
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

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
                {isDirectVideo ? (
                  <video
                    src={
                      normalizedUrl.startsWith("http") || normalizedUrl.startsWith("data:")
                        ? normalizedUrl
                        : typeof window !== "undefined" && window.location.hostname === "localhost"
                        ? `http://localhost:5000${normalizedUrl.startsWith("/") ? normalizedUrl : "/" + normalizedUrl}`
                        : `https://api.ravishingarthub.com${normalizedUrl.startsWith("/") ? normalizedUrl : "/" + normalizedUrl}`
                    }
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={formatEmbedUrl(normalizedUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Full Original Course Flyer / Poster Lightbox Modal */}
      {previewFlyerModal && (
        <div 
          onClick={() => setPreviewFlyerModal(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 sm:p-8 overflow-y-auto cursor-zoom-out animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center cursor-default bg-slate-900/90 border border-slate-700/80 rounded-3xl p-3 shadow-2xl"
          >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenImageFullSize(previewFlyerModal)}
                className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Open full size in new tab"
              >
                <ExternalLink size={12} /> Open Full Size
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFlyer(previewFlyerModal)}
                className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Download poster image"
              >
                <Download size={12} /> Download
              </button>
              <button
                type="button"
                onClick={() => setPreviewFlyerModal(null)}
                className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-auto max-h-[85vh] rounded-2xl flex items-center justify-center p-1">
              <img
                src={getImageUrl(previewFlyerModal)}
                alt="Full Course Flyer Poster"
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
