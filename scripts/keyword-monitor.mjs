// ═══════════════════════════════════════════════════════════
//  KEYWORD MONITOR — SEO Keyword Tracking & Density Analysis
//  Tracks target keywords across all pages + blog posts
// ═══════════════════════════════════════════════════════════

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE, KEYWORDS, slugify } from './config/seo-config.mjs';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const BLOG_DIR   = path.join(ROOT, 'src', 'content', 'blog');
const REPORTS    = path.join(__dirname, 'reports');
const KW_DB      = path.join(__dirname, 'config', 'keywords-db.json');

// ─── Load DB ──────────────────────────────────────────────
async function loadKWDB() {
  try {
    const raw = await fs.readFile(KW_DB, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { keywords: {}, lastRun: null, history: [] };
  }
}

async function saveKWDB(db) {
  db.lastRun = new Date().toISOString();
  await fs.writeFile(KW_DB, JSON.stringify(db, null, 2), 'utf8');
}

// ─── Count Keyword Occurrences in Text ───────────────────
function countOccurrences(text, keyword) {
  const clean   = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[#*`|]/g, '');
  const escaped = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex   = new RegExp(escaped, 'gi');
  const matches = clean.match(regex);
  return matches ? matches.length : 0;
}

// ─── Calculate Keyword Density ───────────────────────────
function calcDensity(text, keyword) {
  const wordCount = text.split(/\s+/).length;
  const count     = countOccurrences(text, keyword);
  if (wordCount === 0) return { count, density: 0, wordCount };
  const density = parseFloat(((count / wordCount) * 100).toFixed(2));
  return { count, density, wordCount };
}

// ─── Density Assessment ───────────────────────────────────
function assessDensity(density) {
  if (density === 0)       return { grade: 'F', label: 'Absent',      color: '🔴' };
  if (density < 0.5)       return { grade: 'D', label: 'Trop faible', color: '🟠' };
  if (density <= 1.0)      return { grade: 'B', label: 'Correct',     color: '🟡' };
  if (density <= 2.5)      return { grade: 'A', label: 'Optimal',     color: '🟢' };
  if (density <= 4.0)      return { grade: 'C', label: 'Dense',       color: '🟡' };
  return                          { grade: 'F', label: 'Sur-optimisé', color: '🔴' };
}

// ─── Scan Blog Posts ──────────────────────────────────────
async function scanBlogPosts() {
  const results = [];
  try {
    const files = await fs.readdir(BLOG_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(BLOG_DIR, file);
      const content  = await fs.readFile(filePath, 'utf8');
      const slug     = file.replace('.md', '');

      // Extract frontmatter keyword
      const kwMatch = content.match(/^keyword:\s*"(.+)"$/m);
      const primaryKw = kwMatch ? kwMatch[1] : '';

      // Extract title
      const titleMatch = content.match(/^title:\s*"(.+)"$/m);
      const title = titleMatch ? titleMatch[1] : slug;

      results.push({ slug, title, content, primaryKw, filePath });
    }
  } catch (err) {
    // blog dir may not exist yet
  }
  return results;
}

// ─── Generate Keyword Report ──────────────────────────────
async function generateReport(db) {
  await fs.mkdir(REPORTS, { recursive: true });

  const date = new Date().toISOString().split('T')[0];

  let report = `# Keyword Monitor Report — ${SITE.name}
Generated: ${new Date().toLocaleString('fr-FR')}

## 🎯 Target Keywords Overview

| Keyword | Volume | Difficulty | Page | Articles | Status |
|---------|--------|------------|------|----------|--------|
`;

  for (const kw of KEYWORDS) {
    const kwData  = db.keywords[kw.kw] || {};
    const articles = kwData.articles || 0;
    const status   = articles > 0 ? '✅ Covered' : '⚠️ Missing';
    report += `| ${kw.kw} | ${kw.vol} | ${kw.difficulty} | ${kw.page} | ${articles} | ${status} |\n`;
  }

  // Coverage summary
  const covered  = KEYWORDS.filter(kw => (db.keywords[kw.kw]?.articles || 0) > 0).length;
  const missing  = KEYWORDS.length - covered;
  const coverage = Math.round((covered / KEYWORDS.length) * 100);

  report += `
---

## 📊 Coverage Summary

- **Total target keywords:** ${KEYWORDS.length}
- **Covered (have articles):** ${covered} (${coverage}%)
- **Missing coverage:** ${missing}
- **Blog posts generated:** ${db.totalPosts || 0}

---

## 📝 Blog Articles Keyword Analysis

`;

  const articles = db.articleAnalysis || [];
  for (const article of articles) {
    const primary = article.primaryKw;
    const analysis = article.keywords?.[primary];

    if (!analysis) continue;

    const assess = assessDensity(analysis.density);
    report += `### ${article.title}
- **Primary keyword:** \`${primary}\`
- **Density:** ${analysis.density}% (${analysis.count}× in ${analysis.wordCount} words)
- **Grade:** ${assess.color} ${assess.grade} — ${assess.label}
- **URL:** ${SITE.url}/blog/${article.slug}

`;
  }

  // Recommendations
  report += `---

## 💡 SEO Recommendations

`;

  const missingKws = KEYWORDS.filter(kw => (db.keywords[kw.kw]?.articles || 0) === 0)
    .sort((a, b) => b.vol - a.vol)
    .slice(0, 10);

  if (missingKws.length > 0) {
    report += `### High-Priority Keywords Without Coverage\n\n`;
    report += `| Priority | Keyword | Volume | Action |\n`;
    report += `|----------|---------|--------|--------|\n`;
    missingKws.forEach((kw, i) => {
      report += `| #${i + 1} | ${kw.kw} | ${kw.vol}/mo | Create blog post |\n`;
    });
  }

  const reportFile = path.join(REPORTS, `keywords-${date}.md`);
  await fs.writeFile(reportFile, report, 'utf8');
  await fs.writeFile(path.join(REPORTS, 'keywords-latest.md'), report, 'utf8');

  console.log(`[Keywords] ✓ Report saved → scripts/reports/keywords-${date}.md`);
  return reportFile;
}

// ─── Main Export ──────────────────────────────────────────
export async function runKeywordMonitor() {
  console.log('[Keywords] Running keyword monitor...');

  const db       = await loadKWDB();
  const posts    = await scanBlogPosts();

  // Reset keyword article counts
  db.keywords    = {};
  db.totalPosts  = posts.length;
  db.articleAnalysis = [];

  // Analyze each blog post
  for (const post of posts) {
    const kwAnalysis = {};

    // Check all target keywords in this post
    for (const kw of KEYWORDS) {
      const { count, density, wordCount } = calcDensity(post.content, kw.kw);
      if (count > 0) {
        kwAnalysis[kw.kw] = { count, density, wordCount };
        // Mark keyword as covered
        if (!db.keywords[kw.kw]) db.keywords[kw.kw] = { articles: 0, slugs: [] };
        db.keywords[kw.kw].articles++;
        db.keywords[kw.kw].slugs.push(post.slug);
      }
    }

    db.articleAnalysis.push({
      slug:      post.slug,
      title:     post.title,
      primaryKw: post.primaryKw,
      keywords:  kwAnalysis,
    });
  }

  // Mark all uncovered keywords
  for (const kw of KEYWORDS) {
    if (!db.keywords[kw.kw]) {
      db.keywords[kw.kw] = { articles: 0, slugs: [] };
    }
  }

  const covered  = Object.values(db.keywords).filter(k => k.articles > 0).length;
  const total    = KEYWORDS.length;
  const coverage = Math.round((covered / total) * 100);

  console.log(`[Keywords] ${posts.length} posts scanned`);
  console.log(`[Keywords] Coverage: ${covered}/${total} keywords (${coverage}%)`);

  await saveKWDB(db);
  await generateReport(db);

  return { covered, total, coverage, posts: posts.length };
}

// ─── CLI ──────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await runKeywordMonitor();
}
