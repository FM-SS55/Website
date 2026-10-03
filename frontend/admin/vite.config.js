import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
// Works whether deps are installed per-app (Docker) or hoisted by npm workspaces
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));

export default defineConfig({
  base: '/admin/',
  build: { outDir: 'dist/admin', emptyOutDir: true },
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
      // shared/ has no node_modules of its own — resolve React from this app
      react: pkgDir('react'),
      'react-dom': pkgDir('react-dom'),
    },
  },
  server: {
    port: 5174,
    fs: { allow: ['..'] },
    proxy: {
      '/api': 'http://localhost:3000',
      '/images/uploads': 'http://localhost:3000',
    },
  },
});