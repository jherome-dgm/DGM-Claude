// Regenerates sitemap.xml from the .html files at the project root.
// A page is included only once it's actually built — i.e. it no longer
// contains the `page-placeholder` shell used for pages still awaiting content.
// Run after building a new page and before pushing/deploying:
//   node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const siteOrigin = 'https://digitalgroupmedia.com';

function isBuilt(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  return !html.includes('page-placeholder');
}

function slugFor(fileName) {
  const base = fileName.replace(/\.html$/, '');
  return base === 'index' ? '/' : `/${base}`;
}

function lastModFor(fileName) {
  try {
    const date = execSync(`git log -1 --format=%cs -- "${fileName}"`, { cwd: root })
      .toString()
      .trim();
    if (date) return date;
  } catch {
    // fall through to mtime
  }
  return fs.statSync(path.join(root, fileName)).mtime.toISOString().slice(0, 10);
}

const htmlFiles = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => isBuilt(path.join(root, f)));

const pages = htmlFiles
  .map((fileName) => ({
    loc: `${siteOrigin}${slugFor(fileName)}`,
    lastmod: lastModFor(fileName),
  }))
  .sort((a, b) => {
    if (a.loc === `${siteOrigin}/`) return -1;
    if (b.loc === `${siteOrigin}/`) return 1;
    return a.loc.localeCompare(b.loc);
  });

const body = pages
  .map((p) => `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);

console.log(`sitemap.xml written with ${pages.length} page(s):`);
pages.forEach((p) => console.log(`  ${p.loc}`));
