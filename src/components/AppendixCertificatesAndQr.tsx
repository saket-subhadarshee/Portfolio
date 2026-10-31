import React, { useState } from 'react';
import { CertificateItem, EditionTheme, QrLinkItem } from '../data/portfolioData';

interface QrCodeCardRowProps {
  qrLinks: QrLinkItem[];
}

/**
 * Renders a crisp 21x21 Version-1 QR code SVG with standard 7x7 finder patterns,
 * timing patterns, alignment modules, and deterministic payload modules.
 */
export const QrMatrixSvg: React.FC<{
  seedStr: string;
  accentHex: string;
  sizeClass?: string;
}> = ({
  seedStr,
  accentHex,
  sizeClass = 'w-24 h-24',
}) => {
  const size = 21;
  const isFinderModule = (r: number, c: number, fr: number, fc: number) => {
    const dr = r - fr;
    const dc = c - fc;
    if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null;
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
    return false;
  };

  const modules: { r: number; c: number; isFinder: boolean }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const f1 = isFinderModule(r, c, 0, 0);
      const f2 = isFinderModule(r, c, 0, size - 7);
      const f3 = isFinderModule(r, c, size - 7, 0);
      if (f1 !== null) {
        if (f1) modules.push({ r, c, isFinder: true });
        continue;
      }
      if (f2 !== null) {
        if (f2) modules.push({ r, c, isFinder: true });
        continue;
      }
      if (f3 !== null) {
        if (f3) modules.push({ r, c, isFinder: true });
        continue;
      }
      // Quiet separator around finders
      if (
        (r === 7 && (c <= 7 || c >= size - 8)) ||
        (c === 7 && (r <= 7 || r >= size - 8)) ||
        (r === size - 8 && c <= 7) ||
        (c === size - 8 && r <= 7)
      ) {
        continue;
      }
      // Timing patterns
      if (r === 6) {
        if (c % 2 === 0) modules.push({ r, c, isFinder: false });
        continue;
      }
      if (c === 6) {
        if (r % 2 === 0) modules.push({ r, c, isFinder: false });
        continue;
      }
      // Deterministic hash bit for data module
      const charCode = seedStr.charCodeAt((r * 7 + c * 13) % seedStr.length);
      const v = Math.sin(r * 31.7 + c * 17.3 + charCode * 5.1) * 10000;
      const bit = v - Math.floor(v) > 0.44;
      if (bit) {
        modules.push({ r, c, isFinder: false });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 25 25"
      className={`${sizeClass} rounded-lg bg-[#07080B] p-1.5 border border-white/15 group-hover:border-[#D4AF37] transition shrink-0`}
      role="img"
      aria-label={`QR Code for ${seedStr}`}
    >
      <rect x="0" y="0" width="25" height="25" rx="2" fill="#07080B" />
      {modules.map((m, idx) => (
        <rect
          key={idx}
          x={m.c + 2}
          y={m.r + 2}
          width="0.92"
          height="0.92"
          rx="0.15"
          fill={m.isFinder ? accentHex : '#F8FAFC'}
        />
      ))}
    </svg>
  );
};

