import React, { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_PORTFOLIO_CONTENT,
  EDITION_THEMES,
  EditionId,
  PortfolioContent,
  ProjectItem,
  StoryScene,
} from './data/portfolioData';
import { ScrollStoryCanvas } from './components/ScrollStoryCanvas';
import { InteractiveSystemsLab } from './components/InteractiveSystemsLab';
import { TelemetrySkillsSection } from './components/TelemetrySkillsSection';
import { VercelDeployModal } from './components/VercelDeployModal';
import {
  AppendixCertificatesSection,
  QrCodeCardRow,
  QrMatrixSvg,
} from './components/AppendixCertificatesAndQr';

const STORAGE_KEY = 'saket_baeng101_portfolio_v15';

const CONTENTS_NAV = [
  { code: '01', label: '01 About Me', href: '#about-me' },
  { code: '02', label: '02 Skills', href: '#skills' },
  { code: '03', label: '03 Best Academic Work', href: '#academic-work' },
  { code: '04', label: '04 Projects & Activities', href: '#projects' },
  { code: '05', label: '05 Certificates & Participation', href: '#certificates' },
  { code: '06', label: '06 Reflection', href: '#reflection' },
  { code: '07', label: '07 Conclusion & Contact', href: '#conclusion-contact' },
  { code: 'A', label: 'A Appendix: Certificate Copies', href: '#appendix-certificates' },
];

