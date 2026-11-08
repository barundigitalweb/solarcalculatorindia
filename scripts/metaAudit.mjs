import fs from 'node:fs';
import path from 'node:path';

const distDir = './dist';
const pages = fs.readdirSync(distDir).filter(f => fs.statSync(path.join(distDir, f)).isDirectory() || f.endsWith('.html'));

console.log('--- TITLE & DESCRIPTION LENGTH ANALYSIS ---');
for (const p of pages) {
  const filePath = p.endsWith('.html') ? path.join(distDir, p) : path.join(distDir, p, 'index.html');
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const descMatch = content.match(/<meta name="description" content="([^"]+)"/);

  const title = titleMatch ? titleMatch[1] : '';
  const desc = descMatch ? descMatch[1] : '';

  const titleStatus = title.length > 70 ? '⚠️ LONG (>70)' : (title.length < 30 ? '⚠️ SHORT (<30)' : '✅ OK');
  const descStatus = desc.length > 165 ? '⚠️ LONG (>165)' : (desc.length < 100 ? '⚠️ SHORT (<100)' : '✅ OK');

  console.log(`Page: ${p}`);
  console.log(`  Title [${title.length}c | ${titleStatus}]: ${title}`);
  console.log(`  Desc  [${desc.length}c | ${descStatus}]: ${desc}`);
}
