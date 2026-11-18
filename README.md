# REV8 web (prototype)

Three static sites. Each folder in `sites/` is ready to deploy as is (no build needed).

| Site | Folder | Notes |
|---|---|---|
| REV8 Cars (main site + partner portal) | `sites/cars` | `index.html` + `images/` |
| REV8 Hotels | `sites/hotels` | `index.html` + `images/` |
| Echolocation Trip | `sites/echolocation` | `index.html` + `img/` |

## Deploy (Netlify)
Create one Netlify site per folder and set "Publish directory" to the folder (leave build command empty).

## Source (REV8 Cars and Hotels)
`source/` holds the React + TypeScript + Tailwind code.
```
cd source && npm install
node build.mjs         # builds dist/
node build-hotel.mjs   # builds dist-hotel/
```
Echolocation is plain HTML/CSS/JS: edit `sites/echolocation/index.html` directly.

## Pending before launch
- Replace the example email `hello@example.com` (`source/src/data.ts`, `CONTACT`; and in `sites/echolocation/index.html`).
- Replace the hard-coded `claude.ai/artifact/...` links between the three sites with the real domains.
- Replace sample reviews, review FAQ and the rental conditions / privacy placeholders.
- Make the forms really send (currently simulated).
- One real page per car for SEO (title, description, sitemap) instead of `#car/...` routes.
