"use client";

import React from "react";
import WindingRoadSec from "./WindingRoadSec";

export default function ArtOThonSec({ sprintImages }: { sprintImages?: string[] }) {
  return (
    <div id="artothon" className="scroll-mt-16">
      <div id="roadmap" className="scroll-mt-16" />
      {/* ─── 3D INTERACTIVE WINDING ROAD EXPERIENCE (Art-O-Thon 8 Milestones) ─── */}
      <WindingRoadSec />
    </div>
  );
}
