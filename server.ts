import 'dotenv/config';
import express, { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

function getOriginFromRequest(req: Request): string {
  const envUrl = (process.env.APP_URL || '').trim();
  if (envUrl && envUrl !== 'MY_APP_URL' && /^https?:\/\//i.test(envUrl)) {
    return envUrl.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim() || req.protocol || 'https';
  const host = req.get('host');
  if (host) return `${proto}://${host}`;
  return 'https://ais-pre-eipiii3bv2a7z4hjcag4yn-509305420087.europe-west2.run.app';
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/music/status', (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({
      configured: hasKey,
      models: ['lyria-3-clip-preview', 'lyria-3-pro-preview'],
    });
  });

  app.post('/api/music/generate', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        configurationRequired: true,
        error:
          'Le studio de génération musicale n’est pas encore activé. Configurez une clé API Gemini facturable dans Paramètres > Secrets pour utiliser Lyria (lyria-3-clip-preview / lyria-3-pro-preview).',
      });
      return;
    }

    const {
      atmosphere = 'Soirée Studio R&B chaleureuse',
      genre = 'R&B / Neo-Soul',
      description = '',
      mode = 'clip',
    } = req.body as {
      atmosphere?: string;
      genre?: string;
      description?: string;
      mode?: 'clip' | 'pro';
    };

    const model = mode === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    const prompt = [
      `Create an original ${mode === 'pro' ? 'full-length' : '30-second'} instrumental soundtrack.`,
      `Atmosphere: ${atmosphere}.`,
      `Genre: ${genre}.`,
      description?.trim() ? `Creative direction: ${description.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    try {
      const response = await ai.models.generateContentStream({
        model,
        contents: prompt,
      });

      const audioChunks: Buffer[] = [];
      let lyrics = '';
      let mimeType = 'audio/mpeg';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (audioChunks.length === 0 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          }
          if (part.text) {
            lyrics += part.text;
          }
        }
      }

      if (audioChunks.length === 0) {
        res.status(502).json({
          error: 'Le modèle musical n’a renvoyé aucun flux audio. Essayez d’affiner votre description.',
        });
        return;
      }

      const audioBase64 = Buffer.concat(audioChunks).toString('base64');
      res.json({
        audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
        mimeType,
        lyrics: lyrics.trim(),
        model,
        prompt,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Échec de la génération musicale.';
      const isAuthOrBilling = /403|400|429|PERMISSION_DENIED|API_KEY|RESOURCE_EXHAUSTED|paid/i.test(
        message
      );
      res.status(isAuthOrBilling ? 402 : 500).json({
        configurationRequired: isAuthOrBilling,
        error: isAuthOrBilling
          ? 'La génération musicale Lyria nécessite une clé Gemini API facturable dans Paramètres > Secrets.'
          : message,
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.get('/robots.txt', async (req, res) => {
      try {
        const seo = await vite.ssrLoadModule('/src/seo/seoConfig.ts');
        res.type('text/plain; charset=utf-8').send(seo.buildRobotsTxt(getOriginFromRequest(req)));
      } catch {
        res.type('text/plain; charset=utf-8').send('User-agent: *\nAllow: /\n');
      }
    });

    app.get('/sitemap.xml', async (req, res) => {
      try {
        const seo = await vite.ssrLoadModule('/src/seo/seoConfig.ts');
        res.type('application/xml; charset=utf-8').send(seo.buildSitemapXml(getOriginFromRequest(req)));
      } catch (err) {
        res.status(500).send(err instanceof Error ? err.message : 'Sitemap error');
      }
    });

    app.get('/llms.txt', async (req, res) => {
      try {
        const seo = await vite.ssrLoadModule('/src/seo/seoConfig.ts');
        res.type('text/plain; charset=utf-8').send(seo.buildLlmsTxt(getOriginFromRequest(req)));
      } catch (err) {
        res.status(500).send(err instanceof Error ? err.message : 'llms.txt error');
      }
    });

    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/') || path.extname(url.split('?')[0])) {
        return next();
      }
      try {
        const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const template = await vite.transformIndexHtml(url, rawTemplate);
        const entry = await vite.ssrLoadModule('/src/entry-server.tsx');
        const { html, headTags } = entry.render(url, getOriginFromRequest(req));

        let finalHtml = template;
        if (/<!--app-seo-start-->[\s\S]*?<!--app-seo-end-->/.test(finalHtml)) {
          finalHtml = finalHtml.replace(/<!--app-seo-start-->[\s\S]*?<!--app-seo-end-->/, headTags);
        }
        finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(finalHtml);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        const fallback = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(url, fallback);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(transformed);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const buildOrigin = 'https://ais-pre-eipiii3bv2a7z4hjcag4yn-509305420087.europe-west2.run.app';

    const serveGeoTextFile = (fileName: string, mimeType: string) => {
      app.get(`/${fileName}`, (req, res, next) => {
        const filePath = path.join(distDir, fileName);
        if (!fs.existsSync(filePath)) return next();
        const origin = getOriginFromRequest(req);
        let content = fs.readFileSync(filePath, 'utf-8');
        if (origin !== buildOrigin) {
          content = content.replaceAll(buildOrigin, origin);
        }
        res.type(`${mimeType}; charset=utf-8`).send(content);
      });
    };

    serveGeoTextFile('robots.txt', 'text/plain');
    serveGeoTextFile('sitemap.xml', 'application/xml');
    serveGeoTextFile('llms.txt', 'text/plain');

    app.use(express.static(distDir, { index: false }));
    app.get('*', (req, res) => {
      const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
      const candidateHtml = cleanPath
        ? path.join(distDir, cleanPath, 'index.html')
        : path.join(distDir, 'index.html');
      const targetHtml = fs.existsSync(candidateHtml)
        ? candidateHtml
        : path.join(distDir, 'index.html');
      const origin = getOriginFromRequest(req);
      let html = fs.readFileSync(targetHtml, 'utf-8');
      if (origin !== buildOrigin) {
        html = html.replaceAll(buildOrigin, origin);
      }
      res.status(200).type('text/html; charset=utf-8').send(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beyond the CV server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
