"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { StudentNav } from "@/components/layout/StudentNav";

export default function StudentCertificates() {
  const { token, user, logout } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/certificates/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCertificates(data);
      })
      .catch(err => console.error(err));
  }, [token]);

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
      <StudentNav user={user} level={user?.membershipLevel || "General"} points={user?.points || 0} logout={logout} />

      <main className="w-full px-4 sm:px-5 lg:px-5 py-5 sm:py-6">
        <header className="mb-12">
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
            My Certificates
          </h1>
          <p className="text-stone-500 mt-2">View and download your earned credentials.</p>
        </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.length === 0 && (
              <div className="col-span-full py-12 text-center text-stone-400">
                You haven't earned any certificates yet. Complete a course to get certified!
              </div>
            )}
            
            {certificates.map(cert => (
              <div key={cert.id} className="relative bg-white/95 rounded-3xl border border-[#ecdccb] p-8 overflow-hidden group shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)]">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-tr-full -ml-4 -mb-4 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 text-center">
                  <div className="mb-6 inline-block p-4 bg-yellow-500/20 rounded-full text-yellow-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Certificate of Completion</h3>
                  <p className="text-teal-300 font-semibold mb-6">{cert.course?.title || "Special Course"}</p>
                  
                  <div className="text-sm text-stone-500 mb-8 border-t border-b border-stone-200 py-4">
                    Awarded on {new Date(cert.createdAt).toLocaleDateString()}
                  </div>
                  
                  <a 
                    href={cert.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#942008] via-[#c4431d] to-[#ea580c] hover:opacity-95 text-white font-bold rounded-full transition-opacity shadow-md"
                  >
                    View / Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
    </div>
  );
}
