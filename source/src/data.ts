// ─────────────────────────────────────────────────────────────
// REV8 Cars — catalogue data (prototype)
// Single source of truth shared by the public site (B2C) and the
// partner portal (B2B). In production this comes from the fleet API.
// Prices: "REV8_Cars_Central_Precios_2026-11-12.xlsx" (minimum price per day, CNY).
// ─────────────────────────────────────────────────────────────

export type Lang = 'en' | 'es' | 'zh' | 'ru' | 'ar';
/** Dropdown order. */
export const LANGS: Lang[] = ['en', 'zh', 'ru', 'es', 'ar'];
export const LANG_LABEL: Record<Lang, string> = { en: 'English', zh: '中文', ru: 'Русский', es: 'Español', ar: 'العربية' };
export const isRtl = (l: Lang) => l === 'ar';
/** Contact details. EMAIL is a placeholder, pending change. */
export const CONTACT = {
  whatsapp: '+34 644 79 44 22', whatsappUrl: 'https://wa.me/34644794422',
  wechat: '+86 191 2118 9461',
  email: 'hello@example.com', emailPending: true,
  instagram: 'https://www.instagram.com/rev8.club', tiktok: 'https://www.tiktok.com/@rev8club',
};
/** Localized text. `zh` (Simplified Chinese) can be added later without code changes. */
export type L10n = Record<'en' | 'es', string> & Partial<Record<'zh' | 'ru' | 'ar', string>>;
/** Localized text with English fallback. */
export const tx = (o: L10n | undefined, lang: Lang): string => (o ? o[lang] ?? o.en : '');

export type CategoryId = 'supercars' | 'suvs' | 'gt' | 'sedans' | 'vans';
export type BodyShape = 'supercar' | 'suv' | 'gt' | 'van';

export interface Vehicle {
  id: string;            // also the photo file name: images/<id>.webp
  brand: string;
  model: string;         // from the price sheet / photo folder
  variant?: L10n;        // distinguishes two cars of the same model
  category: CategoryId;
  shape: BodyShape;      // placeholder silhouette if a photo is missing
  description: L10n;
  /** Minimum public price per day in CNY. null = "Price on request". */
  publicPrice: number | null;
  /** Price-sheet row this car was matched to (for traceability). */
  sheetRef?: string;
  /** Internal review note (shown only with "Review notes" on). */
  note?: L10n;
  photoPosition?: string; // CSS object-position for portrait photos
  featured?: boolean;
}

export const CURRENCY = 'CNY';

export const CATEGORIES: { id: CategoryId; label: L10n }[] = [
  { id: 'supercars', label: { en: 'Supercars', es: 'Superdeportivos' } },
  { id: 'suvs', label: { en: 'Luxury SUVs', es: 'SUV de lujo' } },
  { id: 'gt', label: { en: 'Grand Touring', es: 'Gran Turismo' } },
  { id: 'sedans', label: { en: 'Luxury Sedans', es: 'Berlinas de lujo' } },
  { id: 'vans', label: { en: 'VIP Vans', es: 'Furgonetas VIP' } },
];

const d = (en: string, es: string): L10n => ({ en, es });

