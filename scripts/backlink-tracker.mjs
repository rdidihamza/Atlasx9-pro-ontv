// ═══════════════════════════════════════════════════════════
//  BACKLINK TRACKER — Backlink Opportunity Manager
//  Tracks submissions, generates content, reports progress
// ═══════════════════════════════════════════════════════════

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE, BACKLINK_DIRECTORIES, KEYWORDS, slugify } from './config/seo-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE   = path.join(__dirname, 'config', 'backlinks-db.json');
const REPORTS   = path.join(__dirname, 'reports');

// ─── Load / Save DB ───────────────────────────────────────
async function loadDB() {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    // Initialize from config
    return {
      directories: BACKLINK_DIRECTORIES.map((d, i) => ({
        ...d,
        id:         i + 1,
        submittedAt: null,
        approvedAt:  null,
        notes:       '',
        anchorText:  '',
        targetUrl:   SITE.url,
      })),
      lastRun: null,
      stats: { total: BACKLINK_DIRECTORIES.length, submitted: 0, approved: 0, pending: BACKLINK_DIRECTORIES.length },
    };
  }
}

async function saveDB(db) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  db.lastRun = new Date().toISOString();
  db.stats   = computeStats(db.directories);
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function computeStats(directories) {
  return {
    total:     directories.length,
    submitted: directories.filter(d => d.status === 'submitted' || d.status === 'approved').length,
    approved:  directories.filter(d => d.status === 'approved').length,
    pending:   directories.filter(d => d.status === 'pending').length,
    rejected:  directories.filter(d => d.status === 'rejected').length,
  };
}

// ─── Generate Submission Content for a Directory ──────────
function generateSubmissionContent(directory) {
  const mainKw  = 'Atlas Pro ONTV IPTV France';
  const anchors = [
    'meilleur iptv france',
    'atlas pro ontv',
    'abonnement iptv',
    'iptv 4k france',
    'atlas pro iptv',
  ];

  const anchor  = anchors[directory.id % anchors.length];
  const excerpt = `${SITE.name} est le service IPTV N°1 en France avec +15 000 chaînes HD/4K, +70 000 films & séries VOD. Compatible Firestick, Android, Smart TV, iOS et PC. Essai gratuit 24h. Support francophone 24h/7j.`;

  return {
    title:       `${SITE.name} — N°1 IPTV France | +15 000 Chaînes HD/4K`,
    url:         SITE.url,
    anchorText:  anchor,
    description: excerpt,
    keywords:    'iptv france, atlas pro ontv, abonnement iptv, iptv 4k, chaînes iptv france',
    category:    'Informatique / Streaming / Multimédia',
    email:       'contact@atlasproontv.fr',
    submitUrl:   directory.url,
  };
}

// ─── Mark Directory as Submitted ─────────────────────────
export async function markSubmitted(directoryId, notes = '') {
  const db = await loadDB();
  const dir = db.directories.find(d => d.id === directoryId);
  if (!dir) { console.error(`[Backlinks] Directory #${directoryId} not found`); return; }

  dir.status      = 'submitted';
  dir.submittedAt = new Date().toISOString();
  dir.notes       = notes;
  dir.anchorText  = generateSubmissionContent(dir).anchorText;

  await saveDB(db);
  console.log(`[Backlinks] ✓ Marked as submitted: ${dir.name}`);
}

// ─── Mark Directory as Approved ──────────────────────────
export async function markApproved(directoryId) {
  const db = await loadDB();
  const dir = db.directories.find(d => d.id === directoryId);
  if (!dir) return;

  dir.status     = 'approved';
  dir.approvedAt = new Date().toISOString();

  await saveDB(db);
  console.log(`[Backlinks] ✓ Marked as approved: ${dir.name}`);
}

// ─── Generate Submission Report ───────────────────────────
async function generateReport(db) {
  await fs.mkdir(REPORTS, { recursive: true });

  const date    = new Date().toISOString().split('T')[0];
  const pending = db.directories.filter(d => d.status === 'pending');
  const stats   = db.stats;

  let report = `# Backlink Submission Report — ${SITE.name}
Generated: ${new Date().toLocaleString('fr-FR')}

## Summary
| Status    | Count |
|-----------|-------|
| Total     | ${stats.total} |
| ✅ Approved | ${stats.approved} |
| 📤 Submitted | ${stats.submitted} |
| ⏳ Pending | ${stats.pending} |
| ❌ Rejected | ${stats.rejected || 0} |

---

## 📋 Next Submission Queue (${Math.min(5, pending.length)} directories)

`;

  const nextBatch = pending.slice(0, 5);
  for (const dir of nextBatch) {
    const content = generateSubmissionContent(dir);
    report += `### ${dir.name}
- **URL to submit:** ${dir.url}
- **Type:** ${dir.type}
- **Domain Authority:** DA ${dir.da}
- **Submit this content:**

\`\`\`
Title:       ${content.title}
URL:         ${content.url}
Anchor:      ${content.anchorText}
Description: ${content.description}
Keywords:    ${content.keywords}
Category:    ${content.category}
\`\`\`

---

`;
  }

  // Full directory table
  report += `## 📊 All Directories Status

| # | Name | Type | DA | Status | Submitted |
|---|------|------|----|--------|-----------|
`;
  for (const dir of db.directories) {
    const submitted = dir.submittedAt ? new Date(dir.submittedAt).toLocaleDateString('fr-FR') : '—';
    const statusIcon = { pending: '⏳', submitted: '📤', approved: '✅', rejected: '❌' }[dir.status] || '⏳';
    report += `| ${dir.id} | ${dir.name} | ${dir.type} | ${dir.da} | ${statusIcon} ${dir.status} | ${submitted} |\n`;
  }

  const reportFile = path.join(REPORTS, `backlinks-${date}.md`);
  await fs.writeFile(reportFile, report, 'utf8');

  // Also write latest.md (always current)
  await fs.writeFile(path.join(REPORTS, 'backlinks-latest.md'), report, 'utf8');

  console.log(`[Backlinks] ✓ Report saved → scripts/reports/backlinks-${date}.md`);
  return reportFile;
}

// ─── Main Export ──────────────────────────────────────────
export async function runBacklinkTracker() {
  console.log('[Backlinks] Running backlink tracker...');

  const db = await loadDB();
  await saveDB(db); // Ensure DB is initialized and stats are fresh
  await generateReport(db);

  const stats = db.stats;
  console.log(`[Backlinks] Stats → ${stats.approved} approved | ${stats.submitted} submitted | ${stats.pending} pending`);

  // Show next 3 to submit
  const nextUp = db.directories.filter(d => d.status === 'pending').slice(0, 3);
  if (nextUp.length > 0) {
    console.log('[Backlinks] Next directories to submit:');
    nextUp.forEach(d => console.log(`  → [DA${d.da}] ${d.name} (${d.url})`));
  }

  return db.stats;
}

// ─── CLI ──────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  if (cmd === 'submit') {
    const id = parseInt(process.argv[3]);
    await markSubmitted(id, process.argv[4] || '');
  } else if (cmd === 'approve') {
    const id = parseInt(process.argv[3]);
    await markApproved(id);
  } else {
    await runBacklinkTracker();
  }
}
