import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CONTACT, GALLERY, SPECS, PENDING_PHOTOS, SAMPLE_PARTNERS, SERVICES, VEHICLES, fullName, shortName, tx, LANGS, LANG_LABEL, type CategoryId, type Lang, type Partner, type Vehicle } from './data';
import { calc, fmt, getPartnerRate, type PartnerRate } from './pricing';
import { ContactIcons, BrandIcon, Socials, AboutPage, FaqPage, LangMenu, LegalPage, Reviews, ContactMethods, useX } from './pages';
import { isRtl } from './data';
import { AppCtx, Btn, Eyebrow, Modal, Note, Photo, Reveal, ServiceGlyph, tr, useApp } from './ui';

type View = string; // 'home' | 'fleet' | 'about' | 'faq' | 'terms' | 'privacy' | 'car/<id>'
const viewFromHash = (h: string): View => { const k = h.replace(/^#\/?/, ''); return k === '' || k === 'home' ? 'home' : k === 'partners' ? 'fleet' : k; };
const HOTELS_URL = 'https://claude.ai/artifact/8DF3EgMfDze5UrRB1MsfNr';
const ECHO_URL = 'https://claude.ai/artifact/JpHtQhZwoUHAHqveG4RCq9';
const HERO = VEHICLES.find((v) => v.id === 'lamborghini-huracan-performante')!;
type Mode = 'b2c' | 'b2b';

// ═════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState<Lang>(() => { try { const l = localStorage.getItem('rev8-lang') as Lang; return LANGS.includes(l) ? l : 'en'; } catch { return 'en'; } });
  const [view, setView] = useState<View>(() => viewFromHash(location.hash));
  const [mode, setMode] = useState<Mode>(() => (location.hash === '#partners' ? 'b2b' : 'b2c'));
  const [guest, setGuest] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [partnerId, setPartnerId] = useState(SAMPLE_PARTNERS[0].id);
  const [notes, setNotes] = useState(true);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [quick, setQuick] = useState<Vehicle | null>(null);
  const [inquiry, setInquiry] = useState<{ open: boolean; vehicleId: string; message?: string }>({ open: false, vehicleId: '' });

  const t = tr(lang);
  const partner = SAMPLE_PARTNERS.find((p) => p.id === partnerId)!;
  const isPartner = mode === 'b2b' && !guest;
  const showRates = isPartner && reveal;

  useEffect(() => { try { localStorage.setItem('rev8-lang', lang); } catch { /* storage unavailable */ } document.documentElement.lang = lang; document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr'; }, [lang]);
  useEffect(() => {
    const onHash = () => { setView(viewFromHash(location.hash)); window.scrollTo({ top: 0 }); if (location.hash === '#partners') setMode('b2b'); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { if (mode === 'b2c') { setGuest(false); setReveal(false); } }, [mode]);

  const go = useCallback((v: View, anchor?: string) => {
    if (v !== view) { location.hash = v; setView(v); }
    requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [view]);

  const setPhoto = useCallback((id: string, url: string) => setPhotos((p) => ({ ...p, [id]: url })), []);
  const openCar = (v: Vehicle) => go(`car/${v.id}`);
  const ask = (vehicleId = '', message = '') => { setQuick(null); setInquiry({ open: true, vehicleId, message }); };

  // Partner rates are only computed (≈ "fetched from the server") when the partner view is active.
  const rates = useMemo<Record<string, PartnerRate> | null>(() => {
    if (!showRates) return null;
    return Object.fromEntries(VEHICLES.map((v) => [v.id, getPartnerRate(v, partner)]));
  }, [showRates, partner]);

  return (
    <AppCtx.Provider value={{ lang, t, notes, guest, photos, setPhoto }}>
      <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
        {!guest && <PrototypeBar mode={mode} setMode={setMode} notes={notes} setNotes={setNotes} />}
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto flex max-w-[1440px] items-center justify-end px-5 py-1.5 md:px-10"><ContactIcons lang={lang} size={26} /></div>
        </div>
        <Header lang={lang} setLang={setLang} go={go} view={view} onBook={() => ask()} />
        {isPartner && (
          <PartnerBar partner={partner} setPartnerId={setPartnerId} reveal={reveal} setReveal={setReveal} onGuest={() => setGuest(true)} />
        )}

        <main>
          {view === 'home' ? (
            <Home go={go} onOpen={openCar} onAsk={ask} rates={rates} />
          ) : view === 'fleet' ? (
            <Fleet onOpen={openCar} onAsk={ask} rates={rates} />
          ) : view === 'about' ? (
            <AboutPage back={() => go('home')} />
          ) : view === 'faq' ? (
            <FaqPage back={() => go('home')} onAsk={() => ask()} />
          ) : view === 'terms' || view === 'privacy' ? (
            <LegalPage kind={view} back={() => go('home')} />
          ) : view.startsWith('car/') ? (
            <CarPage id={view.slice(4)} go={go} onAsk={ask} rates={rates} />
          ) : (
            <Home go={go} onOpen={openCar} onAsk={ask} rates={rates} />
          )}
        </main>

        <Footer go={go} />

        {guest && (
          <button onClick={() => setGuest(false)}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12px] font-medium text-white shadow-lg ring-1 ring-white/10 transition hover:bg-neutral-800">
            <span aria-hidden>🔒</span>{t.partner.exitGuest}
          </button>
        )}

        <QuickView v={quick} onClose={() => setQuick(null)} onAsk={ask} rate={quick && rates ? rates[quick.id] : null} />
        <Inquiry open={inquiry.open} vehicleId={inquiry.vehicleId} message={inquiry.message ?? ''} onClose={() => setInquiry({ open: false, vehicleId: '' })} partner={isPartner || (mode === 'b2b') ? partner : null} onBehalf={isPartner} />
      </div>
    </AppCtx.Provider>
  );
}

// ─── Prototype bar ───────────────────────────────────────────
function PrototypeBar({ mode, setMode, notes, setNotes }:
  { mode: Mode; setMode: (m: Mode) => void; notes: boolean; setNotes: (b: boolean) => void }) {
  const { t } = useApp();
  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2 text-[11px] md:px-10">
        <span className="font-medium uppercase tracking-[0.2em] text-white/50">{t.proto.label}</span>
        <div className="flex rounded-full bg-white/10 p-0.5">
          {(['b2c', 'b2b'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1 font-medium transition ${mode === m ? 'bg-white text-neutral-950' : 'text-white/70 hover:text-white'}`}>
              {m === 'b2c' ? t.proto.b2c : t.proto.b2b}
            </button>
          ))}
        </div>
        <Toggle on={notes} set={setNotes} label={t.proto.notes} />
      </div>
    </div>
  );
}

function Toggle({ on, set, label }: { on: boolean; set: (b: boolean) => void; label: string }) {
  return (
    <button onClick={() => set(!on)} className="flex items-center gap-2 text-white/80 hover:text-white" aria-pressed={on}>
      <span className={`relative h-4 w-7 rounded-full transition ${on ? 'bg-white' : 'bg-white/25'}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full transition-all ${on ? 'left-3.5 bg-neutral-950' : 'left-0.5 bg-white'}`} />
      </span>
      {label}
    </button>
  );
}

// ─── Header ──────────────────────────────────────────────────
function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-[#111] ${size === 'lg' ? 'px-4 py-2.5' : 'px-2.5 py-1.5'}`}>
      <img src="images/logo-wordmark.webp" alt="REV8 Club" className={size === 'lg' ? 'h-12 w-auto' : 'h-7 w-auto md:h-8'} />
    </span>
  );
}

function Header({ lang, setLang, go, view, onBook }: { lang: Lang; setLang: (l: Lang) => void; go: (v: View, a?: string) => void; view: View; onBook: () => void }) {
  const { t } = useApp(); const x = useX();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  const links: [string, () => void, string?][] = [
    [t.nav.fleet, () => go('fleet')],
    [t.nav.services, () => go('home', 'services')],
    [t.nav.experience, () => go('home', 'experience')],
    [t.nav.echolocation, () => {}, ECHO_URL],
    [x.faq, () => go('faq')],
    [t.nav.contact, () => go('home', 'contact')],
  ];
  const nav = (f: () => void) => () => { setOpen(false); f(); };
  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.06)]' : ''}`}>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
        <button onClick={() => go('home')} aria-label="REV8 Cars home"><Logo /></button>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([l, f, href], i) => href ? (
            <a key={l} href={href} target="_blank" rel="noopener" className="text-[13px] tracking-wide text-neutral-500 transition hover:text-neutral-950">{l}</a>
          ) : (
            <button key={l} onClick={f} className={`text-[13px] tracking-wide transition hover:text-neutral-950 ${i === 0 && view === 'fleet' ? 'text-neutral-950' : 'text-neutral-500'}`}>{l}</button>
          ))}
          <a href={HOTELS_URL} target="_blank" rel="noopener" className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-[13px] tracking-wide text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950">{t.nav.hotels}</a>
        </nav>
        <div className="flex items-center gap-3 md:gap-5">
          <LangMenu lang={lang} setLang={setLang} />
          <Btn onClick={onBook} className="hidden !px-5 !py-2.5 sm:inline-flex">{t.nav.book}</Btn>
          <button onClick={() => setOpen(!open)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden" aria-label="Menu">
            <span className={`h-px w-5 bg-neutral-900 transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-5 bg-neutral-900 transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-neutral-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          {links.map(([l, f, href]) => href ? (
            <a key={l} href={href} target="_blank" rel="noopener" className="block w-full border-b border-neutral-100 py-4 text-left font-display text-xl tracking-tight">{l} ↗</a>
          ) : (
            <button key={l} onClick={nav(f)} className="block w-full border-b border-neutral-100 py-4 text-left font-display text-xl tracking-tight">{l}</button>
          ))}
          <a href={HOTELS_URL} target="_blank" rel="noopener" className="block w-full border-b border-neutral-100 py-4 text-left font-display text-xl tracking-tight">{t.nav.hotels} ↗</a>
          <Btn onClick={nav(onBook)} className="mt-6 w-full">{t.nav.book}</Btn>
        </div>
      )}
    </header>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center text-[12px] font-medium tracking-wider" role="group" aria-label="Language">
      {LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="px-1.5 text-neutral-300">/</span>}
          <button onClick={() => setLang(l)} aria-pressed={lang === l}
            className={`transition ${lang === l ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'}`}>{LANG_LABEL[l]}</button>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Partner bar (B2B) ───────────────────────────────────────
function PartnerBar({ partner, setPartnerId, reveal, setReveal, onGuest }:
  { partner: Partner; setPartnerId: (id: string) => void; reveal: boolean; setReveal: (b: boolean) => void; onGuest: () => void }) {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcPrice, setCalcPrice] = useState(3000);
  const link = `https://rev8club.com/fleet?ref=${partner.id}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); window.getSelection()?.selectAllChildren(document.getElementById('ref-link')!); }
  };
  const c = calc(calcPrice || 0, partner.commissionPct);
  return (
    <div className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 md:px-10">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-neutral-500">{t.partner.portal} · {t.partner.as}</span>
          <select value={partner.id} onChange={(e) => setPartnerId(e.target.value)}
            className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[12px] font-medium focus:border-neutral-900 focus:outline-none">
            {SAMPLE_PARTNERS.map((p) => <option key={p.id} value={p.id}>{p.name} · {tx(p.type, lang)}</option>)}
          </select>
          <span className="hidden text-neutral-500 sm:inline">{t.partner.terms}: <b className="font-medium text-neutral-900">{partner.commissionPct}%</b></span>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          <button onClick={() => setReveal(!reveal)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${reveal ? 'border-neutral-900 bg-white' : 'border-neutral-300 text-neutral-600 hover:border-neutral-900'}`}>
            {reveal ? '◉ ' + t.partner.hide : '○ ' + t.partner.reveal}
          </button>
          <button onClick={() => setCalcOpen(!calcOpen)} className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 hover:border-neutral-900">
            {t.partner.calc}
          </button>
          <button onClick={copy} className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 hover:border-neutral-900">
            {copied ? '✓ ' + t.partner.copied : t.partner.share}
          </button>
          <button disabled title={t.partner.pdfSoon} className="cursor-not-allowed rounded-full border border-dashed border-neutral-300 px-3.5 py-1.5 text-[12px] text-neutral-400">
            {t.partner.pdf} · {t.partner.pdfSoon}
          </button>
          <button onClick={onGuest} className="rounded-full bg-neutral-950 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-neutral-800">
            👁 {t.partner.guestView}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-3 md:px-10">
        <p className="text-[11px] text-neutral-500"><span id="ref-link" className="font-mono text-neutral-700">{link}</span> — {t.partner.sampleLink}</p>
        {calcOpen && (
          <div className="mt-3 flex flex-wrap items-end gap-6 rounded-xl border border-neutral-200 bg-white p-4">
            <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
              {t.partner.public} (¥)
              <input type="number" min={0} value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="mt-1 block w-32 rounded-md border border-neutral-300 bg-white px-2 py-1 text-lg font-medium normal-case tracking-normal text-neutral-950 focus:border-neutral-950 focus:outline-none" />
            </label>
            <Stat k={`${t.partner.net} (−${partner.commissionPct}%)`} v={fmt(c.net, lang)} />
            <Stat k={t.partner.commission} v={fmt(c.commission, lang)} strong />
            <p className="text-[11px] text-neutral-400">{t.partner.calcHint}</p>
          </div>
        )}
        <Note className="mt-2">{t.partner.secure}</Note>
      </div>
    </div>
  );
}

const Stat = ({ k, v, strong = false }: { k: string; v: string; strong?: boolean }) => (
  <div><p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{k}</p><p className={`mt-1 text-lg ${strong ? 'font-semibold' : 'font-medium'}`}>{v}</p></div>
);

// ─── Home ────────────────────────────────────────────────────
function Home({ go, onOpen, onAsk, rates }: { go: (v: View, a?: string) => void; onOpen: (v: Vehicle) => void; onAsk: (id?: string, message?: string) => void; rates: Record<string, PartnerRate> | null }) {
  const { t, lang } = useApp(); const x = useX();
  const featured = VEHICLES.filter((v) => v.featured);
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10 md:pt-16">
        <Reveal>
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>
          <div className="mt-5 grid items-end gap-8 md:grid-cols-12">
            <h1 className="font-display text-[44px] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[64px] md:col-span-7 lg:text-[92px]">{t.hero.title}</h1>
            <div className="md:col-span-5 md:pb-3">
              <p className="max-w-md text-[17px] leading-relaxed text-neutral-600">{t.hero.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Btn onClick={() => go('fleet')}>{t.hero.ctaFleet} <span aria-hidden>→</span></Btn>
                <Btn variant="outline" onClick={() => go('home', 'services')}>{t.hero.ctaServices}</Btn>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150} className="mt-10 md:mt-14">
          <Photo id={HERO.id} shape="supercar" caption={fullName(HERO, lang)} ratio="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]" big position="50% 62%" eager />
        </Reveal>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div><Eyebrow>{t.featured.eyebrow}</Eyebrow><h2 className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">{t.featured.title}</h2></div>
          <Btn className="!px-8 !py-4 !text-[16px]" onClick={() => go('fleet')}>{t.featured.all} →</Btn>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <Reveal key={v.id} delay={i * 100}><VehicleCard v={v} onOpen={onOpen} onAsk={onAsk} rate={rates?.[v.id] ?? null} /></Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex justify-center">
          <Btn className="w-full !px-12 !py-5 !text-[17px] sm:w-auto" onClick={() => go('fleet')}>{t.featured.all} →</Btn>
        </Reveal>
      </section>

      {/* Experience */}
      <section id="experience" className="scroll-mt-24 border-t border-neutral-100">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <Reveal className="md:col-span-4">
            <Eyebrow>{t.experience.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">{t.experience.title}</h2>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
              <img src="images/services/cockpit.webp" alt="Mercedes-Benz G-Class cockpit" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-8">
            {t.experience.steps.map(([h, p], i) => (
              <Reveal key={h} delay={i * 80} className="border-t border-neutral-900 pt-5">
                <p className="font-display text-sm text-neutral-400">0{i + 1}</p>
                <h3 className="mt-3 text-lg font-medium">{h}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 bg-[#f7f7f5]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
          <Reveal>
            <Eyebrow>{t.services.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">{t.services.title}</h2>
            <Note className="mt-4">{t.services.note}</Note>
          </Reveal>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80} className="h-full">
                <article className="group h-full">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-neutral-200">
                    <img src={`images/${s.photo}.webp`} alt={tx(s.title, lang)} loading="lazy" decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur"><ServiceGlyph icon={s.icon} /></span>
                  </div>
                  <h3 className="mt-5 text-lg font-medium">{tx(s.title, lang)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{tx(s.text, lang)}</p>
                  {s.id === 'self-drive' && <Btn className="mt-5 !px-5 !py-2.5" onClick={() => go('fleet')}>{t.services.selfCta} →</Btn>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Echolocation Trip — distinct identity: dark band + serif */}
      <section id="echolocation" className="scroll-mt-24 bg-[#121212] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <Reveal className="md:col-span-6">
            <Eyebrow light>{t.echo.eyebrow}</Eyebrow>
            <p className="mt-6 font-serif text-[15px] uppercase tracking-[0.4em] text-white/70">Echolocation Trip</p>
            <h2 className="mt-4 font-serif text-5xl font-light leading-[1.05] md:text-6xl">{t.echo.title}</h2>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/70">{t.echo.text}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href={ECHO_URL} target="_blank" rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium tracking-wide text-neutral-950 transition hover:bg-neutral-200">{t.echo.cta} ↗</a>
              <Note>{lang === 'es' ? 'Enlaza al prototipo de Echolocation Trip; cambiar por el dominio real al publicar.' : 'Links to the Echolocation Trip prototype; swap for the real domain at launch.'}</Note>
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:col-start-8">
            <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl bg-[#121212]">
              <img src="images/services/echo-shanghai.webp" alt="Shanghai skyline, Pudong" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-95" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent via-40% to-[#121212]/35" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-transparent via-35% to-[#121212]/50" />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_36px_18px_#121212]" />
            </div>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {t.echo.items.map((it) => <li key={it} className="py-4 font-serif text-xl font-light text-white/90">{it}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
              <img src="images/services/open-door.webp" alt="Rolls-Royce Cullinan" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] md:text-6xl">{t.contact.title}</h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-neutral-600">{t.contact.text}</p>
            <Btn className="mt-10 !px-8 !py-4 !text-[14px]" onClick={() => onAsk()}>{t.contact.cta} →</Btn>
            <div className="mt-8"><ContactIcons lang={lang} size={38} /></div>
          </Reveal>
        </div>
      </section>
      <Reviews />
    </>
  );
}

// ─── Fleet ───────────────────────────────────────────────────
function Fleet({ onOpen, onAsk, rates }: { onOpen: (v: Vehicle) => void; onAsk: (id?: string, message?: string) => void; rates: Record<string, PartnerRate> | null }) {
  const { t, lang } = useApp();
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [q, setQ] = useState('');
  const list = VEHICLES.filter((v) => (cat === 'all' || v.category === cat) &&
    (!q.trim() || `${v.brand} ${v.model} ${v.variant?.en ?? ''} ${v.variant?.es ?? ''}`.toLowerCase().includes(q.trim().toLowerCase())));
  const countFor = (c: CategoryId) => VEHICLES.filter((v) => v.category === c).length;
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-12 md:px-10 md:pt-16">
      <Reveal>
        <Eyebrow>{t.fleet.eyebrow}</Eyebrow>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl font-medium tracking-[-0.035em] md:text-7xl">{t.fleet.title}</h1>
          <p className="text-[13px] text-neutral-500">{t.fleet.count(list.length)}</p>
        </div>
      </Reveal>

      <div className="sticky top-16 z-30 -mx-5 mt-10 border-b border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur md:top-20 md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            <Chip on={cat === 'all'} onClick={() => setCat('all')}>{t.fleet.all}</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>
                {tx(c.label, lang)}<span className="ml-1.5 text-[10px] opacity-50">{countFor(c.id)}</span>
              </Chip>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.fleet.search}
              className="w-full border-b border-neutral-300 bg-transparent py-2 pl-7 pr-6 text-[14px] placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none" />
            {q && <button onClick={() => setQ('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black" aria-label="Clear">✕</button>}
          </div>
        </div>
      </div>

      {list.length ? (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 80}><VehicleCard v={v} onOpen={onOpen} onAsk={onAsk} rate={rates?.[v.id] ?? null} /></Reveal>
          ))}
        </div>
      ) : (
        <div className="py-28 text-center">
          <p className="font-display text-2xl tracking-tight">{q ? t.fleet.noResults : t.fleet.empty}</p>
          <Btn variant="outline" className="mt-6" onClick={() => { setQ(''); setCat('all'); }}>{t.fleet.clear}</Btn>
          {!q && cat === 'sedans' && <div className="mt-6"><Note>{lang === 'es' ? 'No hay berlinas en las fotos iniciales. ¿Alguna para añadir?' : 'No sedans in the initial photos. Any to add?'}</Note></div>}
        </div>
      )}

      <Note className="mt-20 block">
        <b className="font-semibold">{lang === 'es'
          ? `Faltan fotos de ${PENDING_PHOTOS.length} coches del Excel — pendientes de George. No se muestran a los clientes hasta tener fotos reales.`
          : `Photos missing for ${PENDING_PHOTOS.length} cars in the price sheet — pending from George. Hidden from customers until real photos arrive.`}</b>
        <span className="mt-1 block">{PENDING_PHOTOS.map((m) => `${m.name} (${m.ref})`).join(' · ')}</span>
      </Note>
    </section>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition ${on ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'}`}>
      {children}
    </button>
  );
}

// ─── Vehicle card ────────────────────────────────────────────
function VehicleCard({ v, onOpen, onAsk, rate }: { v: Vehicle; onOpen: (v: Vehicle) => void; onAsk: (id?: string, message?: string) => void; rate: PartnerRate | null }) {
  const { t, lang } = useApp();
  const cat = CATEGORIES.find((c) => c.id === v.category)!;
  return (
    <article className="group">
      <button onClick={() => onOpen(v)} className="block w-full text-left" aria-label={`${t.card.details}: ${fullName(v, lang)}`}>
        <Photo id={v.id} shape={v.shape} caption={fullName(v, lang)} position={v.photoPosition} />
      </button>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{v.brand} · {tx(cat.label, lang)}</p>
          <button onClick={() => onOpen(v)} className="mt-1.5 text-left font-display text-[22px] font-medium leading-tight tracking-[-0.02em] hover:underline hover:underline-offset-4">{shortName(v, lang)}</button>
        </div>
      </div>
      <SpecLine id={v.id} />
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-neutral-600">{tx(v.description, lang)}</p>
      {v.note && <Note className="mt-2">{tx(v.note, lang)}</Note>}
      <div className="mt-4 border-t border-neutral-200 pt-4">
        {rate ? <RateBlock rate={rate} /> : <PublicPrice v={v} />}
        <div className="mt-4 flex items-center gap-5">
          <Btn className="!px-5 !py-2.5" onClick={() => onAsk(v.id)}>{t.card.request}</Btn>
          <button onClick={() => onOpen(v)} className="text-[13px] text-neutral-600 underline-offset-4 hover:text-black hover:underline">{t.card.details}</button>
        </div>
      </div>
    </article>
  );
}

const SPEC_L = {
  en: { seats: 'Seats', power: 'Power', hp: 'hp', z: '0–100 km/h', top: 'Top speed', engine: 'Engine' },
  es: { seats: 'Plazas', power: 'Potencia', hp: 'CV', z: '0–100 km/h', top: 'Vel. máx.', engine: 'Motor' },
  zh: { seats: '座位', power: '马力', hp: '马力', z: '百公里加速', top: '极速', engine: '发动机' },
  ru: { seats: 'Мест', power: 'Мощность', hp: 'л.с.', z: '0–100 км/ч', top: 'Макс. скорость', engine: 'Двигатель' },
  ar: { seats: 'المقاعد', power: 'القوة', hp: 'حصان', z: '0–100 كم/س', top: 'السرعة القصوى', engine: 'المحرك' },
} as const;
function SpecLine({ id }: { id: string }) {
  const { lang } = useApp();
  const s = SPECS[id]; if (!s || !s.hp) return null;
  const l = SPEC_L[lang];
  return <p className="mt-2 text-[12px] tracking-wide text-neutral-500">{[`${s.hp} ${l.hp}`, s.zero100 ? `0–100 ${s.zero100.toFixed(1)} s` : '', s.seats ? `${s.seats} ${l.seats.toLowerCase()}` : ''].filter(Boolean).join(' · ')}</p>;
}
function SpecGrid({ id }: { id: string }) {
  const { lang, t } = useApp();
  const s = SPECS[id]; const l = SPEC_L[lang];
  if (!s) return <dl className="mt-8 text-[14px]"><dt className="font-medium">{t.quick.specs}</dt><dd className="mt-1 text-neutral-600">{t.quick.specsPending}</dd></dl>;
  const items: [string, string][] = [
    s.hp ? [l.power, `${s.hp} ${l.hp}`] : null, s.zero100 ? [l.z, `${s.zero100.toFixed(1)} s`] : null,
    s.top ? [l.top, `${s.top} km/h`] : null, s.seats ? [l.seats, String(s.seats)] : null, s.engine ? [l.engine, s.engine] : null,
  ].filter(Boolean) as [string, string][];
  return (
    <div className="mt-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{t.quick.specs}</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(([k, v]) => (<div key={k} className="rounded-xl border border-neutral-200 p-4"><dt className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{k}</dt><dd className="mt-1 font-display text-xl font-medium tracking-[-0.02em]">{v}</dd></div>))}
      </dl>
      <p className="mt-2 text-[11px] leading-snug text-neutral-400">{t.quick.specsNote}</p>
    </div>
  );
}

function PublicPrice({ v }: { v: Vehicle }) {
  const { t, lang } = useApp();
  if (v.publicPrice !== null) return (
    <p className="text-[15px] font-medium"><span className="font-normal text-neutral-500">{t.card.from} </span>{fmt(v.publicPrice, lang)} <span className="font-normal text-neutral-500">{t.card.perDay}</span></p>
  );
  return <p className="text-[15px] text-neutral-700">{t.card.onRequest}</p>;
}

/** Partner-only figures. Rendered only when the server-equivalent `rate` object exists. */
function RateBlock({ rate }: { rate: PartnerRate }) {
  const { t, lang } = useApp();
  if (rate.publicPrice === null) {
    return <p className="text-[13px] text-neutral-600">{t.card.onRequest} · {t.partner.netOnRequest} · <b className="font-medium text-neutral-900">{rate.commissionPct}%</b></p>;
  }
  return (
    <div className="grid grid-cols-3 gap-3 rounded-lg bg-neutral-50 p-3 ring-1 ring-neutral-200">
      <Mini k={t.partner.public} v={fmt(rate.publicPrice, lang)} />
      <Mini k={t.partner.net} v={fmt(rate.netPrice!, lang)} />
      <Mini k={`${t.partner.commission} ${rate.commissionPct}%`} v={fmt(rate.commission!, lang)} strong />
    </div>
  );
}
const Mini = ({ k, v, strong = false }: { k: string; v: string; strong?: boolean }) => (
  <div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-[0.12em] text-neutral-500">{k}</p><p className={`mt-0.5 text-[14px] ${strong ? 'font-semibold' : 'font-medium'}`}>{v}</p></div>
);

// ─── Quick view ──────────────────────────────────────────────
function QuickView({ v, onClose, onAsk, rate }: { v: Vehicle | null; onClose: () => void; onAsk: (id?: string, message?: string) => void; rate: PartnerRate | null }) {
  const { t, lang } = useApp();
  if (!v) return null;
  const cat = CATEGORIES.find((c) => c.id === v.category)!;
  return (
    <Modal open onClose={onClose} wide>
      <Gallery key={v.id} v={v} />
      <div className="grid gap-8 p-6 md:grid-cols-5 md:p-10">
        <div className="md:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{v.brand} · {tx(cat.label, lang)}</p>
          <h3 className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] md:text-4xl">{shortName(v, lang)}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{tx(v.description, lang)}</p>
          <SpecGrid id={v.id} />
          <dl className="mt-8 space-y-5 text-[14px]">
            <div><dt className="font-medium">{t.quick.options}</dt><dd className="mt-1 text-neutral-600">{t.quick.optionsPending}</dd></div>
          </dl>
          {v.note && <Note className="mt-6 mr-2">{tx(v.note, lang)}</Note>}
          <Note className="mt-6">{t.quick.phase2}</Note>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-xl border border-neutral-200 p-5">
            {rate ? <RateBlock rate={rate} /> : <PublicPrice v={v} />}
            <p className="mt-2 text-[12px] leading-snug text-neutral-500">{t.quick.priceNote}</p>
            <Btn className="mt-5 w-full" onClick={() => onAsk(v.id)}>{t.card.request}</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Gallery({ v }: { v: Vehicle }) {
  const { lang } = useApp();
  const n = GALLERY[v.id] || 0;
  const [i, setI] = useState(0);
  if (!n) return <Photo id={v.id} shape={v.shape} caption={fullName(v, lang)} ratio="aspect-[16/10]" big position={v.photoPosition} />;
  const srcs = [`images/${v.id}.webp`, ...Array.from({ length: n }, (_, k) => `images/g/${v.id}-${k + 1}.webp`)];
  const go = (d: number) => setI((x) => (x + d + srcs.length) % srcs.length);
  return (
    <div className="bg-neutral-950">
      <div className="relative aspect-[16/10] overflow-hidden">
        {srcs.map((src, k) => (
          <img key={src} src={src} alt={fullName(v, lang)} loading={k === 0 ? 'eager' : 'lazy'} decoding="async"
            style={{ objectPosition: k === 0 ? v.photoPosition : undefined }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${k === i ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 hover:bg-white">←</button>
        <button aria-label="Next" onClick={() => go(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-900 hover:bg-white">→</button>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2">
        {srcs.map((src, k) => (
          <button key={src} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md md:h-16 md:w-24 ${k === i ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}>
            <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Car page (one per car: #car/<id>) ───────────────────────
function CarPage({ id, go, onAsk, rates }: { id: string; go: (v: View, a?: string) => void; onAsk: (id?: string, message?: string) => void; rates: Record<string, PartnerRate> | null }) {
  const { t, lang } = useApp(); const x = useX();
  const v = VEHICLES.find((c) => c.id === id);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);
  if (!v) return <div className="mx-auto max-w-3xl px-5 py-24"><button onClick={() => go('fleet')} className="text-[13px] text-neutral-500 hover:text-black">← {x.backFleet}</button></div>;
  const cat = CATEGORIES.find((c) => c.id === v.category)!;
  const rate = rates ? rates[v.id] : null;
  const similar = VEHICLES.filter((c) => c.category === v.category && c.id !== v.id).slice(0, 3);
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
      <button onClick={() => go('fleet')} className="text-[13px] text-neutral-500 hover:text-black">← {x.backFleet}</button>
      <div className="mt-6 overflow-hidden rounded-2xl"><Gallery key={v.id} v={v} /></div>
      <div className="mt-10 grid gap-10 md:grid-cols-5 md:gap-14">
        <div className="md:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{v.brand} · {tx(cat.label, lang)}</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.03em] md:text-6xl">{shortName(v, lang)}</h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-600">{tx(v.description, lang)}</p>
          <SpecGrid id={v.id} />
          <dl className="mt-8 space-y-5 text-[14px]">
            <div><dt className="font-medium">{t.quick.options}</dt><dd className="mt-1 text-neutral-600">{t.quick.optionsPending}</dd></div>
          </dl>
          {v.note && <Note className="mt-6">{tx(v.note, lang)}</Note>}
        </div>
        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-neutral-200 p-6 md:sticky md:top-24">
            {rate ? <RateBlock rate={rate} /> : <PublicPrice v={v} />}
            <p className="mt-2 text-[12px] leading-snug text-neutral-500">{t.quick.priceNote}</p>
            <Btn className="mt-5 w-full" onClick={() => onAsk(v.id)}>{x.request}</Btn>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-neutral-500">
              <button onClick={() => go('terms')} className="underline underline-offset-4 hover:text-black">{x.seeConditions}</button>
              <button onClick={() => go('faq')} className="underline underline-offset-4 hover:text-black">{x.faqLink}</button>
            </div>
            <div className="mt-6 border-t border-neutral-100 pt-5"><ContactMethods lang={lang} /></div>
          </div>
        </aside>
      </div>
      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em] md:text-3xl">{x.similar}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <button key={c.id} onClick={() => go(`car/${c.id}`)} className="group text-start">
                <div className="overflow-hidden rounded-xl"><Photo id={c.id} shape={c.shape} caption={fullName(c, lang)} position={c.photoPosition} /></div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500">{c.brand}</p>
                <p className="font-display text-lg tracking-tight">{shortName(c, lang)}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Inquiry form ────────────────────────────────────────────
function Inquiry({ open, vehicleId, message, onClose, partner, onBehalf }: { open: boolean; vehicleId: string; message: string; onClose: () => void; partner: Partner | null; onBehalf: boolean }) {
  const { t, lang } = useApp();
  const empty = { name: '', email: '', phone: '', vehicle: '', from: '', to: '', service: '0', message: '', guest: '' };
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => { if (open) { setF({ ...empty, vehicle: vehicleId, message }); setErr(''); setDone(null); } }, [open, vehicleId, message]);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.from || !f.to || (onBehalf && !f.guest.trim())) return setErr(t.form.required);
    if (f.to < f.from) return setErr(t.form.dates);
    setErr('');
    setDone('INQ-' + Math.random().toString(36).slice(2, 7).toUpperCase());
  };
  const field = 'mt-1.5 w-full normal-case tracking-normal font-normal text-neutral-900 border-b border-neutral-300 bg-transparent py-2 text-[15px] focus:border-neutral-950 focus:outline-none';
  const lbl = 'block text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500';
  const v = VEHICLES.find((x) => x.id === f.vehicle);
  return (
    <Modal open={open} onClose={onClose}>
      {done ? (
        <div className="p-8 md:p-10">
          <p className="text-3xl">✓</p>
          <h3 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em]">{t.form.okTitle}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{t.form.okText}</p>
          <dl className="mt-6 space-y-2 rounded-xl bg-neutral-50 p-5 text-[14px]">
            <Row k={t.form.ref} v={done} />
            <Row k={t.form.name} v={f.name} />
            {onBehalf && <Row k={t.form.guest} v={f.guest} />}
            <Row k={t.form.vehicle} v={v ? fullName(v, lang) : t.form.anyCar} />
            <Row k={`${t.form.from} → ${t.form.to}`} v={`${f.from} → ${f.to}`} />
            <Row k={t.form.service} v={t.form.serviceOpts[Number(f.service)]} />
            {partner && <Row k={t.form.partnerRef} v={partner.id} />}
          </dl>
          <div className="mt-7 flex gap-3">
            <Btn onClick={() => { setF({ ...empty, vehicle: vehicleId }); setDone(null); }} variant="outline">{t.form.again}</Btn>
            <Btn onClick={onClose}>{t.form.close}</Btn>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="p-6 md:p-10">
          <h3 className="pr-10 font-display text-3xl font-medium tracking-[-0.03em]">{t.form.title}</h3>
          <p className="mt-2 text-[14px] text-neutral-600">{t.form.subtitle}</p>
          {onBehalf && partner && (
            <p className="mt-4 rounded-lg bg-neutral-50 px-4 py-3 text-[13px] ring-1 ring-neutral-200">{t.form.onBehalf} · <b className="font-medium">{partner.name}</b> ({partner.id})</p>
          )}
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {onBehalf && <label className={`${lbl} sm:col-span-2`}>{t.form.guest} *<input className={field} value={f.guest} onChange={set('guest')} /></label>}
            <label className={`${lbl} sm:col-span-2`}>{t.form.name} *<input className={field} value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label className={lbl}>{t.form.email} *<input type="email" className={field} value={f.email} onChange={set('email')} autoComplete="email" /></label>
            <label className={lbl}>{t.form.phone}<input className={field} value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
            <label className={`${lbl} sm:col-span-2`}>{t.form.vehicle}
              <select className={field} value={f.vehicle} onChange={set('vehicle')}>
                <option value="">{t.form.anyCar}</option>
                {VEHICLES.map((x) => <option key={x.id} value={x.id}>{fullName(x, lang)}</option>)}
              </select>
            </label>
            <label className={lbl}>{t.form.from} *<input type="date" className={field} value={f.from} onChange={set('from')} /></label>
            <label className={lbl}>{t.form.to} *<input type="date" className={field} value={f.to} min={f.from || undefined} onChange={set('to')} /></label>
            <label className={`${lbl} sm:col-span-2`}>{t.form.service}
              <select className={field} value={f.service} onChange={set('service')}>
                {t.form.serviceOpts.map((o, i) => <option key={o} value={i}>{o}</option>)}
              </select>
            </label>
            <label className={`${lbl} sm:col-span-2`}>{t.form.message}<textarea rows={3} className={`${field} resize-none`} value={f.message} onChange={set('message')} /></label>
          </div>
          {err && <p className="mt-5 text-[13px] text-red-700">{err}</p>}
          <Btn type="submit" className="mt-8 w-full">{t.form.submit}</Btn>
          <Note className="mt-4">{lang === 'es' ? 'Prototipo: el envío está simulado.' : 'Prototype: submission is simulated.'}</Note>
        </form>
      )}
    </Modal>
  );
}
const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-6"><dt className="text-neutral-500">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
);

// ─── Footer ──────────────────────────────────────────────────
function Footer({ go }: { go: (v: View, a?: string) => void }) {
  const { t, lang } = useApp(); const x = useX();
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Logo size="lg" />
          <p className="mt-3 text-[13px] text-neutral-500">{t.footer.city}</p>
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-neutral-600">
          <button onClick={() => go('fleet')} className="hover:text-black">{t.nav.fleet}</button>
          <button onClick={() => go('home', 'services')} className="hover:text-black">{t.nav.services}</button>
          <a href={ECHO_URL} target="_blank" rel="noopener" className="hover:text-black">{t.nav.echolocation}</a>
          <button onClick={() => go('home', 'contact')} className="hover:text-black">{t.nav.contact}</button>
          <a href={HOTELS_URL} target="_blank" rel="noopener" className="hover:text-black">{t.nav.hotels}</a>
        </nav>
        <p className="text-[12px] text-neutral-400">© 2026 REV8 Cars. {t.footer.rights}</p>
      </div>
      <div className="border-t border-neutral-100">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{t.nav.fleet}</p>
          <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.filter((c) => VEHICLES.some((v) => v.category === c.id)).map((c) => (
              <div key={c.id}>
                <p className="text-[13px] font-medium text-neutral-900">{tx(c.label, lang)}</p>
                <ul className="mt-2 space-y-1.5 text-[12px] text-neutral-500">
                  {VEHICLES.filter((v) => v.category === c.id).map((v) => (
                    <li key={v.id}><a href={`#car/${v.id}`} onClick={(e) => { e.preventDefault(); go(`car/${v.id}`); }} className="hover:text-black">{fullName(v, lang)}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-5 text-[12px] text-neutral-500 md:px-10">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <button onClick={() => go('about')} className="hover:text-black">{x.about}</button>
            <button onClick={() => go('faq')} className="hover:text-black">{x.faq}</button>
            <button onClick={() => go('terms')} className="hover:text-black">{t.footer.terms}</button>
            <button onClick={() => go('privacy')} className="hover:text-black">{t.footer.privacy}</button>
          </nav>
          <ContactIcons lang={lang} size={26} />
        </div>
      </div>
    </footer>
  );
}
