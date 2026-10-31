"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  ArrowDown,
  Flag,
  Brush,
  Sparkles,
  Trophy,
  Share2,
  BarChart3,
  Flame,
  Heart,
  PartyPopper,
} from "lucide-react";

// Register GSAP plugins safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────
// 1. MILESTONE DATA (8 Turn Points of the Art-O-Thon Road)
// ─────────────────────────────────────────────────────────────
export interface MilestoneData {
  id: number;
  number: string;
  title: string;
  color: string;
  accentHex: string;
  turnDirection: "right" | "left";
  t: number; // Curve progress parameter [0, 1]
}

export const ROAD_MILESTONES: MilestoneData[] = [
  {
    id: 1,
    number: "01",
    title: "START WITH CLARITY",
    color: "#f97316",
    accentHex: "#ea580c",
    turnDirection: "right",
    t: 0.0935,
  },
  {
    id: 2,
    number: "02",
    title: "BUILD YOUR CONFIDENCE",
    color: "#f59e0b",
    accentHex: "#d97706",
    turnDirection: "left",
    t: 0.2035,
  },
  {
    id: 3,
    number: "03",
    title: "DEVELOP YOUR SKILLS",
    color: "#10b981",
    accentHex: "#059669",
    turnDirection: "right",
    t: 0.321,
  },
  {
    id: 4,
    number: "04",
    title: "FIND YOUR CREATIVE STYLE",
    color: "#06b6d4",
    accentHex: "#0891b2",
    turnDirection: "left",
    t: 0.442,
  },
  {
    id: 5,
    number: "05",
    title: "CREATE YOUR PORTFOLIO",
    color: "#3b82f6",
    accentHex: "#2563eb",
    turnDirection: "right",
    t: 0.565,
  },
  {
    id: 6,
    number: "06",
    title: "BUILD YOUR BRAND IDENTITY",
    color: "#8b5cf6",
    accentHex: "#7c3aed",
    turnDirection: "left",
    t: 0.6865,
  },
  {
    id: 7,
    number: "07",
    title: "GET VISIBLE ONLINE",
    color: "#ec4899",
    accentHex: "#db2777",
    turnDirection: "right",
    t: 0.81,
  },
  {
    id: 8,
    number: "08",
    title: "TAKE YOUR NEXT STEP",
    color: "#f97316",
    accentHex: "#c2410c",
    turnDirection: "left",
    t: 0.9355,
  },
];

// ─────────────────────────────────────────────────────────────
// 1B. 60-DAY TRANSFORMATION OUTCOMES (Celebration Grand Finale)
// ─────────────────────────────────────────────────────────────
export const TRANSFORMATION_OUTCOMES = [
  {
    title: "Practical Resin Skills",
    desc: "Techniques, pigments, and pour mastery",
    icon: Brush,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
  },
  {
    title: "Complete Art Pieces",
    desc: "4+ finished, gallery-ready artworks",
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  {
    title: "Active Portfolio",
    desc: "Signature collection ready to display & sell",
    icon: Trophy,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    title: "Social Media Presence",
    desc: "Content system attracting genuine buyers",
    icon: Share2,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
  },
  {
    title: "Business Clarity",
    desc: "Confident pricing, branding & sales roadmap",
    icon: BarChart3,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  {
    title: "Confidence",
    desc: "Unshakeable self-trust in your creative craft",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    title: "Friendships",
    desc: "Warm sisterhood & daily peer mentorship",
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
  },
];

// ─────────────────────────────────────────────────────────────
// 2. PROCEDURAL TEXTURE GENERATORS (Zero external network requests)
// ─────────────────────────────────────────────────────────────

/** Dotted grid ground texture with soft fading luminous points */
function createDottedGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 128, 128);

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 3.5);
  grad.addColorStop(0, "rgba(249, 115, 22, 0.85)");
  grad.addColorStop(0.3, "rgba(148, 163, 184, 0.45)");
  grad.addColorStop(1, "rgba(148, 163, 184, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 4, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(160, 160);
  return texture;
}

/** Crisp dashed center white lane line texture */
function createDashedLaneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 64, 256);

  ctx.fillStyle = "#ffffff";
  const barWidth = 32;
  const barHeight = 150;
  const x = (64 - barWidth) / 2;
  const y = 20;
  const radius = 6;

  ctx.beginPath();
  ctx.roundRect(x, y, barWidth, barHeight, radius);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 245, 235, 0.95)";
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 6, barWidth - 8, barHeight - 12, 4);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 140);
  return texture;
}

/** Soft drop shadow under the asphalt road */
function createRoadShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.2, "rgba(0, 0, 0, 0.45)");
  grad.addColorStop(0.5, "rgba(0, 0, 0, 0.85)");
  grad.addColorStop(0.8, "rgba(0, 0, 0, 0.45)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 40);
  return texture;
}

/** Numbered circular emblem texture for 3D map pin */
function createPinBadgeTexture(num: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0c111d";
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 96, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 105px 'Inter', system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(num, 128, 134);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ─────────────────────────────────────────────────────────────
// 3. SYNTHESIZED AUDIO AMBIANCE (Web Audio API)
// ─────────────────────────────────────────────────────────────
class RoadAudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private lastTriggeredMilestone: number = -1;

  public init() {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playMilestoneChime(index: number) {
    if (this.isMuted || !this.ctx || index === this.lastTriggeredMilestone) return;
    this.lastTriggeredMilestone = index;

    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = [392, 440, 493.88, 523.25, 587.33, 659.25, 783.99, 880];
      const freq = freqs[index % freqs.length];

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Audio not permitted yet
    }
  }

  public playCelebrationFanfare() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx!.currentTime + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.09 + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.09);
        osc.stop(this.ctx!.currentTime + idx * 0.09 + 0.6);
      });
    } catch {
      // Audio not permitted yet
    }
  }
}

