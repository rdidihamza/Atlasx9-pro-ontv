#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════
//  SEO ENGINE — Background Automation Orchestrator
//  Atlas Pro ONTV — atlasproontv.fr
//
//  Runs as a background daemon with node-cron scheduling:
//  ┌─────────────────── SCHEDULE ────────────────────────┐
//  │  Daily   06:00  →  Generate 1 SEO blog post         │
//  │  Daily   07:00  →  Rebuild sitemap (incl. new posts) │
//  │  Daily   08:00  →  Keyword density scan + report     │
//  │  Weekly  Mon    →  Backlink tracker + report         │
//  │  Startup         →  Run all tasks immediately        │
//  └─────────────────────────────────────────────────────┘
//
//  Usage:
//    node scripts/seo-engine.mjs           → Start daemon
//    node scripts/seo-engine.mjs --once    → Run once + exit
//    node scripts/seo-engine.mjs --seed    → Seed all blog posts
// ═══════════════════════════════════════════════════════════

import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { runBlogGeneration, seedAllArticles } from './blog-generator.mjs';
import { runBacklinkTracker }                  from './backlink-tracker.mjs';
import { runKeywordMonitor }                   from './keyword-monitor.mjs';
import { runSitemapBuilder }                   from './sitemap-builder.mjs';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE   = path.join(__dirname, 'reports', 'seo-engine.log');

// ─── Logger ───────────────────────────────────────────────
async function log(level, message) {
  const ts  = new Date().toISOString();
  const line = `[${ts}] [${level.padEnd(5)}] ${message}`;
  console.log(line);
  try {
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    await fs.appendFile(LOG_FILE, line + '\n', 'utf8');
  } catch { /* non-fatal */ }
}

// ─── Task Runner with Error Handling ──────────────────────
async function runTask(name, fn) {
  await log('INFO', `━━━ Task START: ${name} ━━━`);
  const start = Date.now();
  try {
    const result = await fn();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    await log('OK',  `━━━ Task DONE:  ${name} (${elapsed}s) ━━━`);
    return result;
  } catch (err) {
    await log('ERROR', `━━━ Task FAIL:  ${name} — ${err.message} ━━━`);
    return null;
  }
}

// ─── All Tasks ────────────────────────────────────────────
async function taskBlog()     { return runTask('BlogGenerator',   runBlogGeneration); }
async function taskSitemap()  { return runTask('SitemapBuilder',  runSitemapBuilder); }
async function taskKeywords() { return runTask('KeywordMonitor',  runKeywordMonitor); }
async function taskBacklinks(){ return runTask('BacklinkTracker', runBacklinkTracker); }

// ─── Run All Tasks Once ───────────────────────────────────
async function runAll() {
  await log('INFO', '═══════════════════════════════════');
  await log('INFO', '  SEO Engine — Full Run Starting   ');
  await log('INFO', '═══════════════════════════════════');

  await taskBlog();
  await taskSitemap();
  await taskKeywords();
  await taskBacklinks();

  await log('INFO', '═══════════════════════════════════');
  await log('INFO', '  SEO Engine — Full Run Complete   ');
  await log('INFO', '═══════════════════════════════════');
}

// ─── Start Background Daemon ──────────────────────────────
async function startDaemon() {
  await log('INFO', '');
  await log('INFO', '╔═══════════════════════════════════════╗');
  await log('INFO', '║   Atlas Pro ONTV — SEO Engine v1.0   ║');
  await log('INFO', '║   Background automation started       ║');
  await log('INFO', '╚═══════════════════════════════════════╝');
  await log('INFO', '');
  await log('INFO', 'Schedule:');
  await log('INFO', '  Daily 06:00 → Blog post generation');
  await log('INFO', '  Daily 07:00 → Sitemap rebuild');
  await log('INFO', '  Daily 08:00 → Keyword monitoring');
  await log('INFO', '  Mon   09:00 → Backlink tracker');
  await log('INFO', '');

  // Run immediately on startup
  await log('INFO', 'Running initial tasks on startup...');
  await runAll();

  // ─── CRON SCHEDULES ───────────────────────────────────

  // Daily at 06:00 — Generate 1 new blog post
  cron.schedule('0 6 * * *', async () => {
    await log('INFO', 'CRON: Daily blog generation triggered');
    await taskBlog();
    await taskSitemap(); // rebuild sitemap after new post
  });

  // Daily at 07:00 — Rebuild sitemap
  cron.schedule('0 7 * * *', async () => {
    await log('INFO', 'CRON: Daily sitemap rebuild triggered');
    await taskSitemap();
  });

  // Daily at 08:00 — Keyword scan
  cron.schedule('0 8 * * *', async () => {
    await log('INFO', 'CRON: Daily keyword monitor triggered');
    await taskKeywords();
  });

  // Every Monday at 09:00 — Backlink tracker
  cron.schedule('0 9 * * 1', async () => {
    await log('INFO', 'CRON: Weekly backlink tracker triggered');
    await taskBacklinks();
  });

  await log('INFO', 'Daemon running. Press Ctrl+C to stop.');
}

// ─── Entry Point ──────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--seed')) {
  // Seed all blog posts then run monitors
  await log('INFO', 'Mode: --seed (generate all blog posts)');
  await runTask('BlogSeed', seedAllArticles);
  await runTask('SitemapBuilder', runSitemapBuilder);
  await runTask('KeywordMonitor', runKeywordMonitor);
  await log('INFO', 'Seed complete!');

} else if (args.includes('--once')) {
  // Run all tasks once and exit
  await log('INFO', 'Mode: --once (single run then exit)');
  await runAll();
  await log('INFO', 'Done. Exiting.');

} else if (args.includes('--blog')) {
  await taskBlog();
  await taskSitemap();

} else if (args.includes('--sitemap')) {
  await taskSitemap();

} else if (args.includes('--keywords')) {
  await taskKeywords();

} else if (args.includes('--backlinks')) {
  await taskBacklinks();

} else {
  // Default: start background daemon
  await startDaemon();
}
