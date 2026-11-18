import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
fs.mkdirSync('dist', { recursive: true });
await build({ entryPoints: ['src/main.tsx'], bundle: true, minify: true, format: 'iife', outfile: 'dist/app.js', define: { 'process.env.NODE_ENV': '"production"' }, jsx: 'automatic' });
execSync('npx tailwindcss -i src/index.css -o dist/app.css --minify', { stdio: 'inherit' });
const js = fs.readFileSync('dist/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const css = fs.readFileSync('dist/app.css', 'utf8');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>REV8 Cars · Prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600&family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet">
<style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
fs.writeFileSync('dist/index.html', html);
fs.cpSync('public/images', 'dist/images', { recursive: true, force: true });
console.log('built', (html.length / 1024).toFixed(0) + ' KB');
