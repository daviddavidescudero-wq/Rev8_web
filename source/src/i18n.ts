import type { Lang } from './data';

// UI strings. Add a `zh` block with the same keys to support Simplified Chinese.
const en = {
  nav: { fleet: 'Fleet', services: 'Services', experience: 'Experience', echolocation: 'Echolocation Trip', contact: 'Contact', hotels: 'Hotels', book: 'Request a car' },
  hero: {
    eyebrow: 'Shanghai · Luxury Cars & Premium Mobility',
    title: 'Drive the Extraordinary.',
    subtitle: 'A curated collection of exceptional cars. Tailored service, unforgettable journeys.',
    ctaFleet: 'Explore Our Fleet', ctaServices: 'Our Services', scroll: 'Scroll',
  },
  featured: { eyebrow: 'The collection', title: 'Featured cars', all: 'View the full fleet' },
  experience: {
    eyebrow: 'The REV8 experience', title: 'Simple from the first message to the last mile.',
    steps: [
      ['Choose your car', 'Browse the collection and tell us your dates and plans.'],
      ['We confirm everything', 'Availability, rental terms and the documents you need to drive in China.'],
      ['Ready when you are', 'Your car prepared and handed over, with a team on call during your rental.'],
      ['Drive Shanghai', 'From the Bund to the open road: the city, on your terms.'],
    ],
  },
  services: { selfCta: 'See the self-drive cars', eyebrow: 'Services', title: 'Premium services', note: 'Proposed service categories — confirm commercial availability before launch.' },
  echo: {
    eyebrow: 'Our sister company', title: 'Beyond the drive.',
    text: 'Echolocation Trip designs bespoke journeys across China — private, cultural and unforgettable. Pair your REV8 car with a complete itinerary.',
    items: ['Bespoke itineraries', 'Luxury experiences in China', 'Private tours', 'Cultural experiences', 'Yachts & river cruises', 'Fine dining', 'VIP travel services'],
    cta: 'Visit Echolocation Trip', soon: 'Website coming soon',
  },
  contact: { eyebrow: 'Bookings', title: 'Tell us where you want to go.', text: 'Share your dates and the car you have in mind. Our team will confirm availability and every detail personally.', cta: 'Request availability' },
  footer: { rights: 'All rights reserved.', city: 'Shanghai, China', terms: 'Terms', privacy: 'Privacy' },
  fleet: {
    eyebrow: 'Our fleet', title: 'The collection', search: 'Search brand or model', all: 'All',
    empty: 'No cars in this category yet.', noResults: 'No cars match your search.', clear: 'Clear filters',
    count: (n: number) => `${n} ${n === 1 ? 'car' : 'cars'}`,
    moreEyebrow: 'On request', moreTitle: 'More models available', moreText: 'Not pictured yet, but part of our wider collection. Ask us about availability.', interested: 'Interested in',
  },
  card: { request: 'Request availability', details: 'View details', onRequest: 'Price on request', from: 'From', perDay: '/ day', illustrative: 'Illustrative', modelTbc: 'Model to be confirmed', categoryTbc: 'Category to be confirmed' },
  quick: {
    priceNote: 'Minimum daily rate. Final price depends on dates, duration and service.',
    specsNote: 'Manufacturer figures, approximate; may vary by exact version and year.',
    specs: 'Specifications', specsPending: 'Verified specifications will be published once confirmed.',
    options: 'Rental options', optionsPending: 'Self-drive and chauffeur options are confirmed per car on request.',
    phase2: 'Full vehicle page with gallery, terms and related cars comes in Phase 2.', close: 'Close',
  },
  photo: { pending: 'Photo pending', add: 'Add photo', replace: 'Replace photo', local: 'Preview only · not saved' },
  partner: {
    portal: 'Partner portal', as: 'Signed in as', reveal: 'Show net & commission', hide: 'Hide net & commission',
    guestView: 'Guest View', partnerView: 'Partner View', exitGuest: 'Partner View',
    share: 'Copy guest link', copied: 'Link copied', pdf: 'Guest PDF catalogue', pdfSoon: 'Phase 3',
    public: 'Guest price', net: 'Your net', commission: 'Your commission', netOnRequest: 'Net rate on request',
    calc: 'Commission calculator', calcHint: 'Enter any guest price (CNY)', terms: 'Your terms',
    secure: 'Hotel prices and commissions are still to be defined — the % shown are examples. Prototype — in production, net rates and commissions are calculated and served only by the server to the authenticated partner.',
    sampleLink: 'Sample link — not live yet',
  },
  proto: { label: 'Prototype · Phase 1', b2c: 'Customer site', b2b: 'Partner portal (demo)', sample: 'Sample prices', notes: 'Review notes' },
  form: {
    title: 'Request availability', subtitle: 'We reply personally with availability and terms.',
    name: 'Full name', email: 'Email', phone: 'Phone / WeChat / WhatsApp', vehicle: 'Car', anyCar: 'Not sure yet — advise me',
    from: 'From', to: 'To', service: 'Service', message: 'Message (optional)', guest: 'Guest name', onBehalf: 'Booking on behalf of a guest',
    serviceOpts: ['Self-drive', 'With chauffeur', 'Airport transfer', 'Event', 'Production / shoot', 'Not sure yet'],
    submit: 'Send request', required: 'Please fill in the required fields.', dates: 'The end date must be after the start date.',
    okTitle: 'Request sent', okText: 'Thank you! We have received your request and will reply by email or message as soon as possible.',
    ref: 'Reference', partnerRef: 'Partner referral', again: 'New request', close: 'Close',
  },
};

