import fs from 'node:fs';
import path from 'node:path';

const distDir = './dist';
const pages = fs.readdirSync(distDir).filter(f => fs.statSync(path.join(distDir, f)).isDirectory() || f.endsWith('.html'));

console.log('--- 1. CANONICAL & META CHECK ---');
let hasIssue = false;

for (const p of pages) {
  const filePath = p.endsWith('.html') ? path.join(distDir, p) : path.join(distDir, p, 'index.html');
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
  const ogImgMatch = content.match(/<meta property="og:image" content="([^"]+)"/);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  const canonical = canonicalMatch ? canonicalMatch[1] : null;
  const title = titleMatch ? titleMatch[1] : null;
  const desc = descMatch ? descMatch[1] : null;

  if (!canonical || !title || !desc || !h1Match) {
    console.log(`❌ Missing meta/canonical/h1 in: ${p}`);
    hasIssue = true;
  } else {
    // Check canonical trailing slash consistency
    if (p !== 'index.html' && !p.endsWith('.html')) {
      const expectedUrl = `https://solarcalculatorindia.com/${p}/`;
      if (canonical !== expectedUrl) {
        console.log(`⚠️ Canonical mismatch in ${p}: got ${canonical}, expected ${expectedUrl}`);
      }
    }
  }
}

if (!hasIssue) {
  console.log('✅ All pages have valid Title, Description, Canonical URL, and H1!');
}

console.log('\n--- 2. INTERNAL LINKS CHECK ---');
// Check all internal links in all dist pages to ensure none 404
const internalLinks = new Set();
for (const p of pages) {
  const filePath = p.endsWith('.html') ? path.join(distDir, p) : path.join(distDir, p, 'index.html');
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const hrefs = content.matchAll(/href="([^"#]+)"/g);
  for (const m of hrefs) {
    const href = m[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      internalLinks.add(href);
    }
  }
}

console.log(`Found ${internalLinks.size} unique internal links:`);
for (const link of internalLinks) {
  // check if link resolves in dist
  const cleanLink = link.replace(/^\//, '').replace(/\/$/, '');
  const candidateDir = path.join(distDir, cleanLink, 'index.html');
  const candidateFile = path.join(distDir, cleanLink + '.html');
  const candidateDirect = path.join(distDir, cleanLink);
  
  const exists = cleanLink === '' 
    ? fs.existsSync(path.join(distDir, 'index.html'))
    : (fs.existsSync(candidateDir) || fs.existsSync(candidateFile) || fs.existsSync(candidateDirect));

  if (!exists) {
    console.log(`❌ BROKEN INTERNAL LINK: ${link}`);
  } else {
    console.log(`  ✓ ${link} -> OK`);
  }
}
