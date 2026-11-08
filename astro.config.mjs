import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Unifies multi-part sitemap into a single direct sitemap.xml
function singleSitemap() {
  return {
    name: 'single-sitemap',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const sitemap0Path = path.join(outDir, 'sitemap-0.xml');
        const sitemapXmlPath = path.join(outDir, 'sitemap.xml');
        const sitemapIndexPath = path.join(outDir, 'sitemap-index.xml');

        if (fs.existsSync(sitemap0Path)) {
          fs.copyFileSync(sitemap0Path, sitemapXmlPath);
          fs.unlinkSync(sitemap0Path);
        }
        if (fs.existsSync(sitemapIndexPath)) {
          fs.unlinkSync(sitemapIndexPath);
        }
        console.log('✓ Successfully unified into a single sitemap.xml');
      }
    }
  };
}

export default defineConfig({
  site: 'https://solarcalculatorindia.com',
  output: 'static',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    singleSitemap()
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