type Dict = typeof en;

const es: Dict = {
  nav: { fleet: 'Flota', services: 'Servicios', experience: 'Experiencia', echolocation: 'Echolocation Trip', contact: 'Contacto', hotels: 'Hoteles', book: 'Solicitar coche' },
  hero: {
    eyebrow: 'Shanghái · Coches de lujo y movilidad premium',
    title: 'Conduce lo extraordinario.',
    subtitle: 'Una colección selecta de coches excepcionales. Servicio a medida, viajes inolvidables.',
    ctaFleet: 'Ver la flota', ctaServices: 'Nuestros servicios', scroll: 'Desliza',
  },
  featured: { eyebrow: 'La colección', title: 'Coches destacados', all: 'Ver toda la flota' },
  experience: {
    eyebrow: 'La experiencia REV8', title: 'Sencillo desde el primer mensaje hasta el último kilómetro.',
    steps: [
      ['Elige tu coche', 'Explora la colección y cuéntanos tus fechas y planes.'],
      ['Lo confirmamos todo', 'Disponibilidad, condiciones y la documentación que necesitas para conducir en China.'],
      ['Listo cuando tú lo estés', 'Tu coche preparado y entregado, con un equipo disponible durante el alquiler.'],
      ['Conduce Shanghái', 'Del Bund a la carretera abierta: la ciudad, a tu manera.'],
    ],
  },
  services: { selfCta: 'Ver los coches sin conductor', eyebrow: 'Servicios', title: 'Servicios premium', note: 'Categorías de servicio propuestas — confirmar disponibilidad comercial antes del lanzamiento.' },
  echo: {
    eyebrow: 'Nuestra empresa hermana', title: 'Más allá de la conducción.',
    text: 'Echolocation Trip diseña viajes a medida por China: privados, culturales e inolvidables. Combina tu coche REV8 con un itinerario completo.',
    items: ['Itinerarios a medida', 'Experiencias de lujo en China', 'Tours privados', 'Experiencias culturales', 'Yates y cruceros fluviales', 'Alta gastronomía', 'Servicios de viaje VIP'],
    cta: 'Visitar Echolocation Trip', soon: 'Web próximamente',
  },
  contact: { eyebrow: 'Reservas', title: 'Cuéntanos adónde quieres ir.', text: 'Indícanos tus fechas y el coche que tienes en mente. Nuestro equipo confirmará personalmente la disponibilidad y cada detalle.', cta: 'Solicitar disponibilidad' },
  footer: { rights: 'Todos los derechos reservados.', city: 'Shanghái, China', terms: 'Condiciones', privacy: 'Privacidad' },
  fleet: {
    eyebrow: 'Nuestra flota', title: 'La colección', search: 'Buscar marca o modelo', all: 'Todos',
    empty: 'Todavía no hay coches en esta categoría.', noResults: 'Ningún coche coincide con tu búsqueda.', clear: 'Quitar filtros',
    count: (n: number) => `${n} ${n === 1 ? 'coche' : 'coches'}`,
    moreEyebrow: 'Bajo petición', moreTitle: 'Más modelos disponibles', moreText: 'Aún sin fotos aquí, pero forman parte de nuestra colección. Consúltanos la disponibilidad.', interested: 'Me interesa',
  },
  card: { request: 'Solicitar disponibilidad', details: 'Ver detalles', onRequest: 'Precio a consultar', from: 'Desde', perDay: '/ día', illustrative: 'Ilustrativo', modelTbc: 'Modelo por confirmar', categoryTbc: 'Categoría por confirmar' },
  quick: {
    priceNote: 'Precio mínimo por día. El precio final depende de fechas, duración y servicio.',
    specsNote: 'Datos del fabricante, aproximados; pueden variar según versión y año.',
    specs: 'Especificaciones', specsPending: 'Las especificaciones verificadas se publicarán cuando estén confirmadas.',
    options: 'Opciones de alquiler', optionsPending: 'Las opciones sin conductor y con chófer se confirman para cada coche bajo petición.',
    phase2: 'La ficha completa con galería, condiciones y coches relacionados llega en la Fase 2.', close: 'Cerrar',
  },
  photo: { pending: 'Foto pendiente', add: 'Añadir foto', replace: 'Cambiar foto', local: 'Solo vista previa · no se guarda' },
  partner: {
    portal: 'Portal de socios', as: 'Sesión como', reveal: 'Ver neto y comisión', hide: 'Ocultar neto y comisión',
    guestView: 'Vista cliente', partnerView: 'Vista socio', exitGuest: 'Vista socio',
    share: 'Copiar enlace para clientes', copied: 'Enlace copiado', pdf: 'Catálogo PDF para clientes', pdfSoon: 'Fase 3',
    public: 'Precio cliente', net: 'Tu neto', commission: 'Tu comisión', netOnRequest: 'Neto a consultar',
    calc: 'Calculadora de comisión', calcHint: 'Introduce cualquier precio cliente (CNY)', terms: 'Tus condiciones',
    secure: 'Precios para hoteles y comisiones pendientes de definir — los % son de ejemplo. Prototipo — en producción, el neto y la comisión los calcula y los envía solo el servidor al socio autenticado.',
    sampleLink: 'Enlace de ejemplo — aún no está activo',
  },
  proto: { label: 'Prototipo · Fase 1', b2c: 'Web de clientes', b2b: 'Portal de socios (demo)', sample: 'Precios de ejemplo', notes: 'Notas de revisión' },
  form: {
    title: 'Solicitar disponibilidad', subtitle: 'Te respondemos personalmente con disponibilidad y condiciones.',
    name: 'Nombre completo', email: 'Email', phone: 'Teléfono / WeChat / WhatsApp', vehicle: 'Coche', anyCar: 'Aún no lo sé — aconsejadme',
    from: 'Desde', to: 'Hasta', service: 'Servicio', message: 'Mensaje (opcional)', guest: 'Nombre del cliente', onBehalf: 'Reserva en nombre de un cliente',
    serviceOpts: ['Sin conductor', 'Con chófer', 'Traslado aeropuerto', 'Evento', 'Producción / rodaje', 'Aún no lo sé'],
    submit: 'Enviar solicitud', required: 'Rellena los campos obligatorios.', dates: 'La fecha final debe ser posterior a la inicial.',
    okTitle: 'Solicitud enviada', okText: '¡Gracias! Hemos recibido tu solicitud y te responderemos por email o mensaje lo antes posible.',
    ref: 'Referencia', partnerRef: 'Referencia de socio', again: 'Nueva solicitud', close: 'Cerrar',
  },
};