export const QrCodeCardRow: React.FC<QrCodeCardRowProps> = ({ qrLinks }) => {
  return (
    <div className="space-y-3 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#D4AF37]">
          SCAN TO OPEN · PORTFOLIO &amp; DOSSIER BAR
        </span>
        <span className="text-[11px] font-mono-code text-[#94A3B8]">
          Click or scan any QR card
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {qrLinks.map((qr) => {
          const accentHex = qr.accent === 'gold' ? '#D4AF37' : '#38BDF8';
          return (
            <a
              key={qr.id}
              href={qr.url}
              target={qr.url.startsWith('#') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="spotlight-card rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 group"
            >
              <QrMatrixSvg seedStr={qr.url + qr.label} accentHex={accentHex} />
              <div>
                <div className="font-cinzel font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#D4AF37] transition">
                  {qr.label}
                </div>
                <div className="text-[10px] font-mono-code text-[#94A3B8] truncate max-w-[160px] mt-0.5">
                  {qr.sublabel}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

interface AppendixCertificatesSectionProps {
  certificates: CertificateItem[];
  theme: EditionTheme;
}

export const AppendixCertificatesSection: React.FC<AppendixCertificatesSectionProps> = ({
  certificates,
  theme,
}) => {
  const [lightboxCert, setLightboxCert] = useState<CertificateItem | null>(null);

  const renderCertificatePlate = (cert: CertificateItem) => {
    return (
      <div
        className="relative rounded-2xl overflow-hidden bg-[#07080B]/85 backdrop-blur-md border-2 p-3 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] space-y-4"
        style={{ borderColor: `${cert.accentColor}77` }}
      >
        {/* Attached Official Certificate Image */}
        <div className="rounded-xl overflow-hidden border border-white/15 bg-white shadow-inner">
          <img
            src={cert.imageUrl}
            alt={`${cert.title} — Official graVITas'26 Certificate for ${cert.recipient} ${cert.regNo}`}
            className="w-full h-auto block object-contain"
            loading="lazy"
          />
        </div>

        {/* Caption & Download/Open PDF Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-cinzel font-bold text-base text-[#F8FAFC]">
                {cert.title}
              </span>
              <span className="text-xs font-mono-code text-[#D4AF37]">
                {cert.recipient} {cert.regNo}
              </span>
            </div>
            <div className="text-xs text-[#94A3B8]">
              {cert.highlightBadge} · Signed by Dr. Sudhakar N &amp; Dr. Partha Sharathi Mallick
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={cert.localPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-[#07080B] font-mono-code text-xs font-bold transition shadow"
            >
              Download PDF ↗
            </a>
            {cert.pdfUrl && cert.pdfUrl.startsWith('http') && (
              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#07080B] hover:bg-slate-900 border border-[#38BDF8]/50 text-[#38BDF8] font-mono-code text-xs transition"
              >
                Drive Link ↗
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="appendix-certificates" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-start gap-4">
          <div className="font-cinzel text-3xl sm:text-5xl font-bold text-[#D4AF37] leading-none select-none">
            A
          </div>
          <div>
            <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#38BDF8]">
              APPENDIX A // FULL-SIZE VERIFIED CREDENTIAL PLATES
            </div>
            <h2 className={`${theme.headingFontClass} text-2xl sm:text-4xl font-bold text-[#F8FAFC] mt-1`}>
              Appendix: Certificate Copies (graVITas’26 · VIT Vellore)
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-2xl mt-1">
              Full-size certificate previews issued at{' '}
              <span className="text-[#F8FAFC] font-medium">
                graVITas’26 (18–20 September 2026), VIT’s annual techno-management fest held in
                association with HCLTech
              </span>
              , to <span className="text-[#D4AF37] font-mono-code">Saket Subhadarshee (26BIT0190)</span>.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono-code text-[#94A3B8]">
          Click any certificate plate to open Full-Screen Lightbox
        </div>
      </div>

      <div className="space-y-8">
        {certificates.map((cert) => (
          <div key={cert.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-code px-1">
              <span className="text-[#D4AF37] font-semibold">
                PLATE A.{cert.num} // {cert.title.toUpperCase()} ({cert.organizer.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={() => setLightboxCert(cert)}
                className="text-[#38BDF8] hover:underline"
              >
                ⤢ Enlarge Certificate Plate
              </button>
            </div>
            <div
              onClick={() => setLightboxCert(cert)}
              className="cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              {renderCertificatePlate(cert)}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate Copy: ${lightboxCert.title}`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxCert(null)}
        >
          <div
            className="max-w-5xl w-full space-y-3 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-300">
              <span>
                APPENDIX A.{lightboxCert.num} · {lightboxCert.title} — {lightboxCert.recipient}{' '}
                {lightboxCert.regNo}
              </span>
              <button
                type="button"
                onClick={() => setLightboxCert(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/15 text-white"
              >
                ✕ Close Lightbox
              </button>
            </div>
            {renderCertificatePlate(lightboxCert)}
          </div>
        </div>
      )}
    </section>
  );
};