const roadAudio = new RoadAudioSynth();

// ─────────────────────────────────────────────────────────────
// 4. MAIN WINDING ROAD COMPONENT (Responsive for all screen sizes)
// ─────────────────────────────────────────────────────────────
export default function WindingRoadSec() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Component UI State
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [speedLevel, setSpeedLevel] = useState<string>("Walking • 1.6 m/s");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // 60-Day Transformation Celebration & Party Poppers State
  const popperFiredRef = useRef<boolean>(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiParticlesRef = useRef<any[]>([]);
  const confettiAnimFrameRef = useRef<number | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const pinMeshesRef = useRef<THREE.Group[]>([]);
  const beaconRingsRef = useRef<THREE.Mesh[]>([]);
  const animFrameId = useRef<number | null>(null);

  // Smooth camera banking and walking bob
  const progressProxy = useRef<{ value: number }>({ value: 0 });
  const bankAngleRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const stepBobRef = useRef<number>(0);

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartProgressRef = useRef<number>(0);

  // ─────────────────────────────────────────────────────────
  // Spline Path Definition (8 S-Curves calibrated for smooth 60-day roadmap)
  // ─────────────────────────────────────────────────────────
  const splineCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 15),
      new THREE.Vector3(3, 0.1, -12),
      new THREE.Vector3(16, 0.3, -48), // Apex 1: Right (START WITH CLARITY)
      new THREE.Vector3(9, 0.55, -82),
      new THREE.Vector3(-18, 0.8, -120), // Apex 2: Left (BUILD YOUR CONFIDENCE)
      new THREE.Vector3(-8, 1.1, -158),
      new THREE.Vector3(20, 1.4, -198), // Apex 3: Right (DEVELOP YOUR SKILLS)
      new THREE.Vector3(8, 1.65, -238),
      new THREE.Vector3(-22, 1.85, -278), // Apex 4: Left (FIND YOUR CREATIVE STYLE)
      new THREE.Vector3(-7, 2.0, -318),
      new THREE.Vector3(20, 2.1, -358), // Apex 5: Right (CREATE YOUR PORTFOLIO)
      new THREE.Vector3(8, 1.85, -398),
      new THREE.Vector3(-18, 1.5, -440), // Apex 6: Left (BUILD YOUR BRAND IDENTITY)
      new THREE.Vector3(-6, 1.2, -482),
      new THREE.Vector3(16, 0.9, -525), // Apex 7: Right (GET VISIBLE ONLINE)
      new THREE.Vector3(6, 0.65, -568),
      new THREE.Vector3(-15, 0.5, -615), // Apex 8: Left (TAKE YOUR NEXT STEP - at apex t=0.9355)
      new THREE.Vector3(-6, 0.45, -645), // Exit 8 curve
      new THREE.Vector3(0, 0.4, -665), // Final straight destination & horizon stop
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  curveRef.current = splineCurve;

  // ─────────────────────────────────────────────────────────
  // Build 3D Scene: Road, Dashes, Curbs, Shadows & 3D Markers
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#040711");
    // Atmospheric fog for natural distance depth
    scene.fog = new THREE.FogExp2("#040711", 0.005);

    // 2. Camera setup: Eye-level perspective (1.7m above asphalt)
    // Dynamic initial FOV based on mobile portrait vs desktop landscape
    const initialFov = width < height ? 74 : 62;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 1.7, 15);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting: Ambient + Directional Sun + Headlight + Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd2, 1.7);
    dirLight.position.set(40, 75, 30);
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    softFillLight.position.set(-50, 45, -100);
    scene.add(softFillLight);

    // Dynamic travel headlight moving with camera
    const travelLight = new THREE.PointLight(0xfff7ed, 2.5, 75, 1.2);
    travelLight.position.set(0, 1.6, 0);
    scene.add(travelLight);

    // 5. Clean minimal background: Dotted Grid Ground Plane
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      map: createDottedGridTexture(),
      roughness: 0.9,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    scene.add(groundMesh);

    // 6. Procedural Asphalt Road Geometry (Ribbon along spline)
    const roadSamples = 650;
    const roadWidth = 6.2;
    const roadPositions: number[] = [];
    const roadNormals: number[] = [];
    const roadUvs: number[] = [];
    const roadIndices: number[] = [];

    // Center Dashed Lane Geometry
    const dashPositions: number[] = [];
    const dashNormals: number[] = [];
    const dashUvs: number[] = [];
    const dashIndices: number[] = [];
    const dashWidth = 0.22;

    // Road Shadow Geometry
    const shadowPositions: number[] = [];
    const shadowNormals: number[] = [];
    const shadowUvs: number[] = [];
    const shadowIndices: number[] = [];
    const shadowWidth = roadWidth + 3.2;

    // Curbs Geometry (Left & Right raised borders)
    const curbPositions: number[] = [];
    const curbNormals: number[] = [];
    const curbUvs: number[] = [];
    const curbIndices: number[] = [];
    const curbWidth = 0.35;
    const curbHeight = 0.07;

    for (let i = 0; i < roadSamples; i++) {
      const u = i / (roadSamples - 1);
      const pt = splineCurve.getPointAt(u);
      const tangent = splineCurve.getTangentAt(u).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const lateral = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // Road Surface Vertices
      const leftPt = pt.clone().sub(lateral.clone().multiplyScalar(roadWidth / 2));
      const rightPt = pt.clone().add(lateral.clone().multiplyScalar(roadWidth / 2));
      roadPositions.push(leftPt.x, leftPt.y + 0.04, leftPt.z);
      roadPositions.push(rightPt.x, rightPt.y + 0.04, rightPt.z);
      roadNormals.push(0, 1, 0, 0, 1, 0);
      roadUvs.push(0, u * 90, 1, u * 90);

      // Dashed Line Vertices
      const dashLeft = pt.clone().sub(lateral.clone().multiplyScalar(dashWidth / 2));
      const dashRight = pt.clone().add(lateral.clone().multiplyScalar(dashWidth / 2));
      dashPositions.push(dashLeft.x, dashLeft.y + 0.052, dashLeft.z);
      dashPositions.push(dashRight.x, dashRight.y + 0.052, dashRight.z);
      dashNormals.push(0, 1, 0, 0, 1, 0);
      dashUvs.push(0, u * 140, 1, u * 140);

      // Shadow Vertices (underneath asphalt)
      const shadowLeft = pt.clone().sub(lateral.clone().multiplyScalar(shadowWidth / 2));
      const shadowRight = pt.clone().add(lateral.clone().multiplyScalar(shadowWidth / 2));
      shadowPositions.push(shadowLeft.x, Math.max(0, pt.y - 0.02), shadowLeft.z);
      shadowPositions.push(shadowRight.x, Math.max(0, pt.y - 0.02), shadowRight.z);
      shadowNormals.push(0, 1, 0, 0, 1, 0);
      shadowUvs.push(0, u * 50, 1, u * 50);

      // Curbs: Left & Right raised edges
      const curbLeftOuter = pt.clone().sub(lateral.clone().multiplyScalar(roadWidth / 2 + curbWidth));
      const curbRightOuter = pt.clone().add(lateral.clone().multiplyScalar(roadWidth / 2 + curbWidth));
      curbPositions.push(curbLeftOuter.x, leftPt.y + curbHeight, curbLeftOuter.z);
      curbPositions.push(leftPt.x, leftPt.y + 0.04, leftPt.z);
      curbPositions.push(rightPt.x, rightPt.y + 0.04, rightPt.z);
      curbPositions.push(curbRightOuter.x, rightPt.y + curbHeight, curbRightOuter.z);
      curbNormals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      curbUvs.push(0, u * 60, 0.5, u * 60, 0.5, u * 60, 1, u * 60);

      // Triangles
      if (i < roadSamples - 1) {
        const base = i * 2;
        roadIndices.push(base, base + 1, base + 2);
        roadIndices.push(base + 1, base + 3, base + 2);

        dashIndices.push(base, base + 1, base + 2);
        dashIndices.push(base + 1, base + 3, base + 2);

        shadowIndices.push(base, base + 1, base + 2);
        shadowIndices.push(base + 1, base + 3, base + 2);

        const curbBase = i * 4;
        curbIndices.push(curbBase, curbBase + 1, curbBase + 4);
        curbIndices.push(curbBase + 1, curbBase + 5, curbBase + 4);
        curbIndices.push(curbBase + 2, curbBase + 3, curbBase + 6);
        curbIndices.push(curbBase + 3, curbBase + 7, curbBase + 6);
      }
    }

    // Asphalt Mesh
    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(roadPositions, 3));
    roadGeo.setAttribute("normal", new THREE.Float32BufferAttribute(roadNormals, 3));
    roadGeo.setAttribute("uv", new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeo.setIndex(roadIndices);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.85,
      metalness: 0.15,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Dashed White Lane Mesh
    const dashGeo = new THREE.BufferGeometry();
    dashGeo.setAttribute("position", new THREE.Float32BufferAttribute(dashPositions, 3));
    dashGeo.setAttribute("normal", new THREE.Float32BufferAttribute(dashNormals, 3));
    dashGeo.setAttribute("uv", new THREE.Float32BufferAttribute(dashUvs, 2));
    dashGeo.setIndex(dashIndices);
    const dashMat = new THREE.MeshBasicMaterial({
      map: createDashedLaneTexture(),
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
    });
    const dashMesh = new THREE.Mesh(dashGeo, dashMat);
    scene.add(dashMesh);

    // Under-Road Drop Shadow Mesh
    const shadowGeo = new THREE.BufferGeometry();
    shadowGeo.setAttribute("position", new THREE.Float32BufferAttribute(shadowPositions, 3));
    shadowGeo.setAttribute("normal", new THREE.Float32BufferAttribute(shadowNormals, 3));
    shadowGeo.setAttribute("uv", new THREE.Float32BufferAttribute(shadowUvs, 2));
    shadowGeo.setIndex(shadowIndices);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createRoadShadowTexture(),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(shadowMesh);

    // Road Curbs Mesh
    const curbGeo = new THREE.BufferGeometry();
    curbGeo.setAttribute("position", new THREE.Float32BufferAttribute(curbPositions, 3));
    curbGeo.setAttribute("normal", new THREE.Float32BufferAttribute(curbNormals, 3));
    curbGeo.setAttribute("uv", new THREE.Float32BufferAttribute(curbUvs, 2));
    curbGeo.setIndex(curbIndices);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x2b3346,
      roughness: 0.7,
      metalness: 0.25,
    });
    const curbMesh = new THREE.Mesh(curbGeo, curbMat);
    scene.add(curbMesh);

    // 7. Curbside Reflector Bollards
    const bollardGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.85, 12);
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
    const reflectorMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

    for (let i = 8; i < roadSamples - 8; i += 14) {
      const u = i / (roadSamples - 1);
      const pt = splineCurve.getPointAt(u);
      const tangent = splineCurve.getTangentAt(u).normalize();
      const lateral = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const leftPost = new THREE.Mesh(bollardGeo, bollardMat);
      const leftPos = pt.clone().sub(lateral.clone().multiplyScalar(roadWidth / 2 + 0.5));
      leftPost.position.set(leftPos.x, leftPos.y + 0.42, leftPos.z);
      const leftReflector = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), reflectorMat);
      leftReflector.position.y = 0.38;
      leftPost.add(leftReflector);
      scene.add(leftPost);

      const rightPost = new THREE.Mesh(bollardGeo, bollardMat);
      const rightPos = pt.clone().add(lateral.clone().multiplyScalar(roadWidth / 2 + 0.5));
      rightPost.position.set(rightPos.x, rightPos.y + 0.42, rightPos.z);
      const rightReflector = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), reflectorMat);
      rightReflector.position.y = 0.38;
      rightPost.add(rightReflector);
      scene.add(rightPost);
    }

    // 8. Milestones & Turn Points (8 Floating 3D Map Markers)
    const pinGroups: THREE.Group[] = [];
    const beaconRings: THREE.Mesh[] = [];

    ROAD_MILESTONES.forEach((ms) => {
      const pinGroup = new THREE.Group();

      const apexPt = splineCurve.getPointAt(ms.t);
      const tangent = splineCurve.getTangentAt(ms.t).normalize();
      const lateral = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Offset pin onto the turn apex shoulder (4.8m from center)
      const isRight = ms.turnDirection === "right";
      const shoulderOffset = isRight ? 4.8 : -4.8;
      const pinBasePos = apexPt.clone().add(lateral.clone().multiplyScalar(shoulderOffset));

      pinGroup.position.set(pinBasePos.x, pinBasePos.y + 2.5, pinBasePos.z);

      const pinColor = new THREE.Color(ms.color);

      // Pin Head (Smooth Sphere)
      const headGeo = new THREE.SphereGeometry(0.75, 32, 24);
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        roughness: 0.25,
        metalness: 0.55,
        emissive: pinColor,
        emissiveIntensity: 0.35,
      });
      const headMesh = new THREE.Mesh(headGeo, pinMat);
      headMesh.position.y = 0.45;
      pinGroup.add(headMesh);

      // Pin Needle (Inverted Tapered Cone pointing down to road)
      const coneGeo = new THREE.ConeGeometry(0.72, 1.45, 32);
      const coneMesh = new THREE.Mesh(coneGeo, pinMat);
      coneMesh.rotation.x = Math.PI;
      coneMesh.position.y = -0.3;
      pinGroup.add(coneMesh);

      // Inner Circular Milestone Number Emblem (1 to 8)
      const discGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.12, 32);
      const discTexture = createPinBadgeTexture(ms.number, ms.color);
      const discMatFront = new THREE.MeshBasicMaterial({ map: discTexture });
      const discMatSide = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      const discMesh = new THREE.Mesh(discGeo, [discMatSide, discMatFront, discMatFront]);
      discMesh.rotation.x = Math.PI / 2;
      discMesh.position.set(0, 0.45, 0);
      pinGroup.add(discMesh);

      // Vertical Ground Beacon Laser Pillar
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 2.5, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(0, -1.25, 0);
      pinGroup.add(beamMesh);

      // Concentric Beacon Ring on Asphalt Shoulder
      const ringGeo = new THREE.RingGeometry(0.35, 1.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(pinBasePos.x, pinBasePos.y + 0.06, pinBasePos.z);
      scene.add(ringMesh);
      beaconRings.push(ringMesh);

      scene.add(pinGroup);
      pinGroups.push(pinGroup);
    });

    pinMeshesRef.current = pinGroups;
    beaconRingsRef.current = beaconRings;

    // 9. Floating Ambient Luminous Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const p = splineCurve.getPointAt(u);
      particlePos.push(
        p.x + (Math.random() - 0.5) * 25,
        p.y + Math.random() * 5 + 0.5,
        p.z + (Math.random() - 0.5) * 25
      );
    }
    particleGeo.setAttribute("position", new THREE.Float32BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.18,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─────────────────────────────────────────────────────────
    // 10. Render Loop: Camera Navigation, Banking, Bobbing & Animation
    // ─────────────────────────────────────────────────────────
    let clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const progress = progressProxy.current.value;

      // 1. Calculate camera position at progress t
      const safeCamT = Math.min(progress, 0.996);
      const camPos = splineCurve.getPointAt(safeCamT);

      // 2. Look-ahead target point on curve
      let lookTarget: THREE.Vector3;
      if (progress < 0.975) {
        const lookAheadT = Math.min(progress + 0.036, 0.999);
        lookTarget = splineCurve.getPointAt(lookAheadT);
      } else {
        // At the horizon finish, look forward along the exit tangent
        const forwardTangent = splineCurve.getTangentAt(0.999).normalize();
        lookTarget = camPos.clone().add(forwardTangent.multiplyScalar(25));
      }

      // 3. Smooth Banking into Turns (Tilt camera into curve)
      const safeTangentT = Math.min(progress, 0.97);
      const tangent1 = splineCurve.getTangentAt(safeTangentT);
      const tangent2 = splineCurve.getTangentAt(Math.min(safeTangentT + 0.026, 0.999));
      const turnCurl = tangent1.x * tangent2.z - tangent1.z * tangent2.x;
      const targetBank = THREE.MathUtils.clamp(turnCurl * 3.4, -0.15, 0.15);
      bankAngleRef.current += (targetBank - bankAngleRef.current) * 0.12;

      // 4. First-person walking bob calculation
      const progressDelta = Math.abs(progress - lastProgressRef.current);
      lastProgressRef.current = progress;
      const isMoving = progressDelta > 0.00005;

      if (isMoving) {
        stepBobRef.current += progressDelta * 850;
      }
      const walkingBobY = Math.sin(stepBobRef.current) * (isMoving ? 0.045 : 0.005);
      const walkingSwayX = Math.cos(stepBobRef.current * 0.5) * (isMoving ? 0.02 : 0.002);

      // Position camera at 1.7m eye-level
      camera.position.set(
        camPos.x + walkingSwayX,
        camPos.y + 1.7 + walkingBobY,
        camPos.z
      );

      // Align camera look-at towards target at eye-level
      camera.lookAt(lookTarget.x, lookTarget.y + 1.62, lookTarget.z);

      // Apply realistic camera roll/bank around optical axis
      camera.rotateZ(bankAngleRef.current);

      // Move travel headlight with camera
      travelLight.position.copy(camera.position);

      // 5. Animate Floating 3D Location Pins & Beacon Rings
      pinGroups.forEach((pin, i) => {
        const ms = ROAD_MILESTONES[i];
        const floatBob = Math.sin(elapsed * 2.2 + i * 0.9) * 0.22;
        const apexPt = splineCurve.getPointAt(ms.t);
        pin.position.y = apexPt.y + 2.5 + floatBob;

        // Keep pin numbered disc facing towards the camera for readability
        pin.lookAt(camera.position.x, pin.position.y, camera.position.z);

        // Proximity scale when camera approaches
        const distToCam = camera.position.distanceTo(pin.position);
        const isNear = distToCam < 40 && distToCam > 2;
        const targetScale = isNear ? 1.18 : 1.0;
        pin.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      // Animate Beacon Rings (Pulsing ring expansion)
      beaconRings.forEach((ring, i) => {
        const pulse = 1.0 + Math.sin(elapsed * 3.0 + i) * 0.18;
        ring.scale.set(pulse, pulse, pulse);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + Math.sin(elapsed * 3.0 + i) * 0.35;
      });

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    // ─────────────────────────────────────────────────────────
    // 11. Responsive Resize Handling (Dynamic FOV for phones & desktops)
    // ─────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!canvasContainerRef.current || !renderer || !camera) return;
      const w = canvasContainerRef.current.clientWidth || window.innerWidth;
      const h = canvasContainerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      // On narrow mobile portrait screens (w < h), expand FOV to ensure the curves and pins stay framed!
      if (w < h) {
        camera.fov = 74;
      } else {
        camera.fov = 62;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
    };
  }, [splineCurve]);

  // ─────────────────────────────────────────────────────────
  // 4B. Realistic Party Poppers Confetti Cannon Particle Engine
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleCanvasResize = () => {
      const canvas = confettiCanvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    handleCanvasResize();
    window.addEventListener("resize", handleCanvasResize);
    return () => {
      window.removeEventListener("resize", handleCanvasResize);
      if (confettiAnimFrameRef.current) {
        cancelAnimationFrame(confettiAnimFrameRef.current);
      }
    };
  }, []);

  const triggerPartyPoppers = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    roadAudio.playCelebrationFanfare();

    const COLORS = [
      "#f97316", // orange
      "#f59e0b", // amber
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#ec4899", // pink
      "#8b5cf6", // purple
      "#ffffff", // crisp white
      "#fde047", // bright gold
      "#fb923c", // vivid orange
    ];

    const newParticles: any[] = [];
    const count = window.innerWidth < 640 ? 120 : 200;

    // Cannon 1: Bottom-Left Cannon (blasts up-right)
    for (let i = 0; i < count * 0.45; i++) {
      const angle = -Math.PI * 0.35 + (Math.random() - 0.5) * 0.55;
      const speed = 15 + Math.random() * 16;
      newParticles.push({
        x: width * 0.08,
        y: height * 0.92,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 7 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.1 + Math.random() * 0.12,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
        alpha: 1,
        decay: 0.005 + Math.random() * 0.006,
      });
    }

    // Cannon 2: Bottom-Right Cannon (blasts up-left)
    for (let i = 0; i < count * 0.45; i++) {
      const angle = -Math.PI * 0.65 + (Math.random() - 0.5) * 0.55;
      const speed = 15 + Math.random() * 16;
      newParticles.push({
        x: width * 0.92,
        y: height * 0.92,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 7 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.1 + Math.random() * 0.12,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
        alpha: 1,
        decay: 0.005 + Math.random() * 0.006,
      });
    }

    // Cannon 3: Center Sky Burst (blasts upwards)
    for (let i = 0; i < count * 0.3; i++) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.2;
      const speed = 12 + Math.random() * 18;
      newParticles.push({
        x: width * 0.5,
        y: height * 0.75,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.12 + Math.random() * 0.15,
        shape: Math.random() > 0.3 ? "rect" : "circle",
        alpha: 1,
        decay: 0.006 + Math.random() * 0.007,
      });
    }

    confettiParticlesRef.current = [...confettiParticlesRef.current, ...newParticles];

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * size
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2),
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2)
        );
      }
      ctx.closePath();
      ctx.fill();
    };

    if (!confettiAnimFrameRef.current) {
      const updateConfetti = () => {
        const c = confettiCanvasRef.current;
        if (!c) {
          confettiAnimFrameRef.current = null;
          return;
        }
        const ctx = c.getContext("2d");
        if (!ctx) {
          confettiAnimFrameRef.current = null;
          return;
        }

        ctx.clearRect(0, 0, c.width, c.height);

        const particles = confettiParticlesRef.current;
        const remaining: any[] = [];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.vx *= 0.965;
          p.vy = p.vy * 0.965 + 0.42;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.tilt += p.tiltSpeed;
          p.alpha -= p.decay;

          if (p.alpha > 0 && p.y < c.height + 30) {
            remaining.push(p);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.scale(1, Math.cos(p.tilt));
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;

            if (p.shape === "rect") {
              ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
            } else if (p.shape === "circle") {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
              ctx.fill();
            } else {
              drawStar(ctx, p.size / 2);
            }

            ctx.restore();
          }
        }

        confettiParticlesRef.current = remaining;

        if (remaining.length > 0) {
          confettiAnimFrameRef.current = requestAnimationFrame(updateConfetti);
        } else {
          ctx.clearRect(0, 0, c.width, c.height);
          confettiAnimFrameRef.current = null;
        }
      };

      confettiAnimFrameRef.current = requestAnimationFrame(updateConfetti);
    }
  }, []);

  const checkCelebration = useCallback(
    (p: number, _closestIdx?: number) => {
      // Trigger party poppers when reaching the road end after milestone 8
      if (p >= 0.96) {
        if (!popperFiredRef.current) {
          popperFiredRef.current = true;
          setTimeout(() => {
            triggerPartyPoppers();
          }, 80);
        }
      } else if (p < 0.93) {
        // Reset so traveling forward to road end again fires poppers
        popperFiredRef.current = false;
      }
    },
    [triggerPartyPoppers]
  );

  // ─────────────────────────────────────────────────────────
  // 5. GSAP ScrollTrigger Setup (Scrubbed to User Scroll)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "road-scroll-trigger",
        trigger: container,
        start: "top top",
        end: "+=4200",
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressProxy.current.value = p;
          setScrollProgress(p);

          // Update walking speed readout dynamically
          const speed = Math.abs(self.getVelocity());
          if (speed > 1200) {
            setSpeedLevel("Sprint • 4.8 m/s");
          } else if (speed > 300) {
            setSpeedLevel("Brisk Walk • 2.6 m/s");
          } else if (speed > 10) {
            setSpeedLevel("Walking • 1.6 m/s");
          } else {
            setSpeedLevel("At Milestone • Resting");
          }

          // Determine closest active milestone
          let closestIdx = 0;
          let minDiff = 999;
          ROAD_MILESTONES.forEach((ms, idx) => {
            const diff = Math.abs(p - ms.t);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          // Ensure Milestone 8 stays active through the finish line (p >= 0.88)
          if (p >= 0.88) {
            closestIdx = 7;
          }

          setActiveMilestoneIndex(closestIdx);

          // Audio chime trigger if close to turn apex
          if (minDiff < 0.02) {
            roadAudio.playMilestoneChime(closestIdx);
          }

          // Check for celebration trigger when reaching the end of the road
          checkCelebration(p, closestIdx);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [checkCelebration]);

  // ─────────────────────────────────────────────────────────
  // 6. Smooth Step Scroll (Drives road identically to scrolling for ArrowDown/ArrowUp)
  // ─────────────────────────────────────────────────────────
  const stepRoadScroll = useCallback(
    (direction: 1 | -1) => {
      roadAudio.init();
      const st = ScrollTrigger.getById("road-scroll-trigger");
      if (st && !isFullscreen) {
        // Scroll the window smoothly by 200px in the requested direction
        window.scrollBy({ top: direction * 200, behavior: "smooth" });
      } else {
        // Fallback for fullscreen or direct stepping
        const currentP = progressProxy.current.value;
        const nextP = THREE.MathUtils.clamp(currentP + direction * 0.035, 0, 1);
        gsap.to(progressProxy.current, {
          value: nextP,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => {
            const p = progressProxy.current.value;
            setScrollProgress(p);
            let closestIdx = 0;
            let minDiff = 999;
            ROAD_MILESTONES.forEach((ms, idx) => {
              const diff = Math.abs(p - ms.t);
              if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
              }
            });
            if (p >= 0.88) closestIdx = 7;
            setActiveMilestoneIndex(closestIdx);
            checkCelebration(p, closestIdx);
          },
        });
      }
    },
    [isFullscreen, checkCelebration]
  );

  // ─────────────────────────────────────────────────────────
  // 7. Interactive Navigation: Jump to any Milestone on Demand
  // ─────────────────────────────────────────────────────────
  const jumpToMilestone = useCallback((index: number) => {
    const targetMs = ROAD_MILESTONES[index];
    if (!targetMs) return;

    roadAudio.init();
    setActiveMilestoneIndex(index);
    roadAudio.playMilestoneChime(index);

    // Smooth GSAP animation to target progress
    gsap.to(progressProxy.current, {
      value: targetMs.t,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        const p = progressProxy.current.value;
        setScrollProgress(p);
        checkCelebration(p, index);
      },
    });

    // Synchronize window scroll if ScrollTrigger is active
    const st = ScrollTrigger.getById("road-scroll-trigger") || ScrollTrigger.getAll().find(
      (t) => t.vars.trigger === containerRef.current
    );
    if (st) {
      const targetScroll = st.start + targetMs.t * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, [checkCelebration]);

  // ─────────────────────────────────────────────────────────
  // 8. Arrow Down & Arrow Up Keyboard Support (Identical to mouse scrolling!)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if container is within the viewport
      const rect = containerRef.current?.getBoundingClientRect();
      const inView =
        rect &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0;

      if (!inView && !isFullscreen) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        stepRoadScroll(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        stepRoadScroll(-1);
      } else if (e.key === "ArrowRight") {
        if (activeMilestoneIndex < ROAD_MILESTONES.length - 1) {
          jumpToMilestone(activeMilestoneIndex + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (activeMilestoneIndex > 0) {
          jumpToMilestone(activeMilestoneIndex - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMilestoneIndex, stepRoadScroll, jumpToMilestone, isFullscreen]);

  // ─────────────────────────────────────────────────────────
  // 9. Interactive Touch & Mouse Drag Scrubbing on Canvas
  // ─────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartProgressRef.current = progressProxy.current.value;
    roadAudio.init();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = dragStartYRef.current - e.clientY;
    const progressChange = deltaY / 1500;
    const newProgress = THREE.MathUtils.clamp(dragStartProgressRef.current + progressChange, 0, 1);
    progressProxy.current.value = newProgress;
    setScrollProgress(newProgress);

    let closestIdx = 0;
    let minDiff = 999;
    ROAD_MILESTONES.forEach((ms, idx) => {
      const diff = Math.abs(newProgress - ms.t);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    if (newProgress >= 0.88) {
      closestIdx = 7;
    }
    setActiveMilestoneIndex(closestIdx);
    checkCelebration(newProgress, closestIdx);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const activeMilestone = ROAD_MILESTONES[activeMilestoneIndex];
  const isAtRoadEnd = scrollProgress >= 0.96;

  // Proximity factor (Guarantees Milestone 8 stays 100% visible at the end of the journey)
  const milestoneProximity = useMemo(() => {
    if (!activeMilestone) return 1;
    if (activeMilestone.id === 8 && scrollProgress >= 0.85) {
      return 1.0;
    }
    if (activeMilestone.id === 1 && scrollProgress <= 0.12) {
      return 1.0;
    }
    const diff = Math.abs(scrollProgress - activeMilestone.t);
    if (diff > 0.09) return 0.45;
    return THREE.MathUtils.clamp(1.0 - diff * 7, 0.55, 1.0);
  }, [scrollProgress, activeMilestone]);

  return (
    <section
      id="artothon-3d-road"
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#040711] text-white select-none ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-screen"
        }`}
    >
      {/* ─── Top Completion Progress Bar ─── */}
      <div className="absolute top-0 inset-x-0 z-30 h-1 bg-slate-900/60">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-75"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* ─── 3D WebGL Canvas Layer (Supports Mouse Drag & Touch Scrub) ─── */}
      <div
        ref={canvasContainerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* ─── Minimal Ambient Dotted Vignette Overlay ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-radial from-transparent via-[#040711]/25 to-[#040711]/85"
        aria-hidden="true"
      />

      {/* ─── Party Popper Confetti Canvas Layer ─── */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute inset-0 z-40 w-full h-full"
      />

      {/* ─── Top Header & Telemetry Tracker (Responsive across all screens) ─── */}
      <div className="absolute top-2 inset-x-0 z-20 pointer-events-none p-3 sm:p-6 lg:p-8 flex items-start justify-between gap-3">
        {/* Left: Section Identity */}
        <div className="space-y-1 max-w-md sm:max-w-lg">
          <div className="inline-flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-orange-400">
              Art-O-Thon • 60-Day Transformation
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-md leading-tight">
            Your 60-Day{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Transformation
            </span>{" "}
            Roadmap
          </h2>
          <p className="text-base text-slate-300/90 hidden sm:block">
            A step-by-step journey to become a confident resin artist and build the foundation for your creative business.
          </p>
        </div>

        {/* Right: Controls & Step Counter */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
          {/* Milestone Step Counter */}
          {/* <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Step</span>
            <span className="text-sm sm:text-base font-black text-orange-400 font-mono">
              {activeMilestone.number}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500">/ 08</span>
          </div> */}

          {/* Fullscreen Toggle */}
          {/* <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label="Toggle Fullscreen Road Experience"
            className="p-2 sm:p-2.5 bg-slate-950/80 hover:bg-slate-850 backdrop-blur-md border border-slate-800 hover:border-orange-500/50 rounded-2xl text-slate-300 hover:text-white transition-all shadow-xl"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button> */}
        </div>
      </div>

      {/* ─── Floating Up / Down Stepper Buttons (Right Edge) ─── */}
      <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-2">
        <button
          onClick={() => stepRoadScroll(-1)}
          aria-label="Travel Backward Up Road"
          title="Step Up / Backward (↑ Key)"
          className="p-2.5 sm:p-3 bg-slate-950/85 hover:bg-slate-850 hover:border-orange-500/60 border border-slate-800 rounded-2xl text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md active:scale-95"
        >
          <ChevronUp size={18} />
        </button>
        <button
          onClick={() => stepRoadScroll(1)}
          aria-label="Travel Forward Down Road"
          title="Step Down / Forward (↓ Key)"
          className="p-2.5 sm:p-3 bg-slate-950/85 hover:bg-slate-850 hover:border-orange-500/60 border border-slate-800 rounded-2xl text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md active:scale-95"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* ─── Active Typographic Milestone Card (NUMBER AND TITLE ONLY - Hidden at Road End) ─── */}
      <AnimatePresence>
        {!isAtRoadEnd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className="absolute inset-x-0 bottom-24 sm:bottom-28 z-20 pointer-events-none flex justify-center px-4 sm:px-6"
          >
            <div
              style={{
                opacity: milestoneProximity,
                transform: `scale(${0.92 + milestoneProximity * 0.08})`,
                transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
              }}
              className="pointer-events-auto w-full max-w-lg bg-slate-950/92 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/90 transition-all duration-300 relative overflow-hidden"
            >
              {/* 1. Dynamic Border Flare when Milestone Changes */}
              <motion.div
                key={`border-glow-${activeMilestone.id}`}
                initial={{ opacity: 0.95, scale: 1.02 }}
                animate={{ opacity: 0.2, scale: 1.0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute inset-0 rounded-3xl pointer-events-none border-2"
                style={{
                  borderColor: activeMilestone.color,
                  boxShadow: `0 0 45px ${activeMilestone.color}45`,
                }}
              />

              {/* 2. Luminous Shimmer / Light Sweep Flash across Card Surface */}
              <motion.div
                key={`shimmer-${activeMilestone.id}`}
                initial={{ x: "-120%", opacity: 0.7 }}
                animate={{ x: "240%", opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />

              {/* 3. Ambient Color Blob in Background */}
              <motion.div
                key={`ambient-${activeMilestone.id}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.28, scale: 1.0 }}
                transition={{ duration: 0.5 }}
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: activeMilestone.color }}
              />

              {/* 4. Animated Content: ONLY NUMBER AND TITLE */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone.id}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)", scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -12, filter: "blur(5px)", scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex items-center justify-start sm:justify-center gap-3.5 sm:gap-5"
                >
                  {/* Milestone Number Badge */}
                  <motion.div
                    key={`num-badge-${activeMilestone.id}`}
                    initial={{ scale: 0.45, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl font-mono text-xl sm:text-2xl font-black text-white shadow-xl border"
                    style={{
                      backgroundColor: `${activeMilestone.accentHex}40`,
                      borderColor: activeMilestone.color,
                      boxShadow: `0 0 25px ${activeMilestone.color}35`,
                    }}
                  >
                    {activeMilestone.number}
                  </motion.div>

                  {/* Milestone Title Only */}
                  <div className="text-left min-w-0">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md truncate sm:whitespace-normal">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Road End Celebration (Centered, Open / Not in Card, Big Trophy, 7 Outcomes) ─── */}
      <AnimatePresence>
        {isAtRoadEnd && (
          <motion.div
            key="road-end-center-celebration"
            initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center text-center px-4 py-8"
          >
            <div className="pointer-events-auto flex flex-col items-center max-w-3xl">
              {/* 1. 3D Graduation Trophy Illustration (Direct Floating Image - No Card Box) */}
              <motion.div
                initial={{ scale: 0, rotate: -15, y: 20 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="relative inline-flex items-center justify-center mb-3 sm:mb-4 group cursor-pointer"
                onClick={triggerPartyPoppers}
                title="Click to Blast Poppers! 🎉"
              >
                {/* Ambient Radial Glow behind Trophy */}
                <div className="absolute inset-0 w-44 h-44 sm:w-64 sm:h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/35 to-orange-500/25 blur-3xl pointer-events-none" />

                <Image
                  src="/images/artothon/graduation-trophy.png"
                  alt="60-Day Art-O-Thon Graduation Trophy"
                  width={240}
                  height={225}
                  priority
                  className="relative z-10 w-28 h-auto sm:w-40 md:w-48 lg:w-52 object-contain drop-shadow-[0_15px_35px_rgba(249,115,22,0.45)] group-hover:scale-105 active:scale-95 transition-transform duration-300 pointer-events-auto"
                />
              </motion.div>

              {/* 2. Headline (Floating Clean Typography - Not In Card) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-md backdrop-blur-md">
                  <span className="text-base animate-bounce">🎉</span>
                  <PartyPopper size={14} className="text-orange-400 animate-bounce" />
                  <span>After this 60-Day Course,</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  You Graduate With :
                </h2>
              </motion.div>

              {/* 3. The 7 Outcomes (Floating Pill Badges - Not In Card) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl px-2"
              >
                {TRANSFORMATION_OUTCOMES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + 0.04 * idx, duration: 0.25 }}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-950/85 border ${item.border} text-xs sm:text-sm font-bold text-white shadow-xl shadow-black/80 backdrop-blur-xl hover:scale-105 hover:bg-slate-900/95 transition-all duration-200`}
                    >
                      <Icon size={16} className={`${item.color} shrink-0`} />
                      <span>{item.title}</span>
                    </motion.span>
                  );
                })}
              </motion.div>

              {/* 4. Blast Again Button with Colorful Party Popper Icon */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                type="button"
                onClick={triggerPartyPoppers}
                aria-label="Blast party poppers again"
                className="mt-6 sm:mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300"
              >
                <span className="text-base">🎉</span>
                <PartyPopper size={16} className="text-slate-950" />
                <span>Blast Poppers Again</span>
                <span className="text-base">🎉</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Navigation Bar (8 Milestone Jump Points) ─── */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 pointer-events-none flex flex-col items-center gap-2 px-3 sm:px-4">
        {/* Scroll / Key Instruction (Fades out once user begins scrolling) */}
        {scrollProgress < 0.03 && (
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs text-slate-300 shadow-xl animate-bounce">
            <ArrowDown size={13} className="text-orange-400" />
            <span>Scroll or press ↓ / ↑ keys to walk the road</span>
          </div>
        )}

        {/* Milestone Switcher Pills */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 p-1 sm:p-2 rounded-2xl shadow-2xl max-w-full overflow-x-auto no-scrollbar">
          {/* Previous Turn Button */}
          <button
            onClick={() => {
              if (activeMilestoneIndex > 0) jumpToMilestone(activeMilestoneIndex - 1);
            }}
            disabled={activeMilestoneIndex === 0}
            aria-label="Previous Turn"
            className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 transition"
          >
            <ChevronLeft size={16} />
          </button>

          {/* 8 Milestone Jump Buttons */}
          {ROAD_MILESTONES.map((ms, index) => {
            const isActive = index === activeMilestoneIndex;
            return (
              <button
                key={ms.id}
                onClick={() => jumpToMilestone(index)}
                aria-label={`Jump to Milestone ${ms.number}: ${ms.title}`}
                className={`relative px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 ${isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/30 scale-105 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <span>{ms.number}</span>
                {isActive && (
                  <span className="hidden md:inline font-sans font-semibold text-[11px] truncate max-w-[120px]">
                    {ms.title.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}

          {/* Next Turn Button */}
          <button
            onClick={() => {
              if (activeMilestoneIndex < ROAD_MILESTONES.length - 1)
                jumpToMilestone(activeMilestoneIndex + 1);
            }}
            disabled={activeMilestoneIndex === ROAD_MILESTONES.length - 1}
            aria-label="Next Turn"
            className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