export const VEHICLES: Vehicle[] = [
  // ── Supercars ──
  { id: 'lamborghini-huracan-performante', brand: 'Lamborghini', model: 'Huracán Performante', category: 'supercars', shape: 'supercar',
    description: d('The track-honed Huracán: active aero, a naturally aspirated V10 and a soundtrack to match.', 'El Huracán más radical: aerodinámica activa, V10 atmosférico y un sonido a la altura.'),
    publicPrice: null, note: d('Not in the price sheet — price on request.', 'No está en el Excel — precio a consultar.') },
  { id: 'lamborghini-huracan-evo-spider', brand: 'Lamborghini', model: 'Huracán EVO Spider', category: 'supercars', shape: 'supercar', featured: true,
    description: d('Open-top V10 drama. The roof folds away in seconds; the city never sounds the same again.', 'Drama V10 a cielo abierto. La capota desaparece en segundos y la ciudad ya no suena igual.'),
    publicPrice: 3000, sheetRef: 'RV-025' },
  { id: 'ferrari-sf90', brand: 'Ferrari', model: 'SF90', category: 'supercars', shape: 'supercar',
    description: d('Maranello’s plug-in hybrid flagship, finished in a tricolore livery that commands attention.', 'El buque insignia híbrido de Maranello, con una decoración tricolor que no pasa desapercibida.'),
    publicPrice: 5000, sheetRef: 'RV-020', note: d('Matched to “SF90” (¥5,000), not SF90 Spider (¥6,000) — confirm.', 'Asignado a «SF90» (5.000 ¥), no a SF90 Spider (6.000 ¥) — confirmar.') },
  { id: 'ferrari-296-gtb', brand: 'Ferrari', model: '296 GTB', category: 'supercars', shape: 'supercar',
    description: d('Compact, agile and hybrid. The new generation of the mid-engined Ferrari berlinetta.', 'Compacto, ágil e híbrido. La nueva generación de la berlinetta Ferrari de motor central.'),
    publicPrice: 4000, sheetRef: 'RV-010' },
  { id: 'ferrari-296-gts', brand: 'Ferrari', model: '296 GTS', category: 'supercars', shape: 'supercar',
    description: d('The open-top 296 in black and gold livery: hybrid performance with the sky as the roof.', 'El 296 descapotable en negro y oro: prestaciones híbridas con el cielo como techo.'),
    publicPrice: 4500, sheetRef: 'RV-011' },
  { id: 'ferrari-f8-spider-yellow', brand: 'Ferrari', model: 'F8 Spider', variant: d('Giallo', 'Amarillo'), category: 'supercars', shape: 'supercar', featured: true,
    description: d('Twin-turbo V8 and a retractable hard top, in a yellow made for Shanghai sunshine.', 'V8 biturbo y techo duro retráctil, en un amarillo hecho para el sol de Shanghái.'),
    publicPrice: 3450, sheetRef: 'RV-017' },
  { id: 'ferrari-f8-spider-red', brand: 'Ferrari', model: 'F8 Spider', variant: d('Rosso', 'Rojo'), category: 'supercars', shape: 'supercar',
    description: d('The classic: Rosso Ferrari, a twin-turbo V8 and open-air driving after dark.', 'El clásico: Rosso Ferrari, V8 biturbo y conducción a cielo abierto al caer la noche.'),
    publicPrice: 3450, sheetRef: 'RV-017' },
  { id: 'ferrari-812', brand: 'Ferrari', model: '812', category: 'supercars', shape: 'supercar',
    description: d('Front-mounted V12 grand touring at its most extreme, in red with yellow racing stripes.', 'Gran turismo con V12 delantero en su versión más extrema, en rojo con franjas amarillas.'),
    publicPrice: 4000, sheetRef: 'RV-014' },
  { id: 'porsche-918', brand: 'Porsche', model: '918 Spyder', category: 'supercars', shape: 'supercar',
    description: d('A hypercar icon in Martini racing livery. One of the rarest drives in the city.', 'Un icono hiperdeportivo con decoración Martini. Una de las experiencias más exclusivas de la ciudad.'),
    publicPrice: null, note: d('Not in the price sheet — price on request.', 'No está en el Excel — precio a consultar.') },
  { id: 'porsche-gt3-rs', brand: 'Porsche', model: '911 GT3 RS (992)', category: 'supercars', shape: 'supercar', photoPosition: '50% 58%',
    description: d('Motorsport engineering for the road: swan-neck wing, 9,000 rpm and pure precision.', 'Ingeniería de competición para la calle: alerón cuello de cisne, 9.000 rpm y precisión pura.'),
    publicPrice: 10000, sheetRef: 'RV-039' },

  // ── Luxury SUVs ──
  { id: 'rolls-royce-cullinan-bb-turquoise', brand: 'Rolls-Royce', model: 'Cullinan Black Badge', variant: d('Turquoise', 'Turquesa'), category: 'suvs', shape: 'suv', featured: true,
    description: d('The darker, more assertive Cullinan. Effortless presence for business and celebration alike.', 'El Cullinan más oscuro y rotundo. Presencia sin esfuerzo tanto para negocios como para celebraciones.'),
    publicPrice: 6000, sheetRef: 'RV-046' },
  { id: 'rolls-royce-cullinan-bb-yellow', brand: 'Rolls-Royce', model: 'Cullinan Black Badge', variant: d('Forged Yellow', 'Amarillo Forjado'), category: 'suvs', shape: 'suv',
    description: d('Black Badge character with Forged Yellow details. Arrive anywhere, unmistakably.', 'Carácter Black Badge con detalles en Amarillo Forjado. Llega a cualquier sitio, inconfundible.'),
    publicPrice: 6000, sheetRef: 'RV-046' },
  { id: 'rolls-royce-cullinan-blue', brand: 'Rolls-Royce', model: 'Cullinan', variant: d('Blue interior', 'Interior azul'), category: 'suvs', shape: 'suv',
    description: d('Serene, commanding and finished with a striking blue cabin.', 'Sereno, imponente y con un llamativo habitáculo en azul.'),
    publicPrice: null, note: d('Which row: 5-seat skylight (¥4,500) or 4-seat (¥5,000)?', '¿Qué fila: 5 plazas techo cielo (4.500 ¥) o 4 plazas (5.000 ¥)?') },
  { id: 'rolls-royce-cullinan-2025', brand: 'Rolls-Royce', model: 'Cullinan', variant: d('2025 styling', 'Estética 2025'), category: 'suvs', shape: 'suv',
    description: d('Updated with the latest Cullinan design, including the illuminated grille.', 'Actualizado con el último diseño del Cullinan, incluida la parrilla iluminada.'),
    publicPrice: null, note: d('Which row: 5-seat skylight (¥4,500) or 4-seat (¥5,000)?', '¿Qué fila: 5 plazas techo cielo (4.500 ¥) o 4 plazas (5.000 ¥)?') },
  { id: 'ferrari-purosangue', brand: 'Ferrari', model: 'Purosangue', category: 'suvs', shape: 'suv',
    description: d('Ferrari’s first four-door, four-seater, with a naturally aspirated V12 at its heart.', 'El primer Ferrari de cuatro puertas y cuatro plazas, con un V12 atmosférico como corazón.'),
    publicPrice: 8050, sheetRef: 'RV-018' },
  { id: 'lamborghini-urus', brand: 'Lamborghini', model: 'Urus', category: 'suvs', shape: 'suv',
    description: d('A super SUV with Lamborghini DNA: space for the family, performance for the driver.', 'Un súper SUV con ADN Lamborghini: espacio para la familia, prestaciones para quien conduce.'),
    publicPrice: 2500, sheetRef: 'RV-027' },
  { id: 'aston-martin-dbx', brand: 'Aston Martin', model: 'DBX', category: 'suvs', shape: 'suv',
    description: d('British elegance with a sporting edge, made for long days in and around the city.', 'Elegancia británica con un toque deportivo, pensada para largas jornadas dentro y fuera de la ciudad.'),
    publicPrice: 3000, sheetRef: 'RV-002' },
  { id: 'range-rover', brand: 'Land Rover', model: 'Range Rover', category: 'suvs', shape: 'suv',
    description: d('Commanding, refined and discreet. A composed choice for business and family travel.', 'Imponente, refinado y discreto. Una elección serena para viajes de negocios o en familia.'),
    publicPrice: 2500, sheetRef: 'RV-030' },
  { id: 'mercedes-g63', brand: 'Mercedes-AMG', model: 'G 63', category: 'suvs', shape: 'suv',
    description: d('The icon, in its most powerful form. Unmistakable on any street.', 'El icono en su versión más potente. Inconfundible en cualquier calle.'),
    publicPrice: 3000, sheetRef: 'RV-033' },
  { id: 'mercedes-g350', brand: 'Mercedes-Benz', model: 'G 350 (2024)', category: 'suvs', shape: 'suv',
    description: d('Timeless G-Class design with everyday comfort.', 'El diseño atemporal del Clase G con confort para el día a día.'),
    publicPrice: null, note: d('Not in the price sheet (only G 500 at ¥2,500) — price on request.', 'No está en el Excel (solo G 500 a 2.500 ¥) — precio a consultar.') },
  { id: 'mercedes-maybach-gls', brand: 'Mercedes-Maybach', model: 'GLS 480', category: 'suvs', shape: 'suv',
    description: d('Two-tone Maybach luxury with a first-class rear cabin.', 'Lujo Maybach bicolor con unas plazas traseras de primera clase.'),
    publicPrice: null, note: d('Sheet lists “Maybach S480” (¥800) — is that this car?', 'El Excel dice «Maybach S480» (800 ¥) — ¿es este coche?') },

  // ── Grand Touring ──
  { id: 'rolls-royce-dawn-white', brand: 'Rolls-Royce', model: 'Dawn', variant: d('White', 'Blanco'), category: 'gt', shape: 'gt',
    description: d('Open-air serenity. Ideal for weddings, celebrations and golden-hour drives along the Bund.', 'Serenidad a cielo abierto. Ideal para bodas, celebraciones y paseos al atardecer por el Bund.'),
    publicPrice: 3000, sheetRef: 'RV-048' },
  { id: 'rolls-royce-dawn-grey', brand: 'Rolls-Royce', model: 'Dawn', variant: d('Silver', 'Plata'), category: 'gt', shape: 'gt',
    description: d('The four-seat Rolls-Royce convertible in a two-tone finish.', 'El descapotable de cuatro plazas de Rolls-Royce en acabado bicolor.'),
    publicPrice: 3000, sheetRef: 'RV-048' },
  { id: 'bentley-continental-gt', brand: 'Bentley', model: 'Continental GT', category: 'gt', shape: 'gt',
    description: d('Hand-finished craftsmanship and effortless power for occasions that deserve more.', 'Artesanía acabada a mano y potencia sin esfuerzo para ocasiones que merecen más.'),
    publicPrice: 3500, sheetRef: 'RV-004' },
  { id: 'bmw-m4-convertible', brand: 'BMW', model: 'M4 Convertible', category: 'gt', shape: 'gt',
    description: d('Six-cylinder M performance with the roof down, in a striking green.', 'Prestaciones M de seis cilindros a cielo abierto, en un verde que no pasa desapercibido.'),
    publicPrice: 1150, sheetRef: 'RV-007', note: d('Sheet has two M4 rows (¥1,200 and ¥1,150) — showing “from ¥1,150”.', 'El Excel tiene dos M4 (1.200 y 1.150 ¥) — se muestra «desde 1.150 ¥».') },

  // ── Luxury Sedans ──
  { id: 'rolls-royce-ghost', brand: 'Rolls-Royce', model: 'Ghost', category: 'sedans', shape: 'gt',
    description: d('Understated, whisper-quiet luxury. The executive’s Rolls-Royce.', 'Lujo discreto y silencioso. El Rolls-Royce de los ejecutivos.'),
    publicPrice: 2500, sheetRef: 'RV-049' },
  { id: 'bentley-flying-spur', brand: 'Bentley', model: 'Flying Spur', category: 'sedans', shape: 'gt',
    description: d('A grand saloon with a sporting soul and a beautifully crafted rear cabin.', 'Una gran berlina con alma deportiva y unas plazas traseras exquisitamente acabadas.'),
    publicPrice: null, note: d('Not in the price sheet — price on request.', 'No está en el Excel — precio a consultar.') },
  { id: 'bmw-7-series', brand: 'BMW', model: '7 Series', category: 'sedans', shape: 'gt',
    description: d('Contemporary luxury and technology for business days in the city.', 'Lujo y tecnología contemporáneos para jornadas de negocios en la ciudad.'),
    publicPrice: 800, sheetRef: 'RV-009' },

  // ── VIP Vans ──
  { id: 'toyota-alphard', brand: 'Toyota', model: 'Alphard (2024)', category: 'vans', shape: 'van', photoPosition: '50% 70%',
    description: d('First-class comfort for groups, airport transfers and executive travel.', 'Confort de primera clase para grupos, traslados al aeropuerto y viajes de empresa.'),
    publicPrice: 1000, sheetRef: 'RV-052' },
];

