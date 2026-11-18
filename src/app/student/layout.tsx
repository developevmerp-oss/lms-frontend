import React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="student-panel w-full min-h-screen">{children}</div>;
}

