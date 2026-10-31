import React from 'react';
import {
  EDITION_THEMES,
  EditionId,
  EditionTheme,
  PortfolioContent,
} from '../data/portfolioData';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: EditionTheme;
  edition: EditionId;
  onSelectEdition: (ed: EditionId) => void;
  content: PortfolioContent;
  onCopy: (text: string, label: string) => void;
}

const VERCEL_JSON_STRING = JSON.stringify(
  {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: 'vite',
    buildCommand: 'pnpm build',
    outputDirectory: 'dist',
    cleanUrls: true,
    headers: [
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ],
    rewrites: [
      {
        source: '/((?!assets/|favicon\\.svg|manifest\\.json|robots\\.txt).*)',
        destination: '/index.html',
      },
    ],
  },
  null,
  2
);

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose,
  theme,
  edition,
  onSelectEdition,
  content,
  onCopy,
}) => {
  if (!isOpen) return null;

  const downloadVercelJson = () => {
    const blob = new Blob([VERCEL_JSON_STRING], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vercel.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopy('vercel.json', 'Downloaded vercel.json');
  };

  const downloadContentJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopy('content.json', 'Downloaded content.json');
  };

  const originUrl =
    typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://saket-portfolio.vercel.app/';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vercel-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-sky-400/40 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg shadow">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code text-emerald-400 uppercase">
                  ● PRODUCTION WEB APP READY
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono-code text-slate-300">
                  Vite 8 + React 19 + Tailwind v4
                </span>
              </div>
              <h3
                id="vercel-modal-title"
                className={`${theme.headingFontClass} text-xl sm:text-2xl font-bold text-white mt-0.5`}
              >
                Vercel Edge Deployment &amp; Deep-Link Studio
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono-code text-xs"
          >
            ✕ Close
          </button>
        </div>

        {/* Step-by-Step Vercel Deployment Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono-code text-sky-400">STEP 01 // REPOSITORY</div>
            <div className="font-display font-bold text-sm text-white">Push to GitHub</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Push this project directory (which now includes <code>vercel.json</code>,{' '}
              <code>manifest.json</code>, and code-split assets) to your GitHub account (
              <code>saket-subhadarshee</code>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono-code text-[#D4AF37]">STEP 02 // VERCEL IMPORT</div>
            <div className="font-display font-bold text-sm text-white">Zero-Config Vite Preset</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In Vercel Dashboard, click <strong>Add New → Project</strong>. Vercel auto-detects{' '}
              <code>vercel.json</code> (Build: <code>pnpm build</code>, Output: <code>dist</code>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono-code text-emerald-400">STEP 03 // CLI OPTION</div>
            <div className="font-display font-bold text-sm text-white">Deploy via Terminal</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Or deploy directly from your terminal in one command using the Vercel CLI:
            </p>
            <button
              type="button"
              onClick={() => onCopy('npx vercel --prod', 'npx vercel --prod')}
              className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left font-mono-code text-[11px] text-emerald-300 flex items-center justify-between"
            >
              <span>$ npx vercel --prod</span>
              <span className="text-[10px] text-slate-400">Copy</span>
            </button>
          </div>
        </div>

        {/* Shareable Deep-Link URLs for Each Portfolio Edition */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-amber-300 uppercase">
              SHAREABLE EDITION DEEP-LINKS (URL QUERY ROUTING ACTIVE)
            </span>
            <span className="text-[11px] font-mono-code text-slate-400">
              ?engine=fusion | calibre | signal | compiler
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Your web app automatically syncs the active visual engine with the URL query string so you can send recruiters or hackathon judges a direct link to any edition:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(['fusion', 'calibre', 'signal', 'compiler'] as EditionId[]).map((edKey) => {
              const ed = EDITION_THEMES[edKey];
              const url = `${originUrl}?engine=${edKey}`;
              const isCurrent = edition === edKey;
              return (
                <div
                  key={edKey}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    isCurrent
                      ? 'bg-slate-900 border-amber-400/50'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{ed.name}</div>
                    <div className="text-[10px] font-mono-code text-sky-300 truncate">
                      ?engine={edKey}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectEdition(edKey)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono-code text-slate-200"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(url, `${ed.name} URL`)}
                      className="px-2.5 py-1 rounded bg-[#D4AF37] text-slate-950 font-semibold text-[10px] font-mono-code"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspect & Download vercel.json */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono-code text-slate-300">
              INCLUDED <code>/vercel.json</code> CONFIGURATION
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCopy(VERCEL_JSON_STRING, 'vercel.json contents')}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono-code text-slate-200"
              >
                Copy vercel.json
              </button>
              <button
                type="button"
                onClick={downloadVercelJson}
                className="px-3 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-[11px] font-mono-code"
              >
                Download vercel.json
              </button>
              <button
                type="button"
                onClick={downloadContentJson}
                className="px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-[11px] font-mono-code"
              >
                Export content.json
              </button>
            </div>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-code text-slate-300 overflow-x-auto">
            {VERCEL_JSON_STRING}
          </pre>
        </div>
      </div>
    </div>
  );
};