/** Price-sheet rows with no real photo yet (pending from George). Not shown to customers. */
export const PENDING_PHOTOS: { ref: string; name: string; price: number }[] = [
  { ref: 'RV-001', name: 'Aston Martin DB11', price: 2300 }, { ref: 'RV-003', name: 'Bentley Bentayga', price: 3500 },
  { ref: 'RV-005', name: 'BMW iX', price: 1000 }, { ref: 'RV-006', name: 'BMW M4', price: 1200 }, { ref: 'RV-008', name: 'BMW M5', price: 800 },
  { ref: 'RV-012', name: 'Ferrari 488', price: 2000 }, { ref: 'RV-013', name: 'Ferrari 488', price: 2500 },
  { ref: 'RV-015', name: 'Ferrari California T', price: 2000 }, { ref: 'RV-016', name: 'Ferrari F8 Coupe', price: 2800 },
  { ref: 'RV-019', name: 'Ferrari Roma', price: 3000 }, { ref: 'RV-021', name: 'Ferrari SF90 Spider', price: 6000 },
  { ref: 'RV-022', name: 'Lamborghini Aventador LP700', price: 3500 }, { ref: 'RV-023', name: 'Lamborghini Aventador SVJ', price: 13000 },
  { ref: 'RV-024', name: 'Lamborghini Huracán EVO', price: 2500 }, { ref: 'RV-026', name: 'Lamborghini Revuelto', price: 12000 },
  { ref: 'RV-028', name: 'Land Rover Defender New Model', price: 1200 }, { ref: 'RV-029', name: 'Land Rover Defender', price: 1000 },
  { ref: 'RV-031', name: 'Maserati Levante', price: 800 }, { ref: 'RV-032', name: 'Maserati Quattroporte', price: 800 },
  { ref: 'RV-034', name: 'Mercedes-Benz Clase G G500', price: 2500 }, { ref: 'RV-035', name: 'Mercedes-Benz Maybach S480', price: 800 },
  { ref: 'RV-036', name: 'Mercedes-Benz Clase V', price: 600 }, { ref: 'RV-037', name: 'Porsche 911 (992.1)', price: 1200 },
  { ref: 'RV-038', name: 'Porsche 911 GT3 (992.1)', price: 7000 }, { ref: 'RV-040', name: 'Porsche Cayenne 2024', price: 2000 },
  { ref: 'RV-042', name: 'Porsche Panamera 2024', price: 2000 }, { ref: 'RV-050', name: 'Rolls-Royce Ghost 3', price: 3500 },
  { ref: 'RV-055', name: 'Zeekr 009', price: 900 },
];