export default function App() {
  const [content, setContent] = useState<PortfolioContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.courseMeta && parsed.aboutMe && Array.isArray(parsed.projects)) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PORTFOLIO_CONTENT;
  });

  const [edition, setEdition] = useState<EditionId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const eng = params.get('engine');
      if (eng === 'calibre' || eng === 'signal' || eng === 'compiler' || eng === 'fusion') {
        return eng;
      }
    }
    return 'fusion';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [vercelModalOpen, setVercelModalOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);

  // Scroll-story progress (0..1 across the 520vh pinned runway)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [telemetry, setTelemetry] = useState({
    lerpedProgress: 0,
    frameIndex: 0,
    zoom: 1.0,
  });

  // Projects modal state
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [mdpPdfEmbedOpen, setMdpPdfEmbedOpen] = useState<boolean>(false);
  const [activeAcademicEmbedId, setActiveAcademicEmbedId] = useState<string | null>(null);

  // CMS Drawer state
  const [cmsOpen, setCmsOpen] = useState<boolean>(false);
  const [cmsDraft, setCmsDraft] = useState({
    name: content.profile.name,
    regNo: content.courseMeta.registerNumber,
    faculty: content.courseMeta.faculty,
    semester: content.courseMeta.semester,
    aboutHeadline: content.aboutMe.headline,
    aboutP1: content.aboutMe.paragraph1,
    aboutP2: content.aboutMe.paragraph2,
  });

  // Contact composer state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTopic, setContactTopic] = useState(
    'BAENG101 Portfolio Feedback / Academic Inquiry'
  );
  const [contactMessage, setContactMessage] = useState('');
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const theme = EDITION_THEMES[edition];

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Sync URL query params (?engine=...&project=...) for deep-linking on Vercel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const projParam = params.get('project');
    if (projParam && !activeProjectModal) {
      const found = content.projects.find((p) => p.id === projParam);
      if (found) setActiveProjectModal(found);
    }
  }, []);

  const handleEditionChange = useCallback((nextEd: EditionId) => {
    setEdition(nextEd);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('engine', nextEd);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Global Cmd+K / Ctrl+K shortcut for Command Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Pointer spotlight tracking for `.spotlight-card` elements
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientY >= rect.top - 120 &&
          e.clientY <= rect.bottom + 120 &&
          e.clientX >= rect.left - 120 &&
          e.clientX <= rect.right + 120
        ) {
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
      });
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  // Scroll progress calculation for the 520vh pinned scroll-story stage
  useEffect(() => {
    const handleScroll = () => {
      if (reducedMotion) return;
      const track = document.getElementById('scroll-story-track');
      const stage = document.getElementById('scroll-stage');
      if (!track || !stage) return;
      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const raw = -rect.top / scrollable;
      if (raw <= 1) {
        setScrollProgress(Math.max(0, raw));
      } else {
        // Continue gentle kinetic scroll-driven rotation while reading Sections 01–07 below the track
        const extraPixels = -rect.top - scrollable;
        const wave = 0.52 + 0.38 * Math.sin(extraPixels * 0.00085);
        setScrollProgress(wave);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [reducedMotion]);

  const activeScene: StoryScene = React.useMemo(() => {
    const p = scrollProgress;
    if (p < 0.22) return content.scenes[0];
    if (p < 0.34) return content.scenes[1];
    if (p < 0.56) return content.scenes[2];
    if (p < 0.67) return content.scenes[3];
    if (p < 0.85) return content.scenes[4];
    return content.scenes[5];
  }, [scrollProgress, content.scenes]);

  const activeHudIndex = React.useMemo(() => {
    if (activeScene.id === '01' || activeScene.id === '01T') return 0;
    if (activeScene.id === '02' || activeScene.id === '02T') return 1;
    if (activeScene.id === '03') return 2;
    return 3;
  }, [activeScene.id]);

  const pacingModeLabel = React.useMemo(() => {
    const p = scrollProgress;
    if (activeScene.type === 'transition') return 'ISOLATED TRANSITION';
    if (
      (p >= 0.14 && p < 0.22) ||
      (p >= 0.46 && p < 0.56) ||
      (p >= 0.76 && p < 0.85) ||
      p >= 0.93
    ) {
      return `HOLD · FRAME ${String(activeScene.holdFrame ?? 17).padStart(2, '0')}`;
    }
    return 'LERP 60FPS · MOTION';
  }, [scrollProgress, activeScene]);

  const jumpToScrollRatio = (ratio: number) => {
    setReducedMotion(false);
    requestAnimationFrame(() => {
      const track = document.getElementById('scroll-story-track');
      const stage = document.getElementById('scroll-stage');
      if (track && stage) {
        const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
        const targetY = track.offsetTop + travel * ratio;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  };

  const handleSceneCta = (cta?: { label: string; target?: string; url?: string; action?: string }) => {
    if (!cta) return;
    if (cta.action?.startsWith('openProject:')) {
      const pid = cta.action.split(':')[1];
      const found = content.projects.find((p) => p.id === pid);
      if (found) setActiveProjectModal(found);
      return;
    }
    if (cta.url) {
      window.open(cta.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (cta.target) {
      const el = document.querySelector(cta.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(`Copied: ${label}`))
        .catch(() => showToast(`Ready: ${label}`));
    } else {
      showToast(`Copied: ${label}`);
    }
  };

  const openCmsDrawer = () => {
    setCmsDraft({
      name: content.profile.name,
      regNo: content.courseMeta.registerNumber,
      faculty: content.courseMeta.faculty,
      semester: content.courseMeta.semester,
      aboutHeadline: content.aboutMe.headline,
      aboutP1: content.aboutMe.paragraph1,
      aboutP2: content.aboutMe.paragraph2,
    });
    setCmsOpen(true);
  };

  const saveCmsChanges = () => {
    const next: PortfolioContent = structuredClone(content);
    next.profile.name = cmsDraft.name.trim() || next.profile.name;
    next.courseMeta.registerNumber = cmsDraft.regNo.trim() || next.courseMeta.registerNumber;
    next.profile.regNo = next.courseMeta.registerNumber;
    next.courseMeta.faculty = cmsDraft.faculty.trim() || next.courseMeta.faculty;
    next.courseMeta.semester = cmsDraft.semester.trim() || next.courseMeta.semester;
    next.aboutMe.headline = cmsDraft.aboutHeadline.trim() || next.aboutMe.headline;
    next.aboutMe.paragraph1 = cmsDraft.aboutP1.trim() || next.aboutMe.paragraph1;
    next.aboutMe.paragraph2 = cmsDraft.aboutP2.trim() || next.aboutMe.paragraph2;
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setCmsOpen(false);
    showToast('Saved portfolio changes to local storage');
  };

  const resetCmsDefaults = () => {
    setContent(DEFAULT_PORTFOLIO_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setCmsOpen(false);
    showToast('Restored default BAENG101 portfolio content');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sender = contactName.trim() || 'Reader / Evaluator';
    const email = contactEmail.trim() || 'not-provided';
    const msg =
      contactMessage.trim() || 'Reviewing your BAENG101 Academic & Professional Portfolio.';
    const subject = `[BAENG101 Portfolio] ${contactTopic} — from ${sender}`;
    const body = `To: ${content.profile.name} (${content.conclusion.vitEmail})\nCC: ${content.conclusion.personalEmail}\nFrom: ${sender} <${email}>\nTopic: ${contactTopic}\n\n${msg}`;
    setEmailPreview({ subject, body });
    showToast('Prepared formatted email payload below');
  };

  return (
    <div
      className="min-h-screen bg-[#07080B] text-[#F8FAFC] selection:bg-[#D4AF37]/30 selection:text-amber-100 relative"
      style={
        {
          '--card-accent': theme.primaryHex,
          '--card-accent-secondary': theme.secondaryHex,
          '--card-border-hover': `${theme.primaryHex}66`,
          '--card-glow': `${theme.primaryHex}22`,
        } as React.CSSProperties
      }
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0B1933]/95 border border-[#D4AF37]/60 text-amber-200 text-xs font-mono-code shadow-2xl flex items-center gap-2.5 animate-float-slow"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOP FIXED NAVIGATION & CONTENTS BAR                                   */}
      {/* ===================================================================== */}
      <header className="fixed top-0 inset-x-0 z-40 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Circular Gold SS Emblem (<SS/> Signal Core) + Portrait Badge */}
          <a href="#top" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
            {/* Dual-Ring Circular Gold SS Emblem with Portrait & Vector Ring */}
            <div
              className="relative w-11 h-11 rounded-full flex items-center justify-center bg-[#07080B] border-2 border-[#D4AF37] group-hover:border-[#38BDF8] shadow-[0_0_18px_rgba(212,175,55,0.45)] transition overflow-visible"
              title="Saket Subhadarshee — Circular Gold SS Monogram & Portrait Emblem"
            >
              {/* Spinning dashed horology/signal ring around portrait */}
              <svg
                viewBox="0 0 48 48"
                className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] animate-[spin_18s_linear_infinite] pointer-events-none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  opacity="0.75"
                />
              </svg>
              <img
                src="/saket-photo.jpeg"
                alt="Saket Subhadarshee"
                className="w-full h-full rounded-full object-cover object-top"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#07080B] border border-[#D4AF37] font-cinzel font-extrabold text-[8px] tracking-wider text-[#D4AF37] leading-tight shadow">
                SS
              </span>
            </div>
            <div>
              <div className="font-cinzel font-bold text-sm text-[#F8FAFC] leading-none">
                {content.profile.name}
              </div>
              <div className="font-mono-code text-[10px] text-[#D4AF37] mt-1">
                {content.courseMeta.registerNumber} · BAENG101 · VIT VELLORE
              </div>
            </div>
          </a>

          {/* Desktop Contents Navigation (01–07 + A) */}
          <nav
            aria-label="Portfolio Contents Navigation"
            className="hidden xl:flex items-center gap-3 text-[11px] font-mono-code text-[#94A3B8]"
          >
            {CONTENTS_NAV.map((item) => (
              <a
                key={item.code}
                href={item.href}
                className="hover:text-[#D4AF37] transition whitespace-nowrap"
              >
                <span className="text-[#D4AF37] font-semibold">{item.code}</span>{' '}
                {item.label.replace(/^[0-9A]+\s+/, '')}
              </a>
            ))}
          </nav>

          {/* Engine Switcher & Web App Controls */}
          <div className="flex items-center gap-2">
            <div
              className="hidden md:flex items-center bg-[#07080B]/90 p-1 rounded-xl border border-white/10"
              role="group"
              aria-label="Visual Engine Switcher"
            >
              {(['fusion', 'calibre', 'signal', 'compiler'] as EditionId[]).map((edKey) => {
                const ed = EDITION_THEMES[edKey];
                const isSelected = edition === edKey;
                return (
                  <button
                    key={edKey}
                    type="button"
                    onClick={() => {
                      handleEditionChange(edKey);
                      showToast(`Engine: ${ed.name}`);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-code transition ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#07080B] font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                    title={ed.description}
                  >
                    {edKey === 'fusion'
                      ? '★ Fusion'
                      : edKey === 'calibre'
                      ? 'Calibre'
                      : edKey === 'signal'
                      ? 'Signal'
                      : '3D AST'}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCmdPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B1933]/80 hover:bg-[#0B1933] border border-white/15 text-[11px] font-mono-code text-slate-200 transition"
              title="Open Quick Command Palette (Ctrl+K / Cmd+K)"
            >
              <span>⌘K</span>
            </button>

            <button
              type="button"
              onClick={() => setVercelModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] text-[#07080B] hover:bg-slate-200 font-mono-code text-[11px] font-semibold transition flex items-center gap-1 shadow"
              title="Open Vercel Deployment Studio"
            >
              <span>▲</span>
              <span className="hidden sm:inline">Vercel</span>
            </button>

            <button
              type="button"
              onClick={openCmsDrawer}
              className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono-code font-medium transition"
            >
              CMS
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Contents Menu"
              className="xl:hidden p-2 rounded-lg bg-[#0B1933] border border-white/15 text-slate-200 text-xs font-mono-code"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Contents Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#07080B]/98 px-4 py-4 space-y-3 text-xs font-mono-code">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTENTS_NAV.map((item) => (
                <a
                  key={item.code}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-[#0B1933]/70 border border-white/10 text-[#F8FAFC] hover:border-[#D4AF37]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div id="top" className="pt-16" />

      {/* ===================================================================== */}
      {/* PERSISTENT FIXED 60FPS CANVAS LAYER (VISIBLE ACROSS ENTIRE WEBSITE)   */}
      {/* ===================================================================== */}
      <div
        className="fixed inset-x-0 top-16 bottom-0 z-0 overflow-hidden bg-[#07080B] pointer-events-none"
        aria-hidden="true"
      >
        <ScrollStoryCanvas
          targetProgress={scrollProgress}
          edition={edition}
          reducedMotion={reducedMotion}
          onTelemetryUpdate={setTelemetry}
        />
        <div className="stage-vignette absolute inset-0 z-[2] pointer-events-none" />
      </div>

      {/* ===================================================================== */}
      {/* PINNED 520VH 60FPS SCROLL-STORY STAGE WITH UNOBSTRUCTED ANIMATIONS    */}
      {/* Scene 01 on Left (Cover & Contents) -> Right side 100% open for Canvas */}
      {/* Scenes 02 & 03 on Right -> Left side 100% open for Canvas             */}
      {/* ===================================================================== */}
      <section
        id="scroll-story-track"
        aria-label="Interactive Calibre & Signal Core Portfolio Scroll Stage"
        className="relative w-full z-10"
        style={{ height: reducedMotion ? 'auto' : '520vh' }}
      >
        <div
          id="scroll-stage"
          className={`${
            reducedMotion ? 'relative py-12' : 'sticky top-16'
          } w-full overflow-hidden bg-transparent`}
          style={{ height: reducedMotion ? 'auto' : 'calc(100vh - 4rem)' }}
        >
          {/* Left Vertical Interactive Timeline HUD */}
          {!reducedMotion && (
            <div
              className="hidden xl:flex flex-col gap-4 absolute left-5 top-1/2 -translate-y-1/2 z-20"
              aria-label="Chapter Progress HUD"
            >
              {[
                { idx: 0, label: '01 / COVER', jump: 0.04 },
                { idx: 1, label: '02 / CALIBRE', jump: 0.45 },
                { idx: 2, label: '03 / AGENTS', jump: 0.76 },
                { idx: 3, label: '04 / MONOLITH', jump: 0.94 },
              ].map((step) => {
                const isActive = activeHudIndex === step.idx;
                return (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => jumpToScrollRatio(step.jump)}
                    className={`group flex items-center gap-2.5 text-left transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-1' : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <div
                      className={`w-1 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'h-9 bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.85)]'
                          : 'h-5 bg-slate-500 group-hover:bg-slate-300'
                      }`}
                    />
                    <span className="font-mono-code text-[10px] tracking-[0.15em] text-white">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 12-Column Coordinated Overlay Grid (Leaves opposite side 100% open for Canvas) */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-8 grid grid-cols-12 items-center pointer-events-none">
            {/* SCENE 01: BAENG101P COVER & CONTENTS BAR (Left 6 columns -> Right 6 columns 100% open for animation!) */}
            <article
              aria-hidden={activeScene.id !== '01' && !reducedMotion}
              className={`col-span-12 lg:col-start-1 lg:col-end-7 xl:col-start-2 xl:col-end-7 text-left transition-all duration-500 ${
                activeScene.id === '01' || reducedMotion
                  ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                  : 'opacity-0 -translate-y-6 invisible pointer-events-none absolute inset-x-0'
              }`}
            >
              <div className="p-5 sm:p-6 rounded-3xl bg-[#07080B]/48 border border-[#D4AF37]/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-4">
                {/* Header & Circular Gold SS Portrait Emblem */}
                <div className="flex items-center gap-3.5 border-b border-white/15 pb-3.5">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 p-0.5 bg-gradient-to-b from-[#D4AF37] via-[#FDE68A] to-[#92400E] shadow-[0_0_24px_rgba(212,175,55,0.5)]">
                    <img
                      src="/saket-photo.jpeg"
                      alt="Saket Subhadarshee (26BIT0190)"
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#07080B] border border-[#D4AF37] font-cinzel font-extrabold text-[9px] tracking-wider text-[#D4AF37] shadow">
                      SS
                    </span>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="font-cinzel font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#D4AF37]">
                      {content.courseMeta.institutionHeader}
                    </div>
                    <div className="text-[11px] text-[#F8FAFC] leading-snug">
                      {content.courseMeta.departmentHeader}
                    </div>
                    <div className="font-mono-code text-[10px] text-[#38BDF8] font-semibold">
                      {content.courseMeta.courseCodeTitle}
                    </div>
                  </div>
                </div>

                {/* Portfolio Title */}
                <div>
                  <h1
                    className={`${theme.headingFontClass} text-xl sm:text-3xl font-bold text-[#F8FAFC] leading-[1.15] drop-shadow`}
                  >
                    Saket Subhadarshee — B.Tech. Information Technology —{' '}
                    <em className="font-playfair italic font-normal text-[#D4AF37]">
                      Academic &amp; Professional Portfolio
                    </em>
                  </h1>
                </div>

                {/* 4 Metadata Rows (2x2 compact grid) */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#07080B]/70 border border-[#D4AF37]/30">
                    <div className="text-[9px] font-mono-code uppercase text-[#94A3B8]">
                      Registration number
                    </div>
                    <div className="font-mono-code font-bold text-sm text-[#D4AF37]">
                      {content.courseMeta.registerNumber}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#07080B]/70 border border-white/10">
                    <div className="text-[9px] font-mono-code uppercase text-[#94A3B8]">Class</div>
                    <div className="font-mono-code font-bold text-sm text-[#F8FAFC]">
                      {content.courseMeta.classYear}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#07080B]/70 border border-white/10">
                    <div className="text-[9px] font-mono-code uppercase text-[#94A3B8]">Faculty</div>
                    <div className="font-cinzel font-bold text-xs sm:text-sm text-[#38BDF8]">
                      {content.courseMeta.faculty}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#07080B]/70 border border-white/10">
                    <div className="text-[9px] font-mono-code uppercase text-[#94A3B8]">
                      Semester
                    </div>
                    <div className="font-mono-code font-bold text-xs sm:text-sm text-emerald-400">
                      {content.courseMeta.semester}
                    </div>
                  </div>
                </div>

                {/* Footer Rubric Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/45 font-mono-code text-[10px] font-semibold text-[#D4AF37]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>{content.courseMeta.rubricBadge}</span>
                </div>

                {/* Compact Contents Navigation Bar (01–07 + A) */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[9px] font-mono-code uppercase tracking-[0.2em] text-[#94A3B8] mb-1.5">
                    CONTENTS NAVIGATION (CLICK TO JUMP)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CONTENTS_NAV.map((item) => (
                      <a
                        key={item.code}
                        href={item.href}
                        className="px-2.5 py-1 rounded-lg bg-[#07080B]/80 hover:bg-[#0B1933] border border-white/10 hover:border-[#D4AF37] text-[10px] font-mono-code text-[#F8FAFC] transition"
                      >
                        <span className="text-[#D4AF37] font-bold">{item.code}</span>{' '}
                        {item.label.replace(/^[0-9A]+\s+/, '')}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* TRANSITIONS & SCENES 02–04 */}
            {content.scenes.slice(1).map((scene) => {
              const isCurrent = activeScene.id === scene.id && !reducedMotion;
              const alignClasses =
                scene.alignment === 'right'
                  ? 'col-span-12 lg:col-start-7 lg:col-end-13 text-left lg:text-right'
                  : 'col-span-12 lg:col-start-4 lg:col-end-10 text-center mt-[36vh]';

              if (scene.type === 'transition') {
                return (
                  <div
                    key={scene.id}
                    aria-hidden={!isCurrent}
                    className={`col-span-12 text-center self-start mt-6 transition-all duration-500 ${
                      isCurrent
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-4 invisible absolute inset-x-0'
                    }`}
                  >
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#07080B]/65 border border-[#D4AF37]/45 backdrop-blur-md text-xs font-mono-code text-[#D4AF37]">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                      <span>{scene.eyebrow}</span>
                    </div>
                  </div>
                );
              }

              return (
                <article
                  key={scene.id}
                  aria-hidden={!isCurrent}
                  className={`${alignClasses} transition-all duration-500 ${
                    isCurrent
                      ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                      : 'opacity-0 translate-y-8 invisible pointer-events-none absolute inset-x-0'
                  }`}
                >
                  <div className="p-5 sm:p-6 rounded-3xl bg-[#07080B]/48 border border-white/15 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-3.5">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.accentBgClass} border ${theme.accentBorderClass} ${theme.accentTextClass} text-[10px] font-mono-code tracking-wider uppercase`}
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: theme.primaryHex }}
                      />
                      <span>{scene.eyebrow}</span>
                    </div>

                    <h2
                      className={`${theme.headingFontClass} text-xl sm:text-3xl font-bold text-white leading-[1.15]`}
                    >
                      {scene.heading}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {scene.body}
                    </p>

                    {scene.metrics && (
                      <div
                        className={`flex flex-wrap gap-5 pt-2.5 border-t border-white/10 ${
                          scene.alignment === 'right'
                            ? 'justify-start lg:justify-end'
                            : 'justify-center'
                        }`}
                      >
                        {scene.metrics.map((m) => (
                          <div key={m.label} className="flex flex-col">
                            <span
                              className={`font-mono-code text-sm sm:text-base font-bold ${
                                m.colorClass || 'text-white'
                              }`}
                            >
                              {m.value}
                            </span>
                            <span className="text-[10px] font-mono-code uppercase text-slate-400">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`flex flex-wrap items-center gap-2.5 pt-1 ${
                        scene.alignment === 'right'
                          ? 'justify-start lg:justify-end'
                          : 'justify-center'
                      }`}
                    >
                      {scene.primaryCta && (
                        <button
                          type="button"
                          onClick={() => handleSceneCta(scene.primaryCta)}
                          className={`btn-shimmer px-4 py-2 rounded-xl font-mono-code text-xs font-semibold uppercase tracking-wider transition ${theme.buttonClass}`}
                        >
                          {scene.primaryCta.label}
                        </button>
                      )}
                      {scene.secondaryCta && (
                        <button
                          type="button"
                          onClick={() => handleSceneCta(scene.secondaryCta)}
                          className="px-3.5 py-2 rounded-xl bg-[#07080B]/80 hover:bg-slate-900 text-slate-200 border border-white/15 text-xs font-mono-code uppercase transition"
                        >
                          {scene.secondaryCta.label}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Animated Mouse Wheel Scroll Prompt */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              className={`hidden sm:flex absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 pointer-events-none transition-opacity duration-500 ${
                scrollProgress > 0.06 ? 'opacity-0' : 'opacity-90'
              }`}
            >
              <div className="w-[18px] h-[28px] rounded-full border border-[#D4AF37] relative">
                <div className="w-[3px] h-[6px] rounded-full bg-[#D4AF37] absolute top-1.5 left-1/2 -translate-x-1/2 animate-wheel-pulse" />
              </div>
              <span className="font-mono-code text-[9px] tracking-[0.22em] uppercase text-slate-300">
                Scroll to Traverse 90-Frame Calibre
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* MAIN ACADEMIC & PROFESSIONAL PORTFOLIO SECTIONS (01–07 + APPENDIX A)  */}
      {/* ===================================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-28 border-t border-white/10">
        {/* =================================================================== */}
        {/* SECTION 01 — ABOUT ME                                               */}
        {/* =================================================================== */}
        <section id="about-me" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                01
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 01 // PERSONAL &amp; ENGINEERING PROFILE
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  About Me
                </h2>
              </div>
            </div>
            <div className="text-xs font-mono-code text-[#94A3B8]">
              B.Tech. Information Technology · Registration No.{' '}
              <span className="text-[#D4AF37]">26BIT0190</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Portrait Medallion + Stats (4 Cards) */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="col-span-2 lg:col-span-1 spotlight-card rounded-2xl p-5 border-[#D4AF37]/40 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full shrink-0 p-0.5 bg-gradient-to-br from-[#D4AF37] to-[#38BDF8] shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                  <img
                    src="/saket-photo.jpeg"
                    alt="Saket Subhadarshee"
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#07080B] border border-[#D4AF37] font-cinzel font-bold text-[9px] text-[#D4AF37]">
                    SS
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-cinzel font-bold text-base text-[#F8FAFC] truncate">
                    {content.profile.name}
                  </div>
                  <div className="font-mono-code text-xs text-[#D4AF37]">
                    Registration No. {content.courseMeta.registerNumber}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    B.Tech. IT · VIT Vellore
                  </div>
                </div>
              </div>

              {content.aboutMe.sidebarStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="spotlight-card rounded-2xl p-5 border-[#D4AF37]/30 flex flex-col justify-between"
                >
                  <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#94A3B8]">
                    STAT // 0{idx + 1}
                  </div>
                  <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#D4AF37] mt-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono-code text-[#F8FAFC] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Right 8 Columns: Headline, Prose Paragraphs 1 & 2, and Structured Rows */}
            <div className="lg:col-span-8 spotlight-card rounded-3xl p-6 sm:p-9 space-y-6">
              <h3 className="font-playfair text-xl sm:text-2xl lg:text-[1.7rem] font-semibold text-[#F8FAFC] leading-snug border-l-4 border-[#D4AF37] pl-4">
                “{content.aboutMe.headline}”
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                <p>{content.aboutMe.paragraph1}</p>
                <p>{content.aboutMe.paragraph2}</p>
              </div>

              {/* Structured Rows: Career goal, Interests, Strengths */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {content.aboutMe.structuredRows.map((row) => (
                  <div
                    key={row.label}
                    className="p-4 rounded-2xl bg-[#07080B]/65 border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline"
                  >
                    <div className="sm:col-span-3 font-mono-code text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                      {row.label}
                    </div>
                    <div className="sm:col-span-9 text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 02 — SKILLS (SELF-ASSESSED OUT OF 10)                       */}
        {/* =================================================================== */}
        <TelemetrySkillsSection theme={theme} skillsData={content.skillsSection} />

        {/* =================================================================== */}
        {/* SECTION 03 — BEST ACADEMIC WORK (BAENG101)                          */}
        {/* =================================================================== */}
        <section id="academic-work" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                03
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 03 // BAENG101 TECHNICAL ENGLISH COMMUNICATION LAB
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  Best Academic Work (BAENG101)
                </h2>
              </div>
            </div>
            <div className="text-xs font-mono-code text-[#D4AF37]">
              Faculty: {content.courseMeta.faculty} · {content.courseMeta.semester}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.academicWork.map((card) => {
              const driveFileMatch = card.docUrl?.match(/\/file\/d\/([^/]+)/);
              const previewUrl = driveFileMatch
                ? `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`
                : null;
              const isEmbedOpen = activeAcademicEmbedId === card.id;

              return (
              <article
                key={card.id}
                className="spotlight-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border-[#D4AF37]/35"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[11px] font-mono-code text-[#38BDF8]">
                      {card.eyebrow}
                    </span>
                    {card.ratingBadge && (
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-mono-code font-bold text-[#D4AF37]">
                        {card.ratingBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8FAFC] leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{card.body}</p>

                  {card.verdict && (
                    <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 space-y-1">
                      <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#D4AF37] font-bold">
                        Verdict
                      </div>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                        {card.verdict}
                      </p>
                    </div>
                  )}

                  {/* Key Dossier Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#07080B]/65 border border-white/10 space-y-2">
                    <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#D4AF37]">
                      {card.highlightsHeader || 'KEY ACADEMIC HIGHLIGHTS'}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                      {card.highlights.map((h) => (
                        <li key={h} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* What It Shows Box */}
                <div className="p-4 rounded-2xl bg-[#0B1933]/65 border border-[#38BDF8]/35 space-y-1">
                  <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#38BDF8] font-bold">
                    What it shows
                  </div>
                  <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                    {card.whatItShows}
                  </p>
                  {card.docUrl && (
                    <div className="pt-2.5 flex flex-wrap items-center gap-2.5">
                      <a
                        href={card.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#07080B] text-xs font-mono-code font-bold hover:bg-amber-300 transition shadow"
                      >
                        {card.docLabel || 'Open Dossier ↗'}
                      </a>
                      {previewUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveAcademicEmbedId((prev) =>
                              prev === card.id ? null : card.id
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-[#07080B] border border-[#38BDF8]/45 text-[#38BDF8] text-xs font-mono-code hover:bg-slate-900 transition"
                        >
                          {isEmbedOpen ? 'Hide Inline Preview' : 'Embed Document Preview'}
                        </button>
                      )}
                    </div>
                  )}
                  {isEmbedOpen && previewUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-black h-72 w-full">
                      <iframe
                        src={previewUrl}
                        title={card.title}
                        className="w-full h-full border-0"
                        allow="autoplay"
                      />
                    </div>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 04 — PROJECTS & ACTIVITIES                                  */}
        {/* =================================================================== */}
        <section id="projects" className="space-y-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                04
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 04 // APPLIED SYSTEMS ENGINEERING &amp; LEADERSHIP
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  Projects &amp; Activities
                </h2>
              </div>
            </div>
            <div className="text-xs font-mono-code text-[#94A3B8]">
              4 Technical Projects · 3 Leadership &amp; Operational Tracks
            </div>
          </div>

          {/* 4 Technical Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.projects.map((p) => (
              <article
                key={p.id}
                className="spotlight-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-cinzel font-bold text-sm px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                        PROJECT {p.num}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-emerald-500/15 text-emerald-300 border border-emerald-400/35">
                        {p.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono-code text-[#94A3B8]">{p.period}</span>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition leading-snug">
                      {p.title}
                    </h3>
                    <div className="text-xs font-mono-code text-[#38BDF8] mt-1">{p.subtitle}</div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{p.summary}</p>

                  {/* Numbered Challenge Labs / Highlights list directly on Card for Project 3 */}
                  {p.id === 'gcp-skills-boost-arcade' && (
                    <div className="space-y-3">
                      <ul className="space-y-2 text-xs text-slate-200 bg-[#07080B]/75 p-4 rounded-2xl border border-[#D4AF37]/35">
                        {p.highlights.map((hl) => (
                          <li key={hl} className="leading-relaxed">
                            {hl}
                          </li>
                        ))}
                      </ul>

                      {/* 3-Column 100.0% Score Verification Strip */}
                      <div className="grid grid-cols-3 gap-2 text-center font-mono-code">
                        <div className="p-2.5 rounded-xl bg-[#07080B]/80 border border-emerald-500/35">
                          <div className="text-[10px] text-[#94A3B8]">DATA &amp; PUB/SUB</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">100.0%</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#07080B]/80 border border-emerald-500/35">
                          <div className="text-[10px] text-[#94A3B8]">COMPUTE &amp; VPC</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">100.0%</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#07080B]/80 border border-emerald-500/35">
                          <div className="text-[10px] text-[#94A3B8]">CLOUD MONITORING</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">100.0%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {p.liveDisplay && p.codeDisplay && (
                    <div className="p-3 rounded-xl bg-[#07080B]/70 border border-white/10 text-[11px] font-mono-code space-y-1">
                      <div>
                        <span className="text-[#94A3B8]">Live: </span>
                        <a
                          href={`https://${p.liveDisplay}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#D4AF37] hover:underline"
                        >
                          {p.liveDisplay}
                        </a>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">Code: </span>
                        <a
                          href={`https://${p.codeDisplay}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:underline"
                        >
                          {p.codeDisplay}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Embedded PDF & Scannable QR Viewer for Project 4 (Aquaculture MDP) */}
                  {p.pdfUrl && (
                    <div className="p-4 rounded-2xl bg-[#07080B]/80 border border-[#D4AF37]/45 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <a
                            href={p.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Scan or click to open 22-Slide Project Review – I PDF"
                          >
                            <QrMatrixSvg
                              seedStr={p.pdfUrl}
                              accentHex="#D4AF37"
                              sizeClass="w-16 h-16"
                            />
                          </a>
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#D4AF37] font-bold">
                              PDF &amp; QR LINK VIEWER · 22-SLIDE DECK
                            </div>
                            <div className="text-xs text-[#F8FAFC] font-medium">
                              Project Review – I Presentation PDF
                            </div>
                            <div className="flex flex-wrap gap-2 pt-0.5">
                              <a
                                href={p.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#07080B] font-mono-code text-[11px] font-bold hover:bg-amber-300 transition"
                              >
                                Open 22-Slide PDF ↗
                              </a>
                              <button
                                type="button"
                                onClick={() => setMdpPdfEmbedOpen((prev) => !prev)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-[#38BDF8]/40 text-[#38BDF8] font-mono-code text-[11px] hover:bg-slate-800 transition"
                              >
                                {mdpPdfEmbedOpen ? 'Hide Inline PDF' : 'Embed PDF Preview'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-[11px] font-mono-code">
                        <a
                          href="https://delete-ruby.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:underline"
                        >
                          VIT Campus Marketplace (delete-ruby.vercel.app) ↗
                        </a>
                        <span className="text-slate-600">·</span>
                        <a
                          href="https://github.com/saket-subhadarshee"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-white hover:underline"
                        >
                          GitHub (saket-subhadarshee) ↗
                        </a>
                      </div>

                      {mdpPdfEmbedOpen && (
                        <div className="rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-black h-72 w-full">
                          <iframe
                            src="https://drive.google.com/file/d/1rCYguV18uSwjeKbFRf5-ZPTMUkcXtkBi/preview"
                            title="Aquaculture MDP 22-Slide Project Review I PDF"
                            className="w-full h-full border-0"
                            allow="autoplay"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-2 relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((st) => (
                      <span
                        key={st}
                        className="px-2.5 py-1 rounded-lg bg-[#07080B]/80 text-[#F8FAFC] text-[11px] font-mono-code border border-[#D4AF37]/30"
                      >
                        {st}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveProjectModal(p)}
                      className="text-xs font-mono-code font-semibold text-[#D4AF37] hover:text-amber-200 transition flex items-center gap-1"
                    >
                      <span>Inspect Architecture &amp; Highlights</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    {p.links && p.links[0] && (
                      <a
                        href={p.links[0].url}
                        target={p.links[0].url.startsWith('#') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono-code text-[#38BDF8] hover:underline"
                      >
                        {p.links[0].label} ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Activities and Leadership Subsection */}
          <div className="spotlight-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#38BDF8]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#38BDF8]">
                  CAMPUS &amp; TECHNICAL OPERATIONS
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-0.5">
                  Activities and Leadership
                </h3>
              </div>
              <span className="text-xs font-mono-code text-[#D4AF37]">
                VIT Vellore · Unstop · FlightAware · Kaggle
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {content.activities.map((act) => (
                <div
                  key={act.title}
                  className="p-5 rounded-2xl bg-[#07080B]/65 border border-white/10 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/35 font-mono-code text-[11px] text-[#D4AF37] font-semibold">
                      {act.period}
                    </span>
                    <h4 className="font-cinzel font-bold text-base text-[#F8FAFC]">{act.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Sandbox for AbstractLens AI, AeroPulse ADS-B & Nano-Biosensor */}
          <div id="interactive-lab" className="scroll-mt-24">
            <InteractiveSystemsLab theme={theme} />
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 05 — CERTIFICATES & PARTICIPATION                           */}
        {/* =================================================================== */}
        <section id="certificates" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                05
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 05 // GRAVITAS’26 TECHNO-MANAGEMENT FEST (IN ASSOCIATION WITH HCLTECH)
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  Certificates &amp; Participation
                </h2>
              </div>
            </div>
            <a
              href="#appendix-certificates"
              className="text-xs font-mono-code text-[#D4AF37] hover:underline"
            >
              Jump to Appendix A Full-Size Certificate Copies ↓
            </a>
          </div>

          <div className="space-y-4">
            {content.certificates.map((cert) => (
              <div
                key={cert.id}
                className="spotlight-card rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-white/10"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-cinzel font-bold text-xs px-2.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                      {cert.num}
                    </span>
                    <span className="font-mono-code text-xs text-[#38BDF8] font-semibold">
                      {cert.highlightBadge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-emerald-500/15 text-emerald-300 border border-emerald-400/35">
                      {cert.credentialType}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-xl font-bold text-[#F8FAFC]">
                    {cert.title}{' '}
                    <span className="text-sm font-mono-code font-normal text-[#94A3B8]">
                      — {cert.organizer}
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                    {cert.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {cert.pdfUrl && (
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-[#07080B] font-mono-code text-xs font-bold transition shadow"
                    >
                      Original PDF ↗
                    </a>
                  )}
                  <a
                    href="#appendix-certificates"
                    className="px-4 py-2 rounded-xl bg-[#07080B]/80 hover:bg-[#0B1933] border border-[#D4AF37]/40 text-xs font-mono-code text-[#D4AF37] transition"
                  >
                    View Plate A.{cert.num} ↓
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 06 — REFLECTION                                             */}
        {/* =================================================================== */}
        <section id="reflection" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                06
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 06 // FIRST-SEMESTER SELF-EVALUATION &amp; GROWTH
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  Reflection
                </h2>
              </div>
            </div>
            <div className="text-xs font-mono-code text-[#94A3B8]">
              BAENG101 · Module 5 Reflective Synthesis
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.reflection.map((block, idx) => (
              <article
                key={block.label}
                className={`spotlight-card rounded-3xl p-6 sm:p-8 space-y-3 ${
                  idx === 3 ? 'border-emerald-400/40' : 'border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                    06.{idx + 1} // {block.label}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-[#F8FAFC]">{block.label}</h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{block.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 07 — CONCLUSION & CONTACT (+ QR CODE ROW)                   */}
        {/* =================================================================== */}
        <section id="conclusion-contact" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-start gap-4">
              <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
                07
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
                  SECTION 07 // CLOSING STATEMENT &amp; DIRECT CHANNELS
                </div>
                <h2
                  className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}
                >
                  Conclusion &amp; Contact
                </h2>
              </div>
            </div>
            <div className="text-xs font-mono-code text-[#D4AF37]">
              Saket Subhadarshee · 26BIT0190 · VIT Vellore
            </div>
          </div>

          <div className="spotlight-card rounded-3xl p-6 sm:p-10 border-[#D4AF37]/40 space-y-8">
            {/* Closing Summary Quote */}
            <blockquote className="p-6 rounded-2xl bg-[#07080B]/70 border-l-4 border-[#D4AF37] font-playfair text-base sm:text-xl text-[#F8FAFC] leading-relaxed italic">
              “{content.conclusion.summary}”
            </blockquote>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 5 Columns: Official Contact Details */}
              <div className="lg:col-span-5 space-y-3 text-xs font-mono-code">
                <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#38BDF8] mb-2">
                  VERIFIED CONTACT DIRECTORY
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080B]/75 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#94A3B8]">VIT EMAIL</span>
                  <a
                    href={`mailto:${content.conclusion.vitEmail}`}
                    className="text-[#D4AF37] hover:underline break-all"
                  >
                    {content.conclusion.vitEmail}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080B]/75 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#94A3B8]">PERSONAL EMAIL</span>
                  <a
                    href={`mailto:${content.conclusion.personalEmail}`}
                    className="text-[#F8FAFC] hover:underline break-all"
                  >
                    {content.conclusion.personalEmail}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080B]/75 border border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[#94A3B8]">PHONE</span>
                  <a
                    href={`tel:${content.conclusion.phone.replace(/\s+/g, '')}`}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    {content.conclusion.phone}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080B]/75 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#94A3B8]">LINKEDIN</span>
                  <a
                    href={content.conclusion.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:underline break-all"
                  >
                    {content.conclusion.linkedinDisplay} ↗
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080B]/75 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#94A3B8]">GITHUB</span>
                  <a
                    href={content.conclusion.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:underline break-all"
                  >
                    {content.conclusion.githubDisplay} ↗
                  </a>
                </div>
              </div>

              {/* Right 7 Columns: Direct Message Composer */}
              <div className="lg:col-span-7 bg-[#07080B]/75 rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <h3 className="font-cinzel font-bold text-base text-[#F8FAFC]">
                    Direct Portfolio Inquiry &amp; Feedback Composer
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    Dispatches to VIT &amp; Personal Email
                  </span>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="cf-name"
                        className="block text-xs font-mono-code text-[#94A3B8] mb-1"
                      >
                        Your Name / Faculty / Organization *
                      </label>
                      <input
                        id="cf-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g., Dr. Atul Kumar Singh / Collaborator"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B1933]/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cf-email"
                        className="block text-xs font-mono-code text-[#94A3B8] mb-1"
                      >
                        Your Email *
                      </label>
                      <input
                        id="cf-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@vit.ac.in"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B1933]/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cf-topic"
                      className="block text-xs font-mono-code text-[#94A3B8] mb-1"
                    >
                      Subject / Nature
                    </label>
                    <select
                      id="cf-topic"
                      value={contactTopic}
                      onChange={(e) => setContactTopic(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B1933]/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="BAENG101 Portfolio Feedback / Academic Inquiry">
                        BAENG101 Portfolio Feedback / Academic Inquiry
                      </option>
                      <option value="Software / AI Systems Engineering Internship">
                        Software / AI Systems Engineering Internship
                      </option>
                      <option value="Hackathon / Unstop / Kaggle Collaboration">
                        Hackathon / Unstop / Kaggle Collaboration
                      </option>
                      <option value="ADS-B Telemetry / Multidisciplinary Research">
                        ADS-B Telemetry / Multidisciplinary Research
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="cf-message"
                      className="block text-xs font-mono-code text-[#94A3B8] mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="cf-message"
                      rows={2}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Enter feedback or collaboration details..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B1933]/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className={`btn-shimmer px-5 py-2 rounded-xl font-mono-code text-xs font-semibold uppercase tracking-wider transition ${theme.buttonClass}`}
                    >
                      Prepare Email Payload
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(content.conclusion.vitEmail, content.conclusion.vitEmail)
                      }
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/15 text-xs font-mono-code transition"
                    >
                      Copy VIT Email
                    </button>
                  </div>
                </form>

                {emailPreview && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-[#D4AF37]/40 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-code text-[#D4AF37] font-semibold">
                        READY TO SEND
                      </span>
                      <a
                        href={`mailto:${content.conclusion.vitEmail}?cc=${encodeURIComponent(
                          content.conclusion.personalEmail
                        )}&subject=${encodeURIComponent(
                          emailPreview.subject
                        )}&body=${encodeURIComponent(emailPreview.body)}`}
                        className="px-3 py-1 rounded-lg bg-emerald-400 text-slate-950 font-mono-code font-semibold"
                      >
                        Open Mail Client ↗
                      </a>
                    </div>
                    <pre className="text-[11px] font-mono-code text-slate-300 whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {emailPreview.body}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Row ("Scan to open"): Campus Marketplace · Abstract Analysis · LinkedIn · GitHub */}
            <QrCodeCardRow qrLinks={content.conclusion.qrLinks} />
          </div>
        </section>

        {/* =================================================================== */}
        {/* APPENDIX A — CERTIFICATE COPIES (GRAVITAS’26 · VIT VELLORE)         */}
        {/* =================================================================== */}
        <AppendixCertificatesSection certificates={content.certificates} theme={theme} />
      </main>

      {/* ===================================================================== */}
      {/* FOOTER                                                                */}
      {/* ===================================================================== */}
      <footer className="relative z-10 border-t border-white/10 bg-[#07080B]/90 py-8 px-4 sm:px-6 text-xs text-[#94A3B8] font-mono-code">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full border border-[#D4AF37] p-0.5 bg-[#07080B] shrink-0">
              <img
                src="/saket-photo.jpeg"
                alt="Saket Subhadarshee"
                className="w-full h-full rounded-full object-cover object-top"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-[#07080B] border border-[#D4AF37] font-cinzel font-bold text-[7px] text-[#D4AF37]">
                SS
              </span>
            </div>
            <span>
              Saket Subhadarshee ({content.courseMeta.registerNumber}) · B.Tech. IT, VIT Vellore ·{' '}
              <span className="text-[#D4AF37]">{content.courseMeta.rubricBadge}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setVercelModalOpen(true)}
              className="text-[#38BDF8] hover:underline"
            >
              ▲ Vercel Deploy Studio
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={openCmsDrawer}
              className="text-[#D4AF37] hover:underline"
            >
              Edit Portfolio CMS
            </button>
            <span>·</span>
            <a href="#top" className="text-[#F8FAFC] hover:text-[#D4AF37]">
              Back to Cover ↑
            </a>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* PROJECT CASE STUDY MODAL                                              */}
      {/* ===================================================================== */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pm-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#D4AF37]/50 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-emerald-500/15 text-emerald-300 border border-emerald-400/35">
                  PROJECT {activeProjectModal.num} · {activeProjectModal.status}
                </span>
                <h3
                  id="pm-title"
                  className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-2"
                >
                  {activeProjectModal.title}
                </h3>
                <p className="text-xs font-mono-code text-[#D4AF37] mt-0.5">
                  {activeProjectModal.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono-code text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">{activeProjectModal.summary}</p>

            {activeProjectModal.architectureNodes && (
              <div>
                <div className="text-xs font-mono-code text-[#38BDF8] uppercase mb-2">
                  System Architecture Pipeline
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeProjectModal.architectureNodes.map((node, i) => (
                    <div
                      key={node}
                      className="p-2.5 rounded-xl bg-[#07080B] border border-white/10 text-center"
                    >
                      <div className="text-[10px] font-mono-code text-[#D4AF37]">STAGE 0{i + 1}</div>
                      <div className="text-xs font-semibold text-white mt-0.5">{node}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-mono-code text-[#94A3B8] uppercase mb-2">
                Key Engineering Highlights
              </div>
              <ul className="space-y-2 text-xs text-slate-200 list-disc pl-5">
                {activeProjectModal.highlights.map((h) => (
                  <li key={h} className="leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
              {activeProjectModal.links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target={l.url.startsWith('#') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (l.url.startsWith('#')) setActiveProjectModal(null);
                  }}
                  className={`px-4 py-2 rounded-xl font-mono-code text-xs font-semibold transition ${theme.buttonClass}`}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VERCEL DEPLOYMENT STUDIO MODAL */}
      <VercelDeployModal
        isOpen={vercelModalOpen}
        onClose={() => setVercelModalOpen(false)}
        theme={theme}
        edition={edition}
        onSelectEdition={(ed) => {
          handleEditionChange(ed);
          showToast(`Activated ${EDITION_THEMES[ed].name}`);
        }}
        content={content}
        onCopy={copyToClipboard}
      />

      {/* QUICK COMMAND PALETTE (Cmd+K / Ctrl+K) */}
      {cmdPaletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Command Palette"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
          onClick={() => setCmdPaletteOpen(false)}
        >
          <div
            className="glass-panel rounded-2xl max-w-lg w-full border border-[#D4AF37]/50 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono-code">
              <span className="text-[#D4AF37] font-semibold">
                ⌘K // BAENG101 PORTFOLIO QUICK JUMP
              </span>
              <button
                type="button"
                onClick={() => setCmdPaletteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ESC
              </button>
            </div>
            <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto text-xs font-mono-code">
              {CONTENTS_NAV.map((item) => (
                <a
                  key={item.code}
                  href={item.href}
                  onClick={() => setCmdPaletteOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-[#0B1933] text-slate-200 hover:text-[#D4AF37] transition"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCmdPaletteOpen(false);
                    jumpToScrollRatio(0.45);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                >
                  Jump to Scene 02 Calibre
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCmdPaletteOpen(false);
                    setVercelModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white text-slate-950 font-semibold"
                >
                  ▲ Vercel Deploy Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IN-BROWSER CONTENT CMS DRAWER */}
      {cmsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cms-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end"
          onClick={() => setCmsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0B1933] border-l border-[#D4AF37]/40 h-full flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono-code text-[#D4AF37]">
                  BAENG101 PORTFOLIO CONTENT CMS
                </span>
                <h3 id="cms-title" className="font-cinzel text-lg font-bold text-white">
                  Customize Cover &amp; Section 01 Copy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCmsOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono-code"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-mono-code">Student Name</label>
                  <input
                    type="text"
                    value={cmsDraft.name}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-mono-code">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.regNo}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, regNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-mono-code">Faculty</label>
                  <input
                    type="text"
                    value={cmsDraft.faculty}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-mono-code">Semester</label>
                  <input
                    type="text"
                    value={cmsDraft.semester}
                    onChange={(e) => setCmsDraft({ ...cmsDraft, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono-code">
                  Section 01 — About Me Headline
                </label>
                <input
                  type="text"
                  value={cmsDraft.aboutHeadline}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, aboutHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono-code">
                  Section 01 — Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={cmsDraft.aboutP1}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, aboutP1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono-code">
                  Section 01 — Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={cmsDraft.aboutP2}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, aboutP2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#07080B] border border-white/15 text-white"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#07080B] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={saveCmsChanges}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#07080B] font-semibold text-xs font-mono-code"
              >
                Save Local Draft
              </button>
              <button
                type="button"
                onClick={resetCmsDefaults}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono-code"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
