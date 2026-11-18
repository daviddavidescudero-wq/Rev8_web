// REV8 Club — simple site for hotels (B2B landing). Shares the fleet data with the main site.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CATEGORIES, VEHICLES, shortName, tx, LANGS, LANG_LABEL, type CategoryId, type Lang, type Vehicle } from './data';
import { fmt } from './pricing';
import { LangMenu, ContactMethods, Socials } from './pages';
import { AppCtx } from './ui';
import { sendForm, SEND_FAIL } from './send';
import { isRtl, CONTACT } from './data';


/** Partner portal (full catalogue with show/hide commission). Will be login-protected later. */
const PORTAL_URL = '../cars/#partners';

const T = {
  en: {
    partners: 'Partner area', partnersHint: 'Commission & net prices',
    eyebrow: 'For hotels in Shanghai',
    title: 'Luxury cars for your guests, without the hassle.',
    sub: 'Offer your guests the most exclusive cars in Shanghai. You recommend, we take care of everything else.',
    seeCars: 'See the cars', how: 'How it works',
    howTitle: 'How it works', howSub: 'Three steps. No cost or commitment for your hotel.',
    steps: [
      ['Your guest asks', 'Your concierge shares our catalogue or sends us the request with dates and the car.'],
      ['We take care of it', 'We confirm availability, help with the documents to drive in China and bring the car to your hotel.'],
      ['Your hotel earns', 'Every booking from your hotel generates a commission for you. You see your figures in the partner area.'],
    ],
    youTitle: 'What your hotel does', you: 'Recommend REV8 to your guests and pass us the request. That’s it.',
    weTitle: 'What REV8 does', we: 'The car, delivery and collection at your hotel, airport transfers, chauffeur on request and the paperwork to drive in China.',
    carsTitle: 'Available cars', carsSub: 'Our current fleet in Shanghai. Prices are what your guest pays, minimum per day.',
    all: 'All', from: 'From', perDay: '/ day', onRequest: 'Price on request',
    ctaTitle: 'Ready to offer REV8 to your guests?', ctaText: 'Enter the partner area to see your net prices and commission, or ask us for a meeting.',
    meet: 'Request a meeting',
    form: { title: 'Request a meeting', hotel: 'Hotel', name: 'Your name', contact: 'Email / WeChat / phone', msg: 'Message (optional)', send: 'Send', req: 'Please fill in hotel, name and contact.', ok: 'Request sent', okText: 'Thank you! We have received your request and will reply by email or message as soon as possible.', close: 'Close' },
    locked: 'Prototype: open for now, it will require login.',
  },
  es: {
    partners: 'Área de socios', partnersHint: 'Comisión y precios netos',
    eyebrow: 'Para hoteles en Shanghái',
    title: 'Coches de lujo para tus clientes, sin complicaciones.',
    sub: 'Ofrece a tus huéspedes los coches más exclusivos de Shanghái. Tú lo recomiendas, nosotros nos encargamos de todo lo demás.',
    seeCars: 'Ver los coches', how: 'Cómo funciona',
    howTitle: 'Cómo funciona', howSub: 'Tres pasos. Sin coste ni compromiso para tu hotel.',
    steps: [
      ['Tu huésped lo pide', 'Tu conserje comparte nuestro catálogo o nos envía la solicitud con fechas y coche.'],
      ['Nosotros nos encargamos', 'Confirmamos disponibilidad, ayudamos con la documentación para conducir en China y llevamos el coche a tu hotel.'],
      ['Tu hotel gana', 'Cada reserva que viene de tu hotel te genera una comisión. Ves tus cifras en el área de socios.'],
    ],
    youTitle: 'Lo que hace tu hotel', you: 'Recomendar REV8 a tus huéspedes y pasarnos la solicitud. Nada más.',
    weTitle: 'Lo que hace REV8', we: 'El coche, la entrega y recogida en tu hotel, traslados al aeropuerto, chófer si lo piden y los trámites para conducir en China.',
    carsTitle: 'Coches disponibles', carsSub: 'Nuestra flota actual en Shanghái. Los precios son lo que paga tu huésped, mínimo por día.',
    all: 'Todos', from: 'Desde', perDay: '/ día', onRequest: 'Precio a consultar',
    ctaTitle: '¿Listo para ofrecer REV8 a tus huéspedes?', ctaText: 'Entra en el área de socios para ver tus precios netos y tu comisión, o pídenos una reunión.',
    meet: 'Pedir una reunión',
    form: { title: 'Pedir una reunión', hotel: 'Hotel', name: 'Tu nombre', contact: 'Email / WeChat / teléfono', msg: 'Mensaje (opcional)', send: 'Enviar', req: 'Rellena hotel, nombre y contacto.', ok: 'Solicitud enviada', okText: '¡Gracias! Hemos recibido tu solicitud y te responderemos por email o mensaje lo antes posible.', close: 'Cerrar' },
    locked: 'Prototipo: de momento abierta, más adelante pedirá contraseña.',
  },
  zh: {
    partners: '合作伙伴专区', partnersHint: '佣金与净价',
    eyebrow: '面向上海酒店',
    title: '为您的客人提供豪华座驾，省心无忧。',
    sub: '为您的客人提供上海最尊贵的座驾。您只需推荐，其余一切由我们负责。',
    seeCars: '查看车辆', how: '合作方式',
    howTitle: '合作方式', howSub: '三个步骤。酒店无需任何费用或承诺。',
    steps: [
      ['客人提出需求', '您的礼宾分享我们的车辆目录，或将日期和车型需求发给我们。'],
      ['我们全程负责', '我们确认车辆可用性，协助办理在中国驾车的手续，并将车辆送到您的酒店。'],
      ['酒店获得收益', '每一笔来自贵酒店的预订都会为您带来佣金。您可在合作伙伴专区查看相关数据。'],
    ],
    youTitle: '酒店需要做的', you: '向客人推荐 REV8，并把需求转给我们。仅此而已。',
    weTitle: 'REV8 负责的', we: '车辆、送车及在酒店取车、机场接送、按需配备司机，以及在中国驾车所需的手续。',
    carsTitle: '可选车辆', carsSub: '我们目前在上海的车队。价格为客人支付的每日最低价格。',
    all: '全部', from: '起', perDay: '/ 天', onRequest: '价格面议',
    ctaTitle: '准备好为您的客人提供 REV8 了吗？', ctaText: '进入合作伙伴专区查看您的净价和佣金，或与我们预约会面。',
    meet: '预约会面',
    form: { title: '预约会面', hotel: '酒店', name: '您的姓名', contact: '邮箱 / 微信 / 电话', msg: '留言（可选）', send: '发送', req: '请填写酒店、姓名和联系方式。', ok: '请求已发送', okText: '谢谢！我们已收到您的请求，会尽快通过邮件或消息回复您。', close: '关闭' },
    locked: '原型说明：目前开放，之后将需要登录。',
  },
  ru: {
    partners: 'Кабинет партнёра', partnersHint: 'Комиссия и нетто-цены',
    eyebrow: 'Для отелей Шанхая',
    title: 'Премиальные автомобили для ваших гостей — без хлопот.',
    sub: 'Предложите гостям самые эксклюзивные автомобили Шанхая. Вы рекомендуете, всё остальное делаем мы.',
    seeCars: 'Смотреть авто', how: 'Как это работает',
    howTitle: 'Как это работает', howSub: 'Три шага. Без затрат и обязательств для вашего отеля.',
    steps: [
      ['Гость делает запрос', 'Ваш консьерж делится нашим каталогом или присылает нам запрос с датами и автомобилем.'],
      ['Мы берём всё на себя', 'Подтверждаем наличие, помогаем с документами для вождения в Китае и привозим авто в ваш отель.'],
      ['Ваш отель зарабатывает', 'С каждого бронирования от вашего отеля вы получаете комиссию. Цифры доступны в кабинете партнёра.'],
    ],
    youTitle: 'Что делает ваш отель', you: 'Рекомендует REV8 гостям и передаёт нам запрос. Это всё.',
    weTitle: 'Что делает REV8', we: 'Автомобиль, доставка и возврат в вашем отеле, трансферы из аэропорта, водитель по запросу и документы для вождения в Китае.',
    carsTitle: 'Доступные авто', carsSub: 'Наш текущий автопарк в Шанхае. Цены — это то, что платит гость, минимум за сутки.',
    all: 'Все', from: 'От', perDay: '/ сутки', onRequest: 'Цена по запросу',
    ctaTitle: 'Готовы предложить REV8 своим гостям?', ctaText: 'Войдите в кабинет партнёра, чтобы увидеть нетто-цены и комиссию, или запросите встречу.',
    meet: 'Запросить встречу',
    form: { title: 'Запросить встречу', hotel: 'Отель', name: 'Ваше имя', contact: 'Почта / WeChat / телефон', msg: 'Сообщение (необязательно)', send: 'Отправить', req: 'Укажите отель, имя и контакт.', ok: 'Запрос отправлен', okText: 'Спасибо! Мы получили вашу заявку и ответим по почте или в мессенджере как можно скорее.', close: 'Закрыть' },
    locked: 'Прототип: пока открыт, позже потребуется вход.',
  },
  ar: {
    partners: 'منطقة الشركاء', partnersHint: 'العمولة والأسعار الصافية',
    eyebrow: 'لفنادق شنغهاي',
    title: 'سيارات فاخرة لضيوفك، دون عناء.',
    sub: 'قدّم لضيوفك أرقى السيارات في شنغهاي. أنت توصي ونحن نتولى كل ما عدا ذلك.',
    seeCars: 'شاهد السيارات', how: 'كيف يعمل',
    howTitle: 'كيف يعمل', howSub: 'ثلاث خطوات. بلا تكلفة أو التزام على فندقك.',
    steps: [
      ['يطلب ضيفك', 'يشارك موظف الكونسيرج كتالوجنا أو يرسل لنا الطلب بالتواريخ والسيارة.'],
      ['نتولى الأمر', 'نؤكد التوفر، ونساعد في أوراق القيادة في الصين، ونوصل السيارة إلى فندقك.'],
      ['يربح فندقك', 'كل حجز يأتي من فندقك يمنحك عمولة. تطّلع على أرقامك في منطقة الشركاء.'],
    ],
    youTitle: 'ما يقوم به فندقك', you: 'التوصية بـ REV8 لضيوفك وتمرير الطلب إلينا. هذا كل شيء.',
    weTitle: 'ما تقوم به REV8', we: 'السيارة والتسليم والاستلام في فندقك، والتوصيل من المطار وإليه، وسائق عند الطلب، وأوراق القيادة في الصين.',
    carsTitle: 'السيارات المتاحة', carsSub: 'أسطولنا الحالي في شنغهاي. الأسعار هي ما يدفعه ضيفك، كحد أدنى لليوم.',
    all: 'الكل', from: 'من', perDay: '/ يوم', onRequest: 'السعر عند الطلب',
    ctaTitle: 'هل أنت مستعد لتقديم REV8 لضيوفك؟', ctaText: 'ادخل إلى منطقة الشركاء لترى أسعارك الصافية وعمولتك، أو اطلب منا اجتماعاً.',
    meet: 'اطلب اجتماعاً',
    form: { title: 'اطلب اجتماعاً', hotel: 'الفندق', name: 'اسمك', contact: 'البريد / WeChat / الهاتف', msg: 'رسالة (اختياري)', send: 'إرسال', req: 'يرجى إدخال الفندق والاسم وطريقة التواصل.', ok: 'تم إرسال الطلب', okText: 'شكراً لك! استلمنا طلبك وسنرد عليك عبر البريد أو الرسائل في أقرب وقت.', close: 'إغلاق' },
    locked: 'نموذج أولي: مفتوح حالياً، وسيتطلب لاحقاً تسجيل الدخول.',
  },
};