const zh: Dict = {
  nav: { fleet: '车队', services: '服务', experience: '体验', echolocation: 'Echolocation Trip', contact: '联系我们', hotels: '酒店合作', book: '预约用车' },
  hero: {
    eyebrow: '上海 · 豪华座驾与高端出行',
    title: '驾驭非凡。',
    subtitle: '精选非凡座驾。量身定制的服务，难忘的旅程。',
    ctaFleet: '浏览车队', ctaServices: '我们的服务', scroll: '向下滚动',
  },
  featured: { eyebrow: '精选系列', title: '推荐车型', all: '查看全部车队' },
  experience: {
    eyebrow: 'REV8 体验', title: '从第一条消息到最后一公里，一切简单。',
    steps: [
      ['选择座驾', '浏览车队，告诉我们您的日期和行程。'],
      ['我们确认一切', '车辆可用性、租赁条款以及在中国驾车所需的手续。'],
      ['随时为您备好', '车辆整备完毕并交付给您，租赁期间团队随时待命。'],
      ['驾驭上海', '从外滩到郊外公路：按您的节奏畅游这座城市。'],
    ],
  },
  services: { selfCta: '查看自驾车型', eyebrow: '服务', title: '尊享服务', note: '拟定的服务类别——上线前需确认是否提供。' },
  echo: {
    eyebrow: '我们的姊妹公司', title: '不止于驾驶。',
    text: 'Echolocation Trip 为您定制中国之旅——私密、人文、难忘。将您的 REV8 座驾与完整行程相结合。',
    items: ['定制行程', '中国奢华体验', '私人导览', '人文体验', '游艇与游船', '高端美食', 'VIP 出行服务'],
    cta: '访问 Echolocation Trip', soon: '网站即将上线',
  },
  contact: { eyebrow: '预订', title: '告诉我们您想去哪里。', text: '告诉我们您的日期和心仪的车型。我们的团队将亲自为您确认车辆及每一个细节。', cta: '查询可用性' },
  footer: { rights: '保留所有权利。', city: '中国 · 上海', terms: '条款', privacy: '隐私' },
  fleet: {
    eyebrow: '我们的车队', title: '车队一览', search: '搜索品牌或车型', all: '全部',
    empty: '该类别暂无车辆。', noResults: '没有符合搜索条件的车辆。', clear: '清除筛选',
    count: (n: number) => `共 ${n} 辆`,
    moreEyebrow: '可预约', moreTitle: '更多车型', moreText: '暂无图片，但属于我们的车队。欢迎咨询。', interested: '感兴趣的车型',
  },
  card: { request: '查询可用性', details: '查看详情', onRequest: '价格面议', from: '起', perDay: '/ 天', illustrative: '示例', modelTbc: '车型待确认', categoryTbc: '类别待确认' },
  quick: {
    priceNote: '每日最低价格。最终价格取决于日期、租期和服务。',
    specsNote: '厂商公布数据，仅供参考；因具体版本和年份而异。',
    specs: '技术参数', specsPending: '经核实的参数将在确认后公布。',
    options: '租赁方式', optionsPending: '自驾或配司机的选项需按车辆单独确认。',
    phase2: '包含图库、条款和相关车型的完整车辆页面将在第二阶段推出。', close: '关闭',
  },
  photo: { pending: '图片待补充', add: '添加图片', replace: '更换图片', local: '仅预览 · 不会保存' },
  partner: {
    portal: '合作伙伴门户', as: '当前身份', reveal: '显示净价与佣金', hide: '隐藏净价与佣金',
    guestView: '客人视图', partnerView: '合作伙伴视图', exitGuest: '合作伙伴视图',
    share: '复制客人链接', copied: '链接已复制', pdf: '客人版 PDF 目录', pdfSoon: '第三阶段',
    public: '客人价格', net: '您的净价', commission: '您的佣金', netOnRequest: '净价面议',
    calc: '佣金计算器', calcHint: '输入任意客人价格（人民币）', terms: '您的条款',
    secure: '酒店价格和佣金尚待确定——所示百分比仅为示例。原型说明：正式上线后，净价和佣金仅由服务器计算并发送给已登录的合作伙伴。',
    sampleLink: '示例链接——尚未上线',
  },
  proto: { label: '原型 · 第一阶段', b2c: '客户网站', b2b: '合作伙伴门户（演示）', sample: '示例价格', notes: '审阅备注' },
  form: {
    title: '查询可用性', subtitle: '我们会亲自回复车辆情况和租赁条款。',
    name: '姓名', email: '邮箱', phone: '电话 / 微信 / WhatsApp', vehicle: '车型', anyCar: '还不确定——请给我建议',
    from: '开始日期', to: '结束日期', service: '服务', message: '留言（可选）', guest: '客人姓名', onBehalf: '代客人预订',
    serviceOpts: ['自驾', '配司机', '机场接送', '活动', '拍摄 / 制作', '还不确定'],
    submit: '发送请求', required: '请填写必填项。', dates: '结束日期必须晚于开始日期。',
    okTitle: '请求已发送', okText: '谢谢！我们已收到您的请求，会尽快通过邮件或消息回复您。',
    ref: '编号', partnerRef: '合作伙伴推荐码', again: '新的请求', close: '关闭',
  },
};


