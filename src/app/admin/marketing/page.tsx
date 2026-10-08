"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNav } from "@/components/layout/AdminNav";
import {
  Megaphone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Save,
  Power,
  RefreshCw,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface MetaEventsState {
  pageView: boolean;
  viewContent: boolean;
  lead: boolean;
  registration: boolean;
  contact: boolean;
  booking: boolean;
  checkout: boolean;
  purchase: boolean;
}

interface TrackingSetting {
  id?: string;
  platform: string;
  pixelId: string;
  enabled: boolean;
  trackPageView: boolean;
  trackViewContent: boolean;
  trackLead: boolean;
  trackRegistration: boolean;
  trackContact: boolean;
  trackBooking: boolean;
  trackCheckout: boolean;
  trackPurchase: boolean;
  customData?: any;
}

const EVENT_DEFINITIONS = [
  {
    key: "pageView" as keyof MetaEventsState,
    dbKey: "trackPageView",
    label: "Page View (PageView)",
    description: "Tracks visits across all pages automatically when visitors navigate the site.",
    badge: "Core",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "viewContent" as keyof MetaEventsState,
    dbKey: "trackViewContent",
    label: "View Content (ViewContent)",
    description: "Fires when users explore courses, workshops, and membership tier details.",
    badge: "Browsing",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    key: "lead" as keyof MetaEventsState,
    dbKey: "trackLead",
    label: "Lead (Lead)",
    description: "Fires when visitors register for free webinars or submit enquiry forms.",
    badge: "Marketing",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "registration" as keyof MetaEventsState,
    dbKey: "trackRegistration",
    label: "Complete Registration (CompleteRegistration)",
    description: "Fires when a new student signs up and successfully registers an account.",
    badge: "Acquisition",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    key: "booking" as keyof MetaEventsState,
    dbKey: "trackBooking",
    label: "Schedule / Booking (Schedule)",
    description: "Tracks confirmed live masterclass seats and workshop session bookings.",
    badge: "Engagement",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    key: "contact" as keyof MetaEventsState,
    dbKey: "trackContact",
    label: "Contact Enquiry (Contact)",
    description: "Tracks contact forms, mentor enquiry modals, and support inquiries.",
    badge: "Support",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    key: "checkout" as keyof MetaEventsState,
    dbKey: "trackCheckout",
    label: "Initiate Checkout (InitiateCheckout)",
    description: "Fires whenever a student clicks 'Upgrade / Subscribe' and opens the checkout dialog.",
    badge: "Funnel",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    key: "purchase" as keyof MetaEventsState,
    dbKey: "trackPurchase",
    label: "Purchase / Conversion (Purchase)",
    description: "CRITICAL: Strictly fires ONLY after verified Razorpay payment success with order value.",
    badge: "High Value",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
  },
];

export default function AdminMarketingPage() {
  const { token, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"meta" | "ga4" | "google_ads" | "tiktok">("meta");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Meta Pixel form state
  const [settingId, setSettingId] = useState<string | null>(null);
  const [pixelId, setPixelId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [events, setEvents] = useState<MetaEventsState>({
    pageView: true,
    viewContent: true,
    lead: true,
    registration: true,
    contact: true,
    booking: true,
    checkout: true,
    purchase: true,
  });

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4500);
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/marketing-tracking`, { headers });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const metaSetting = json.data.find((s: TrackingSetting) => s.platform.toUpperCase() === "META");
        if (metaSetting) {
          setSettingId(metaSetting.id || null);
          setPixelId(metaSetting.pixelId || "");
          setEnabled(Boolean(metaSetting.enabled));
          setEvents({
            pageView: metaSetting.trackPageView !== false,
            viewContent: metaSetting.trackViewContent !== false,
            lead: metaSetting.trackLead !== false,
            registration: metaSetting.trackRegistration !== false,
            contact: metaSetting.trackContact !== false,
            booking: metaSetting.trackBooking !== false,
            checkout: metaSetting.trackCheckout !== false,
            purchase: metaSetting.trackPurchase !== false,
          });
        }
      }
    } catch (err: any) {
      console.error("Error loading marketing tracking settings:", err);
      showError("Failed to fetch marketing tracking settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const cleanPixelId = pixelId.trim();

      const payload = {
        platform: "META",
        pixelId: cleanPixelId,
        enabled: enabled,
        events: {
          pageView: events.pageView,
          viewContent: events.viewContent,
          lead: events.lead,
          registration: events.registration,
          contact: events.contact,
          booking: events.booking,
          checkout: events.checkout,
          purchase: events.purchase,
        },
      };

      const res = await fetch(`${API_BASE_URL}/admin/marketing-tracking`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showSuccess("Meta Pixel marketing configuration saved successfully!");
        if (data.data && data.data.id) {
          setSettingId(data.data.id);
        }
      } else {
        showError(data.message || "Failed to save settings.");
      }
    } catch (err: any) {
      console.error(err);
      showError("Network error while saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEvent = (key: keyof MetaEventsState) => {
    setEvents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTestPixel = () => {
    if (!pixelId.trim()) {
      showError("Please enter a Meta Pixel ID first to test.");
      return;
    }
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      try {
        window.fbq("trackCustom", "AdminPixelTest", {
          timestamp: new Date().toISOString(),
          admin_user: user?.name || "Admin",
        });
        showSuccess("Test event 'AdminPixelTest' dispatched to Meta Pixel! Check Meta Events Manager or Meta Pixel Helper.");
      } catch (err) {
        showSuccess("Pixel test triggered.");
      }
    } else {
      showSuccess(
        "Settings ready! Once you click Save, Meta Pixel will automatically track visitors on your live domain."
      );
    }
  };

  const isNumericOnly = /^\d+$/.test(pixelId.trim());

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav user={user} logout={logout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl shadow-sm">
                <Megaphone size={26} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Marketing & Tracking Manager
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Dynamic Meta (Facebook) Pixel integration with zero code changes and fail-safe operation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchSettings()}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => handleSave()}
              disabled={isSaving || isLoading}
              className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition-all shadow-md shadow-rose-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={15} />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold shadow-sm animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold shadow-sm animate-fade-in">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl mb-8 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab("meta")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "meta"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Meta / Facebook Pixel
            {enabled && pixelId && (
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full">
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ga4")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "ga4"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Google Analytics 4
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              Soon
            </span>
          </button>

          <button
            onClick={() => setActiveTab("google_ads")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "google_ads"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Google Ads Conversion
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              Soon
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tiktok")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "tiktok"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            TikTok Pixel
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full border border-slate-200">
              Soon
            </span>
          </button>
        </div>

        {activeTab !== "meta" ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Integration Coming Soon</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              This marketing channel integration is pre-architected in our system. Once you provide the account ID,
              it can be activated with a single toggle.
            </p>
            <button
              onClick={() => setActiveTab("meta")}
              className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
            >
              Back to Meta Pixel
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      enabled && pixelId.trim()
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Power size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-black text-slate-900">Meta Pixel Master Status</h2>
                      {enabled && pixelId.trim() ? (
                        <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                          Active & Tracking
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                          Inactive / Standby
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {enabled && pixelId.trim()
                        ? "Meta Pixel is actively firing conversion events on your live domain."
                        : "Tracking is turned off. No tracking scripts or network requests will be loaded."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-slate-500">
                    {enabled ? "ENABLED" : "DISABLED"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnabled(!enabled)}
                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      enabled ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        enabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Pixel ID Input Section */}
              <div className="pt-6">
                <label className="block text-sm font-black text-slate-900 mb-1.5">
                  Meta Pixel ID (Dataset ID)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={pixelId}
                      onChange={(e) => setPixelId(e.target.value.trim())}
                      placeholder="e.g. 123456789012345"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestPixel}
                    className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-2xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <Zap size={14} className="text-amber-500" />
                    Test Pixel
                  </button>
                </div>

                {pixelId && !isNumericOnly && (
                  <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1.5">
                    <AlertCircle size={13} />
                    Note: Meta Pixel IDs usually contain only numbers (15-16 digits). Please verify.
                  </p>
                )}

                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <Info size={13} />
                  You can get this ID from <strong>Meta Events Manager → Data Sources → Pixel / Dataset ID</strong>.
                </p>
              </div>
            </div>

            {/* Granular Event Switches */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Conversion Event Triggers</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Toggle individual standard marketing events on or off without affecting your site functionality.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Independent & Non-Blocking
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENT_DEFINITIONS.map((evt) => {
                  const isChecked = events[evt.key];
                  return (
                    <div
                      key={evt.key}
                      onClick={() => handleToggleEvent(evt.key)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                        isChecked
                          ? "bg-slate-50/70 border-slate-300 hover:border-slate-400"
                          : "bg-white border-slate-200 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{evt.label}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${evt.badgeColor}`}
                          >
                            {evt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEvent(evt.key);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isChecked ? "bg-rose-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture & Help Documentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How it works with GoDaddy */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-3xl border border-indigo-100 p-6 sm:p-7">
                <div className="flex items-center gap-2.5 text-indigo-900 font-black mb-3">
                  <Globe size={18} className="text-indigo-600" />
                  How Domain & GoDaddy Works
                </div>
                <p className="text-xs text-indigo-950/80 leading-relaxed mb-4">
                  GoDaddy is simply your <strong>Domain Registrar</strong> that points your domain name
                  (<code>ravishingarthub.com</code>) to the live server.
                </p>
                <div className="space-y-2.5 text-xs text-indigo-950/80">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>No GoDaddy code edits needed:</strong> Meta Pixel is loaded directly by the LMS
                      frontend software on your domain.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>100% Dynamic:</strong> You or your client can change or disable the Pixel ID here
                      anytime without redeploying code.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Domain Verification (Optional):</strong> If Meta asks to verify your domain, you can
                      simply add a DNS TXT record in GoDaddy DNS management.
                    </span>
                  </div>
                </div>
              </div>

              {/* Testing Guide */}
              <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/70 rounded-3xl border border-emerald-100 p-6 sm:p-7">
                <div className="flex items-center gap-2.5 text-emerald-900 font-black mb-3">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Testing & Verification Guide
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed mb-4">
                  Easily verify that events are firing without developer assistance:
                </p>
                <div className="space-y-2.5 text-xs text-emerald-950/80">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>
                      Install the official <strong>Meta Pixel Helper</strong> Chrome Extension from the Google
                      Chrome Web Store.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>
                      Open your homepage, webinar, or subscription page. The extension icon will turn blue and show
                      all fired events (PageView, ViewContent, Lead, Purchase).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>Failsafe Security:</strong> If an ad-blocker is used or Meta is offline, our
                      application wraps tracking in protected try-catch wrappers, ensuring ZERO impact on student
                      learning or payments.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="sticky bottom-6 p-4 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 hidden sm:block">
                All changes take effect immediately across all marketing pages upon saving.
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => fetchSettings()}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving || isLoading}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition-all shadow-md shadow-rose-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={15} />
                  {isSaving ? "Saving Settings..." : "Save Marketing Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
