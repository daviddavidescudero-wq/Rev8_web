import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
fs.mkdirSync('dist-hotel/images', { recursive: true });
await build({ entryPoints: ['src/hotel.tsx'], bundle: true, minify: true, format: 'iife', outfile: 'dist-hotel/app.js', define: { 'process.env.NODE_ENV': '"production"' }, jsx: 'automatic' });
execSync('npx tailwindcss -i src/index.css -o dist-hotel/app.css --minify --content "./src/hotel.tsx"', { stdio: 'inherit' });
const js = fs.readFileSync('dist-hotel/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const css = fs.readFileSync('dist-hotel/app.css', 'utf8');
fs.writeFileSync('dist-hotel/index.html', `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>REV8 Club · Hotels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600&display=swap" rel="stylesheet">
<style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);
for (const f of fs.readdirSync('public/images')) if (f.endsWith('.webp')) fs.copyFileSync('public/images/' + f, 'dist-hotel/images/' + f);
console.log('ok', fs.readdirSync('dist-hotel/images').length, 'images');
