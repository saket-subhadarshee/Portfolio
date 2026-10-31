import React, { useEffect, useRef } from 'react';
import { EditionId } from '../data/portfolioData';

interface ScrollStoryCanvasProps {
  targetProgress: number;
  edition: EditionId;
  reducedMotion: boolean;
  onTelemetryUpdate?: (telemetry: {
    lerpedProgress: number;
    frameIndex: number;
    zoom: number;
  }) => void;
}

interface CompilerNode3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  label: string;
  phase: number;
}

const COMPILER_LABELS = [
  'malloc()',
  '0x7FA2',
  'AST_NODE',
  'Gemini::Agent',
  'Firebase::Auth',
  'Vercel::Edge',
  'std::vector',
  'ptr->next',
  'PSpice::DC',
  'ADS-B:1090',
  'O(n log n)',
  'SHA256',
];

const COMPILER_NODES: CompilerNode3D[] = Array.from({ length: 54 }, (_, i) => {
  // Deterministic pseudo-random distribution so it never flickers on re-render
  const seed1 = Math.sin(i * 12.9898) * 43758.5453;
  const seed2 = Math.sin(i * 78.233) * 43758.5453;
  const seed3 = Math.sin(i * 39.346) * 43758.5453;
  const rx = seed1 - Math.floor(seed1);
  const ry = seed2 - Math.floor(seed2);
  const rz = seed3 - Math.floor(seed3);

  return {
    x: (rx - 0.5) * 920,
    y: (ry - 0.5) * 640,
    z: rz * 820 + 80,
    size: (i % 4) + 2.2,
    color: i % 3 === 0 ? '#00F2FE' : i % 3 === 1 ? '#6366F1' : '#D4AF37',
    label: COMPILER_LABELS[i % COMPILER_LABELS.length],
    phase: i * 0.65,
  };
});

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function smoothstep(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const ScrollStoryCanvas: React.FC<ScrollStoryCanvasProps> = ({
  targetProgress,
  edition,
  reducedMotion,
  onTelemetryUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    progress: targetProgress,
    targetProgress: targetProgress,
    mouseX: 0,
    mouseY: 0,
    smoothMouseX: 0,
    smoothMouseY: 0,
    startTime: performance.now(),
    lastReportedFrame: -1,
  });
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    stateRef.current.targetProgress = targetProgress;
  }, [targetProgress]);

  // Preload embedded keyframe images for authentic raster texture blending
  useEffect(() => {
    let cancelled = false;
    const cache = imageCacheRef.current;
    import('../data/keyframes').then(({ CALIBRE_KEYFRAMES, SIGNAL_KEYFRAMES }) => {
      if (cancelled) return;
      Object.entries(CALIBRE_KEYFRAMES).forEach(([k, src]) => {
        const key = `calibre-${k}`;
        if (!cache.has(key)) {
          const img = new Image();
          img.src = src;
          cache.set(key, img);
        }
      });
      Object.entries(SIGNAL_KEYFRAMES).forEach(([k, src]) => {
        const key = `signal-${k}`;
        if (!cache.has(key)) {
          const img = new Image();
          img.src = src;
          cache.set(key, img);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      stateRef.current.mouseX = clamp(nx, -1, 1);
      stateRef.current.mouseY = clamp(ny, -1, 1);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const getClosestKeyframeImage = (prefix: 'calibre' | 'signal', frameIdx: number) => {
      const keys = [0, 17, 24, 45, 51, 58, 72, 79, 89];
      let best = keys[0];
      let bestDist = Math.abs(frameIdx - best);
      for (const k of keys) {
        const d = Math.abs(frameIdx - k);
        if (d < bestDist) {
          best = k;
          bestDist = d;
        }
      }
      return imageCacheRef.current.get(`${prefix}-${best}`) || null;
    };

    const renderHorologyLayer = (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      p: number,
      ambientSec: number,
      mx: number,
      my: number,
      isFusion: boolean
    ) => {
      const cx = W * 0.5;
      const cy = H * 0.5;
      const unitScale = Math.min(W / 1440, H / 900);
      const zoom = 1 + p * 1.45;

      // Lateral camera choreography: Left text (Scene 01) -> Right text (Scenes 02 & 03) -> Center (Scene 04)
      const isMobile = W < 860;
      let panX = 0;
      if (!isMobile) {
        if (p < 0.22) {
          // Scene 01 & Cover: Text is on Left -> Keep Horology Calibre clearly on Right from p=0!
          panX = lerp(1440 * 0.21, 1440 * 0.23, smoothstep(0, 0.22, p));
        } else if (p < 0.36) {
          // Transition 01T: Sweep laterally from Right (+0.23) across center to Left (-0.22)
          const t = smoothstep(0.22, 0.36, p);
          panX = lerp(1440 * 0.23, -1440 * 0.22, t);
        } else if (p < 0.84) {
          // Scenes 02 & 03: Text is on Right -> Keep Horology Calibre clearly on Left!
          panX = lerp(-1440 * 0.22, -1440 * 0.20, smoothstep(0.36, 0.84, p));
        } else {
          // Scene 04 Finale: Return to Center stage
          const t = smoothstep(0.84, 0.93, p);
          panX = lerp(-1440 * 0.20, 0, t);
        }
      }

      ctx.save();
      ctx.translate(cx + mx * 18, cy + (isMobile ? H * 0.12 : my * 14));
      ctx.scale(zoom * unitScale, zoom * unitScale);
      ctx.translate(panX, 0);

      // Continuous micro-escapement tick + scroll rotation
      const escapementTick = ambientSec * 0.45 + Math.sin(ambientSec * 4.5) * 0.03;
      const timeAngle = p * Math.PI * 8 + escapementTick;

      const goldPrimary = '#D4AF37';
      const cyanAccent = '#38BDF8';

      // Outer Precision Degree Dial (180 ticks)
      ctx.save();
      ctx.rotate(-timeAngle * 0.06);
      for (let i = 0; i < 120; i++) {
        const ang = (i / 120) * Math.PI * 2;
        const isMajor = i % 10 === 0;
        const r1 = isMajor ? 268 : 274;
        const r2 = 282;
        ctx.strokeStyle = isMajor ? 'rgba(212, 175, 55, 0.45)' : 'rgba(148, 163, 184, 0.16)';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.stroke();
      }
      ctx.restore();

      // Layer 1: Brushed Titanium Skeleton Bridges
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 242, 0, Math.PI * 2);
      ctx.stroke();

      // Inner chamfer bevel
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 235, 0, Math.PI * 2);
      ctx.stroke();

      // Skeleton Crosshair Calibre Bridges
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-242, 0);
      ctx.lineTo(242, 0);
      ctx.moveTo(0, -242);
      ctx.lineTo(0, 242);
      ctx.stroke();

      // Layer 2: Main 36-Tooth Tourbillon Cage Ring
      const ringGrad = ctx.createLinearGradient(-220, -220, 220, 220);
      ringGrad.addColorStop(0, '#FDE68A');
      ringGrad.addColorStop(0.5, goldPrimary);
      ringGrad.addColorStop(1, '#92400E');

      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(0, 0, 216, 0, Math.PI * 2);
      ctx.stroke();

      // 3-pillar Tourbillon inner geometry
      ctx.save();
      ctx.rotate(timeAngle * 0.2);
      for (let s = 0; s < 3; s++) {
        const sa = (s / 3) * Math.PI * 2;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.32)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * 44, Math.sin(sa) * 44);
        ctx.lineTo(Math.cos(sa) * 214, Math.sin(sa) * 214);
        ctx.stroke();

        // Blued-steel horological screws on cage rim
        ctx.fillStyle = cyanAccent;
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * 216, Math.sin(sa) * 216, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const teeth = 36;
      for (let i = 0; i < teeth; i++) {
        const th = (i / teeth) * Math.PI * 2;
        const x1 = Math.cos(th) * 216;
        const y1 = Math.sin(th) * 216;
        const x2 = Math.cos(th) * 232;
        const y2 = Math.sin(th) * 232;
        ctx.strokeStyle = goldPrimary;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // Layer 3: Secondary Meshing Calibre Wheel (Upper-Right)
      ctx.save();
      ctx.translate(178 - p * 38, -118 + p * 28);
      ctx.rotate(-timeAngle * 0.5);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.72)';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, 0, 108, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.stroke();

      for (let j = 0; j < 24; j++) {
        const th = (j / 24) * Math.PI * 2;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.75)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(th) * 108, Math.sin(th) * 108);
        ctx.lineTo(Math.cos(th) * 120, Math.sin(th) * 120);
        ctx.stroke();
      }
      // Secondary jewel pivot
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Layer 3B: Tertiary AI-Agent Satellite Pinion (Lower-Left, engages in Scene 02–04)
      if (p > 0.28 || isFusion) {
        const satAlpha = isFusion ? 0.85 : clamp((p - 0.28) / 0.24, 0, 1);
        ctx.save();
        ctx.translate(-162 + p * 24, 114 - p * 18);
        ctx.rotate(timeAngle * 0.68);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.75 * satAlpha})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, 84, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = 0; k < 18; k++) {
          const th = (k / 18) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(th) * 84, Math.sin(th) * 84);
          ctx.lineTo(Math.cos(th) * 95, Math.sin(th) * 95);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(56, 189, 248, ${0.9 * satAlpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Layer 4: Breathing Archimedean Balance Spring (Hairspring)
      const springBreath = 1 + Math.sin(ambientSec * 3.8) * 0.045;
      ctx.save();
      ctx.rotate(timeAngle * 0.85);
      ctx.scale(springBreath, springBreath);
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.82)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 9.5; a += 0.09) {
        const r = 5 + a * 5.4;
        const sx = Math.cos(a) * r;
        const sy = Math.sin(a) * r;
        if (a === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();

      // Layer 5: Synthetic Ruby Pivot Jewel Nucleus with Specular Glow
      const rubyGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 34);
      rubyGlow.addColorStop(0, '#FDA4AF');
      rubyGlow.addColorStop(0.28, '#E11D48');
      rubyGlow.addColorStop(0.65, '#9F1239');
      rubyGlow.addColorStop(1, 'rgba(159, 18, 57, 0)');
      ctx.fillStyle = rubyGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();

      // Gold chaton setting ring around ruby
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Layer 6: Monocrystalline Sapphire Enclosure Cylinder (Scene 04 Finale)
      if (p > 0.64) {
        const caseProgress = clamp((p - 0.64) / 0.34, 0, 1);
        ctx.strokeStyle = `rgba(212, 175, 55, ${caseProgress * 0.88})`;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(0, 0, 294, 0, Math.PI * 2);
        ctx.stroke();

        const gradGlass = ctx.createLinearGradient(-300, -300, 300, 300);
        gradGlass.addColorStop(0, `rgba(255, 255, 255, ${0.15 * caseProgress})`);
        gradGlass.addColorStop(0.45, 'transparent');
        gradGlass.addColorStop(0.65, 'transparent');
        gradGlass.addColorStop(1, `rgba(56, 189, 248, ${0.16 * caseProgress})`);
        ctx.fillStyle = gradGlass;
        ctx.beginPath();
        ctx.arc(0, 0, 294, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const renderSignalCoreLayer = (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      p: number,
      f: number,
      ambientSec: number,
      mx: number,
      my: number,
      isFusion: boolean
    ) => {
      const sx = W / 1280;
      const sy = H / 720;
      const sc = Math.min(sx, sy);
      const isNarrow = W < 860;

      // Coordinated camera path matching left/right/center scene cards
      let coreX: number;
      let coreY: number;
      let coreR: number;

      if (p < 0.22) {
        // Scene 01 (left text -> core on right)
        const t = smoothstep(0, 0.22, p);
        coreX = lerp(935, 910, t);
        coreY = lerp(360, 345, t);
        coreR = lerp(42, 50, t);
      } else if (p < 0.34) {
        // Transition 01T (sweeps across center to left)
        const t = smoothstep(0.22, 0.34, p);
        coreX = lerp(910, 365, t);
        coreY = lerp(345, 345, t);
        coreR = lerp(50, 58, Math.sin(t * Math.PI));
      } else if (p < 0.56) {
        // Scene 02 (right text -> core on left)
        const t = smoothstep(0.34, 0.56, p);
        coreX = lerp(365, 355, t);
        coreY = lerp(345, 360, t);
        coreR = lerp(52, 46, t);
      } else if (p < 0.67) {
        // Transition 02T (neural routing)
        const t = smoothstep(0.56, 0.67, p);
        coreX = lerp(355, 350, t);
        coreY = lerp(360, 330, Math.sin(t * Math.PI));
        coreR = lerp(46, 54, Math.sin(t * Math.PI));
      } else if (p < 0.85) {
        // Scene 03 (right text -> core on left)
        const t = smoothstep(0.67, 0.85, p);
        coreX = lerp(350, 365, t);
        coreY = lerp(330, 355, t);
        coreR = lerp(52, 48, t);
      } else {
        // Scene 04 (center monolith)
        const t = smoothstep(0.85, 0.96, p);
        coreX = lerp(365, 640, t);
        coreY = lerp(355, 260, t);
        coreR = lerp(48, 54, t);
      }

      const cx =
        (isNarrow ? W * 0.5 : coreX * sx) + mx * 16;
      const cy =
        (isNarrow ? H * 0.64 : coreY * sy) + my * 12;
      const cr = coreR * sc * (isNarrow ? 0.82 : 1.0);

      // Volumetric glow around Signal Core
      if (!isFusion) {
        const radGrad = ctx.createRadialGradient(cx, cy, cr * 0.2, cx, cy, cr * 5.2);
        radGrad.addColorStop(0, 'rgba(56, 189, 248, 0.30)');
        radGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.12)');
        radGrad.addColorStop(1, 'rgba(5, 7, 11, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, cr * 5.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scene 01: Telemetry Rings & Perspective Grid
      const s1Vis = 1.0 - smoothstep(0.18, 0.28, p);
      if (s1Vis > 0.01) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 * s1Vis})`;
        ctx.lineWidth = 1.2;
        for (let gi = -5; gi <= 5; gi++) {
          ctx.beginPath();
          ctx.moveTo(cx + gi * 36 * sc, cy + 72 * sc);
          ctx.lineTo(cx + gi * 92 * sc, H - 16);
          ctx.stroke();
        }
        [92, 146, 204].forEach((rad, ri) => {
          const rScaled = rad * sc;
          const startAng = ambientSec * (0.8 - ri * 0.25) + ri * 1.1 + p * 4;
          ctx.strokeStyle =
            ri === 1
              ? `rgba(212, 175, 55, ${0.48 * s1Vis})`
              : `rgba(56, 189, 248, ${(0.55 - ri * 0.12) * s1Vis})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, rScaled, startAng, startAng + Math.PI * 1.35);
          ctx.stroke();
        });
      }

      // Transition 01T: Packet Stream in Flight
      const t1Vis = smoothstep(0.18, 0.24, p) * (1.0 - smoothstep(0.32, 0.37, p));
      if (t1Vis > 0.01) {
        for (let pIdx = 0; pIdx < 10; pIdx++) {
          const ang = pIdx * ((Math.PI * 2) / 10) + ambientSec * 2.2 + p * 12;
          const orbitD = (65 + (pIdx % 3) * 45) * sc;
          const px = cx + Math.cos(ang) * orbitD * 1.35;
          const py = cy + Math.sin(ang) * orbitD * 0.8;
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 * t1Vis})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();

          ctx.fillStyle =
            pIdx % 2
              ? `rgba(245, 158, 11, ${0.92 * t1Vis})`
              : `rgba(56, 189, 248, ${0.92 * t1Vis})`;
          ctx.beginPath();
          ctx.moveTo(px, py - 7 * sc);
          ctx.lineTo(px + 7 * sc, py);
          ctx.lineTo(px, py + 7 * sc);
          ctx.lineTo(px - 7 * sc, py);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Scene 02: Isometric Campus Marketplace Architecture Graph
      const s2Vis = smoothstep(0.31, 0.37, p) * (1.0 - smoothstep(0.54, 0.60, p));
      if (s2Vis > 0.01) {
        const isoW = 235 * sc;
        const isoH = 148 * sc;

        ctx.fillStyle = `rgba(11, 17, 30, ${0.65 * s2Vis})`;
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.52 * s2Vis})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy - isoH);
        ctx.lineTo(cx + isoW, cy);
        ctx.lineTo(cx, cy + isoH);
        ctx.lineTo(cx - isoW, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const archNodes = [
          { nx: cx - 162 * sc, ny: cy - 84 * sc, col: '56, 189, 248', label: 'CLIENT UI' },
          { nx: cx + 162 * sc, ny: cy - 84 * sc, col: '16, 185, 129', label: 'VERCEL EDGE' },
          { nx: cx - 162 * sc, ny: cy + 88 * sc, col: '245, 158, 11', label: 'FIREBASE DB' },
          { nx: cx + 162 * sc, ny: cy + 88 * sc, col: '168, 85, 247', label: 'GITHUB SEC' },
        ];

        archNodes.forEach((nd, idx) => {
          ctx.strokeStyle = `rgba(${nd.col}, ${0.78 * s2Vis})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nd.nx, nd.ny);
          ctx.stroke();

          // Continuous animated data packet pulsing along bus even during still hold
          const pulseT = (ambientSec * 0.85 + idx * 0.25) % 1.0;
          const px = lerp(cx, nd.nx, pulseT);
          const py = lerp(cy, nd.ny, pulseT);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * s2Vis})`;
          ctx.beginPath();
          ctx.arc(px, py, 4.2 * sc, 0, Math.PI * 2);
          ctx.fill();

          const bw = 44 * sc;
          const bh = 24 * sc;
          ctx.fillStyle = `rgba(11, 16, 28, ${0.92 * s2Vis})`;
          ctx.strokeStyle = `rgba(${nd.col}, ${0.95 * s2Vis})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(nd.nx, nd.ny - bh);
          ctx.lineTo(nd.nx + bw, nd.ny);
          ctx.lineTo(nd.nx, nd.ny + bh);
          ctx.lineTo(nd.nx - bw, nd.ny);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `rgba(248, 250, 252, ${0.92 * s2Vis})`;
          ctx.font = `600 ${Math.max(9, Math.round(10 * sc))}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(nd.label, nd.nx, nd.ny + bh + 14 * sc);
        });
      }

      // Transition 02T: Neural Routing Filaments
      const t2Vis = smoothstep(0.54, 0.59, p) * (1.0 - smoothstep(0.66, 0.71, p));
      if (t2Vis > 0.01) {
        for (let si = 0; si < 12; si++) {
          const ang = (si / 12) * Math.PI * 2 + ambientSec * 0.9 + f * 0.05;
          const x0 = cx + Math.cos(ang) * 56 * sc;
          const y0 = cy + Math.sin(ang) * 56 * sc;
          const x1 = cx + Math.cos(ang + 0.32) * 218 * sc;
          const y1 = cy + Math.sin(ang + 0.32) * 218 * sc;
          ctx.strokeStyle =
            si % 3 === 0
              ? `rgba(212, 175, 55, ${0.82 * t2Vis})`
              : `rgba(56, 189, 248, ${0.82 * t2Vis})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }

      // Scene 03: 5-Satellite AI Agents & Multidisciplinary Constellation
      const s3Vis = smoothstep(0.65, 0.71, p) * (1.0 - smoothstep(0.84, 0.89, p));
      if (s3Vis > 0.01) {
        [0, 1, 2].forEach((ei) => {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.32 * s3Vis})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 198 * sc, (108 + ei * 18) * sc, 0, 0, Math.PI * 2);
          ctx.stroke();
        });
        const satNodes = [
          { col: '56, 189, 248', name: 'GEMINI API' },
          { col: '212, 175, 55', name: 'KAGGLE 5D' },
          { col: '16, 185, 129', name: 'NANO-BIOTECH' },
          { col: '168, 85, 247', name: 'CLUEMINATI' },
          { col: '244, 63, 94', name: 'ORCAD 17.2' },
        ];
        satNodes.forEach((sat, si) => {
          const sang = si * ((Math.PI * 2) / 5) + ambientSec * 0.48 + f * 0.03;
          const satX = cx + Math.cos(sang) * 184 * sc;
          const satY = cy + Math.sin(sang) * 120 * sc;
          ctx.strokeStyle = `rgba(${sat.col}, ${0.65 * s3Vis})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(satX, satY);
          ctx.stroke();

          ctx.fillStyle = `rgba(9, 13, 24, ${0.95 * s3Vis})`;
          ctx.strokeStyle = `rgba(${sat.col}, ${0.95 * s3Vis})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(satX, satY, 14 * sc, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `rgba(248, 250, 252, ${0.9 * s3Vis})`;
          ctx.font = `600 ${Math.max(8, Math.round(9.5 * sc))}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(sat.name, satX, satY - 20 * sc);
        });
      }

      // Scene 04: Horizon Beacon & <SS/> Hexagonal Lock
      const s4Vis = smoothstep(0.83, 0.90, p);
      if (s4Vis > 0.01) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.82 * s4Vis})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 200 * sc, 320 * sc, 130 * sc, 0, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();

        ctx.strokeStyle = `rgba(56, 189, 248, ${0.95 * s4Vis})`;
        ctx.lineWidth = 4.5 * sc;
        ctx.beginPath();
        ctx.moveTo(cx - 60 * sc, cy - 52 * sc);
        ctx.lineTo(cx - 90 * sc, cy);
        ctx.lineTo(cx - 60 * sc, cy + 52 * sc);
        ctx.stroke();

        ctx.strokeStyle = `rgba(212, 175, 55, ${0.95 * s4Vis})`;
        ctx.beginPath();
        ctx.moveTo(cx + 60 * sc, cy - 52 * sc);
        ctx.lineTo(cx + 90 * sc, cy);
        ctx.lineTo(cx + 60 * sc, cy + 52 * sc);
        ctx.stroke();
      }

      // Central Hexagonal Signal Core Subject
      if (!isFusion) {
        const rot = f * 0.06 + ambientSec * 0.55;
        ctx.fillStyle = 'rgba(11, 17, 30, 0.94)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ang = rot + k * (Math.PI / 3);
          const vx = cx + Math.cos(ang) * cr;
          const vy = cy + Math.sin(ang) * cr;
          if (k === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.92)';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const ang = -rot * 1.25 + k * (Math.PI / 2);
          const vx = cx + Math.cos(ang) * (cr * 0.56);
          const vy = cy + Math.sin(ang) * (cr * 0.56);
          if (k === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(3, 5.5 * sc), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const renderCompiler3DLayer = (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      p: number,
      ambientSec: number,
      mx: number,
      my: number,
      isBackgroundOnly: boolean
    ) => {
      const cx = W * 0.5;
      const cy = H * 0.5;

      let lateralPan = 0;
      if (W >= 860 && !isBackgroundOnly) {
        if (p < 0.22) {
          lateralPan = W * 0.18;
        } else if (p < 0.36) {
          lateralPan = lerp(W * 0.18, -W * 0.18, smoothstep(0.22, 0.36, p));
        } else if (p < 0.82) {
          lateralPan = -W * 0.18;
        } else {
          lateralPan = lerp(-W * 0.18, 0, smoothstep(0.82, 0.92, p));
        }
      }

      ctx.save();
      ctx.translate(cx + lateralPan + mx * 22, cy + my * 16);

      const cameraZ = p * 560;
      const rotAngle = p * Math.PI * 1.55 + ambientSec * 0.18;

      // Background Cyber Matrix Grid
      ctx.strokeStyle = isBackgroundOnly
        ? 'rgba(56, 189, 248, 0.025)'
        : 'rgba(0, 242, 254, 0.045)';
      ctx.lineWidth = 1;
      const gridR = 420 + p * 180;
      ctx.beginPath();
      for (let g = -gridR; g <= gridR; g += 80) {
        ctx.moveTo(g, -gridR);
        ctx.lineTo(g, gridR);
        ctx.moveTo(-gridR, g);
        ctx.lineTo(gridR, g);
      }
      ctx.stroke();

      // Project 3D Compiler Nodes
      const projected: {
        sx: number;
        sy: number;
        rz: number;
        size: number;
        color: string;
        label: string;
      }[] = [];

      COMPILER_NODES.forEach((node) => {
        const floatY = node.y + Math.sin(ambientSec * 1.4 + node.phase) * 10;
        const rx = node.x * Math.cos(rotAngle) - node.z * Math.sin(rotAngle);
        let rz = node.x * Math.sin(rotAngle) + node.z * Math.cos(rotAngle) - cameraZ + 420;
        // Wrap Z so camera never runs out of nodes
        while (rz < 40) rz += 820;
        while (rz > 860) rz -= 820;

        const fov = 460 / rz;
        const sx = rx * fov;
        const sy = floatY * fov;
        projected.push({
          sx,
          sy,
          rz,
          size: node.size * fov,
          color: node.color,
          label: node.label,
        });
      });

      // Interconnecting AST & Pointer Edges
      const maxDist = isBackgroundOnly ? 120 : 155;
      ctx.lineWidth = 1.15;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const d = Math.hypot(
            projected[i].sx - projected[j].sx,
            projected[i].sy - projected[j].sy
          );
          if (d < maxDist) {
            const alpha =
              (1 - d / maxDist) * (isBackgroundOnly ? 0.16 : 0.38);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.stroke();
          }
        }
      }

      // Draw Node Spheres & Near-Camera Telemetry Labels
      projected.forEach((pt, idx) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = isBackgroundOnly ? 0.45 : 0.92;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, Math.max(1.2, pt.size), 0, Math.PI * 2);
        ctx.fill();

        if (!isBackgroundOnly && pt.rz < 260 && idx % 4 === 0) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.72)';
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillText(pt.label, pt.sx + pt.size + 5, pt.sy + 3);
        }
      });
      ctx.globalAlpha = 1;

      // Holographic Deployment Rings in Scene 03 / 04
      if (!isBackgroundOnly && p > 0.62) {
        const ringProg = clamp((p - 0.62) / 0.35, 0, 1);
        ctx.strokeStyle = `rgba(0, 242, 254, ${ringProg * 0.75})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 165 + ringProg * 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.rotate(-ambientSec * 0.4);
        ctx.strokeStyle = `rgba(99, 102, 241, ${ringProg * 0.6})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, 198 + ringProg * 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      if (canvas && !reducedMotion) {
        const st = stateRef.current;
        // Smooth kinetic lerp for scroll progress & mouse parallax
        st.progress += (st.targetProgress - st.progress) * 0.11;
        st.smoothMouseX += (st.mouseX - st.smoothMouseX) * 0.08;
        st.smoothMouseY += (st.mouseY - st.smoothMouseY) * 0.08;

        const p = clamp(st.progress, 0, 1);
        const frameIdx = Math.min(89, Math.max(0, Math.round(p * 89)));
        const zoom = 1 + p * 1.6;

        if (onTelemetryUpdate && Math.abs(frameIdx - st.lastReportedFrame) >= 1) {
          st.lastReportedFrame = frameIdx;
          onTelemetryUpdate({
            lerpedProgress: p,
            frameIndex: frameIdx,
            zoom,
          });
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const targetW = Math.round(rect.width * dpr);
          const targetH = Math.round(rect.height * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const W = rect.width;
            const H = rect.height;
            const ambientSec = (now - st.startTime) * 0.001;

            // 1. Deep Obsidian Studio Backdrop
            const bgGrad = ctx.createRadialGradient(
              W * 0.5,
              H * 0.5,
              40,
              W * 0.5,
              H * 0.5,
              Math.max(W, H) * 0.75
            );
            bgGrad.addColorStop(0, '#0d121f');
            bgGrad.addColorStop(0.55, '#070910');
            bgGrad.addColorStop(1, '#040508');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            // 2. Subtle Authentic Embedded WebP Keyframe Backdrop Blend
            const kfSource = edition === 'signal' ? 'signal' : 'calibre';
            const kfImg = getClosestKeyframeImage(kfSource, frameIdx);
            if (kfImg && kfImg.complete && kfImg.naturalWidth > 0) {
              ctx.save();
              ctx.globalAlpha = edition === 'compiler' ? 0.08 : 0.19;
              ctx.drawImage(kfImg, 0, 0, W, H);
              ctx.restore();
            }

            // 3. Render Selected Portfolio Engine(s)
            if (edition === 'calibre') {
              renderHorologyLayer(
                ctx,
                W,
                H,
                p,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                false
              );
            } else if (edition === 'signal') {
              renderSignalCoreLayer(
                ctx,
                W,
                H,
                p,
                frameIdx,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                false
              );
            } else if (edition === 'compiler') {
              renderCompiler3DLayer(
                ctx,
                W,
                H,
                p,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                false
              );
            } else {
              // GRAND FUSION: All 3 engines harmonized
              renderCompiler3DLayer(
                ctx,
                W,
                H,
                p,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                true
              );
              renderHorologyLayer(
                ctx,
                W,
                H,
                p,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                true
              );
              renderSignalCoreLayer(
                ctx,
                W,
                H,
                p,
                frameIdx,
                ambientSec,
                st.smoothMouseX,
                st.smoothMouseY,
                true
              );
            }

            ctx.restore();
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [edition, reducedMotion, onTelemetryUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
};
