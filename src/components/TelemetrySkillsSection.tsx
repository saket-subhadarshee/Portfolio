import React from 'react';
import { EditionTheme, PortfolioContent } from '../data/portfolioData';

interface TelemetrySkillsSectionProps {
  theme: EditionTheme;
  skillsData: PortfolioContent['skillsSection'];
}

export const TelemetrySkillsSection: React.FC<TelemetrySkillsSectionProps> = ({
  theme,
  skillsData,
}) => {
  // Compute 5-axis SVG Radar coordinates from the 5 technical ratings
  const cx = 140;
  const cy = 135;
  const maxR = 90;

  const radarAxes = [
    { label: 'HTML/Tailwind', techScore: 8, commScore: 8 },
    { label: 'Python & DSA', techScore: 8, commScore: 7 },
    { label: 'React & Firebase', techScore: 7, commScore: 8 },
    { label: 'Git & Vercel CI', techScore: 7, commScore: 8 },
    { label: 'Gemini & Claude', techScore: 9, commScore: 8 },
  ];

  const getPoint = (idx: number, ratio: number) => {
    const angle = -Math.PI / 2 + (idx * (Math.PI * 2)) / radarAxes.length;
    const r = maxR * ratio;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  };

  const techPolygon = radarAxes
    .map((a, idx) => {
      const pt = getPoint(idx, a.techScore / 10);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  const commPolygon = radarAxes
    .map((a, idx) => {
      const pt = getPoint(idx, a.commScore / 10);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <section id="skills" className="space-y-8 scroll-mt-24">
      {/* Section 02 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-start gap-4">
          <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
            02
          </div>
          <div>
            <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
              SECTION 02 // SELF-ASSESSED COMPETENCY MATRIX
            </div>
            <h2 className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}>
              Skills &amp; Technical Tooling
            </h2>
          </div>
        </div>
        <div className="text-xs font-mono-code text-[#94A3B8] italic">
          {skillsData.selfAssessedNote}
        </div>
      </div>

      {/* Technical (Gold Bars) & Communication/Soft Skills (Cyan Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1: Technical Skills (Gold Progress Bars) */}
        <div className="lg:col-span-4 spotlight-card rounded-2xl p-6 space-y-5 border-[#D4AF37]/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#D4AF37]">
                  TECHNICAL ENGINEERING
                </span>
                <h3 className="font-cinzel font-bold text-lg text-[#F8FAFC] mt-0.5">
                  Technical (Rated out of 10)
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-mono-code text-xs font-bold text-[#D4AF37]">
                GOLD BARS
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {skillsData.technical.map((item) => {
                const pct = (item.score / item.max) * 100;
                return (
                  <div key={item.name} className="space-y-1.5 group">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-[#F8FAFC] font-medium group-hover:text-[#D4AF37] transition">
                        {item.name}
                      </span>
                      <span className="font-mono-code font-bold text-[#D4AF37] shrink-0">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#07080B] border border-white/10 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#92400E] via-[#D4AF37] to-[#FDE68A] shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code text-[#94A3B8]">
            <span>PEAK PROFICIENCY</span>
            <span className="text-[#D4AF37] font-semibold">Gemini API &amp; Claude Code (9/10)</span>
          </div>
        </div>

        {/* Column 2: Communication and Soft Skills (Cyan Progress Bars) */}
        <div className="lg:col-span-4 spotlight-card rounded-2xl p-6 space-y-5 border-[#38BDF8]/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#38BDF8]">
                  BAENG101 &amp; TEAM LEADERSHIP
                </span>
                <h3 className="font-cinzel font-bold text-lg text-[#F8FAFC] mt-0.5">
                  Communication &amp; Soft Skills
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/40 font-mono-code text-xs font-bold text-[#38BDF8]">
                CYAN BARS
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {skillsData.communication.map((item) => {
                const pct = (item.score / item.max) * 100;
                return (
                  <div key={item.name} className="space-y-1.5 group">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-[#F8FAFC] font-medium group-hover:text-[#38BDF8] transition">
                        {item.name}
                      </span>
                      <span className="font-mono-code font-bold text-[#38BDF8] shrink-0">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#07080B] border border-white/10 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code text-[#94A3B8]">
            <span>RHETORICAL MODEL</span>
            <span className="text-[#38BDF8] font-semibold">Ken Hyland&apos;s 5-Move (8/10)</span>
          </div>
        </div>

        {/* Column 3: Dual-Layer SVG Competency Overlay Radar */}
        <div className="lg:col-span-4 spotlight-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400">
                TELEMETRY HARMONICS
              </span>
              <h3 className="font-cinzel font-bold text-lg text-[#F8FAFC] mt-0.5">
                Dual-Layer Competency Radar
              </h3>
            </div>
            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">
              SCALE: /10
            </span>
          </div>

          <div className="flex items-center justify-center py-1">
            <svg
              viewBox="0 0 280 270"
              className="w-full max-w-[270px] h-auto overflow-visible select-none"
              role="img"
              aria-label="Technical vs Communication Dual-Layer Radar"
            >
              {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
                <polygon
                  key={ratio}
                  points={radarAxes
                    .map((_, idx) => {
                      const pt = getPoint(idx, ratio);
                      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.16)"
                  strokeWidth="1"
                  strokeDasharray={ratio === 1 ? undefined : '3 3'}
                />
              ))}

              {radarAxes.map((a, idx) => {
                const end = getPoint(idx, 1.0);
                return (
                  <line
                    key={a.label}
                    x1={cx}
                    y1={cy}
                    x2={end.x}
                    y2={end.y}
                    stroke="rgba(148, 163, 184, 0.22)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Communication Cyan Polygon */}
              <polygon
                points={commPolygon}
                fill="rgba(56, 189, 248, 0.16)"
                stroke="#38BDF8"
                strokeWidth="2"
              />

              {/* Technical Gold Polygon */}
              <polygon
                points={techPolygon}
                fill="rgba(212, 175, 55, 0.22)"
                stroke="#D4AF37"
                strokeWidth="2.2"
              />

              {radarAxes.map((a, idx) => {
                const ptTech = getPoint(idx, a.techScore / 10);
                const lblPt = getPoint(idx, 1.22);
                return (
                  <g key={a.label}>
                    <circle
                      cx={ptTech.x}
                      cy={ptTech.y}
                      r="4.5"
                      fill="#D4AF37"
                      stroke="#07080B"
                      strokeWidth="1.5"
                    />
                    <text
                      x={lblPt.x}
                      y={lblPt.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono-code text-[9px] fill-slate-200 font-semibold"
                    >
                      {a.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-code pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" /> Technical (Gold)
            </span>
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" /> Communication (Cyan)
            </span>
          </div>
        </div>
      </div>

      {/* Tools I Use & Other Note */}
      <div className="spotlight-card rounded-2xl p-6 sm:p-7 space-y-5 border-white/10">
        <div className="space-y-3">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#D4AF37]">
            TOOLS I USE (14 CORE ENVIRONMENTS &amp; PLATFORMS)
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsData.tools.map((tool) => (
              <span
                key={tool}
                className="px-3.5 py-1.5 rounded-xl bg-[#07080B] border border-[#D4AF37]/35 hover:border-[#38BDF8] text-xs font-mono-code text-[#F8FAFC] shadow-sm transition"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-300">
            <strong className="font-mono-code text-[#38BDF8] uppercase mr-2">Other:</strong>
            {skillsData.otherNote}
          </div>
          <span className="font-mono-code text-[#94A3B8] italic shrink-0">
            *{skillsData.selfAssessedNote}
          </span>
        </div>
      </div>
    </section>
  );
};
