import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { BodyShape, Lang, ServiceIcon, Vehicle } from './data';
import { DICT, type Dict } from './i18n';

// ─── App context ─────────────────────────────────────────────
export interface Ctx {
  lang: Lang;
  t: Dict;
  notes: boolean;          // show prototype review notes
  guest: boolean;          // guest-safe presentation (no internal controls)
  photos: Record<string, string>;
  setPhoto: (id: string, url: string) => void;
}
export const AppCtx = createContext<Ctx>({} as Ctx);
export const useApp = () => useContext(AppCtx);
export const tr = (lang: Lang) => DICT[lang];

// ─── Reveal-on-scroll ────────────────────────────────────────
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

// ─── Review note (prototype annotation) ──────────────────────
export function Note({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { notes, guest } = useApp();
  if (!notes || guest) return null;
  return (
    <div className={`inline-flex items-start gap-2 rounded-md border border-dashed border-amber-400/80 bg-amber-50 px-3 py-1.5 text-[12px] leading-snug text-amber-900 ${className}`}>
      <span aria-hidden>✎</span><span>{children}</span>
    </div>
  );
}

// ─── Eyebrow + section title ─────────────────────────────────
export const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-[11px] font-medium uppercase tracking-[0.22em] ${light ? 'text-white/60' : 'text-neutral-500'}`}>{children}</p>
);

// ─── Car silhouettes for photo placeholders ──────────────────
const SHAPES: Record<BodyShape, { body: string; wheels: [number, number][]; r: number }> = {
  supercar: { body: 'M18 106 C40 97 72 92 112 89 L152 67 C178 57 232 53 272 59 L322 77 C352 81 373 89 381 101 L382 108 L18 108 Z', wheels: [[96, 108], [306, 108]], r: 19 },
  suv: { body: 'M24 108 L26 82 C28 73 39 67 58 65 L108 41 C119 36 134 34 150 34 L268 34 C289 34 300 38 312 50 L340 66 C364 70 376 80 378 96 L378 108 Z', wheels: [[96, 108], [304, 108]], r: 22 },
  gt: { body: 'M18 104 C40 93 80 89 122 87 L162 71 C177 66 202 66 216 70 L242 81 L330 83 C360 87 376 95 380 104 L380 108 L18 108 Z', wheels: [[98, 108], [306, 108]], r: 20 },
  van: { body: 'M30 108 L30 52 C30 37 40 28 57 28 L298 28 C318 28 330 34 342 48 L372 82 C378 88 380 96 380 104 L380 108 Z', wheels: [[100, 108], [308, 108]], r: 20 },
};

export function Silhouette({ shape, className = '' }: { shape: BodyShape; className?: string }) {
  const s = SHAPES[shape];
  return (
    <svg viewBox="0 0 400 140" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d={s.body} strokeLinejoin="round" />
      <line x1="4" y1="128" x2="396" y2="128" strokeOpacity=".35" />
      {s.wheels.map(([x, y]) => (
        <g key={x}><circle cx={x} cy={y} r={s.r} fill="#f4f4f2" /><circle cx={x} cy={y} r={s.r * 0.45} /></g>
      ))}
    </svg>
  );
}

// ─── Photo: real photo from images/<id>.webp, neutral placeholder if it fails ───
export function Photo({ id, shape, caption, ratio = 'aspect-[4/3]', className = '', big = false, position, eager = false }:
  { id: string; shape: BodyShape; caption: string; ratio?: string; className?: string; big?: boolean; position?: string; eager?: boolean }) {
  const { t } = useApp();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`group/photo relative overflow-hidden bg-[#f4f4f2] ${ratio} ${className}`}>
      {!failed ? (
        <img src={`images/${id}.webp`} alt={caption} loading={eager ? 'eager' : 'lazy'} decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)} style={{ objectPosition: position }}
          className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300">
          <Silhouette shape={shape} className={big ? 'w-[58%] max-w-[760px]' : 'w-[72%]'} />
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">{t.photo.pending} · {caption}</p>
        </div>
      )}
    </div>
  );
}

// ─── Buttons ─────────────────────────────────────────────────
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' | 'ghost' | 'light' };
export function Btn({ variant = 'solid', className = '', ...p }: BtnProps) {
  const v = {
    solid: 'bg-neutral-950 text-white hover:bg-neutral-800',
    outline: 'border border-neutral-300 text-neutral-900 hover:border-neutral-900',
    ghost: 'text-neutral-900 underline-offset-4 hover:underline',
    light: 'bg-white text-neutral-950 hover:bg-neutral-200',
  }[variant];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${v} ${className}`} />;
}

// ─── Modal ───────────────────────────────────────────────────
export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-neutral-950/50 backdrop-blur-sm sm:items-center sm:p-6 animate-[fade_.2s_ease-out]" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-4xl' : 'sm:max-w-xl'} animate-[rise_.25s_ease-out]`}>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 ring-1 ring-black/10 hover:text-black">✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── Service icons ───────────────────────────────────────────
export function ServiceGlyph({ icon }: { icon: ServiceIcon }) {
  const p: Record<ServiceIcon, React.ReactNode> = {
    key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l2 2M15 8l2 2" /></>,
    chauffeur: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /><path d="M8.5 4.5h7" /></>,
    plane: <path d="M2 14l20-7-4 13-5-5-4 3 1-5-8-2z" />,
    event: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    camera: <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
    star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />,
  };
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{p[icon]}</svg>;
}


