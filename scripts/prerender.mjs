import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

async function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing built client HTML at ${templatePath}. Run vite build first.`);
  }

  const ssrEntryPath = path.join(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error(`Missing built SSR entry at ${ssrEntryPath}. Run vite build --ssr first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const ssrModule = await import(pathToFileURL(ssrEntryPath).href);
  const { render, UNIVERSE_ROUTES, buildSitemapXml, buildRobotsTxt, buildLlmsTxt } = ssrModule;

  const baseUrl = process.env.APP_URL;

  for (const route of UNIVERSE_ROUTES) {
    const { html, headTags } = render(route.path, baseUrl);
    let pageHtml = template;

    if (/<!--app-seo-start-->[\s\S]*?<!--app-seo-end-->/.test(pageHtml)) {
      pageHtml = pageHtml.replace(/<!--app-seo-start-->[\s\S]*?<!--app-seo-end-->/, headTags);
    } else {
      pageHtml = pageHtml.replace('</head>', `    ${headTags}\n  </head>`);
    }

    if (pageHtml.includes('<!--app-html-->')) {
      pageHtml = pageHtml.replace('<!--app-html-->', html);
    } else {
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    }

    const outPath =
      route.path === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.path.replace(/^\//, ''), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, pageHtml, 'utf-8');
    console.log(`[prerender] Generated ${path.relative(distDir, outPath)} -> ${route.path}`);
  }

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemapXml(baseUrl), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), buildRobotsTxt(baseUrl), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'llms.txt'), buildLlmsTxt(baseUrl), 'utf-8');
  console.log('[prerender] Generated sitemap.xml, robots.txt, and llms.txt');

  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }
}

prerender().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
