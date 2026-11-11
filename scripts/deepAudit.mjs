import fs from 'node:fs';

async function audit() {
  const urls = [
    'https://solarcalculatorindia.com/',
    'https://solarcalculatorindia.com/1kw-solar-panel-cost-calculator/',
    'https://solarcalculatorindia.com/2kw-solar-panel-cost-calculator/',
    'https://solarcalculatorindia.com/3kw-solar-panel-cost-calculator/',
    'https://solarcalculatorindia.com/pm-surya-ghar-subsidy-calculator/',
    'https://solarcalculatorindia.com/sbi-solar-loan-emi-calculator/',
    'https://solarcalculatorindia.com/solar-calculator-maharashtra/',
    'https://solarcalculatorindia.com/solar-calculator-uttar-pradesh/',
    'https://solarcalculatorindia.com/solar-calculator-gujarat/',
    'https://solarcalculatorindia.com/solar-calculator-rajasthan/',
    'https://solarcalculatorindia.com/solar-calculator-karnataka/',
    'https://solarcalculatorindia.com/solar-calculator-west-bengal/',
    'https://solarcalculatorindia.com/solar-calculator-delhi/',
    'https://solarcalculatorindia.com/about-us/',
    'https://solarcalculatorindia.com/contact-us/',
    'https://solarcalculatorindia.com/privacy-policy/',
    'https://solarcalculatorindia.com/terms-of-service/',
    'https://solarcalculatorindia.com/sitemap.xml',
    'https://solarcalculatorindia.com/robots.txt',
    'https://solarcalculatorindia.com/llms.txt',
    'https://solarcalculatorindia.com/og-image.png',
    'https://solarcalculatorindia.com/favicon.svg'
  ];

  console.log('====================================================');
  console.log('   DEEP PRODUCTION AUDIT: SOLARCALCULATORINDIA.COM   ');
  console.log('====================================================');

  let issueCount = 0;
  const pageResults = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
      const status = res.status;

      if (status !== 200) {
        console.error(`❌ HTTP ${status}: ${url}`);
        issueCount++;
        continue;
      }

      const text = await res.text();

      if (url.endsWith('.xml') || url.endsWith('.txt') || url.endsWith('.png') || url.endsWith('.svg')) {
        const ct = res.headers.get('content-type');
        console.log(`✅ [${status}] ASSET: ${url.replace('https://solarcalculatorindia.com', '')} (${ct}, ${text.length} bytes)`);
        continue;
      }

      // Check Title
      const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      const titleLen = title.length;

      // Check Meta Description
      const descMatch = text.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) || text.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i);
      const desc = descMatch ? descMatch[1].trim() : '';
      const descLen = desc.length;

      // Check Canonical
      const canMatch = text.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
      const canonical = canMatch ? canMatch[1].trim() : '';

      // Check GTM
      const hasGTMHead = text.includes('GTM-MCCTJNKT');
      const hasGTMBody = text.includes('ns.html?id=GTM-MCCTJNKT');

      // Check OpenGraph
      const ogTitleMatch = text.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
      const ogImageMatch = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);

      // Check Viewport
      const hasViewport = text.includes('name="viewport"') || text.includes("name='viewport'");

      // JSON-LD schemas
      const jsonLdMatches = [...text.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];

      const issues = [];
      if (!title) issues.push('Missing Title');
      else if (titleLen < 30 || titleLen > 65) issues.push(`Title length ${titleLen}c`);
      
      if (!desc) issues.push('Missing Desc');
      else if (descLen < 120 || descLen > 165) issues.push(`Desc length ${descLen}c`);

      if (canonical !== url) issues.push(`Canonical mismatch: got "${canonical}"`);
      if (!hasGTMHead || !hasGTMBody) issues.push(`Missing GTM`);
      if (!ogTitleMatch) issues.push(`Missing og:title`);
      if (!ogImageMatch || !ogImageMatch[1].includes('og-image.png')) issues.push(`Missing or non-png og:image`);
      if (!hasViewport) issues.push(`Missing viewport`);
      if (jsonLdMatches.length === 0) issues.push(`Missing JSON-LD schema`);

      const pathStr = url.replace('https://solarcalculatorindia.com', '') || '/';
      if (issues.length > 0) {
        console.warn(`⚠️ [${status}] ${pathStr} -> ${issues.join('; ')}`);
        issueCount += issues.length;
      } else {
        console.log(`✅ [${status}] ${pathStr.padEnd(35)} | Title: "${title.substring(0, 32)}..." (${titleLen}c) | Desc: (${descLen}c) | Schemas: ${jsonLdMatches.length} | GTM: OK`);
      }

      pageResults.push({ path: pathStr, title, titleLen, desc, descLen, canonical, schemas: jsonLdMatches.length });
    } catch (err) {
      console.error(`❌ ERROR fetching ${url}: ${err.message}`);
      issueCount++;
    }
  }

  // Check Internal Navigation Links on Homepage
  console.log('\n--- AUDITING HOMEPAGE INTERNAL LINKS ---');
  try {
    const homeRes = await fetch('https://solarcalculatorindia.com/');
    const homeHtml = await homeRes.text();
    const hrefMatches = [...homeHtml.matchAll(/href=["'](\/[^"']*)["']/gi)].map(m => m[1]);
    const uniqueHrefs = [...new Set(hrefMatches)].filter(h => !h.startsWith('/#') && !h.startsWith('/api'));
    console.log(`Found ${uniqueHrefs.length} unique internal links on homepage:`);
    for (const href of uniqueHrefs) {
      const fullLink = 'https://solarcalculatorindia.com' + href;
      const linkRes = await fetch(fullLink);
      if (linkRes.status === 200) {
        console.log(`  ✅ [200] ${href}`);
      } else {
        console.warn(`  ❌ [${linkRes.status}] ${href} (BROKEN LINK)`);
        issueCount++;
      }
    }
  } catch (e) {
    console.error('Homepage link check error:', e.message);
  }

  // Audit Lead API with real payload
  console.log('\n--- TESTING /api/lead PRODUCTION ENDPOINT ---');
  try {
    const optRes = await fetch('https://solarcalculatorindia.com/api/lead', { method: 'OPTIONS' });
    console.log(`OPTIONS /api/lead: HTTP ${optRes.status} (CORS headers: ${optRes.headers.get('access-control-allow-origin') || 'none'})`);

    const badPost = await fetch('https://solarcalculatorindia.com/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '123' }) // Invalid phone to test rejection
    });
    const badJson = await badPost.json();
    if (badPost.status === 400) {
      console.log(`✅ Validation guard test passed: Rejected invalid phone with 400: "${badJson.error}"`);
    } else {
      console.warn(`⚠️ Expected 400 for bad input, got ${badPost.status}`);
    }
  } catch (e) {
    console.error('API test failed:', e.message);
  }

  console.log(`\n====================================================`);
  console.log(`   AUDIT FINISHED with ${issueCount} warnings/issues`);
  console.log(`====================================================\n`);
}

audit();
