// ═══════════════════════════════════════════════════════════
//  BLOG GENERATOR — SEO Article Generator
//  Generates keyword-optimized markdown articles automatically
//  Output → src/content/blog/*.md
// ═══════════════════════════════════════════════════════════

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SITE, KEYWORDS, BLOG_TEMPLATES, BLOG_QUEUE, CONTENT_BLOCKS,
  slugify, capitalize,
} from './config/seo-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const BLOG_DIR  = path.join(ROOT, 'src', 'content', 'blog');
const STATE_FILE = path.join(__dirname, 'config', 'blog-state.json');

// ─── Load / Save State ────────────────────────────────────
async function loadState() {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { generated: [], queueIndex: 0 };
  }
}

async function saveState(state) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ─── Build Frontmatter ────────────────────────────────────
function buildFrontmatter({ slug, title, description, keyword, date, tags }) {
  const tagsStr = tags.map(t => `"${t}"`).join(', ');
  return `---
title: "${title.replace(/"/g, "'")}"
description: "${description.replace(/"/g, "'")}"
slug: "${slug}"
keyword: "${keyword}"
date: "${date}"
dateModified: "${date}"
author: "${SITE.name}"
tags: [${tagsStr}]
category: "Guide IPTV"
image: "/images/blog/${slug}.webp"
canonical: "${SITE.url}/blog/${slug}"
noindex: false
schema:
  type: "Article"
  name: "${title.replace(/"/g, "'")}"
  description: "${description.replace(/"/g, "'")}"
  author: "${SITE.name}"
  publisher: "${SITE.name}"
---
`;
}

// ─── Build Article Body ───────────────────────────────────
function buildArticleBody(kw, template) {
  const year  = new Date().getFullYear();
  const title = template.titleFn(kw);
  const lines = [];

  lines.push(`# ${title}\n`);

  // Render sections in template order
  for (const sectionKey of template.sections) {
    const blockFn = CONTENT_BLOCKS[sectionKey];
    if (blockFn) {
      lines.push(blockFn(kw, SITE));
    }
  }

  // Internal linking footer block
  lines.push(`
---

## En Savoir Plus sur Atlas Pro ONTV

- [Voir tous les abonnements IPTV](${SITE.url}/#abonnement)
- [Télécharger l'application Atlas Pro](${SITE.url}/#telecharger)
- [Catalogue des chaînes disponibles](${SITE.url}/#chaines)
- [Guide d'installation multi-appareils](${SITE.url}/#appareils)
- [Avis et témoignages clients](${SITE.url}/#avis)

---

*Article mis à jour le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}. ${SITE.name} — N°1 IPTV France.*
`);

  return lines.join('\n');
}

// ─── Generate Single Article ──────────────────────────────
async function generateArticle(queueItem) {
  const { kw, template: templateId } = queueItem;

  const template = BLOG_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    console.error(`[BlogGen] Template "${templateId}" not found`);
    return null;
  }

  const slug        = template.slug(kw);
  const title       = template.titleFn(kw);
  const description = template.descFn(kw);
  const date        = new Date().toISOString().split('T')[0];

  // Build tags from keyword + generic
  const tags = [
    kw,
    'iptv france',
    'atlas pro ontv',
    'streaming',
    `iptv ${new Date().getFullYear()}`,
  ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

  const frontmatter = buildFrontmatter({ slug, title, description, keyword: kw, date, tags });
  const body        = buildArticleBody(kw, template);
  const markdown    = frontmatter + '\n' + body;

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.writeFile(filePath, markdown, 'utf8');

  return { slug, title, description, keyword: kw, date, filePath };
}

// ─── Main Export: Run One Generation Cycle ────────────────
export async function runBlogGeneration() {
  console.log('[BlogGen] Starting blog generation cycle...');

  const state = await loadState();
  const queue = BLOG_QUEUE;

  if (state.queueIndex >= queue.length) {
    // Restart queue from beginning
    state.queueIndex = 0;
    console.log('[BlogGen] Queue exhausted — restarting from beginning');
  }

  const item = queue[state.queueIndex];

  // Skip if already generated today
  const today = new Date().toISOString().split('T')[0];
  const alreadyToday = state.generated.some(g => g.date === today);
  if (alreadyToday) {
    console.log(`[BlogGen] Article already generated today (${today}). Skipping.`);
    return null;
  }

  try {
    const result = await generateArticle(item);
    if (result) {
      state.generated.push(result);
      state.queueIndex = (state.queueIndex + 1) % queue.length;
      await saveState(state);
      console.log(`[BlogGen] ✓ Generated: "${result.title}"`);
      console.log(`[BlogGen]   Slug:     ${result.slug}`);
      console.log(`[BlogGen]   File:     ${result.filePath}`);
    }
    return result;
  } catch (err) {
    console.error('[BlogGen] Error generating article:', err.message);
    return null;
  }
}

// ─── Generate All Queue Articles (initial seed) ──────────
export async function seedAllArticles() {
  console.log(`[BlogGen] Seeding ${BLOG_QUEUE.length} articles...`);
  const state = await loadState();
  let count = 0;

  for (const item of BLOG_QUEUE) {
    const template = BLOG_TEMPLATES.find(t => t.id === item.template);
    if (!template) continue;

    const slug     = template.slug(item.kw);
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    // Skip if file already exists
    try {
      await fs.access(filePath);
      console.log(`[BlogGen] ↷ Skipping existing: ${slug}`);
      continue;
    } catch { /* doesn't exist, generate it */ }

    const date  = new Date(Date.now() - count * 86400000).toISOString().split('T')[0];
    const result = await generateArticle(item);
    if (result) {
      // Backdate articles
      const fileContent = await fs.readFile(result.filePath, 'utf8');
      const backdated   = fileContent
        .replace(/^date: ".*"$/m, `date: "${date}"`)
        .replace(/^dateModified: ".*"$/m, `dateModified: "${date}"`);
      await fs.writeFile(result.filePath, backdated, 'utf8');

      state.generated.push({ ...result, date });
      count++;
      console.log(`[BlogGen] ✓ [${count}/${BLOG_QUEUE.length}] ${result.slug}`);

      // Small delay to avoid overwhelming file system
      await new Promise(r => setTimeout(r, 50));
    }
  }

  state.queueIndex = count % BLOG_QUEUE.length;
  await saveState(state);
  console.log(`[BlogGen] Seed complete. ${count} articles generated.`);
}

// ─── CLI: run directly with `node scripts/blog-generator.mjs` ──
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === 'seed') {
    await seedAllArticles();
  } else {
    await runBlogGeneration();
  }
}
