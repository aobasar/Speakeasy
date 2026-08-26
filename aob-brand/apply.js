#!/usr/bin/env node
'use strict';

/**
 * AOB Speakeasy — build-time footer swap.
 *
 * MiroTalk ships a large footer on every public page: its own logo, Discord and
 * social links, sponsor blocks. We replace it with our own one-liner.
 *
 * Doing that by editing public/views/*.html would mean diverging from upstream in
 * six files that upstream keeps touching (sponsor rotations, icon tweaks), so the
 * daily upstream-sync merge conflicted in all six every time. Instead the view
 * files stay byte-identical to upstream and this script rewrites them while the
 * Docker image is built. Nothing to merge, nothing to resolve.
 *
 * Run by the Dockerfile. Safe to run locally to preview the real footer
 * (`node aob-brand/apply.js`); `git checkout -- public/views` undoes it.
 *
 * If upstream ever renames the <footer id="footer"> anchor this script exits
 * non-zero, which fails the Docker build. Coolify then keeps the previous
 * container running, so the branding can never silently disappear from the
 * live site — a red build is the intended failure mode.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VIEWS_DIR = path.join(ROOT, 'public', 'views');
const FOOTER_FILE = path.join(__dirname, 'footer.html');

// Marker that proves our footer is already in place, so re-running is a no-op.
const MARKER = '@AOBASAR';

const OPEN_ANCHOR = '<footer id="footer"';
const CLOSE_ANCHOR = '</footer>';

function fail(message) {
    console.error(`aob-brand: ERROR — ${message}`);
    process.exit(1);
}

const footer = fs.readFileSync(FOOTER_FILE, 'utf8').trim();
if (!footer.includes(MARKER)) {
    fail(`aob-brand/footer.html no longer contains the "${MARKER}" marker`);
}

const files = fs
    .readdirSync(VIEWS_DIR)
    .filter((name) => name.endsWith('.html'))
    .sort();

let replaced = 0;
let skipped = 0;

for (const name of files) {
    const file = path.join(VIEWS_DIR, name);
    const html = fs.readFileSync(file, 'utf8');

    const start = html.indexOf(OPEN_ANCHOR);
    if (start === -1) continue; // page has no footer (client.html, iframe.html, ...)

    if (html.includes(MARKER)) {
        skipped += 1;
        continue;
    }

    const closeAt = html.indexOf(CLOSE_ANCHOR, start);
    if (closeAt === -1) {
        fail(`${name}: found "${OPEN_ANCHOR}" but no closing ${CLOSE_ANCHOR}`);
    }
    const end = closeAt + CLOSE_ANCHOR.length;

    // Re-indent our block to sit where upstream's footer sat, so the output
    // still passes prettier and stays readable inside the image.
    const lineStart = html.lastIndexOf('\n', start) + 1;
    const indent = html.slice(lineStart, start);
    if (indent.trim() !== '') {
        fail(`${name}: <footer> is not the first thing on its line, cannot re-indent safely`);
    }
    const block = footer
        .split('\n')
        .map((line, i) => (i === 0 || line === '' ? line : indent + line))
        .join('\n');

    fs.writeFileSync(file, html.slice(0, start) + block + html.slice(end));
    console.log(`aob-brand: footer replaced in public/views/${name}`);
    replaced += 1;
}

if (replaced === 0 && skipped === 0) {
    fail(`no page in public/views contains "${OPEN_ANCHOR}" — upstream renamed the footer anchor, ` +
        `update aob-brand/apply.js before shipping`);
}

console.log(`aob-brand: done — ${replaced} replaced, ${skipped} already branded.`);
