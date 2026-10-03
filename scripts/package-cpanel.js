#!/usr/bin/env node
// Builds both React apps and assembles a flat, upload-ready bundle for cPanel
// ("Setup Node.js App") in ./dist-cpanel/ . Run from the repo root:  npm run package:cpanel
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'dist-cpanel');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

run('npm run build');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

fs.cpSync(path.join(root, 'backend', 'src'), path.join(out, 'src'), { recursive: true });
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'package.json'), 'utf8'));
delete pkg.devDependencies;
fs.writeFileSync(path.join(out, 'package.json'), JSON.stringify(pkg, null, 2));
fs.cpSync(path.join(root, 'frontend', 'web', 'dist'), path.join(out, 'frontend-dist', 'web'), { recursive: true });
fs.cpSync(path.join(root, 'frontend', 'admin', 'dist'), path.join(out, 'frontend-dist', 'admin'), { recursive: true });

console.log(`\nDone. Zip the CONTENTS of ${out} (package.json must be at the zip's top level) and upload it via cPanel File Manager.`);