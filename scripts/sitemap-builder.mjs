// ═══════════════════════════════════════════════════════════
//  SITEMAP BUILDER — Auto XML Sitemap Generator
//  Includes all pages + blog posts with proper SEO priority
// ═══════════════════════════════════════════════════════════

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE } from './config/seo-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const BLOG_DIR  = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC    = path.join(ROOT, 'public');

// ─── Static Pages ─────────────────────────────────────────
const STATIC_PAGES = [
  { loc: '/',                      priority: '1.0', changefreq: 'daily'   },
  { loc: '/#abonnement',           priority: '0.9', changefreq: 'weekly'  },
  { loc: '/#chaines',              priority: '0.8', changefreq: 'weekly'  },
  { loc: '/#fonctionnalites',      priority: '0.8', changefreq: 'monthly' },
  { loc: '/#telecharger',          priority: '0.7', changefreq: 'monthly' },
  { loc: '/#appareils',            priority: '0.7', changefreq: 'monthly' },
  { loc: '/#avis',                 priority: '0.6', changefreq: 'weekly'  },
  { loc: '/#faq',                  priority: '0.6', changefreq: 'monthly' },
  { loc: '/blog',                  priority: '0.8', changefreq: 'daily'   },
  { loc: '/mentions-legales',      priority: '0.2', changefreq: 'yearly'  },
];

// ─── Scan Blog Posts ──────────────────────────────────────
async function getBlogPosts() {
  const posts = [];
  try {
    const files = await fs.readdir(BLOG_DIR);
    for (const file of files.filter(f => f.endsWith('.md'))) {
      const slug    = file.replace('.md', '');
      const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
      const dateM   = content.match(/^date:\s*"(.+)"$/m);
      const date    = dateM ? dateM[1] : new Date().toISOString().split('T')[0];
      posts.push({ slug, date });
    }
  } catch { /* blog dir may not exist */ }
  return posts;
}

// ─── Build XML ────────────────────────────────────────────
function buildXML(staticPages, blogPosts) {
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = staticPages.map(p => `  <url>
    <loc>${SITE.url}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const blogUrls = blogPosts.map(p => `  <url>
    <loc>${SITE.url}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${staticUrls}

${blogUrls}

</urlset>`;
}

// ─── Generate robots.txt ──────────────────────────────────
function buildRobots(blogPosts) {
  return `# robots.txt — ${SITE.name}
# Generated automatically by SEO Engine

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE.url}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block bad bots
User-agent: SemrushBot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10
`;
}

// ─── Main Export ──────────────────────────────────────────
export async function runSitemapBuilder() {
  console.log('[Sitemap] Building sitemap...');

  const blogPosts = await getBlogPosts();
  const xml       = buildXML(STATIC_PAGES, blogPosts);
  const robots    = buildRobots(blogPosts);

  await fs.mkdir(PUBLIC, { recursive: true });
  await fs.writeFile(path.join(PUBLIC, 'sitemap.xml'), xml, 'utf8');
  await fs.writeFile(path.join(PUBLIC, 'robots.txt'),  robots, 'utf8');

  const totalUrls = STATIC_PAGES.length + blogPosts.length;
  console.log(`[Sitemap] ✓ sitemap.xml → ${totalUrls} URLs (${STATIC_PAGES.length} pages + ${blogPosts.length} posts)`);
  console.log(`[Sitemap] ✓ robots.txt updated`);

  return { totalUrls, staticPages: STATIC_PAGES.length, blogPosts: blogPosts.length };
}

// ─── CLI ──────────────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await runSitemapBuilder();
}
