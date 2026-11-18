import React, { useEffect, useRef, useState } from 'react';
import { CONTACT, LANGS, LANG_LABEL, type Lang } from './data';
import { XD } from './extra';
import { Eyebrow, Reveal, useApp } from './ui';

export const useX = () => XD[useApp().lang];


// ─── Brand icons (coloured) ──────────────────────────────────
export type BrandKey = 'whatsapp' | 'wechat' | 'instagram' | 'tiktok' | 'email';
export function BrandIcon({ k, size = 36 }: { k: BrandKey; size?: number }) {
  const id = `g-${k}`;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden className="shrink-0">
      {k === 'instagram' && <defs><linearGradient id={id} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset=".35" stopColor="#FA7E1E" /><stop offset=".6" stopColor="#D62976" /><stop offset="1" stopColor="#4F5BD5" /></linearGradient></defs>}
      <circle cx="20" cy="20" r="20" fill={k === 'whatsapp' ? '#25D366' : k === 'wechat' ? '#07C160' : k === 'instagram' ? `url(#${id})` : k === 'tiktok' ? '#000' : '#C9A24B'} />
      {k === 'whatsapp' && <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 29l1.4-5A9.5 9.5 0 1 1 16 27.6z" /><path d="M16.4 15.6c-.6 1.6.3 3.7 2.2 5.4 1.9 1.7 3.9 2.4 5.2 1.7l.7-1.5-2.3-1.2-1 .9c-1-.5-2-1.4-2.6-2.5l.8-1-1.1-2.2z" fill="#fff" stroke="none" /></g>}
      {k === 'wechat' && <g fill="#fff"><ellipse cx="17" cy="17.5" rx="8" ry="6.8" /><ellipse cx="25.5" cy="23.5" rx="7" ry="5.9" stroke="#07C160" strokeWidth="1.6" /><circle cx="14.3" cy="16" r="1.1" fill="#07C160" /><circle cx="19.7" cy="16" r="1.1" fill="#07C160" /><circle cx="23.2" cy="22.6" r=".95" fill="#07C160" /><circle cx="27.8" cy="22.6" r=".95" fill="#07C160" /></g>}
      {k === 'instagram' && <g fill="none" stroke="#fff" strokeWidth="2.2"><rect x="10.5" y="10.5" width="19" height="19" rx="5.5" /><circle cx="20" cy="20" r="4.6" /><circle cx="25.9" cy="14.1" r="1.2" fill="#fff" stroke="none" /></g>}
      {k === 'tiktok' && <g fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22.6 10v13.1a3.9 3.9 0 1 1-3.9-3.9" stroke="#25F4EE" transform="translate(-1 .8)" /><path d="M22.6 10v13.1a3.9 3.9 0 1 1-3.9-3.9" stroke="#FE2C55" transform="translate(1 -.8)" /><path d="M22.6 10v13.1a3.9 3.9 0 1 1-3.9-3.9" stroke="#fff" /><path d="M22.6 10c.3 2.9 2.2 4.8 5 5" stroke="#fff" /></g>}
      {k === 'email' && <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"><rect x="10" y="12.5" width="20" height="15" rx="2.5" /><path d="M10.8 14l9.2 7.2 9.2-7.2" strokeLinecap="round" /></g>}
    </svg>
  );
}

// ─── Language dropdown ───────────────────────────────────────
export function LangMenu({ lang, setLang, dark = false }: { lang: Lang; setLang: (l: Lang) => void; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-medium transition ${dark ? 'text-white hover:bg-white/10' : 'text-neutral-800 hover:bg-neutral-100'}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
        <span>{LANG_LABEL[lang]}</span>
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l4 4 4-4" /></svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute end-0 top-full z-[70] mt-2 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 text-neutral-900 shadow-xl">
          {LANGS.map((l) => (
            <li key={l} role="option" aria-selected={l === lang}>
              <button onClick={() => { setLang(l); setOpen(false); }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-start text-[14px] hover:bg-neutral-50 ${l === lang ? 'font-semibold' : ''}`}>
                <span dir={l === 'ar' ? 'rtl' : 'ltr'}>{LANG_LABEL[l]}</span>{l === lang && <span aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Contact methods ─────────────────────────────────────────
export function CopyBtn({ text, label, done }: { text: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(text); } catch { /* ignore */ } setOk(true); setTimeout(() => setOk(false), 1600); }}
      className="rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-medium hover:border-neutral-900">{ok ? done : label}</button>
  );
}

export function ContactMethods({ lang, dark = false }: { lang: Lang; dark?: boolean }) {
  const x = XD[lang];
  const row = dark ? 'border-white/15' : 'border-neutral-200';
  const sub = dark ? 'text-white/50' : 'text-neutral-500';
  return (
    <div className={`divide-y rounded-2xl border ${row} ${dark ? 'divide-white/15' : 'divide-neutral-200'}`}>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3"><BrandIcon k="whatsapp" size={40} /><div><p className={`text-[11px] uppercase tracking-[0.18em] ${sub}`}>{x.whatsapp}</p><p dir="ltr" className="mt-1 text-[16px] font-medium">{CONTACT.whatsapp}</p></div></div>
        <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25D366] px-4 py-2 text-[12px] font-semibold text-neutral-950 hover:brightness-95">{x.open}</a>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3"><BrandIcon k="wechat" size={40} /><div><p className={`text-[11px] uppercase tracking-[0.18em] ${sub}`}>{x.wechat}</p><p dir="ltr" className="mt-1 text-[16px] font-medium">{CONTACT.wechat}</p></div></div>
        <CopyBtn text={CONTACT.wechat} label={x.copy} done={x.copied} />
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3"><BrandIcon k="email" size={40} /><div><p className={`text-[11px] uppercase tracking-[0.18em] ${sub}`}>{x.email}</p><p dir="ltr" className="mt-1 text-[16px] font-medium">{CONTACT.email}</p>
          {CONTACT.emailPending && <p className="mt-1 text-[11px] text-amber-600">{x.emailPending}</p>}</div></div>
        <a href={`mailto:${CONTACT.email}`} className="rounded-full border border-neutral-300 px-3 py-1 text-[11px] font-medium hover:border-neutral-900">{x.open}</a>
      </div>
    </div>
  );
}

// ─── Reviews ─────────────────────────────────────────────────
export function Reviews() {
  const x = useX();
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>{x.reviewsEyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">{x.reviewsTitle}</h2>
        <p className="mt-3 inline-block rounded-md border border-dashed border-amber-400/80 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">✎ {x.reviewsNote}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {x.reviews.map(([q, who], i) => (
            <Reveal key={i} delay={i * 80}>
              <figure className="h-full overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200">
                <img src={`images/services/${['self-drive', 'chauffeur', 'experiences'][i]}.webp`} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
                <div className="p-7">
                <div className="text-[15px] tracking-widest text-amber-500" aria-label="5/5">★★★★★</div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-neutral-700">“{q}”</blockquote>
                <figcaption className="mt-5 text-[12px] font-medium text-neutral-500">{who}</figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Simple pages ────────────────────────────────────────────
const Shell = ({ children, back }: { children: React.ReactNode; back: () => void }) => {
  const x = useX();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
      <button onClick={back} className="text-[13px] text-neutral-500 hover:text-black">← {x.back}</button>
      <div className="mt-8">{children}</div>
    </div>
  );
};

export function AboutPage({ back }: { back: () => void }) {
  const x = useX();
  return (
    <Shell back={back}>
      <Eyebrow>{x.about}</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-0.03em] md:text-5xl">{x.aboutLead}</h1>
      <p className="mt-3 inline-block rounded-md border border-dashed border-amber-400/80 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">✎ {x.aboutNote}</p>
      <p className="mt-8 text-[17px] leading-relaxed text-neutral-600">{x.aboutP}</p>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">{x.aboutServicesTitle}</h2>
          <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 text-[15px] text-neutral-700">
            {x.aboutServices.map((t) => <li key={t} className="py-3">{t}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">{x.aboutHelpTitle}</h2>
          <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 text-[15px] text-neutral-700">
            {x.aboutHelp.map((t) => <li key={t} className="py-3">{t}</li>)}
          </ul>
        </div>
      </div>
      <p className="mt-12 font-display text-2xl font-medium leading-snug tracking-[-0.02em]">{x.aboutClose}</p>
    </Shell>
  );
}

export function FaqPage({ back, onAsk }: { back: () => void; onAsk: () => void }) {
  const x = useX();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Shell back={back}>
      <Eyebrow>{x.faqEyebrow}</Eyebrow>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">{x.faqTitle}</h1>
      <p className="mt-3 inline-block rounded-md border border-dashed border-amber-400/80 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">✎ {x.faqNote}</p>
      <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
        {x.faqs.map(([q, a], i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-start">
              <span className="font-display text-lg tracking-tight md:text-xl">{q}</span>
              <span aria-hidden className="text-xl text-neutral-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="pb-6 text-[15px] leading-relaxed text-neutral-600">{a}</p>}
          </div>
        ))}
      </div>
      <button onClick={onAsk} className="mt-10 rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-medium text-white hover:bg-neutral-800">{x.contactTitle}</button>
    </Shell>
  );
}

export function LegalPage({ kind, back }: { kind: 'terms' | 'privacy'; back: () => void }) {
  const x = useX();
  const items = kind === 'terms' ? x.termsItems : x.privacyItems;
  return (
    <Shell back={back}>
      <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">{kind === 'terms' ? x.termsTitle : x.privacyTitle}</h1>
      <p className="mt-3 inline-block rounded-md border border-dashed border-amber-400/80 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">✎ {x.legalDraft}</p>
      <ol className="mt-10 space-y-5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-4 border-b border-neutral-200 pb-5">
            <span className="font-display text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
            <div><p className="font-medium">{it}</p><p className="mt-1 text-[13px] text-neutral-400">{x.tbc}</p></div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

// ─── Social links ────────────────────────────────────────────
export function Socials({ className = '', size = 36 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="Instagram @rev8.club" className="transition hover:scale-110"><BrandIcon k="instagram" size={size} /></a>
      <a href={CONTACT.tiktok} target="_blank" rel="noopener" aria-label="TikTok @rev8club" className="transition hover:scale-110"><BrandIcon k="tiktok" size={size} /></a>
    </div>
  );
}

// ─── Compact contact icons (top strip): icons only, no numbers or emails ───
export function ContactIcons({ lang, size = 28 }: { lang: Lang; size?: number }) {
  const x = XD[lang];
  const [ok, setOk] = useState(false);
  const cls = 'transition hover:scale-110';
  return (
    <div className="flex items-center gap-2.5">
      {ok && <span className="text-[11px] text-neutral-500">{x.wechat}: {x.copied}</span>}
      <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener" aria-label={x.whatsapp} title={x.whatsapp} className={cls}><BrandIcon k="whatsapp" size={size} /></a>
      <button aria-label={`${x.wechat} · ${x.copy}`} title={`${x.wechat} · ${x.copy}`} className={cls}
        onClick={async () => { try { await navigator.clipboard.writeText(CONTACT.wechat); } catch { /* ignore */ } setOk(true); setTimeout(() => setOk(false), 1800); }}><BrandIcon k="wechat" size={size} /></button>
      <a href={`mailto:${CONTACT.email}`} aria-label={x.email} title={x.email} className={cls}><BrandIcon k="email" size={size} /></a>
      <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="Instagram" title="Instagram" className={cls}><BrandIcon k="instagram" size={size} /></a>
      <a href={CONTACT.tiktok} target="_blank" rel="noopener" aria-label="TikTok" title="TikTok" className={cls}><BrandIcon k="tiktok" size={size} /></a>
    </div>
  );
}