export type ServiceIcon = 'key' | 'chauffeur' | 'plane' | 'event' | 'camera' | 'star';
export const SERVICES: { id: string; photo: string; icon: ServiceIcon; title: L10n; text: L10n }[] = [
  { id: 'self-drive', photo: 'services/self-drive', icon: 'key',
    title: { en: 'Self-Drive Luxury Rental', es: 'Alquiler de lujo sin conductor' },
    text: { en: 'Take the wheel yourself. We help you with the paperwork you need to drive in China.', es: 'Conduce tú. Te ayudamos con la documentación necesaria para conducir en China.' } },
  { id: 'chauffeur', photo: 'services/chauffeur', icon: 'chauffeur',
    title: { en: 'Chauffeur Services', es: 'Servicio con chófer' },
    text: { en: 'Professional drivers for business days, evenings out and multi-stop itineraries.', es: 'Chóferes profesionales para jornadas de trabajo, noches de ocio e itinerarios con varias paradas.' } },
  { id: 'airport', photo: 'toyota-alphard', icon: 'plane',
    title: { en: 'Airport Transfers', es: 'Traslados al aeropuerto' },
    text: { en: 'Met at arrivals and driven straight to your hotel in comfort.', es: 'Te recibimos en llegadas y te llevamos directamente a tu hotel con total comodidad.' } },
  { id: 'events', photo: 'rolls-royce-dawn-white', icon: 'event',
    title: { en: 'Luxury Cars for Events', es: 'Coches de lujo para eventos' },
    text: { en: 'Weddings, launches and celebrations, with cars presented to perfection.', es: 'Bodas, presentaciones y celebraciones, con los coches presentados a la perfección.' } },
  { id: 'production', photo: 'porsche-918', icon: 'camera',
    title: { en: 'Photo & Film Productions', es: 'Producciones de foto y vídeo' },
    text: { en: 'Hero cars for shoots, campaigns and commercials, with on-set support.', es: 'Coches protagonistas para sesiones, campañas y anuncios, con asistencia en rodaje.' } },
  { id: 'experiences', photo: 'services/experiences', icon: 'star',
    title: { en: 'Bespoke Automotive Experiences', es: 'Experiencias a medida' },
    text: { en: 'Curated drives and moments designed around you and the car you love.', es: 'Rutas y momentos diseñados a tu medida y en torno al coche que te apasiona.' } },
];

