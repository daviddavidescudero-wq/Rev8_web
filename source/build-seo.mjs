import { build } from 'esbuild';
import { execSync } from 'child_process';
await build({ entryPoints: ['src/seo.ts'], bundle: true, platform: 'node', format: 'esm', outfile: '/tmp/seo.mjs', logLevel: 'error' });
execSync('node /tmp/seo.mjs', { stdio: 'inherit' });
