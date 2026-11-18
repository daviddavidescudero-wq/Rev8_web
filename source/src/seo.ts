// Static SEO page generator: one real HTML page per car. Run via build-seo.mjs
import fs from 'fs';
import { VEHICLES, SPECS, GALLERY, CATEGORIES, CONTACT, fullName, tx } from './data';

const BASE = (process.env.SITE_BASE || 'https://daviddavidescudero-wq.github.io/Rev8_web').replace(/\/$/, '');
const CARS = `${BASE}/sites/cars`;
const OUT = process.env.OUT_DIR || 'dist';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n: number) => '¥' + n.toLocaleString('en-US');
const today = new Date().toISOString().slice(0, 10);
const catLabel = (id: string) => tx(CATEGORIES.find((c) => c.id === id)!.label, 'en');

const css = `*{box-sizing:border-box}body{margin:0;font:16px/1.6 Inter,system-ui,sans-serif;color:#111;background:#fff}a{color:inherit}
header,main,footer{max-width:1080px;margin:0 auto;padding:0 24px}header{display:flex;align-items:center;justify-content:space-between;padding-top:20px;padding-bottom:20px}
header img{height:34px;display:block}nav a{font-size:14px;margin-left:20px;text-decoration:none;color:#555}nav a:hover{color:#000}
.crumb{font-size:13px;color:#777;margin:8px 0 20px}.crumb a{color:#777}
.hero{border-radius:20px;overflow:hidden;background:#eee;aspect-ratio:16/9}.hero img{width:100%;height:100%;object-fit:cover;display:block}
h1{font:500 clamp(30px,5vw,52px)/1.1 'Inter Tight',Inter,sans-serif;letter-spacing:-.02em;margin:32px 0 8px}
.eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#777;margin-top:28px}
.cols{display:grid;gap:40px;grid-template-columns:1fr;margin-top:8px}@media(min-width:860px){.cols{grid-template-columns:1.4fr 1fr}}
.lead{font-size:19px;color:#333;max-width:60ch}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin:24px 0}dl div{border:1px solid #e5e5e5;border-radius:14px;padding:14px}
dt{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#777}dd{margin:4px 0 0;font:500 20px 'Inter Tight',Inter,sans-serif}
.box{border:1px solid #e5e5e5;border-radius:18px;padding:24px;align-self:start}.price{font-size:22px;font-weight:500}.price small{font-size:14px;font-weight:400;color:#777}
.btn{display:inline-block;background:#000;color:#fff;text-decoration:none;border-radius:999px;padding:13px 26px;font-size:15px;margin-top:16px}.btn.alt{background:#fff;color:#000;border:1px solid #ccc;margin-left:8px}
.gal{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin:16px 0}.gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px;display:block}
ul.l{list-style:none;padding:0;margin:12px 0;columns:2;font-size:15px}ul.l li{padding:4px 0}ul.l a{text-decoration:none;color:#444}ul.l a:hover{color:#000;text-decoration:underline}
footer{border-top:1px solid #e5e5e5;margin-top:64px;padding-top:28px;padding-bottom:48px;font-size:14px;color:#666}`;

