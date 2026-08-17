"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

export default function StudentCertificates() {
  const { token } = useAuth();
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
    <div className="min-h-screen bg-transparent text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 min-h-[80vh] bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shrink-0">
          <h2 className="text-xl font-bold mb-8 text-teal-400">Student Panel</h2>
          <nav className="space-y-4 text-gray-300">
            <Link href="/student/dashboard" className="block hover:text-white">Dashboard</Link>
            <Link href="/student/courses" className="block hover:text-white">My Courses</Link>
            <Link href="/student/tasks" className="block hover:text-white">Daily Tasks</Link>
            <Link href="/student/leaderboard" className="block hover:text-white">Leaderboard</Link>
            <Link href="/student/certificates" className="block hover:text-white">Certificates</Link>
            <Link href="/student/certificates" className="block hover:text-white font-semibold text-white">Certificates</Link>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="mb-12">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-yellow-500">
              My Certificates
            </h1>
            <p className="text-gray-400 mt-2">View and download your earned credentials.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                You haven't earned any certificates yet. Complete a course to get certified!
              </div>
            )}
            
            {certificates.map(cert => (
              <div key={cert.id} className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-yellow-500/30 p-8 overflow-hidden group shadow-lg shadow-yellow-500/10">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-tr-full -ml-4 -mb-4 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 text-center">
                  <div className="mb-6 inline-block p-4 bg-yellow-500/20 rounded-full text-yellow-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">Certificate of Completion</h3>
                  <p className="text-teal-300 font-semibold mb-6">{cert.course?.title || "Special Course"}</p>
                  
                  <div className="text-sm text-gray-400 mb-8 border-t border-b border-gray-700 py-4">
                    Awarded on {new Date(cert.createdAt).toLocaleDateString()}
                  </div>
                  
                  <a 
                    href={cert.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold rounded-full transition-opacity shadow-md"
                  >
                    View / Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