// ─── Partner data (B2B) ──────────────────────────────────────
// PROTOTYPE ONLY. In production these terms live on the server and are
// returned only to the authenticated partner they belong to.
export interface Partner {
  id: string;        // referral identifier used in guest links
  name: string;
  type: L10n;
  commissionPct: number;
}

export const SAMPLE_PARTNERS: Partner[] = [
  { id: 'HTL-A01', name: 'Sample Hotel A', type: { en: 'Hotel', es: 'Hotel' }, commissionPct: 10 },
  { id: 'AGY-B02', name: 'Sample Travel Agency B', type: { en: 'Travel agency', es: 'Agencia de viajes' }, commissionPct: 15 },
  { id: 'CON-C03', name: 'Sample Concierge C', type: { en: 'Concierge', es: 'Conserjería' }, commissionPct: 12 },
];

export const fullName = (v: Vehicle, lang: Lang) => `${v.brand} ${v.model}${v.variant ? ' · ' + tx(v.variant, lang) : ''}`;
export const shortName = (v: Vehicle, lang: Lang) => `${v.model}${v.variant ? ' · ' + tx(v.variant, lang) : ''}`;

// ─── Simplified Chinese (keyed by the English text) ──────────
const ZH: Record<string, string> = {
  'Supercars': '超级跑车', 'Luxury SUVs': '豪华 SUV', 'Grand Touring': '豪华 GT', 'Luxury Sedans': '豪华轿车', 'VIP Vans': 'VIP 商务车',
  'Giallo': '黄色', 'Rosso': '红色', 'Turquoise': '绿松石色', 'Forged Yellow': '锻造黄', 'Blue interior': '蓝色内饰', '2025 styling': '2025 款造型', 'White': '白色', 'Silver': '银色',
  'Hotel': '酒店', 'Travel agency': '旅行社', 'Concierge': '礼宾服务',
  'The track-honed Huracán: active aero, a naturally aspirated V10 and a soundtrack to match.': '为赛道而生的 Huracán：主动空气动力学、自然吸气 V10，声浪同样震撼。',
  'Open-top V10 drama. The roof folds away in seconds; the city never sounds the same again.': '敞篷 V10 的极致张力。顶篷数秒即可收起，城市从此听起来与众不同。',
  'Maranello’s plug-in hybrid flagship, finished in a tricolore livery that commands attention.': '马拉内罗的插电混动旗舰，意式三色涂装，吸睛十足。',
  'Compact, agile and hybrid. The new generation of the mid-engined Ferrari berlinetta.': '紧凑、灵动、混合动力。新一代中置引擎法拉利跑车。',
  'The open-top 296 in black and gold livery: hybrid performance with the sky as the roof.': '黑金涂装的敞篷 296：以天空为顶的混动性能。',
  'Twin-turbo V8 and a retractable hard top, in a yellow made for Shanghai sunshine.': '双涡轮增压 V8 与可收折硬顶，一抹为上海阳光而生的黄色。',
  'The classic: Rosso Ferrari, a twin-turbo V8 and open-air driving after dark.': '经典之选：法拉利红、双涡轮增压 V8，夜色中敞篷驰骋。',
  'Front-mounted V12 grand touring at its most extreme, in red with yellow racing stripes.': '前置 V12 的极致 GT，红色车身配黄色赛道条纹。',
  'A hypercar icon in Martini racing livery. One of the rarest drives in the city.': '马天尼赛车涂装的超跑传奇，城中最稀有的驾驶体验之一。',
  'Motorsport engineering for the road: swan-neck wing, 9,000 rpm and pure precision.': '公路上的赛车工程：鹅颈尾翼、9,000 转与纯粹的精准。',
  'The darker, more assertive Cullinan. Effortless presence for business and celebration alike.': '更深邃、更霸气的库里南。无论商务还是庆典，气场自成。',
  'Black Badge character with Forged Yellow details. Arrive anywhere, unmistakably.': 'Black Badge 的性格，搭配锻造黄细节。所到之处，辨识度满分。',
  'Serene, commanding and finished with a striking blue cabin.': '沉稳大气，配以夺目的蓝色内饰。',
  'Updated with the latest Cullinan design, including the illuminated grille.': '采用最新库里南设计，包括可点亮的格栅。',
  'Ferrari’s first four-door, four-seater, with a naturally aspirated V12 at its heart.': '法拉利首款四门四座车型，搭载自然吸气 V12。',
  'A super SUV with Lamborghini DNA: space for the family, performance for the driver.': '流淌兰博基尼血统的超级 SUV：家人有空间，驾驶者有性能。',
  'British elegance with a sporting edge, made for long days in and around the city.': '英伦优雅兼具运动气质，适合市区及周边的全天出行。',
  'Commanding, refined and discreet. A composed choice for business and family travel.': '气度不凡、精致低调。商务与家庭出行的从容之选。',
  'The icon, in its most powerful form. Unmistakable on any street.': '经典车型的最强形态，在任何街道都辨识度十足。',
  'Timeless G-Class design with everyday comfort.': '经典永恒的 G 级设计，兼具日常舒适。',
  'Two-tone Maybach luxury with a first-class rear cabin.': '迈巴赫双色奢华，后排享受头等舱体验。',
  'Open-air serenity. Ideal for weddings, celebrations and golden-hour drives along the Bund.': '敞篷的宁静之美。婚礼、庆典或黄昏时分沿外滩兜风的理想之选。',
  'The four-seat Rolls-Royce convertible in a two-tone finish.': '双色涂装的劳斯莱斯四座敞篷车。',
  'Hand-finished craftsmanship and effortless power for occasions that deserve more.': '手工精制工艺与从容动力，为重要场合而生。',
  'Six-cylinder M performance with the roof down, in a striking green.': '敞篷享受六缸 M 性能，醒目的绿色车身。',
  'Understated, whisper-quiet luxury. The executive’s Rolls-Royce.': '低调静谧的奢华，商务精英的劳斯莱斯。',
  'A grand saloon with a sporting soul and a beautifully crafted rear cabin.': '兼具运动灵魂的豪华轿车，后排做工精美。',
  'Contemporary luxury and technology for business days in the city.': '当代奢华与科技，为城中商务行程而生。',
  'First-class comfort for groups, airport transfers and executive travel.': '头等舱般的舒适，适合团队出行、机场接送及商务差旅。',
  'Self-Drive Luxury Rental': '豪华自驾租车', 'Take the wheel yourself. We help you with the paperwork you need to drive in China.': '亲自驾驶。我们协助您办理在中国驾车所需的手续。',
  'Chauffeur Services': '专属司机服务', 'Professional drivers for business days, evenings out and multi-stop itineraries.': '专业司机，服务于商务日程、夜间出行及多站行程。',
  'Airport Transfers': '机场接送', 'Met at arrivals and driven straight to your hotel in comfort.': '抵达口迎接，舒适直达您的酒店。',
  'Luxury Cars for Events': '活动用豪华车', 'Weddings, launches and celebrations, with cars presented to perfection.': '婚礼、发布会与庆典，车辆完美呈现。',
  'Photo & Film Productions': '摄影与影视拍摄', 'Hero cars for shoots, campaigns and commercials, with on-set support.': '为拍摄、广告与宣传提供主角用车，并提供现场支持。',
  'Bespoke Automotive Experiences': '定制驾驶体验', 'Curated drives and moments designed around you and the car you love.': '围绕您与心爱座驾精心策划的驾驶旅程与难忘时刻。',
};
import { RU, AR } from './tr';
const addZh = (o?: L10n) => { if (!o) return; if (!o.zh && ZH[o.en]) o.zh = ZH[o.en]; if (!o.ru && RU[o.en]) o.ru = RU[o.en]; if (!o.ar && AR[o.en]) o.ar = AR[o.en]; };
CATEGORIES.forEach((c) => addZh(c.label));
VEHICLES.forEach((v) => { addZh(v.description); addZh(v.variant); });
SERVICES.forEach((x) => { addZh(x.title); addZh(x.text); });
SAMPLE_PARTNERS.forEach((p) => addZh(p.type));