function HotelApp() {
  const [lang, setLang] = useState<Lang>(() => { try { const l = localStorage.getItem('rev8-lang') as Lang; return LANGS.includes(l) ? l : 'en'; } catch { return 'en'; } });
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [form, setForm] = useState(false);
  const t = T[lang];
  useEffect(() => { try { localStorage.setItem('rev8-lang', lang); } catch { /* ignore */ } document.documentElement.lang = lang; document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr'; }, [lang]);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const cars = VEHICLES.filter((v) => cat === 'all' || v.category === cat);
  const cats = CATEGORIES.filter((c) => VEHICLES.some((v) => v.category === c.id));

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="inline-flex items-center rounded-md bg-[#111] px-2.5 py-1.5"><img src="images/logo-wordmark.webp" alt="REV8 Club" className="h-7 w-auto" /></span>
          <div className="flex items-center gap-4">
            <LangMenu lang={lang} setLang={setLang} />
            <a href={PORTAL_URL} target="_blank" rel="noopener" title={t.locked}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800">
              <span aria-hidden>🔒</span>{t.partners}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <img src="images/lamborghini-huracan-performante.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-36">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/80">{t.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => go('cars')} className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-neutral-950 hover:bg-neutral-200">{t.seeCars} →</button>
            <button onClick={() => go('how')} className="rounded-full border border-white/40 px-6 py-3 text-[13px] font-medium hover:border-white">{t.how}</button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">{t.howTitle}</h2>
        <p className="mt-3 text-[16px] text-neutral-600">{t.howSub}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {t.steps.map(([h, p], i) => (
            <div key={h} className="border-t border-neutral-900 pt-5">
              <p className="font-display text-sm text-neutral-400">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-medium">{h}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{p}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-6"><p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">{t.youTitle}</p><p className="mt-3 text-[16px] leading-relaxed">{t.you}</p></div>
          <div className="rounded-2xl bg-neutral-950 p-6 text-white"><p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">{t.weTitle}</p><p className="mt-3 text-[16px] leading-relaxed text-white/90">{t.we}</p></div>
        </div>
      </section>

      {/* Cars */}
      <section id="cars" className="scroll-mt-16 bg-[#f7f7f5]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 className="font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">{t.carsTitle}</h2>
          <p className="mt-3 text-[16px] text-neutral-600">{t.carsSub}</p>
          <div className="mt-8 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
            {[{ id: 'all' as const, label: { en: t.all, es: t.all } }, ...cats].map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition ${cat === c.id ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-600 hover:text-neutral-950'}`}>{tx(c.label, lang)}</button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cars.map((v) => <CarCard key={v.id} v={v} lang={lang} t={t} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="rounded-3xl bg-neutral-950 p-8 text-white md:p-14">
          <h2 className="max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] md:text-5xl">{t.ctaTitle}</h2>
          <p className="mt-4 max-w-xl text-[16px] text-white/75">{t.ctaText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={PORTAL_URL} target="_blank" rel="noopener" className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-neutral-950 hover:bg-neutral-200">🔒 {t.partners}</a>
            <button onClick={() => setForm(true)} className="rounded-full border border-white/40 px-6 py-3 text-[13px] font-medium hover:border-white">{t.meet}</button>
          </div>
          <p className="mt-4 text-[12px] text-white/50">{t.locked}</p>
          <div className="mt-8 max-w-xl"><ContactMethods lang={lang} dark /><Socials className="mt-5 text-white" /></div>
        </div>
      </section>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[12px] text-neutral-500">
          <span>REV8 Club · Shanghai</span><span dir="ltr">WhatsApp {CONTACT.whatsapp} · WeChat {CONTACT.wechat} · {CONTACT.email}</span><span>© 2026</span>
        </div>
      </footer>

      {form && <MeetForm t={t} lang={lang} onClose={() => setForm(false)} />}
    </div>
  );
}

function CarCard({ v, lang, t }: { v: Vehicle; lang: Lang; t: (typeof T)['en'] }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200">
      <div className="relative aspect-[4/3] bg-neutral-200">
        <img src={`images/${v.id}.webp`} alt={`${v.brand} ${shortName(v, lang)}`} loading="lazy" decoding="async"
          style={{ objectPosition: v.photoPosition }} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="p-3.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{v.brand}</p>
        <p className="mt-0.5 text-[15px] font-medium leading-snug">{shortName(v, lang)}</p>
        <p className="mt-2 text-[13px]">
          {v.publicPrice !== null
            ? <><span className="text-neutral-500">{t.from} </span><b className="font-semibold">{fmt(v.publicPrice, lang)}</b><span className="text-neutral-500"> {t.perDay}</span></>
            : <span className="text-neutral-600">{t.onRequest}</span>}
        </p>
      </div>
    </article>
  );
}

function MeetForm({ t, lang, onClose }: { t: (typeof T)['en']; lang: Lang; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState('');
  const [f, setF] = useState({ hotel: '', name: '', contact: '', msg: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const field = 'mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 focus:border-neutral-950 focus:outline-none';
  const lbl = 'block text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500';
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/50 sm:items-center sm:p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl md:p-8">
        {ok ? (
          <>
            <p className="text-3xl">✓</p>
            <h3 className="mt-3 font-display text-2xl font-medium">{t.form.ok}</h3>
            <p className="mt-2 text-[15px] text-neutral-600">{t.form.okText}</p>
            <button onClick={onClose} className="mt-6 rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-medium text-white">{t.form.close}</button>
          </>
        ) : (
          <form noValidate onSubmit={async (e) => { e.preventDefault(); if (busy) return; if (!f.hotel.trim() || !f.name.trim() || !f.contact.trim()) return setErr(t.form.req); setErr(''); setBusy(true); const good = await sendForm('REV8 Hotels', 'HOTEL-' + Math.random().toString(36).slice(2, 7).toUpperCase(), { hotel: f.hotel, name: f.name, contact: f.contact, message: f.msg }, lang, hp); setBusy(false); if (!good) return setErr(SEND_FAIL[lang]); setOk(true); }}>
            <h3 className="font-display text-2xl font-medium">{t.form.title}</h3>
            <div className="mt-5 space-y-4">
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
              <label className={lbl}>{t.form.hotel} *<input className={field} value={f.hotel} onChange={set('hotel')} /></label>
              <label className={lbl}>{t.form.name} *<input className={field} value={f.name} onChange={set('name')} /></label>
              <label className={lbl}>{t.form.contact} *<input className={field} value={f.contact} onChange={set('contact')} /></label>
              <label className={lbl}>{t.form.msg}<textarea rows={3} className={`${field} resize-none`} value={f.msg} onChange={set('msg')} /></label>
            </div>
            {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={busy} className="rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-medium text-white disabled:opacity-60">{t.form.send}</button>
              <button type="button" onClick={onClose} className="rounded-full border border-neutral-300 px-6 py-3 text-[13px] font-medium">{t.form.close}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<HotelApp />);