const ru: Dict = {
  nav: { fleet: 'Автопарк', services: 'Услуги', experience: 'Опыт', echolocation: 'Echolocation Trip', contact: 'Контакты', hotels: 'Для отелей', book: 'Запросить авто' },
  hero: {
    eyebrow: 'Шанхай · Премиальные авто и мобильность',
    title: 'Водите необыкновенное.',
    subtitle: 'Тщательно подобранная коллекция выдающихся автомобилей. Индивидуальный сервис и незабываемые поездки.',
    ctaFleet: 'Смотреть автопарк', ctaServices: 'Наши услуги', scroll: 'Вниз',
  },
  featured: { eyebrow: 'Коллекция', title: 'Избранные авто', all: 'Весь автопарк' },
  experience: {
    eyebrow: 'Опыт REV8', title: 'Просто — от первого сообщения до последнего километра.',
    steps: [
      ['Выберите авто', 'Изучите коллекцию и сообщите нам даты и планы.'],
      ['Мы всё подтверждаем', 'Наличие, условия аренды и документы, необходимые для вождения в Китае.'],
      ['Готово к вашему приезду', 'Автомобиль подготовлен и передан вам, а команда на связи весь срок аренды.'],
      ['Откройте Шанхай', 'От набережной Бунд до загородных дорог: город на ваших условиях.'],
    ],
  },
  services: { selfCta: 'Авто для самостоятельной поездки', eyebrow: 'Услуги', title: 'Премиальные услуги', note: 'Предлагаемые категории услуг — перед запуском уточните доступность.' },
  echo: {
    eyebrow: 'Наша родственная компания', title: 'Больше, чем поездка.',
    text: 'Echolocation Trip создаёт индивидуальные путешествия по Китаю — частные, культурные и незабываемые. Дополните свой REV8 полным маршрутом.',
    items: ['Индивидуальные маршруты', 'Роскошные впечатления в Китае', 'Частные туры', 'Культурные программы', 'Яхты и речные круизы', 'Высокая кухня', 'VIP-сервис в поездках'],
    cta: 'Перейти в Echolocation Trip', soon: 'Сайт скоро появится',
  },
  contact: { eyebrow: 'Бронирование', title: 'Расскажите, куда хотите поехать.', text: 'Укажите даты и автомобиль, который вам нравится. Наша команда лично подтвердит наличие и все детали.', cta: 'Узнать о наличии' },
  footer: { rights: 'Все права защищены.', city: 'Шанхай, Китай', terms: 'Условия', privacy: 'Конфиденциальность' },
  fleet: {
    eyebrow: 'Наш автопарк', title: 'Коллекция', search: 'Поиск по марке или модели', all: 'Все',
    empty: 'В этой категории пока нет авто.', noResults: 'Нет авто по вашему запросу.', clear: 'Сбросить фильтры',
    count: (n: number) => `Авто: ${n}`,
    moreEyebrow: 'По запросу', moreTitle: 'Другие доступные модели', moreText: 'Пока без фото, но они входят в нашу коллекцию. Спросите о наличии.', interested: 'Интересует',
  },
  card: { request: 'Узнать о наличии', details: 'Подробнее', onRequest: 'Цена по запросу', from: 'От', perDay: '/ сутки', illustrative: 'Иллюстрация', modelTbc: 'Модель уточняется', categoryTbc: 'Категория уточняется' },
  quick: {
    priceNote: 'Минимальная цена за сутки. Итоговая цена зависит от дат, срока и услуги.',
    specsNote: 'Данные производителя, приблизительные; могут отличаться в зависимости от версии и года.',
    specs: 'Характеристики', specsPending: 'Проверенные характеристики будут опубликованы после подтверждения.',
    options: 'Варианты аренды', optionsPending: 'Аренда без водителя и с водителем уточняется по каждому авто.',
    phase2: 'Полная страница авто с галереей, условиями и похожими моделями появится во второй фазе.', close: 'Закрыть',
  },
  photo: { pending: 'Фото ожидается', add: 'Добавить фото', replace: 'Заменить фото', local: 'Только просмотр · не сохраняется' },
  partner: {
    portal: 'Портал партнёров', as: 'Вы вошли как', reveal: 'Показать нетто и комиссию', hide: 'Скрыть нетто и комиссию',
    guestView: 'Вид для гостя', partnerView: 'Вид партнёра', exitGuest: 'Вид партнёра',
    share: 'Скопировать ссылку для гостя', copied: 'Ссылка скопирована', pdf: 'PDF-каталог для гостя', pdfSoon: 'Фаза 3',
    public: 'Цена для гостя', net: 'Ваша нетто-цена', commission: 'Ваша комиссия', netOnRequest: 'Нетто по запросу',
    calc: 'Калькулятор комиссии', calcHint: 'Введите любую цену для гостя (CNY)', terms: 'Ваши условия',
    secure: 'Цены для отелей и комиссии ещё не определены — проценты приведены как пример. Прототип: в рабочей версии нетто-цены и комиссии рассчитываются и передаются только сервером авторизованному партнёру.',
    sampleLink: 'Пример ссылки — пока не активна',
  },
  proto: { label: 'Прототип · Фаза 1', b2c: 'Сайт для клиентов', b2b: 'Портал партнёров (демо)', sample: 'Примерные цены', notes: 'Заметки для проверки' },
  form: {
    title: 'Узнать о наличии', subtitle: 'Мы лично ответим о наличии и условиях.',
    name: 'Полное имя', email: 'Эл. почта', phone: 'Телефон / WeChat / WhatsApp', vehicle: 'Автомобиль', anyCar: 'Пока не знаю — посоветуйте',
    from: 'С', to: 'По', service: 'Услуга', message: 'Сообщение (необязательно)', guest: 'Имя гостя', onBehalf: 'Бронирование от имени гостя',
    serviceOpts: ['Без водителя', 'С водителем', 'Трансфер из аэропорта', 'Мероприятие', 'Съёмки / производство', 'Пока не знаю'],
    submit: 'Отправить запрос', required: 'Заполните обязательные поля.', dates: 'Дата окончания должна быть позже даты начала.',
    okTitle: 'Запрос отправлен', okText: 'Спасибо! Мы получили вашу заявку и ответим по почте или в мессенджере как можно скорее.',
    ref: 'Номер', partnerRef: 'Рекомендация партнёра', again: 'Новый запрос', close: 'Закрыть',
  },
};