function page(v: (typeof VEHICLES)[number]) {
  const name = fullName(v, 'en');
  const url = `${CARS}/${v.id}/`;
  const img = `${CARS}/images/${v.id}.webp`;
  const s = SPECS[v.id] || {};
  const desc = tx(v.description, 'en');
  const metaDesc = `Rent the ${name} in Shanghai${v.publicPrice ? ' from ' + fmt(v.publicPrice) + ' per day' : ''}. ${desc} Self-drive or with chauffeur. Delivery in Shanghai. REV8 Club.`.slice(0, 300);
  const title = `Rent ${name} in Shanghai${v.publicPrice ? ' · from ' + fmt(v.publicPrice) + '/day' : ''} | REV8 Club`;
  const specs: [string, string][] = ([
    s.hp && ['Power', `${s.hp} hp`], s.zero100 && ['0–100 km/h', `${s.zero100.toFixed(1)} s`], s.top && ['Top speed', `${s.top} km/h`],
    s.seats && ['Seats', String(s.seats)], s.engine && ['Engine', s.engine],
  ].filter(Boolean) as [string, string][]);
  const n = GALLERY[v.id] || 0;
  const similar = VEHICLES.filter((o) => o.category === v.category && o.id !== v.id).slice(0, 6);
  const waText = encodeURIComponent(`Hi REV8, I'd like to rent the ${name}.`);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Product', name: `${name} rental in Shanghai`, brand: { '@type': 'Brand', name: v.brand }, description: desc, image: img, url,
      ...(v.publicPrice ? { offers: { '@type': 'Offer', priceCurrency: 'CNY', price: v.publicPrice, availability: 'https://schema.org/InStock', url, priceSpecification: { '@type': 'UnitPriceSpecification', price: v.publicPrice, priceCurrency: 'CNY', unitCode: 'DAY' } } } : {}) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'REV8 Cars', item: `${CARS}/` },
      { '@type': 'ListItem', position: 2, name: catLabel(v.category), item: `${CARS}/#fleet` },
      { '@type': 'ListItem', position: 3, name, item: url } ] },
  ];
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(metaDesc)}"><meta property="og:image" content="${img}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="REV8 Club">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Inter+Tight:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${css}</style></head><body>
<header><a href="../"><img src="../images/logo-full.webp" alt="REV8 Club"></a><nav><a href="../#fleet">Fleet</a><a href="../#faq">FAQ</a><a href="${CONTACT.whatsappUrl}" rel="noopener">WhatsApp</a></nav></header>
<main>
<p class="crumb"><a href="../">REV8 Cars</a> › ${esc(catLabel(v.category))} › ${esc(name)}</p>
<div class="hero"><img src="../images/${v.id}.webp" alt="${esc(name)} for rent in Shanghai" width="1600" height="900" fetchpriority="high"></div>
<p class="eyebrow">${esc(v.brand)} · ${esc(catLabel(v.category))}</p>
<h1>Rent a ${esc(name)} in Shanghai</h1>
<div class="cols"><div>
<p class="lead">${esc(desc)}</p>
${specs.length ? `<dl>${specs.map(([k, x]) => `<div><dt>${k}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl><p style="font-size:12px;color:#999">Manufacturer figures, approximate.</p>` : ''}
<h2 style="font:500 22px 'Inter Tight',Inter,sans-serif;margin-top:32px">Self-drive or with chauffeur</h2>
<p>The ${esc(name)} is available in Shanghai for self-drive rental or with a professional chauffeur, for a day, a weekend or longer. We can deliver the car to your hotel or the airport, and we arrange insurance and paperwork. Tell us your dates and we confirm availability.</p>
${n ? `<h2 style="font:500 22px 'Inter Tight',Inter,sans-serif;margin-top:32px">Gallery</h2><div class="gal">${Array.from({ length: n }, (_, i) => `<img src="../images/g/${v.id}-${i + 1}.webp" alt="${esc(name)} – photo ${i + 1}" loading="lazy">`).join('')}</div>` : ''}
</div>
<aside class="box"><p class="price">${v.publicPrice ? `<small>From </small>${fmt(v.publicPrice)} <small>/ day</small>` : 'Price on request'}</p>
<p style="color:#666;font-size:14px;margin:8px 0 0">Final price depends on dates, duration and service.</p>
<a class="btn" href="../#car/${v.id}">Request this car</a><a class="btn alt" href="${CONTACT.whatsappUrl}?text=${waText}" rel="noopener">WhatsApp</a>
<p style="font-size:13px;margin-top:20px"><a href="../#terms">Rental conditions</a> · <a href="../#faq">FAQ</a></p></aside></div>
${similar.length ? `<p class="eyebrow" style="margin-top:48px">Similar cars</p><ul class="l">${similar.map((o) => `<li><a href="../${o.id}/">${esc(fullName(o, 'en'))}</a></li>`).join('')}</ul>` : ''}
</main>
<footer><p>REV8 Club · Luxury car rental in Shanghai · <a href="../">All cars</a></p><ul class="l">${VEHICLES.map((o) => `<li><a href="../${o.id}/">${esc(fullName(o, 'en'))}</a></li>`).join('')}</ul></footer>
</body></html>`;
}

for (const v of VEHICLES) {
  fs.mkdirSync(`${OUT}/${v.id}`, { recursive: true });
  fs.writeFileSync(`${OUT}/${v.id}/index.html`, page(v));
}
const urls = [`${BASE}/`, `${CARS}/`, `${BASE}/sites/hotels/`, `${BASE}/sites/echolocation/`, ...VEHICLES.map((v) => `${CARS}/${v.id}/`)];
fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
console.log('seo pages', VEHICLES.length);