/** Extra gallery photos per car: images/g/<id>-1..N.webp (no visible plates: sides, interiors, details). */
export const GALLERY: Record<string, number> = {
  'lamborghini-huracan-performante': 3,
  'lamborghini-huracan-evo-spider': 5,
  'ferrari-f8-spider-yellow': 5,
};

/** Headline specs (manufacturer figures, approx.). Only filled where the exact model is clear; others stay empty until confirmed. */
export type Specs = { seats?: number; hp?: number; zero100?: number; top?: number; engine?: string };
export const SPECS: Record<string, Specs> = {
  'lamborghini-huracan-performante': { seats: 2, hp: 640, zero100: 2.9, top: 325, engine: 'V10 5.2' },
  'lamborghini-huracan-evo-spider': { seats: 2, hp: 640, zero100: 3.1, top: 325, engine: 'V10 5.2' },
  'ferrari-sf90': { seats: 2, hp: 1000, zero100: 2.5, top: 340, engine: 'V8 hybrid' },
  'ferrari-296-gtb': { seats: 2, hp: 830, zero100: 2.9, top: 330, engine: 'V6 hybrid' },
  'ferrari-296-gts': { seats: 2, hp: 830, zero100: 2.9, top: 330, engine: 'V6 hybrid' },
  'ferrari-f8-spider-yellow': { seats: 2, hp: 720, zero100: 2.9, top: 340, engine: 'V8 3.9 turbo' },
  'ferrari-f8-spider-red': { seats: 2, hp: 720, zero100: 2.9, top: 340, engine: 'V8 3.9 turbo' },
  'ferrari-812': { seats: 2, hp: 800, zero100: 2.9, top: 340, engine: 'V12 6.5' },
  'porsche-918': { seats: 2, hp: 887, zero100: 2.6, top: 345, engine: 'V8 hybrid' },
  'porsche-gt3-rs': { seats: 2, hp: 525, zero100: 3.2, top: 296, engine: 'Flat-6 4.0' },
  'rolls-royce-cullinan-bb-turquoise': { seats: 5, hp: 600, zero100: 5.0, top: 250, engine: 'V12 6.75 turbo' },
  'rolls-royce-cullinan-bb-yellow': { seats: 5, hp: 600, zero100: 5.0, top: 250, engine: 'V12 6.75 turbo' },
  'rolls-royce-cullinan-blue': { seats: 5, hp: 563, zero100: 5.2, top: 250, engine: 'V12 6.75 turbo' },
  'rolls-royce-cullinan-2025': { seats: 5, hp: 563, zero100: 5.2, top: 250, engine: 'V12 6.75 turbo' },
  'ferrari-purosangue': { seats: 4, hp: 725, zero100: 3.3, top: 310, engine: 'V12 6.5' },
  'mercedes-g63': { seats: 5, hp: 585, zero100: 4.5, top: 220, engine: 'V8 4.0 turbo' },
  'rolls-royce-dawn-white': { seats: 4, hp: 563, zero100: 4.9, top: 250, engine: 'V12 6.6 turbo' },
  'rolls-royce-dawn-grey': { seats: 4, hp: 563, zero100: 4.9, top: 250, engine: 'V12 6.6 turbo' },
  'rolls-royce-ghost': { seats: 5, hp: 563, zero100: 4.8, top: 250, engine: 'V12 6.75 turbo' },
  'toyota-alphard': { seats: 7 },
};