const ar: Dict = {
  nav: { fleet: 'الأسطول', services: 'الخدمات', experience: 'التجربة', echolocation: 'Echolocation Trip', contact: 'تواصل معنا', hotels: 'للفنادق', book: 'اطلب سيارة' },
  hero: {
    eyebrow: 'شنغهاي · سيارات فاخرة وتنقل راقٍ',
    title: 'قُد ما هو استثنائي.',
    subtitle: 'مجموعة مختارة بعناية من السيارات الاستثنائية. خدمة مصممة خصيصاً لك ورحلات لا تُنسى.',
    ctaFleet: 'استكشف أسطولنا', ctaServices: 'خدماتنا', scroll: 'مرّر للأسفل',
  },
  featured: { eyebrow: 'المجموعة', title: 'سيارات مميزة', all: 'عرض الأسطول كاملاً' },
  experience: {
    eyebrow: 'تجربة REV8', title: 'بسيطة من أول رسالة إلى آخر كيلومتر.',
    steps: [
      ['اختر سيارتك', 'تصفح المجموعة وأخبرنا بتواريخك وخططك.'],
      ['نؤكد كل شيء', 'التوفر وشروط الإيجار والوثائق اللازمة للقيادة في الصين.'],
      ['جاهزة عند وصولك', 'سيارتك مجهزة ومسلّمة إليك، وفريقنا متاح طوال مدة الإيجار.'],
      ['اكتشف شنغهاي', 'من الباند إلى الطرق المفتوحة: المدينة على طريقتك.'],
    ],
  },
  services: { selfCta: 'شاهد سيارات القيادة الذاتية', eyebrow: 'الخدمات', title: 'خدمات مميزة', note: 'فئات خدمات مقترحة — يُرجى تأكيد التوفر التجاري قبل الإطلاق.' },
  echo: {
    eyebrow: 'شركتنا الشقيقة', title: 'أبعد من القيادة.',
    text: 'تصمم Echolocation Trip رحلات خاصة في أنحاء الصين — خاصة وثقافية ولا تُنسى. اجمع سيارتك من REV8 مع برنامج رحلة متكامل.',
    items: ['برامج رحلات مصممة خصيصاً', 'تجارب فاخرة في الصين', 'جولات خاصة', 'تجارب ثقافية', 'اليخوت والرحلات النهرية', 'مطاعم راقية', 'خدمات سفر VIP'],
    cta: 'زيارة Echolocation Trip', soon: 'الموقع قريباً',
  },
  contact: { eyebrow: 'الحجوزات', title: 'أخبرنا إلى أين تريد أن تذهب.', text: 'شاركنا تواريخك والسيارة التي تفكر بها. سيؤكد فريقنا التوفر وكل التفاصيل شخصياً.', cta: 'اطلب التوفر' },
  footer: { rights: 'جميع الحقوق محفوظة.', city: 'شنغهاي، الصين', terms: 'الشروط', privacy: 'الخصوصية' },
  fleet: {
    eyebrow: 'أسطولنا', title: 'المجموعة', search: 'ابحث عن ماركة أو طراز', all: 'الكل',
    empty: 'لا توجد سيارات في هذه الفئة بعد.', noResults: 'لا توجد سيارات مطابقة لبحثك.', clear: 'مسح عوامل التصفية',
    count: (n: number) => (n === 1 ? 'سيارة واحدة' : `${n} سيارات`),
    moreEyebrow: 'عند الطلب', moreTitle: 'طرازات أخرى متاحة', moreText: 'لا توجد صور لها بعد، لكنها ضمن مجموعتنا الأوسع. اسألنا عن التوفر.', interested: 'مهتم بـ',
  },
  card: { request: 'اطلب التوفر', details: 'عرض التفاصيل', onRequest: 'السعر عند الطلب', from: 'من', perDay: '/ يوم', illustrative: 'توضيحية', modelTbc: 'الطراز قيد التأكيد', categoryTbc: 'الفئة قيد التأكيد' },
  quick: {
    priceNote: 'الحد الأدنى للسعر اليومي. يعتمد السعر النهائي على التواريخ والمدة والخدمة.',
    specsNote: 'أرقام الشركة المصنّعة، تقريبية؛ وقد تختلف حسب الإصدار والسنة.',
    specs: 'المواصفات', specsPending: 'سيتم نشر المواصفات المؤكدة فور التحقق منها.',
    options: 'خيارات الإيجار', optionsPending: 'يتم تأكيد خيار القيادة الذاتية أو مع سائق لكل سيارة عند الطلب.',
    phase2: 'ستصدر صفحة السيارة الكاملة مع المعرض والشروط والسيارات المشابهة في المرحلة الثانية.', close: 'إغلاق',
  },
  photo: { pending: 'الصورة قيد الإضافة', add: 'إضافة صورة', replace: 'استبدال الصورة', local: 'معاينة فقط · لن يتم الحفظ' },
  partner: {
    portal: 'بوابة الشركاء', as: 'تم تسجيل الدخول باسم', reveal: 'إظهار الصافي والعمولة', hide: 'إخفاء الصافي والعمولة',
    guestView: 'عرض الضيف', partnerView: 'عرض الشريك', exitGuest: 'عرض الشريك',
    share: 'نسخ رابط الضيف', copied: 'تم نسخ الرابط', pdf: 'كتالوج PDF للضيف', pdfSoon: 'المرحلة 3',
    public: 'سعر الضيف', net: 'صافي سعرك', commission: 'عمولتك', netOnRequest: 'الصافي عند الطلب',
    calc: 'حاسبة العمولة', calcHint: 'أدخل أي سعر للضيف (يوان)', terms: 'شروطك',
    secure: 'أسعار الفنادق والعمولات لم تُحدد بعد — النسب الظاهرة أمثلة. نموذج أولي: عند الإطلاق يحسب الخادم الأسعار الصافية والعمولات ويرسلها فقط إلى الشريك المسجّل.',
    sampleLink: 'رابط تجريبي — غير مفعّل بعد',
  },
  proto: { label: 'نموذج أولي · المرحلة 1', b2c: 'موقع العملاء', b2b: 'بوابة الشركاء (تجريبي)', sample: 'أسعار تجريبية', notes: 'ملاحظات المراجعة' },
  form: {
    title: 'اطلب التوفر', subtitle: 'نرد عليك شخصياً بالتوفر والشروط.',
    name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف / WeChat / WhatsApp', vehicle: 'السيارة', anyCar: 'لست متأكداً بعد — انصحوني',
    from: 'من', to: 'إلى', service: 'الخدمة', message: 'رسالة (اختياري)', guest: 'اسم الضيف', onBehalf: 'حجز نيابةً عن ضيف',
    serviceOpts: ['قيادة ذاتية', 'مع سائق', 'توصيل من المطار', 'مناسبة', 'تصوير / إنتاج', 'لست متأكداً بعد'],
    submit: 'إرسال الطلب', required: 'يرجى تعبئة الحقول المطلوبة.', dates: 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية.',
    okTitle: 'تم إرسال الطلب', okText: 'شكراً لك! استلمنا طلبك وسنرد عليك عبر البريد أو الرسائل في أقرب وقت.',
    ref: 'المرجع', partnerRef: 'إحالة شريك', again: 'طلب جديد', close: 'إغلاق',
  },
};

export const DICT: Record<Lang, Dict> = { en, es, zh, ru, ar };
export type { Dict };
